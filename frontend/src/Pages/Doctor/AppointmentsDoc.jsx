import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";

const AppointmentsDoc = ({ userName, userRole, handleLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/citas");
        console.log(response.data); // Verifica los datos que se están recibiendo
        setAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="flex">
      <Sidebar
        isExpanded={isSidebarExpanded}
        userName={userName}
        userRole={userRole}
        handleLogout={handleLogout}
      />
      <div className="flex-1 bg-gray-100">
        <Navbar
          userName={userName}
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          isSidebarExpanded={isSidebarExpanded}
        />
        
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-center mb-2">Mis pacientes</h1>
          <p className="text-center text-lg mb-6 text-gray-600">
            Administra y consulta la lista de tus pacientes
          </p>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="overflow-x-auto flex justify-center">
              <table className="min-w-max bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr>
                    <th className="px-10 py-3 text-left text-gray-600 bg-blue-100">Paciente</th>
                    <th className="px-10 py-3 text-left text-gray-600 bg-blue-100">Fecha</th>
                    <th className="px-10 py-3 text-left text-gray-600 bg-blue-100">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
<td className="px-10 py-6 text-gray-800">{appointment.paciente_nombre}</td>
<td className="px-10 py-6 text-gray-800">{new Date(appointment.fecha).toLocaleDateString()}</td>
                      <td className="px-10 py-6 text-gray-800">{appointment.hora_inicio}</td>
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
