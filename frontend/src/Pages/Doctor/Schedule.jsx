import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import Swal from "sweetalert2";

const Schedule = ({ userName, userRole, handleLogout }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [publishedSchedules, setPublishedSchedules] = useState([]);

  const userId = localStorage.getItem("userId");

  const fetchPublishedSchedules = async (doctorId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/disponibilidades/${doctorId}`
      );
      if (!response.ok) throw new Error("Error al obtener los horarios publicados");
      const data = await response.json();
      setPublishedSchedules(data);
    } catch (error) {
      console.error("Error al cargar horarios publicados:", error.message);
    }
  };

  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/doctores/${userId}`
        );
        if (!response.ok) throw new Error("Error al obtener el ID del médico");
        const data = await response.json();
        setDoctorId(data.doctor.id);
        fetchPublishedSchedules(data.doctor.id);
      } catch (error) {
        console.error("Error al obtener el ID del médico:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al obtener la información del médico.",
        });
      }
    };

    fetchDoctorId();
  }, [userId]);

  useEffect(() => {
    if (doctorId) {
      fetchPublishedSchedules(doctorId);
    }
  }, [doctorId]);

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
    setTimeSlots([]);
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
          doctorId,
          diaSemana: selectedDay.value,
          horaInicio: slot.start,
          horaFin: slot.end,
          activo: 1,
        };

        const response = await fetch("http://localhost:3000/disponibilidades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Error en la publicación del horario");
        return response.json();
      });

      await Promise.all(requests);

      Swal.fire({
        icon: "success",
        title: "¡Horario publicado!",
        text: "Tus horarios han sido publicados exitosamente.",
      });

      fetchPublishedSchedules(doctorId);
      setTimeSlots([]);
      setSelectedDay(null);
    } catch (error) {
      console.error("Error al publicar horarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al publicar los horarios. Inténtalo nuevamente.",
      });
    }
  };

  const handleDeleteSchedule = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Este horario será eliminado permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/disponibilidades/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Error al eliminar el horario");

        Swal.fire({
          icon: "success",
          title: "Horario eliminado",
          text: "El horario se ha eliminado exitosamente.",
        });

        setPublishedSchedules((prev) =>
          prev.filter((schedule) => schedule.id !== id)
        );
      } catch (error) {
        console.error("Error al eliminar horario:", error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el horario. Inténtalo nuevamente.",
        });
      }
    }
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
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          isSidebarExpanded={isSidebarExpanded}
        />
        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
            Mi horario
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 flex items-center space-x-2"
                >
                  <span className="text-xl font-light">+</span>
                  <span className="text-sm font-light">Añadir</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handlePublishSchedule}
              className="px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-green-700"
            >
              Publicar horario
            </button>
          </div>

{/* Horarios publicados */}
<div className="mt-8">
  <table className="w-full bg-white border border-gray-300 rounded-lg shadow-md">
    <thead className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <tr>
        <th className="px-6 py-3 text-left border border-gray-300">
          Día
        </th>
        <th className="px-6 py-3 text-left border border-gray-300">
          Hora Inicio
        </th>
        <th className="px-6 py-3 text-left border border-gray-300">
          Hora Fin
        </th>
        <th className="px-6 py-3 text-center border border-gray-300">
          Acciones
        </th>
      </tr>
    </thead>
    <tbody>
      {publishedSchedules && publishedSchedules.length > 0 ? (
        publishedSchedules.map((schedule) => (
          <tr
            key={schedule.id}
            className="hover:bg-gray-100 transition-colors duration-200"
          >
            <td className="px-6 py-4 border border-gray-300 text-gray-800">
              {schedule.dia_semana}
            </td>
            <td className="px-6 py-4 border border-gray-300 text-gray-800">
              {schedule.hora_inicio}
            </td>
            <td className="px-6 py-4 border border-gray-300 text-gray-800">
              {schedule.hora_fin}
            </td>
            <td className="px-6 py-4 border border-gray-300 text-center">
              <button
                onClick={() => handleDeleteSchedule(schedule.id)}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                title="Eliminar horario"
              >
                <FaTrash />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="4"
            className="px-6 py-4 text-center text-gray-600 border border-gray-300"
          >
            No hay horarios disponibles
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

        </div>
      </div>
    </div>
  );
};

export default Schedule;
