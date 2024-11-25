import React, { useState, useRef, useEffect } from 'react';
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
  FaUserMd, // Usado para dermatología
  FaFemale,
  FaProcedures,
  FaRegHospital,
  FaDiagnoses,
  FaCapsules,
  FaLungs,
  FaWheelchair,
  FaMicroscope,
  FaNotesMedical,
  FaUserClock,
  FaSyringe,
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
    case 'dermatología':
      return <FaUserMd className="w-10 h-10 text-white" />;
    case 'ginecología':
      return <FaFemale className="w-10 h-10 text-white" />;
    case 'urología':
      return <FaProcedures className="w-10 h-10 text-white" />;
    case 'traumatología':
      return <FaRegHospital className="w-10 h-10 text-white" />;
    case 'psiquiatría':
      return <FaDiagnoses className="w-10 h-10 text-white" />;
    case 'oncología':
      return <FaDiagnoses className="w-10 h-10 text-white" />;
    case 'endocrinología':
      return <FaCapsules className="w-10 h-10 text-white" />;
    case 'neumología':
      return <FaLungs className="w-10 h-10 text-white" />;
    case 'reumatología':
      return <FaWheelchair className="w-10 h-10 text-white" />;
    case 'hematología':
      return <FaMicroscope className="w-10 h-10 text-white" />;
    case 'otorrinolaringología':
      return <FaNotesMedical className="w-10 h-10 text-white" />;
    case 'medicina interna':
      return <FaUserClock className="w-10 h-10 text-white" />;
    case 'cirugía general':
      return <FaSyringe className="w-10 h-10 text-white" />;
    default:
      return <FaSearch className="w-10 h-10 text-white" />;
  }
};

const Specialties = ({ specialties, onSelect }) => {
  const [showAll, setShowAll] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState('0px');

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  useEffect(() => {
    if (showAll) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight('0px');
    }
  }, [showAll]);

  return (
    <div className="flex flex-col items-center">
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

        {/* Mostrar las primeras 8 especialidades */}
        {specialties.slice(0, 7).map((specialty, index) => (
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

      {/* Contenedor oculto/visible */}
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden transition-max-height duration-500 ease-in-out"
      >
        <div className="flex justify-center flex-wrap gap-6 mt-4">
          {specialties.slice(7).map((specialty, index) => (
            <div
              key={index + 8}
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
      </div>

      {/* Botón para desplegar/ocultar más especialidades */}
      <button
        className="mt-6 flex items-center text-blue-600 font-medium focus:outline-none"
        onClick={toggleShowAll}
      >
        {showAll ? 'Mostrar menos' : 'Mostrar más'}
        <span
          className={`ml-2 transform transition-transform duration-300 ${
            showAll ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>
    </div>
  );
};

export default Specialties;
