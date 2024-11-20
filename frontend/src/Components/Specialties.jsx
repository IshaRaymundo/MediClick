import React from 'react';
import {
  FaHeartbeat,
  FaBrain,
  FaBaby,
  FaTooth,
  FaBone,
  FaEye,
  FaAppleAlt,
  FaSearch,
  FaUsers,
} from 'react-icons/fa';

const getSpecialtyIcon = (specialtyName) => {
  switch (specialtyName.toLowerCase()) {
    case 'cardiología':
      return <FaHeartbeat className="w-10 h-10 text-white" />;
    case 'neurología':
      return <FaBrain className="w-10 h-10 text-white" />;
    case 'pediatría':
      return <FaBaby className="w-10 h-10 text-white" />;
    case 'odontología':
      return <FaTooth className="w-10 h-10 text-white" />;
    case 'ortopedia':
      return <FaBone className="w-10 h-10 text-white" />;
    case 'oftalmología':
      return <FaEye className="w-10 h-10 text-white" />;
    case 'nutriología':
      return <FaAppleAlt className="w-10 h-10 text-white" />;
    default:
      return <FaSearch className="w-10 h-10 text-white" />;
  }
};

const Specialties = ({ specialties, onSelect }) => {
  return (
    <div className="flex justify-center flex-wrap gap-6">
      {/* Botón para mostrar todos los doctores */}
      <div
        className="flex flex-col items-center cursor-pointer group"
        onClick={() => onSelect(null)}
      >
        <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
          <FaUsers className="w-10 h-10 text-white" />
        </div>
        <p className="text-center text-sm mt-2 transition-all duration-300 group-hover:text-gray-800">
          Todos
        </p>
      </div>

      {/* Especialidades dinámicas */}
      {specialties.map((specialty, index) => (
        <div
          key={index}
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => onSelect(specialty.nombre)}
        >
          <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
            {getSpecialtyIcon(specialty.nombre)}
          </div>
          <p className="text-center text-sm mt-2 transition-all duration-300 group-hover:text-blue-800">
            {specialty.nombre}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Specialties;
