import React, { useEffect, useState } from "react";
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

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para formatear la fecha en DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Función para formatear la hora en formato 12 horas (HH:MM AM/PM)
  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convertir 0 a 12 para formato 12 horas
    return `${hours}:${minutes} ${ampm}`;
  };

  // Cargar citas desde el backend
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/citas?user_id=${userName}`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          throw new Error("Error al obtener las citas");
        }
      } catch (error) {
        console.error("Error al cargar las citas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [userName]);

  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const getPaginatedAppointments = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return appointments.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCancel = async (appointment) => {
    MySwal.fire({
      title: "¿Estás seguro de querer cancelar esta cita?",
      text: `Cita con ${appointment.doctor_nombre} (${appointment.especialidades}) el ${formatDate(
        appointment.fecha
      )} a las ${formatTime(appointment.hora_inicio)}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch("http://localhost:3000/horarios/cancelar", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ citaId: appointment.id }),
          });

          if (response.ok) {
            MySwal.fire({
              title: "¡Cita cancelada!",
              text: "La cita ha sido cancelada exitosamente.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            setAppointments((prev) =>
              prev.filter((item) => item.id !== appointment.id)
            );
          } else {
            throw new Error("No se pudo cancelar la cita.");
          }
        } catch (error) {
          console.error("Error al cancelar la cita:", error);
          MySwal.fire({
            title: "Error",
            text: "No se pudo cancelar la cita. Intenta de nuevo más tarde.",
            icon: "error",
          });
        }
      }
    });
  };

  const renderAppointments = () => {
    if (loading) {
      return <p>Cargando citas...</p>;
    }

    const paginatedAppointments = getPaginatedAppointments();
    return paginatedAppointments.map((appointment) => (
      <div
        key={appointment.id}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-300 py-6"
      >
        <div>
          <p className="font-medium text-lg text-blue-900">{appointment.doctor_nombre}</p>
          <p className="text-sm text-gray-500">{appointment.especialidades}</p>
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg">{formatDate(appointment.fecha)}</p>
          <p className="text-sm text-gray-500">{`${formatTime(
            appointment.hora_inicio
          )} - ${formatTime(appointment.hora_fin)}`}</p>
        </div>
        <div className="flex justify-center md:justify-end space-x-4">
          {view === "upcoming" && (
            <button
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all"
              onClick={() => handleCancel(appointment)}
            >
              Cancelar
            </button>
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
            <div className="border-t border-gray-300 my-2"></div>
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
            <div className="border-t border-gray-300"></div>
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
                  className={`px-3 py-2 rounded-md ${
                    index + 1 === currentPage
                      ? "bg-blue-700 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
