import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import Specialties from "../../Components/Specialties";
import DoctorModal from "../../Components/DoctorModal";
import axios from "axios";

// Función para construir la URL de la imagen
const getFullImageUrl = (photo) => {
  return photo ? `http://localhost:3000/${photo}` : "https://via.placeholder.com/120";
};

// Función para truncar texto
const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text || "";
};

// Componente para mostrar cada doctor
const DoctorCard = ({
  name,
  especialidad,
  description,
  photo,
  email,
  onSchedule,
}) => (
  <div className="bg-white p-4 rounded-xl flex flex-col sm:flex-row items-center w-full max-w-5xl mx-auto shadow-lg hover:shadow-2xl transition-all">
    <div className="flex flex-col items-center mb-4 sm:mb-0 sm:mr-6">
      <img
        src={getFullImageUrl(photo)}
        alt="Doctor"
        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-2"
      />
      <p className="text-xs sm:text-sm text-gray-600 font-extralight">
        {especialidad}
      </p>
    </div>
    <div className="flex flex-col flex-grow text-center sm:text-left">
      <h3 className="text-lg sm:text-xl font-semibold">{name}</h3>
      <p className="text-gray-500 text-sm mb-2">
        {truncateText(description, 30)}
      </p>
      <p className="text-gray-400 text-sm italic">{email}</p>
      <div className="flex flex-col sm:flex-row items-center justify-between mt-2">
        <button
          className="bg-teal-600 text-white px-4 py-1 rounded-full transition-all hover:bg-teal-700"
          onClick={onSchedule}
        >
          Ver más
        </button>
      </div>
    </div>
  </div>
);

const DoctorList = ({ userName, userRole, handleLogout }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
  };

  // Cargar especialidades desde la API
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/especialidades"
        );
        setSpecialties(response.data);
      } catch (error) {
        console.error("Error al obtener especialidades:", error);
      }
    };

    fetchSpecialties();
  }, []);

  // Cargar doctores desde la API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/doctores");
        setDoctors(response.data);
        setFilteredDoctors(response.data.slice(0, 6)); // Limita a 6 doctores inicialmente
      } catch (error) {
        console.error("Error al obtener doctores:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Filtrar doctores por especialidad
  const handleSpecialtySelect = (specialtyName) => {
    setSelectedSpecialty(specialtyName);

    if (specialtyName) {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.especialidades &&
          doctor.especialidades.toLowerCase() === specialtyName.toLowerCase()
      );
      setFilteredDoctors(filtered.slice(0, 6)); // Limita a 6 doctores filtrados
    } else {
      setFilteredDoctors(doctors.slice(0, 6));
    }
  };

  return (
    <div className="flex bg-gray-50">
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

        <div className="px-4 sm:px-8 py-4 flex flex-col items-center">
          <section className="mb-8 w-full max-w-4xl">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-left ml-4 text-blue-900">
              Especialidades
            </h2>
            <Specialties
              specialties={specialties}
              onSelect={handleSpecialtySelect}
            />
          </section>
        </div>

        <div className="w-full flex justify-center">
          <section className="w-full max-w-6xl">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-left ml-4 text-blue-900">
              {selectedSpecialty
                ? `Doctores de ${selectedSpecialty}`
                : "Doctores disponibles"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.doctorId}
                  name={doctor.username}
                  description={doctor.informacion}
                  photo={doctor.fotoUrl}
                  email={doctor.email}
                  especialidad={doctor.especialidades}
                  onSchedule={() => handleOpenModal(doctor)} // El objeto `doctor` pasa correctamente
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <DoctorModal
        isOpen={isModalOpen}
        doctor={selectedDoctor}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default DoctorList;
