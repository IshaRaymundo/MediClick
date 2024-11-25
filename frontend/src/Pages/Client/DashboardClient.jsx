import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import Sidebar from '../../Components/Sidebar';
import Specialties from '../../Components/Specialties';
import DoctorModal from '../../Components/DoctorModal';
import axios from 'axios';
// import { FaSearch } from 'react-icons/fa';

// Función para truncar texto
const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text || '';  // Si `text` es null o undefined, devuelve una cadena vacía
};


// Componente para mostrar cada doctor
const DoctorCard = ({ name, especialidad, description, price, photo, onSchedule }) => (
  <div className="bg-white p-4 rounded-xl flex flex-col sm:flex-row items-center w-full max-w-5xl mx-auto shadow-lg hover:shadow-2xl transition-all">
    <div className="flex flex-col items-center mb-4 sm:mb-0 sm:mr-6">
      <img
        src={photo || "https://via.placeholder.com/120"}
        alt="Doctor"
        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-2"
      />
      <p className="text-xs sm:text-sm text-gray-600 font-extralight">{especialidad}</p>
    </div>
    <div className="flex flex-col flex-grow text-center sm:text-left">
      <h3 className="text-lg sm:text-xl font-semibold">{name}</h3>
      <p className="text-gray-500 text-sm mb-2">{truncateText(description, 30)}</p>
      <div className="flex flex-col sm:flex-row items-center justify-between mt-2">
        <p className="text-lg font-semibold mb-2 sm:mb-0">${price}</p>
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
        const response = await axios.get('http://localhost:3000/especialidades');
        setSpecialties(response.data);
      } catch (error) {
        console.error('Error al obtener especialidades:', error);
      }
    };

    fetchSpecialties();
  }, []);

  // Cargar doctores desde la API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/doctors');
        setDoctors(response.data);
        setFilteredDoctors(response.data.sort(() => 0.5 - Math.random()).slice(0, 6)); // Doctores aleatorios
      } catch (error) {
        console.error('Error al obtener doctores:', error);
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
          doctor.especialidad &&
          doctor.especialidad.toLowerCase() === specialtyName.toLowerCase()
      );
      setFilteredDoctors(filtered);
    } else {
      // Si no hay especialidad seleccionada, muestra doctores aleatorios
      setFilteredDoctors(doctors.sort(() => 0.5 - Math.random()).slice(0, 6));
    }
  };

  return (
    <div className="flex bg-gray-50">
      <Sidebar isExpanded={isSidebarExpanded} userName={userName} userRole={userRole} handleLogout={handleLogout} />
      <div className="flex-1">
        <Navbar
          userName={userName}
          toggleSidebar={toggleSidebar}
          isSidebarExpanded={isSidebarExpanded}
        />

        <div className="px-4 sm:px-8 py-4 flex flex-col items-center">
          {/* <header className="flex justify-between items-center w-full max-w-4xl mb-8">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-800" />
              </span>
              <input
                type="text"
                placeholder="Ingresa un nombre o doctor"
                className="w-full p-2 pl-10 rounded-full border border-gray-300 bg-gray-100 focus:ring focus:ring-blue-300"
              />
            </div>
          </header> */}

          <section className="mb-8 w-full max-w-4xl">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-left ml-4 text-blue-900">Especialidades</h2>
            <Specialties specialties={specialties} onSelect={handleSpecialtySelect} />
          </section>
        </div>

        <div className="w-full flex justify-center">
          <section className="w-full max-w-6xl">
            <h2 className="text-lg sm:text-xl font-bold mb-4 text-left ml-4 text-blue-900">
              {selectedSpecialty
                ? `Doctores de ${selectedSpecialty}`
                : 'Doctores disponibles'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor, index) => (
                <DoctorCard
                  key={index}
                  name={doctor.doctor_name}
                  description={doctor.informacion}
                  photo={doctor.foto_url}
                  especialidad={doctor.especialidad}
                  price={Math.floor(Math.random() * 50) + 10}
                  onSchedule={() => handleOpenModal(doctor)}
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
