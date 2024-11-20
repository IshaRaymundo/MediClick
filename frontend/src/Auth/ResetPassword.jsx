import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();

  const handleResetPassword = async () => {
    try {
        await axios.post(`http://localhost:3000/reset-password/${token}`, { password });
        Swal.fire('Contraseña actualizada', 'Tu contraseña ha sido cambiada exitosamente', 'success');
    } catch (error) {
      Swal.fire('Error', 'El enlace ha expirado o es inválido', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Nueva Contraseña</h2>
      <input
        type="password"
        placeholder="Nueva Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4"
      />
      <button onClick={handleResetPassword} className="px-4 py-2 bg-blue-500 text-white">
        Cambiar Contraseña
      </button>
    </div>
  );
};

export default ResetPassword;
