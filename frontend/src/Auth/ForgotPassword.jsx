import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:3000/auth/forgot-password', { email });
      Swal.fire('Correo enviado', 'Revisa tu correo para recuperar tu contraseña', 'success');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al enviar el correo', 'error');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Recuperar Contraseña</h2>
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-4"
      />
      <button onClick={handleForgotPassword} className="px-4 py-2 bg-blue-500 text-white">
        Recuperar
      </button>
    </div>
  );
};

export default ForgotPassword;
