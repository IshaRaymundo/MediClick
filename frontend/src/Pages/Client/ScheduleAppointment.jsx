import React, { useState, useEffect } from "react"; 
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const getFullImageUrl = (photo) => {
  return photo ? `http://localhost:3000/${photo}` : "https://via.placeholder.com/150";
};

const ScheduleAppointment = ({ userName, userRole, handleLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]); // Estado para los horarios disponibles
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const doctorId = 2; // Supongamos que este es fijo para este ejemplo
  const pacienteId = 4; // Este debe provenir del estado del usuario autenticado
  const doctorName = queryParams.get("doctor") || "Doctor";
  const doctorEspecialidad = queryParams.get("especialidad") || "Especialidad";
  const doctorPhoto = queryParams.get("photo") || "";

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

  // Llamada al backend para obtener horarios disponibles
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      try {
        const response = await fetch(
          `http://localhost:3000/horarios/disponibles?doctorId=${doctorId}&fecha=${formattedDate}`
        );

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        const data = await response.json();
        setAvailableTimes(data); // Actualizar horarios disponibles
      } catch (error) {
        console.error("Error al obtener horarios disponibles:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar los horarios disponibles.",
        });
      }
    };

    fetchAvailableTimes();
  }, [selectedDate, doctorId]);

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleReserve = async (timeSlot) => {
    const { horaInicio, horaFin } = timeSlot;
    const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD

    const payload = {
      disponibilidadId: 2, // Este valor podría depender del horario específico
      fecha: formattedDate,
      horaInicio,
      horaFin,
      doctorId,
      pacienteId,
    };

    try {
      const response = await fetch("http://localhost:3000/horarios/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error en la reserva de la cita");
      }

      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: "¡Cita reservada!",
        text: data.message,
        confirmButtonText: "OK",
      }).then(() => {
        // Marcar el horario como ocupado
        setAvailableTimes((prev) =>
          prev.map((slot) =>
            slot.horaInicio === horaInicio && slot.horaFin === horaFin
              ? { ...slot, ocupado: true }
              : slot
          )
        );
      });
    } catch (error) {
      console.error("Error al reservar cita:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo reservar la cita. Inténtalo nuevamente.",
      });
    }
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
          <div className="flex items-center w-full max-w-4xl mb-8">
            <img
              src={getFullImageUrl(doctorPhoto)}
              alt={doctorName}
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
              <div className="grid grid-cols-7 text-center">
                {daysOfWeek.map((day) => (
                  <div key={day} className="font-light text-blue-950 pb-2">
                    {day}
                  </div>
                ))}
                {days.map((day) => (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`py-2 cursor-pointer ${
                      selectedDate.toDateString() === day.toDateString()
                        ? "bg-blue-800 text-white"
                        : "hover:bg-gray-200"
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
                {availableTimes.map((timeSlot) => (
                  <button
                    key={timeSlot.horaInicio}
                    onClick={() => handleReserve(timeSlot)}
                    className={`p-2 rounded-lg text-sm font-medium ${
                      timeSlot.ocupado
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    disabled={timeSlot.ocupado}
                  >
                    {timeSlot.horaInicio} - {timeSlot.horaFin}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAppointment;
