import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = ({ setUserName }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/register', {
        username,
        password,
        email
      });
      console.log(response.data.message);

      setUserName(username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en el servidor');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const calculatePasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1; // Contiene mayúsculas
    if (/[0-9]/.test(password)) strength += 1; // Contiene números
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Contiene caracteres especiales
    return strength;
  };

  const passwordStrength = calculatePasswordStrength();
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-700'][passwordStrength];
  const strengthText = ['Muy débil', 'Débil', 'Moderada', 'Fuerte', 'Muy fuerte'][passwordStrength];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">Registrarse</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="relative mb-2">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña (mínimo 8 caracteres)"
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

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-100 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {password && (
            <>
              <div className="w-full h-2 rounded-full bg-gray-300 mb-2">
                <div className={`h-full rounded-full ${strengthColor} transition-all duration-300`} style={{ width: `${(passwordStrength / 4) * 100}%` }}></div>
              </div>
              <p className="text-sm text-gray-600 text-center mb-4">{strengthText}</p>
            </>
          )}
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
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default Register;
