import React from "react";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/30 to-gray-800/40">
      <div className="flex flex-col items-center">
        <div className="heartbeat-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 40"
            className="heartbeat-svg"
          >
            <polyline
              points="0,20 20,20 30,10 40,30 50,20 70,20 80,6 100,34 110,20 130,20 140,12 160,28 170,20 200,20 220,20 230,10 240,30 250,20 270,20 280,6 300,34 310,20 330,20 340,12 360,28 370,20 400,20"
              fill="none"
              stroke="blue"
              strokeWidth="2"
            />
          </svg>
        </div>
        <p className="text-white mt-10 text-2xl sm:text-3xl font-semibold text-center px-4">
          Cargando Horarios del Médico...
        </p>
      </div>

      <style>
        {`
          /* Contenedor del electrocardiograma */
          .heartbeat-container {
            width: 100%; 
            max-width: 1200px; 
            height: 20vh; 
            max-height: 200px;
            overflow: hidden;
            position: relative;
          }

          /* SVG que se desliza */
          .heartbeat-svg {
            width: 200%; 
            height: 100%; 
            position: absolute;
            animation: infinite-scroll 8s linear infinite;
          }

          /* Animación del movimiento continuo */
          @keyframes infinite-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-33.33%); /* Ajuste para movimiento continuo */
            }
          }

          /* Texto responsivo */
          p {
            font-size: calc(1rem + 1vw); /* Tamaño de texto relativo al ancho de la pantalla */
          }
        `}
      </style>
    </div>
  );
};

export default LoadingOverlay;
