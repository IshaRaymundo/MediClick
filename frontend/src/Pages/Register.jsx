// Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Aquí podrías agregar la lógica para registrar al usuario
    console.log('Registro:', { username, password, confirmPassword });
    navigate('/'); // Redirige al Home después de registrarse
  };

  const handleBackToHome = () => {
    navigate('/'); // Redirige al Home
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">Registrarse</h2>
        <form onSubmit={handleRegister} className="space-y-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-blue-800 text-white font-semibold hover:bg-blue-700 transition duration-200"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-4 text-center text-gray-500">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
        <button
          onClick={handleBackToHome}
          className="mt-6 w-full py-2 rounded-full border border-blue-600 text-blue-600 font-semibold hover:bg-blue-100 transition duration-200"
        >
          Volver al Home
        </button>
      </div>
    </div>
  );
};

export default Register;
