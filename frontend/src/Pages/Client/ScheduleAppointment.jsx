import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const getFullImageUrl = (photo) => {
  return photo
    ? `http://localhost:3000/${photo}`
    : "https://via.placeholder.com/150";
};

const ScheduleAppointment = ({ userName, userRole, handleLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [timeToReserve, setTimeToReserve] = useState(null); // Guardar el horario seleccionado

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const doctorName = queryParams.get("doctor") || "Doctor";
  const doctorEspecialidad = queryParams.get("especialidad") || "Especialidad";
  const doctorPhoto = queryParams.get("photo") || "";

  const daysOfWeek = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];
  const currentMonth = selectedDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      try {
        const response = await fetch(
          `http://localhost:3000/horarios/disponibles?doctorId=2&fecha=${formattedDate}`
        );

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        const data = await response.json();
        setAvailableTimes(data);
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
  }, [selectedDate]);

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const confirmReservation = async (timeSlot) => {
    const { horaInicio, horaFin } = timeSlot;
    const formattedDate = selectedDate.toISOString().split("T")[0];

    const payload = {
      disponibilidadId: 2,
      fecha: formattedDate,
      horaInicio,
      horaFin,
      doctorId: 2,
      pacienteId: 4,
    };

    try {
      const response = await fetch("http://localhost:3000/horarios/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Error al reservar la cita");
      }

      const data = await response.json();
      Swal.fire({
        icon: "success",
        title: "¡Cita reservada!",
        text: data.message,
        showConfirmButton: false, // Elimina el botón
        timer: 2000, // Duración de 2 segundos
      }).then(() => {
        navigate("/"); // Redirige al home tras el tiempo definido
      });

      setAvailableTimes((prev) =>
        prev.map((slot) =>
          slot.horaInicio === horaInicio && slot.horaFin === horaFin
            ? { ...slot, ocupado: true }
            : slot
        )
      );
    } catch (error) {
      console.error("Error al reservar cita:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo reservar la cita. Inténtalo nuevamente.",
      });
    }
  };

  const handleReserve = (timeSlot) => {
    setTimeToReserve(timeSlot); // Guarda el horario seleccionado para confirmación
    Swal.fire({
      title: "Confirmar reserva",
      text: `¿Estás seguro de reservar este horario? ${timeSlot.horaInicio} - ${timeSlot.horaFin}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmReservation(timeSlot); // Realiza la reserva si se confirma
      }
    });
  };

  const getDaysInMonthWithOffset = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonthWithOffset(
    selectedDate.getFullYear(),
    selectedDate.getMonth()
  );

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

        <div className="p-6">
          <div className="flex items-center w-full max-w-4xl mb-8">
            <img
              src={getFullImageUrl(doctorPhoto)}
              alt={doctorName}
              className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300 object-cover"
            />
            <div>
              <h2 className="text-4xl font-semibold">{doctorName}</h2>
              <p className="text-base text-gray-500">{doctorEspecialidad}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
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
                {days.map((day, index) =>
                  day ? (
                    <div
                      key={index}
                      onClick={() => handleDayClick(day)}
                      className={`py-2 cursor-pointer flex items-center justify-center ${
                        selectedDate.toDateString() === day.toDateString()
                          ? "bg-blue-800 text-white rounded-full"
                          : "text-gray-700 hover:bg-gray-200 rounded-full"
                      }`}
                    >
                      {day.getDate()}
                    </div>
                  ) : (
                    <div key={index} className="py-2"></div>
                  )
                )}
              </div>
            </div>

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
