import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingOverlay from "./LoadingOverlay";

const getFullImageUrl = (photo) => {
  return photo ? `http://localhost:3000/${photo}` : "https://via.placeholder.com/150";
};

const DoctorModal = ({ isOpen, doctor, onClose, isAuthenticated, userId }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      document.body.style.overflow = "hidden";
    } else {
      setShowModal(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavigate = () => {
    if (!isAuthenticated) {
      onClose();
      Swal.fire({
        title: "Para continuar",
        text: "Por favor regístrate o inicia sesión si ya estás registrado.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Iniciar sesión",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate(
          `/schedule-appointment?doctorId=${doctor.doctorId}&doctor=${encodeURIComponent(
            doctor.username
          )}&especialidad=${encodeURIComponent(
            doctor.especialidades
          )}&photo=${encodeURIComponent(doctor.fotoUrl || "")}&userId=${userId}`
        );
      }, 2000);
    }, 300);
  };

  if (!isOpen || !doctor) return null;

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto transition-opacity duration-300 ${
          showModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      >
        <div
          className={`relative p-4 w-full max-w-3xl bg-white rounded-lg shadow-lg transition-transform duration-300 ${
            showModal ? "translate-y-0 scale-100" : "translate-y-10 scale-95"
          }`}
        >
          <div className="p-6 border-b">
            <h3 className="text-2xl text-center font-semibold">{doctor.username}</h3>
            <button
              type="button"
              className="absolute top-4 right-4 text-red-600 hover:text-white hover:bg-red-600 rounded-full p-2"
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
          <div className="p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            <div className="flex flex-col items-center">
              <img
                src={getFullImageUrl(doctor.fotoUrl)}
                alt={doctor.username}
                className="w-40 h-40 rounded-full shadow-md"
              />
              <p className="text-sm text-gray-600 mt-4">{doctor.especialidades || "No hay especialidad disponible."}</p>
            </div>
            <div className="flex flex-col flex-grow">
              <h4 className="text-lg font-medium mb-2">Información del doctor</h4>
              <p className="text-sm text-gray-600">
                {doctor.informacion || "No hay descripción disponible para este doctor."}
              </p>
            </div>
          </div>
          <div className="flex justify-center p-6 border-t">
            <button
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-full font-medium"
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
