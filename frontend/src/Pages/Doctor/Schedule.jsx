import React, { useState } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";

const Schedule = ({ userName, userRole, handleLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const daysOfWeek = ["DOM", "LUN", "MAR", "MIE", "JUE", "VIE", "SAB"];

  const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);
    setSelectedDate(newDate);
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setTimeSlots([]); // Reset slots when selecting a new day
  };

  const handleAddTimeSlot = () => {
    if (startTime && endTime) {
      setTimeSlots([...timeSlots, { start: startTime, end: endTime }]);
      setStartTime("");
      setEndTime("");
    } else {
      alert("Por favor completa los campos de hora de inicio y fin.");
    }
  };

  const handlePublishSchedule = () => {
    console.log("Horario publicado:", {
      date: selectedDate.toDateString(),
      timeSlots,
    });
    alert("¡Horario publicado con éxito!");
  };

  const days = getDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
  const currentMonth = selectedDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

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
            Selecciona un día y los horarios que estarás disponible para atender pacientes.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Selección de día */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Elige el horario
              </h2>
              <div className="flex justify-between items-center mb-4">
                <button onClick={handlePreviousMonth} className="text-black font-light text-xl">
                  &lt;
                </button>
                <h2 className="text-base font-light text-gray-800">{currentMonth}</h2>
                <button onClick={handleNextMonth} className="text-black font-light text-xl">
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-7 text-center">
                {daysOfWeek.map((day) => (
                  <div key={day} className="font-light text-black bg-blue-100 pb-2">
                    {day}
                  </div>
                ))}
                {days.map((day) => (
                  <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`py-2 cursor-pointer rounded-full ${
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

            {/* Selección de horario */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Elige el horario
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium text-sm">Inicio:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="p-2 border rounded-lg text-sm w-24"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium text-sm">Fin:</label>
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
