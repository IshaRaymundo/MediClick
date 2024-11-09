import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userName, toggleSidebar, handleLogout }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = () => {
    handleLogout(); 
    navigate('/'); 
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white text-blue-700 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-2xl mr-6 ml-4 focus:outline-none">
          <FaBars />
        </button>
        <h1 className="text-2xl font-bold">MediClick</h1>
      </div>
      <div className="relative flex items-center">
        {userName ? (
          <div className="relative" ref={dropdownRef}>
            <span
              onClick={toggleDropdown}
              className="mr-4 text-xl cursor-pointer hover:underline"
            >
              Bienvenido, {userName}!
            </span>
            <div
              className={`absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
                isDropdownOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="text-gray-700">
                <li onClick={() => navigate('/profile')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Perfil
                </li>
                <li onClick={handleLogoutClick} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                  Cerrar sesión
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={handleLoginClick}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full hover:bg-gray-200"
          >
            <FaUser />
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
