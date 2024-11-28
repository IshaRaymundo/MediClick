import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";

const AppointmentsDoc = ({ userName, userRole, handleLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `http://localhost:3000/citas/doctor?user_id=${userId}`
        );
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error("Error fetching doctor's appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    if (search) {
      filtered = filtered.filter((appointment) =>
        appointment.paciente_nombre
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (appointment) =>
          new Date(appointment.fecha).toLocaleDateString() ===
          new Date(selectedDate).toLocaleDateString()
      );
    }

    if (selectedDay) {
      filtered = filtered.filter(
        (appointment) =>
          new Date(appointment.fecha).toLocaleDateString("en-US", {
            weekday: "long",
          }) === selectedDay
      );
    }

    setFilteredAppointments(filtered);
  }, [search, selectedDate, selectedDay, appointments]);

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

        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-center mb-4 text-blue-900">
            Mis Pacientes
          </h1>

          {/* Controles de filtro */}
          <div className="flex flex-col lg:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md mb-6 space-y-3 lg:space-y-0">
            {/* Búsqueda */}
            <div className="w-full lg:w-1/3">
              <input
                type="text"
                placeholder="Buscar paciente..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filtro por fecha */}
            <div className="w-full lg:w-1/3">
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Filtro por día */}
            <div className="w-full lg:w-1/3">
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="">Filtrar por día</option>
                <option value="Monday">Lunes</option>
                <option value="Tuesday">Martes</option>
                <option value="Wednesday">Miércoles</option>
                <option value="Thursday">Jueves</option>
                <option value="Friday">Viernes</option>
                <option value="Saturday">Sábado</option>
                <option value="Sunday">Domingo</option>
              </select>
            </div>
          </div>

          {/* Tabla de citas */}
          {loading ? (
            <p className="text-center text-xl text-gray-600">Cargando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                <thead>
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-white"
                      style={{
                        background: "linear-gradient(to right, #2C5364, #203A43)",
                      }}
                    >
                      Paciente
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-white"
                      style={{
                        background: "linear-gradient(to right, #2C5364, #203A43)",
                      }}
                    >
                      Fecha
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-white"
                      style={{
                        background: "linear-gradient(to right, #2C5364, #203A43)",
                      }}
                    >
                      Hora
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment, index) => (
                    <tr
                      key={appointment.citaId}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-white hover:bg-gray-200"
                      } transition-all`}
                    >
                      <td className="px-4 py-2 text-gray-800 border-t border-gray-300">
                        {appointment.paciente_nombre}
                      </td>
                      <td className="px-4 py-2 text-gray-800 border-t border-gray-300">
                        {new Date(appointment.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-gray-800 border-t border-gray-300">
                        {appointment.hora_inicio} - {appointment.hora_fin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsDoc;
