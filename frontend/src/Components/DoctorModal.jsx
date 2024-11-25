import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay"; // Asegúrate de importar correctamente este componente.

const DoctorModal = ({ isOpen, doctor, onClose }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      document.body.style.overflow = "hidden"; // Evita el desplazamiento en el fondo.
    } else {
      setShowModal(false);
      document.body.style.overflow = ""; // Restaura el desplazamiento.
    }

    return () => {
      document.body.style.overflow = ""; // Limpia el efecto al desmontar.
    };
  }, [isOpen]);

  const handleNavigate = () => {
    setShowModal(false);

    setTimeout(() => {
      setIsLoading(true);

      setTimeout(() => {
        setIsLoading(false);
        navigate(
          `/schedule-appointment?doctor=${encodeURIComponent(
            doctor.username
          )}&especialidad=${encodeURIComponent(doctor.especialidades)}`
        );
      }, 2000);
    }, 300);
  };

  if (!isOpen || !doctor) return null;

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${
          showModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        <div
          className={`relative p-4 w-full max-w-3xl max-h-full bg-white rounded-lg shadow-lg dark:bg-gray-800 transition-transform duration-300 ${
            showModal ? "translate-y-0 scale-100" : "translate-y-10 scale-95"
          }`}
        >
          {/* Modal header */}
          <div className="p-6 border-b border-gray-300 dark:border-gray-700">
            <h3 className="text-2xl text-center font-semibold text-gray-800 dark:text-white">
              {doctor.username}
            </h3>
            <button
              type="button"
              className="absolute top-4 right-4 text-red-600 bg-transparent hover:bg-red-600 hover:text-white rounded-full p-2 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div className="p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex flex-col items-center mr-6">
              <img
                src={doctor.fotoUrl || "https://via.placeholder.com/150"}
                alt={doctor.username}
                className="w-40 h-40 rounded-full shadow-md"
              />
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {doctor.especialidades || "No hay especialidad disponible."}
              </p>
            </div>
            <div className="flex flex-col flex-grow">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                  Información del doctor
                </h4>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {doctor.informacion ||
                    "No hay descripción disponible para este doctor."}
                </p>
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="flex justify-center p-6 space-x-3 border-t border-gray-300 dark:border-gray-700">
            <button
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300"
              onClick={handleNavigate}
            >
              Ver Horarios Disponibles
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorModal;
