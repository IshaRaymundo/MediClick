import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DoctorModal from "./DoctorModal"; // Importa el componente del modal

const getFullImageUrl = (photo) => {
  return photo ? `http://localhost:3000/${photo}` : "https://via.placeholder.com/120";
};

const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text || "";
};

const SpecialitySelect = ({ userName, userRole, handleLogout }) => {
  const { especialidad } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const normalizeString = (str) =>
    str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get("http://localhost:3000/especialidades");
        setSpecialties(response.data);
      } catch (error) {
        console.error("Error al obtener especialidades:", error);
      }
    };

    fetchSpecialties();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/doctores");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error al obtener doctores:", error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length > 0 && specialties.length > 0) {
      const normalizedSpecialty = normalizeString(especialidad);
      const selectedSpecialty = specialties.find(
        (spec) => normalizeString(spec.nombre) === normalizedSpecialty
      );

      if (selectedSpecialty) {
        const filtered = doctors.filter((doctor) => {
          const doctorSpecialties = doctor.especialidades
            ?.split(",")
            .map((spec) => normalizeString(spec.trim()));
          return doctorSpecialties?.includes(normalizedSpecialty);
        });
        setFilteredDoctors(filtered);
      } else {
        setFilteredDoctors([]);
      }
    }
  }, [especialidad, doctors, specialties]);

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
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Doctores de Especialidad:{" "}
            {especialidad.charAt(0).toUpperCase() + especialidad.slice(1)}
          </h1>
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
               <div
               key={doctor.doctorId}
               className="bg-white p-4 rounded-xl flex flex-col sm:flex-row items-center w-full max-w-5xl mx-auto shadow-lg hover:shadow-2xl transition-all overflow-hidden"
             >
               <div className="flex flex-col items-center mb-4 sm:mb-0 sm:mr-6">
                 <img
                   src={getFullImageUrl(doctor.fotoUrl)}
                   alt={doctor.username}
                   className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-2"
                 />
                 <p className="text-xs sm:text-sm text-gray-600 font-extralight text-center truncate max-w-[150px]">
                   {doctor.especialidades || "No especificada"}
                 </p>
               </div>
               <div className="flex flex-col flex-grow text-center sm:text-left">
                 <h3 className="text-lg sm:text-xl font-semibold truncate max-w-full">
                   {doctor.username}
                 </h3>
                 <p className="text-gray-500 text-sm mb-2 overflow-hidden text-ellipsis max-h-[48px]">
                   {truncateText(doctor.informacion, 100)}
                 </p>
                 <p className="text-gray-400 text-sm italic truncate">{doctor.email}</p>
                 <div className="flex flex-col sm:flex-row items-center justify-between mt-2">
                   <button
                     className="bg-teal-600 text-white px-4 py-1 rounded-full transition-all hover:bg-teal-700"
                     onClick={() => handleOpenModal(doctor)}
                   >
                     Ver más
                   </button>
                 </div>
               </div>
             </div>
             
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No hay doctores disponibles para la especialidad seleccionada.
            </p>
          )}
        </div>
      </div>
      <DoctorModal
        isOpen={isModalOpen}
        doctor={selectedDoctor}
        isAuthenticated={Boolean(
          localStorage.getItem("username") && localStorage.getItem("role")
        )}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SpecialitySelect;
