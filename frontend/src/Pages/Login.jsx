// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserName }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setUserName(username);
    navigate('/'); 
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">Inicia Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-blue-800 text-white font-semibold hover:bg-blue-700 transition duration-200"
          >
            Iniciar sesión
          </button>
        </form>
        <p className="mt-4 text-center text-gray-500">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate
          </a>
        </p>
        <button
          onClick={handleBackToHome}
          className="mt-6 w-full py-2 rounded-full border border-blue-600 text-blue-600 font-semibold hover:bg-blue-100 transition duration-200"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default Login;
