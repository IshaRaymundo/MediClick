import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import Swal from "sweetalert2";

const Schedule = ({ userName, userRole, handleLogout }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const daysOfWeek = [
    { name: "DOM", value: "Domingo" },
    { name: "LUN", value: "Lunes" },
    { name: "MAR", value: "Martes" },
    { name: "MIE", value: "Miércoles" },
    { name: "JUE", value: "Jueves" },
    { name: "VIE", value: "Viernes" },
    { name: "SAB", value: "Sábado" },
  ];

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setTimeSlots([]); // Reset slots when selecting a new day
  };

  const handleAddTimeSlot = () => {
    if (startTime && endTime && startTime < endTime) {
      setTimeSlots([...timeSlots, { start: startTime, end: endTime }]);
      setStartTime("");
      setEndTime("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Datos inválidos",
        text: "Por favor, asegúrate de ingresar una hora de inicio y fin válidas.",
      });
    }
  };

  const handlePublishSchedule = async () => {
    if (!selectedDay) {
      Swal.fire({
        icon: "warning",
        title: "No hay día seleccionado",
        text: "Selecciona un día antes de publicar el horario.",
      });
      return;
    }

    if (timeSlots.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No hay horarios",
        text: "Añade al menos un horario antes de publicar.",
      });
      return;
    }

    try {
      const requests = timeSlots.map(async (slot) => {
        const payload = {
          doctorId: 9, // ID del doctor
          diaSemana: selectedDay.value, // Día seleccionado
          horaInicio: slot.start,
          horaFin: slot.end,
          activo: 1,
        };

        const response = await fetch("http://localhost:3000/disponibilidades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Error en la publicación del horario");
        }

        return response.json();
      });

      await Promise.all(requests);

      Swal.fire({
        icon: "success",
        title: "¡Horario publicado!",
        text: "Tus horarios han sido publicados exitosamente.",
      });

      setTimeSlots([]); // Limpia los horarios tras la publicación
      setSelectedDay(null); // Limpia el día seleccionado
    } catch (error) {
      console.error("Error al publicar horarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al publicar los horarios. Inténtalo nuevamente.",
      });
    }
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
        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-4">
            Mi horario
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Selecciona un día de la semana y los horarios que estarás disponible
            para atender pacientes.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Selección de día */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Selecciona el día
              </h2>
              <div className="grid grid-cols-7 text-center">
                {daysOfWeek.map((day) => (
                  <div
                    key={day.name}
                    onClick={() => handleDayClick(day)}
                    className={`py-2 cursor-pointer rounded-full ${
                      selectedDay?.name === day.name
                        ? "bg-blue-800 text-white"
                        : "hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {day.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Selección de horario */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Elige el horario
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium text-sm">
                    Inicio:
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="p-2 border rounded-lg text-sm w-24"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium text-sm">
                    Fin:
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="p-2 border rounded-lg text-sm w-24"
                  />
                </div>
                <button
                  onClick={handleAddTimeSlot}
                  className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 flex items-center justify-center w-8 h-8"
                >
                  +
                </button>
              </div>

              {/* Lista de horarios añadidos */}
              {timeSlots.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Horarios añadidos:
                  </h3>
                  <ul className="list-disc ml-6">
                    {timeSlots.map((slot, index) => (
                      <li key={index}>
                        {slot.start} - {slot.end}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handlePublishSchedule}
            className="w-full mt-6 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-green-700"
          >
            Publicar horario
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
  
