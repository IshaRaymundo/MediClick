import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ScheduleAppointment = ({ userName, userRole, handleLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const doctorName = queryParams.get("doctor") || "Doctor";
  const doctorEspecialidad = queryParams.get("especialidad") || "Especialidad";

  const daysOfWeek = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const currentMonth = selectedDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        icon: "warning",
        title: "¡Faltan datos!",
        text: "Debes seleccionar una fecha y un horario antes de agendar tu cita.",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: `Estás a punto de agendar tu cita el día ${selectedDate.toLocaleDateString()} a las ${selectedTime}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, agendar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "¡Cita programada!",
          text: `Tu cita ha sido programada exitosamente para el ${selectedDate.toLocaleDateString()} a las ${selectedTime}.`,
          confirmButtonText: "Entendido",
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  const days = getDaysInMonth(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );

  return (
    <div className="flex">
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

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center w-full max-w-4xl mb-8">
            <button
              onClick={() => window.history.back()}
              className="mr-4 text-gray-700 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <img
              src="https://via.placeholder.com/50"
              alt="Doctor"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h2 className="text-4xl font-semibold">{doctorName}</h2>
              <p className="text-base text-gray-500">{doctorEspecialidad}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Calendar Section */}
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <h3 className="text-3xl font-semibold text-gray-800 mb-4">
                Elige el día
              </h3>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() - 1,
                        1
                      )
                    )
                  }
                  className="text-gray-600 hover:text-gray-800"
                >
                  &lt;
                </button>
                <span className="font-light text-gray-800">{currentMonth}</span>
                <button
                  onClick={() =>
                    setSelectedDate(
                      new Date(
                        selectedDate.getFullYear(),
                        selectedDate.getMonth() + 1,
                        1
                      )
                    )
                  }
                  className="text-gray-600 hover:text-gray-800"
                >
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-7 text-center">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="font-light text-blue-950 pb-2 border-b bg-blue-100 shadow-sm"
                  >
                    {day}
                  </div>
                ))}
                {days.map((day) => (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`py-2 cursor-pointer flex items-center justify-center ${
                      selectedDate.toDateString() === day.toDateString()
                        ? "bg-blue-800 text-white rounded-full"
                        : "text-gray-700 hover:bg-gray-200 rounded-full"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                ))}
              </div>
            </div>

            {/* Time Picker Section */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-3xl font-semibold text-gray-800 mb-4">
                Elige el horario
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[
                  "9:30",
                  "10:00",
                  "10:30",
                  "11:00",
                  "12:00",
                  "12:30",
                  "13:00",
                  "13:30",
                  "14:00",
                  "14:30",
                  "15:00",
                  "15:30",
                  "16:00",
                  "16:30",
                  "17:00",
                  "17:30",
                  "18:00",
                  "18:30",
                  "19:00",
                  "19:30",
                ].map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-lg text-sm font-medium ${
                      selectedTime === time
                        ? "bg-blue-800 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSchedule}
              className="bg-blue-800 text-white px-8 py-3 rounded-full text-lg shadow-md hover:bg-blue-700"
            >
              Programar cita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;
