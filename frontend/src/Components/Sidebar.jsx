import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  CalendarIcon,
  HeartIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon, // Icono para "Cerrar sesión"
} from "@heroicons/react/24/outline";

const Sidebar = ({ userName, userRole, isExpanded, handleLogout, isAuthenticated }) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Controla si el usuario está logueado
  const navigate = useNavigate();

  const toggleSubMenu = (menuName) => {
    if (isExpanded) {
      setActiveSubMenu((prev) => (prev === menuName ? null : menuName));
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    setIsLoggedIn(false); // Cambia el estado a no logueado
    navigate("/");
  };

  return (
    <div
      className={`flex flex-col ${
        isExpanded ? "w-64" : "w-16"
      } bg-blue-200 min-h-screen p-4 transition-width duration-300`}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8 ">
        <img
          src="/Mediclick azul.png" // Reemplaza con la ruta de tu logo
          alt="Logo"
          className={`mb-2 ${isExpanded ? "w-44 h-20" : "w-0 h-0"} transition-all duration-300`}
        />
      </div>

      {/* Contenedor del menú */}
      <div className="flex-grow w-full">
        {isExpanded && (
          <p className="text-lg font-bold mb-9 transition-opacity duration-300 opacity-100">
            Menú
          </p>
        )}

        {/* Opciones para Paciente */}
        {userRole === 3 && (
          <>
            <Link
              to="/"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
            >
              <HomeIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && <span className="ml-4 font-medium">Home</span>}
            </Link>

            {/* Botón Mis Citas con Submenú */}
            <div>
              <button
                onClick={() => toggleSubMenu("misCitas")}
                className="flex items-center justify-between w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
              >
                <div className="flex items-center">
                  <CalendarIcon
                    className={`transition-all duration-300 ${
                      isExpanded ? "w-8 h-8" : "w-4 h-4"
                    }`}
                  />
                  {isExpanded && (
                    <span className="ml-4 font-medium">Mis citas</span>
                  )}
                </div>
                {isExpanded && (
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      activeSubMenu === "misCitas" ? "rotate-180" : "rotate-0"
                    }`}
                  />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeSubMenu === "misCitas" && isExpanded
                    ? "max-h-32"
                    : "max-h-0"
                }`}
              >
                <div className="text-center">
                  <Link
                    to="/mis-citas/pasadas"
                    className="block mb-2 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
                  >
                    Pasadas
                  </Link>
                  <Link
                    to="/mis-citas/proximas"
                    className="block p-2 rounded-lg hover:bg-blue-300 text-blue-800"
                  >
                    Próximas
                  </Link>
                </div>
              </div>
            </div>

            {/* Botón Especialidades con Submenú */}
            <div>
              <button
                onClick={() => toggleSubMenu("especialidades")}
                className="flex items-center justify-between w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
              >
                <div className="flex items-center">
                  <HeartIcon
                    className={`transition-all duration-300 ${
                      isExpanded ? "w-8 h-8" : "w-4 h-4"
                    }`}
                  />
                  {isExpanded && (
                    <span className="ml-4 font-medium">Especialidades</span>
                  )}
                </div>
                {isExpanded && (
                  <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-300 ${
                      activeSubMenu === "especialidades"
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  />
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeSubMenu === "especialidades" && isExpanded
                    ? "max-h-80"
                    : "max-h-0"
                }`}
              >
                <div className="text-center">
                  <Link
                    to="/especialidades/cardiologia"
                    className="block mb-2 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
                  >
                    Cardiología
                  </Link>
                  <Link
                    to="/especialidades/neurologia"
                    className="block mb-2 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
                  >
                    Neurología
                  </Link>
                  <Link
                    to="/especialidades/odontologia"
                    className="block mb-2 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
                  >
                    Odontología
                  </Link>
                  <Link
                    to="/especialidades/pediatria"
                    className="block mb-2 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
                  >
                    Pediatría
                  </Link>
                  <Link
                    to="/especialidades/ortopedia"
                    className="block p-2 rounded-lg hover:bg-blue-300 text-blue-800"
                  >
                    Ortopedia
                  </Link>
                  <Link
                    to="/especialidades/ortopedia"
                    className="block p-2 rounded-lg hover:bg-blue-300 text-blue-800"
                  >
                    Oftamología
                  </Link>
                  <Link
                    to="/especialidades/ortopedia"
                    className="block p-2 rounded-lg hover:bg-blue-300 text-blue-800"
                  >
                    Nutriología
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Opciones para Doctor */}
        {userRole === 2 && (
          <>
            <Link
              to="/dashboard-doc"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
            >
              <HomeIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && <span className="ml-4 font-medium">Home</span>}
            </Link>
            <Link
              to="/mis-pacientes"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
            >
              <ClipboardDocumentListIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && <span className="ml-4 font-medium">Mis Pacientes</span>}
            </Link>
          </>
        )}

        {/* Opciones para Admin */}
        {userRole === 1 && (
          <>
            <Link
              to="/admin-dashboard"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
            >
              <HomeIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && <span className="ml-4 font-medium">Home</span>}
            </Link>
            <Link
              to="/Users-Admin"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-300 text-blue-800"
            >
              <UsersIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && <span className="ml-4 font-medium">Usuarios</span>}
            </Link>
          </>
        )}
      </div>

          {/* Botón Cerrar sesión */}
          {isLoggedIn && (
        <button
          onClick={handleLogoutClick}
          className="flex items-center w-full p-2 rounded-lg hover:bg-red-500 hover:text-white text-red-600 mt-auto"
        >
          <ArrowRightOnRectangleIcon
            className={`transition-all duration-300 ${
              isExpanded ? "w-8 h-8" : "w-6 h-6"
            }`}
          />
          {isExpanded && <span className="ml-4 font-medium">Cerrar sesión</span>}
        </button>
      )}
    </div>
  );
};

export default Sidebar;