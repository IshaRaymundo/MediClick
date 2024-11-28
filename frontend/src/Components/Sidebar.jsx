import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  HomeIcon,
  CalendarIcon,
  HeartIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({
  userName,
  userRole,
  isExpanded,
  handleLogout,
  isAuthenticated,
}) => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const toggleSubMenu = (menuName) => {
    if (isExpanded) {
      setActiveSubMenu((prev) => (prev === menuName ? null : menuName));
    }
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Sesión cerrada!",
          text: "Has cerrado sesión exitosamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          handleLogout(); // Llama a la función de cierre de sesión
          setIsLoggedIn(false); // Actualiza el estado del login
          navigate("/"); // Redirige al usuario al inicio
        });
      }
    });
  };

  return (
    <div
      className={`flex flex-col ${
        isExpanded ? "w-64" : "w-16"
      } bg-gradient-to-b from-blue-700 to-blue-950 min-h-screen p-4 transition-width duration-300 shadow-xl rounded-tr-3xl rounded-br-3xl`}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/Mediclick logo trans.png"
          alt="Logo"
          className={`mb-2 ${
            isExpanded ? "w-44 h-20" : "w-0 h-0"
          } transition-all duration-300`}
        />
      </div>

      {/* Menú */}
      <div className="flex-grow w-full">
        {isExpanded && (
          <p className="text-white text-lg font-bold mb-9 transition-opacity duration-300 opacity-100">
            Menú
          </p>
        )}

        {/* Opciones para Paciente */}
        {userRole === 3 && (
          <>
            <Link
              to="/"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-700 hover:shadow-md text-white transition-all duration-300"
            >
              <HomeIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && <span className="ml-4 font-medium">Home</span>}
            </Link>

            {/* Submenú: Mis Citas */}
            <div>
              <button
                onClick={() => toggleSubMenu("misCitas")}
                className="flex items-center justify-between w-full mb-4 p-2 rounded-lg hover:bg-blue-700 hover:shadow-md text-white transition-all duration-300"
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
                    to="/appointments"
                    state={{ view: "past" }}
                    className="block mb-2 p-2 rounded-lg hover:bg-blue-600 text-white transition-all duration-300"
                  >
                    Pasadas
                  </Link>
                  <Link
                    to="/appointments"
                    state={{ view: "upcoming" }}
                    className="block p-2 rounded-lg hover:bg-blue-600 text-white transition-all duration-300"
                  >
                    Próximas
                  </Link>
                </div>
              </div>
            </div>

            {/* Submenú: Especialidades */}
            <div>
              <button
                onClick={() => toggleSubMenu("especialidades")}
                className="flex items-center justify-between w-full mb-4 p-2 rounded-lg hover:bg-blue-700 hover:shadow-md text-white transition-all duration-300"
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
    className="block mb-2 p-2 rounded-lg hover:bg-blue-600 text-white transition-all duration-300"
  >
    Cardiología
  </Link>
  <Link
    to="/especialidades/neurologia"
    className="block mb-2 p-2 rounded-lg hover:bg-blue-600 text-white transition-all duration-300"
  >
    Neurología
  </Link>
  <Link
    to="/especialidades/dermatologia"
    className="block mb-2 p-2 rounded-lg hover:bg-blue-600 text-white transition-all duration-300"
  >
    Dermatología
  </Link>
  <Link
    to="/especialidades/pediatria"
    className="block mb-2 p-2 rounded-lg hover:bg-blue-600 text-white transition-all duration-300"
  >
    Pediatría
  </Link>
  <Link
    to="/especialidades/oftalmologia"
    className="block mb-2 p-2 rounded-lg hover:bg-blue-600 text-white transition-all duration-300"
  >
    Oftalmología
  </Link>
  <Link
    to="/especialidades/nutriologia"
    className="block mb-2 p-2 rounded-lg hover:bg-blue-600 text-white transition-all duration-300"
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
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-700 hover:shadow-md text-white transition-all duration-300"
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
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-700 hover:shadow-md text-white transition-all duration-300"
            >
              <ClipboardDocumentListIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && (
                <span className="ml-4 font-medium">Mis Pacientes</span>
              )}
            </Link>
            <Link
              to="/Schedule-doc"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-700 hover:shadow-md text-white transition-all duration-300"
            >
              <ClockIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && (
                <span className="ml-4 font-medium">Mis Horarios</span>
              )}
            </Link>
          </>
        )}

        {/* Opciones para Admin */}
        {userRole === 1 && (
          <>
            <Link
              to="/admin-dashboard"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-700 hover:shadow-md text-white transition-all duration-300"
            >
              <HomeIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && <span className="ml-4 font-medium">Home</span>}
            </Link>
            <Link
              to="/users-admin"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-700 hover:shadow-md text-white transition-all duration-300"
            >
              <UsersIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && <span className="ml-4 font-medium">Usuarios</span>}
            </Link>
            <Link
              to="/especialidades"
              className="flex items-center w-full mb-4 p-2 rounded-lg hover:bg-blue-700 hover:shadow-md text-white transition-all duration-300"
            >
              <HeartIcon
                className={`transition-all duration-300 ${
                  isExpanded ? "w-8 h-8" : "w-6 h-6"
                }`}
              />
              {isExpanded && (
                <span className="ml-4 font-medium">Especialidades</span>
              )}
            </Link>
          </>
        )}
      </div>

      {/* Botón Cerrar sesión */}
      {isLoggedIn && (
        <button
          onClick={handleLogoutClick}
          className="flex items-center w-full p-2 rounded-lg hover:bg-red-500 hover:shadow-md text-white mt-auto transition-all duration-300"
        >
          <ArrowRightOnRectangleIcon
            className={`transition-all duration-300 ${
              isExpanded ? "w-8 h-8" : "w-6 h-6"
            }`}
          />
          {isExpanded && (
            <span className="ml-4 font-medium">Cerrar sesión</span>
          )}
        </button>
      )}
    </div>
  );
};

export default Sidebar;
