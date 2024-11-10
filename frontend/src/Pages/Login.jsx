import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ setUserName, setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });

      localStorage.setItem('token', response.data.token);

      setUserName(username);
      setUserRole(response.data.role);
      localStorage.setItem('username', username); 
      localStorage.setItem('role', response.data.role); 
      // Redirigir al usuario según su rol
      if (response.data.role === 1) {
        navigate('/admin-roles');
      } else if (response.data.role === 2) {
        navigate('/dashboard-doc');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error en el servidor');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">Inicia Sesión</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
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
