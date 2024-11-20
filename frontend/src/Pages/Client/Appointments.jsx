import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";

const MySwal = withReactContent(Swal);

const Appointments = ({ userName, userRole, handleLogout }) => {
  const location = useLocation();
  const [view, setView] = useState(location.state?.view || "upcoming");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const pastAppointments = [
    { id: 1, date: "2024-11-01", time: "10:00 AM", doctor: "Dr. José Pérez", specialty: "Cardiología" },
    { id: 2, date: "2024-10-25", time: "2:30 PM", doctor: "Dra. María López", specialty: "Odontología" },
    { id: 3, date: "2024-10-10", time: "11:15 AM", doctor: "Dr. Hugo Sánchez", specialty: "Neurología" },
    { id: 4, date: "2024-09-30", time: "4:45 PM", doctor: "Dra. Andrea Torres", specialty: "Pediatría" },
    { id: 5, date: "2024-09-15", time: "1:00 PM", doctor: "Dr. Ernesto Chávez", specialty: "Nutriología" },
  ];

  const upcomingAppointments = [
    { id: 1, date: "2024-12-01", time: "9:00 AM", doctor: "Dr. Ricardo Méndez", specialty: "Neurología" },
    { id: 2, date: "2024-12-10", time: "1:30 PM", doctor: "Dra. Ana Ramírez", specialty: "Pediatría" },
    { id: 3, date: "2024-12-20", time: "10:00 AM", doctor: "Dr. Sofía Delgado", specialty: "Cardiología" },
    { id: 4, date: "2025-01-05", time: "2:00 PM", doctor: "Dra. Laura Ortiz", specialty: "Odontología" },
    { id: 5, date: "2025-01-15", time: "3:15 PM", doctor: "Dr. Carlos Rivera", specialty: "Ortopedia" },
  ];

  const getPaginatedAppointments = () => {
    const appointments = view === "past" ? pastAppointments : upcomingAppointments;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return appointments.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(
    (view === "past" ? pastAppointments : upcomingAppointments).length / itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAction = (action, appointment) => {
    MySwal.fire({
      title: `¿Estás seguro de querer ${action}?`,
      text: `Cita con ${appointment.doctor} (${appointment.specialty}) el ${appointment.date} a las ${appointment.time}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Acción exitosa!",
          text: `La cita ha sido ${action} correctamente.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleReschedule = (appointment) => {
    MySwal.fire({
      title: `Reagendar cita con ${appointment.doctor}`,
      html: `
        <div class="flex flex-col items-start">
          <label class="block text-left font-medium mb-2">Seleccione nueva fecha:</label>
          <input type="date" id="newDate" class="swal2-input" required>
          <label class="block text-left font-medium mt-4 mb-2">Seleccione nuevo horario:</label>
          <select id="newTime" class="swal2-input">
            <option value="9:00 AM">9:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:30 AM">11:30 AM</option>
            <option value="1:00 PM">1:00 PM</option>
            <option value="3:30 PM">3:30 PM</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const newDate = document.getElementById("newDate").value;
        const newTime = document.getElementById("newTime").value;

        if (!newDate || !newTime) {
          Swal.showValidationMessage("Por favor seleccione fecha y horario");
        } else {
          return { newDate, newTime };
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Cita reagendada!",
          text: `Nueva cita el ${result.value.newDate} a las ${result.value.newTime}`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };

  const renderAppointments = () => {
    const appointments = getPaginatedAppointments();
    return appointments.map((appointment) => (
      <div
        key={appointment.id}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-300 py-6"
      >
        <div>
          <p className="font-medium text-lg text-blue-900">{appointment.doctor}</p>
          <p className="text-sm text-gray-500">{appointment.specialty}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg">{appointment.date}</p>
          <p className="text-sm text-gray-500">{appointment.time}</p>
        </div>
        <div className="flex justify-center md:justify-end space-x-4">
          {view === "past" && (
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all"
              onClick={() => handleAction("volver a agendar", appointment)}
            >
              Volver agendar
            </button>
          )}
          {view === "upcoming" && (
            <>
              <button
                className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all"
                onClick={() => handleReschedule(appointment)}
              >
                Reagendar
              </button>
              <button
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all"
                onClick={() => handleAction("cancelar", appointment)}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    ));
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar
        isExpanded={isSidebarExpanded}
        userName={userName}
        userRole={userRole}
        handleLogout={handleLogout}
      />

      <div className="flex-1">
        <Navbar
          userName={userName}
          toggleSidebar={toggleSidebar}
          isSidebarExpanded={isSidebarExpanded}
        />

        <div className="px-6 md:px-12 py-8 flex flex-col items-center">
          <div className="max-w-4xl w-full p-8 bg-white rounded-2xl shadow-lg">
            <p className="text-2xl font-semibold text-blue-900 mb-8 text-center">
              Agenda de {userName}
            </p>
            <div class="border-t border-gray-300 my-2"></div>
            <div className="flex justify-center mb-8">
              <div
                className="flex items-center bg-gray-200 rounded-full p-1 w-96 relative overflow-hidden"
                role="group"
              >
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-500 ease-in-out bg-gradient-to-r ${
                    view === "upcoming"
                      ? "translate-x-full from-green-600 to-green-400"
                      : "from-blue-700 to-blue-500"
                  } rounded-full w-1/2`}
                ></div>
                <button
                  onClick={() => {
                    setView("past");
                    setCurrentPage(1);
                  }}
                  className={`z-10 flex-1 px-8 py-2 text-lg font-medium rounded-full transition-all duration-300 ${
                    view === "past"
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Anteriores
                </button>
                <button
                  onClick={() => {
                    setView("upcoming");
                    setCurrentPage(1);
                  }}
                  className={`z-10 flex-1 px-8 py-2 text-lg font-medium rounded-full transition-all duration-300 ${
                    view === "upcoming"
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Próximas
                </button>
              </div>
            </div>
            <div class="border-t border-gray-300"></div>
            <div className="transition-opacity duration-500 ease-in-out opacity-100">
              {view === "past" ? (
                <h2 className="text-xl font-bold mb-6 text-blue-700 text-center md:text-left">
                  Citas Pasadas
                </h2>
              ) : (
                <h2 className="text-xl font-bold mb-6 text-blue-700 text-center md:text-left">
                  Citas Próximas
                </h2>
              )}
              {renderAppointments()}
            </div>

            <div className="flex justify-center mt-6 space-x-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
                    currentPage === index + 1
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
