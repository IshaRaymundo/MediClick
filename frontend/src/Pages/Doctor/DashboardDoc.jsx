import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import {
  FaClock,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";

const DashboardDoc = ({ userName, userRole, handleLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [specialty, setSpecialty] = useState(null);
  const [specialtyError, setSpecialtyError] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertShown, setAlertShown] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [followingAppointments, setFollowingAppointments] = useState([]);
  const [earningsLastMonth, setEarningsLastMonth] = useState(0);
  const [earningsThisMonth, setEarningsThisMonth] = useState(0);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/doctores");
        const doctorData = response.data.find(
          (doctor) =>
            doctor.username.toLowerCase().trim() ===
            userName.toLowerCase().trim()
        );

        if (doctorData) {
          setSpecialty(doctorData.especialidades || "No registrada");
          setDoctorInfo(doctorData.informacion);

          if (!alertShown && !doctorData.informacion) {
            Swal.fire({
              title: "Información Incompleta",
              text: "Parece que falta información en tu perfil. Por favor, complétala.",
              icon: "warning",
              confirmButtonText: "Ir a Perfil",
              showCancelButton: true,
              cancelButtonText: "Cerrar",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/perfil";
              }
            });

            setAlertShown(true);
          }
        } else {
          setSpecialty("No registrada");
          setDoctorInfo(null);
        }
        setLoading(false);
      } catch (err) {
        setSpecialtyError("Error al obtener la especialidad médica");
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [userName, alertShown]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get("http://localhost:3000/citas/doctor", {
          params: { user_id: userId },
        });

        const sortedAppointments = response.data.sort(
          (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );

        setAppointments(sortedAppointments);

        if (sortedAppointments.length > 0) {
          setNextAppointment(sortedAppointments[0]);
          setFollowingAppointments(sortedAppointments.slice(1, 4));
        }

        const thisMonth = new Date().getMonth();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;

        const earningsThisMonth =
          sortedAppointments.filter(
            (appointment) =>
              new Date(appointment.fecha).getMonth() === thisMonth
          ).length * 30;

        const earningsLastMonth =
          sortedAppointments.filter(
            (appointment) =>
              new Date(appointment.fecha).getMonth() === lastMonth
          ).length * 30;

        setEarningsThisMonth(earningsThisMonth);
        setEarningsLastMonth(earningsLastMonth);
      } catch (err) {
        console.error("Error al obtener las citas:", err);
      }
    };

    fetchAppointments();
  }, []);

  const progressPercentage = () => {
    if (earningsLastMonth === 0) return 100;
    return Math.min((earningsThisMonth / earningsLastMonth) * 100, 100);
  };

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
          toggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          isSidebarExpanded={isSidebarExpanded}
        />

        <div className="px-6 py-8 bg-gray-100">
          <h1 className="text-3xl font-bold text-center mb-6">
            Bienvenido al Panel de Doctor
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Aquí podrás ver y gestionar tus citas, estadísticas y otros datos
            importantes.
          </p>

          {/* Tarjetas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-green-500 text-white rounded-lg shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <FaCalendarAlt className="absolute top-3 right-3 text-6xl opacity-20" />
              <h2 className="text-xl font-semibold mb-2">Mi Horario</h2>
              <p>Consulta y organiza tus horarios de trabajo.</p>
            </div>

            <div className="bg-red-500 text-white rounded-lg shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <FaClock className="absolute top-3 right-3 text-6xl opacity-20" />
              <h2 className="text-xl font-semibold mb-2">Siguiente Cita</h2>
              {nextAppointment ? (
                <>
                  <p>
                    <strong>Hora:</strong> {nextAppointment.hora_inicio}
                  </p>
                  <p>
                    <strong>Paciente:</strong>{" "}
                    {nextAppointment.paciente_nombre || "N/A"}
                  </p>
                </>
              ) : (
                <p>No tienes próximas citas.</p>
              )}
            </div>

            <div className="bg-purple-500 text-white rounded-lg shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <FaClipboardList className="absolute top-3 right-3 text-6xl opacity-20" />
              <h2 className="text-xl font-semibold mb-2">
                Especialidad Médica
              </h2>
              {loading ? (
                <p>Cargando...</p>
              ) : specialtyError ? (
                <p>{specialtyError}</p>
              ) : (
                <p>{specialty}</p>
              )}
            </div>

            <div className="bg-indigo-500 text-white rounded-lg shadow-lg p-6 relative overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300">
  <h2 className="text-base font-semibold mb-2">Pacientes Atendidos Este Mes:</h2>
  <p className="text-lg font-bold">
    {appointments.filter(
      (appointment) =>
        new Date(appointment.fecha).getMonth() === new Date().getMonth() &&
        new Date(appointment.fecha).getFullYear() === new Date().getFullYear()
    ).length}
  </p>
  <p className="text-sm">
    Comparado con el mes pasado:{" "}
    <span className="font-semibold">
      {appointments.filter(
        (appointment) =>
          new Date(appointment.fecha).getMonth() ===
            new Date().getMonth() - 1 &&
          new Date(appointment.fecha).getFullYear() === new Date().getFullYear()
      ).length}
    </span>
  </p>
</div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  {/* Ganancias */}
  <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
    <h2 className="text-xl font-bold text-center mb-4 text-blue-900">
      Ganancias
    </h2>
    <div className="h-48 overflow-y-auto">
      {[
        { mes: "Junio", ganancias: 1300 },
        { mes: "Julio", ganancias: 2000 },
        { mes: "Agosto", ganancias: 1400 },
        { mes: "Septiembre", ganancias: 2600 },
        { mes: "Octubre", ganancias: 1300 },
        { mes: "Noviembre", ganancias: earningsThisMonth },
      ]
        .slice(-6) // Muestra los últimos 6 meses (incluyendo el actual)
        .map((item, index, array) => {
          const maxGanancia = Math.max(...array.map((i) => i.ganancias)); // Ganancia máxima para calcular ancho relativo
          const progressWidth = (item.ganancias / maxGanancia) * 100;

          // Colores dinámicos para cada barra
          const barColors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-red-500",
            "bg-purple-500",
            "bg-teal-500",
          ];
          const barColor = barColors[index % barColors.length]; // Ciclo de colores

          return (
            <div key={index} className="mb-4">
              <p className="font-semibold text-gray-600">
                {item.mes}: ${item.ganancias}
              </p>
              <div className="bg-gray-200 rounded-full h-4 relative">
                <div
                  className={`h-4 rounded-full transition-all ${barColor}`}
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>
            </div>
          );
        })}
    </div>
  </div>

  {/* Próximas citas */}
  <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
    <h2 className="text-xl font-bold text-center mb-4 text-blue-900">
      Próximas Citas
    </h2>
    <ul>
      {followingAppointments.map((appointment) => (
        <li
          key={appointment.citaId}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <p className="text-lg font-semibold">
              Paciente: {appointment.paciente_nombre || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(appointment.fecha).toLocaleDateString()} -{" "}
              {appointment.hora_inicio} - {appointment.hora_fin}
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default DashboardDoc;
