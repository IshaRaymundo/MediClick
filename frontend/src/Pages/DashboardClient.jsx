import React, { useState } from 'react';
import { FaHeartbeat, FaBrain, FaBaby, FaTooth, FaBone, FaEye, FaAppleAlt, FaSearch } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

const DoctorCard = ({ name, description, price }) => (
  <div className="bg-gray-100 p-4 rounded-lg flex items-center w-full max-w-5xl mx-auto">
    <img
      src="https://via.placeholder.com/120"
      alt="Doctor"
      className="w-32 h-32 rounded-full mr-6"
    />
    <div className="flex flex-col flex-grow">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-500 text-sm mb-2">{description}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-lg font-semibold">${price}</p>
        <button className="bg-blue-800 text-white px-4 py-1 rounded-full">Agendar</button>
      </div>
    </div>
  </div>
);

const specialties = [
  { icon: <FaHeartbeat className="w-10 h-10 text-white" />, name: 'Cardiología' },
  { icon: <FaBrain className="w-10 h-10 text-white" />, name: 'Neurología' },
  { icon: <FaBaby className="w-10 h-10 text-white" />, name: 'Pediatría' },
  { icon: <FaTooth className="w-10 h-10 text-white" />, name: 'Odontología' },
  { icon: <FaBone className="w-10 h-10 text-white" />, name: 'Ortopedia' },
  { icon: <FaEye className="w-10 h-10 text-white" />, name: 'Oftalmología' },
  { icon: <FaAppleAlt className="w-10 h-10 text-white" />, name: 'Nutriología' },
];

const DoctorList = ({ userName, setUserName }) => {
const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const doctors = [
    { name: 'Dr. Lorem Ipsum', description: 'Especialista en cuidados médicos generales', price: 12 },
    { name: 'Dr. John Doe', description: 'Experto en pediatría y salud infantil', price: 15 },
    { name: 'Dra. Jane Smith', description: 'Odontología avanzada y estética dental', price: 20 },
    { name: 'Dr. Albert Tan', description: 'Ortopedia y tratamiento de lesiones deportivas', price: 18 },
    { name: 'Dra. Clara Lee', description: 'Nutriología y salud dietética', price: 25 },
    { name: 'Dr. Mark White', description: 'Especialista en neurología y salud cerebral', price: 30 },
  ];

  return (
    <div className="flex">
      <Sidebar isExpanded={isExpanded} userName={userName} />
      <div className="flex-1">
      <Navbar userName={userName} toggleSidebar={toggleSidebar} setUserName={setUserName} />

        <div className="px-8 py-4 flex flex-col items-center">
          <header className="flex justify-between items-center w-full max-w-4xl mb-8">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-800" />
              </span>
              <input
                type="text"
                placeholder="Ingresa un nombre o doctor"
                className="w-full p-2 pl-10 rounded-full border border-gray-300 bg-gray-100"
              />
            </div>
          </header>

          <section className="mb-8 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-4 text-left ml-4">Especialidades</h2>
            <div className="flex justify-center space-x-8">
              {specialties.map((specialty, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center">
                    {specialty.icon}
                  </div>
                  <p className="text-center text-sm mt-2">{specialty.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="w-full flex justify-center">
          <section className="w-full max-w-6xl">
            <h2 className="text-xl font-bold mb-4 text-left ml-4">Doctores disponibles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => (
                <DoctorCard key={index} {...doctor} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
