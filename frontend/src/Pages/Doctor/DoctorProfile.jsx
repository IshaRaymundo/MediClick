import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorProfile = ({ userId }) => {
  const [doctorData, setDoctorData] = useState({
    username: '',
    email: '',
    especialidad_id: '',
    foto_url: '',
    informacion: '',
  });

  useEffect(() => {
    // Cargar los datos actuales del perfil
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(`/api/doctors/${userId}/profile`);
        setDoctorData(response.data);
      } catch (error) {
        console.error('Error al cargar los datos del perfil:', error);
      }
    };
    fetchDoctorData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/doctors/${userId}/profile`, doctorData);
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil');
    }
  };

  return (
    <div>
      <h2>Perfil del Doctor</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de usuario:
          <input
            type="text"
            name="username"
            value={doctorData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={doctorData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Especialidad:
          <input
            type="text"
            name="especialidad_id"
            value={doctorData.especialidad_id}
            onChange={handleChange}
          />
        </label>
        <label>
          URL de la foto:
          <input
            type="text"
            name="foto_url"
            value={doctorData.foto_url}
            onChange={handleChange}
          />
        </label>
        <label>
          Información:
          <textarea
            name="informacion"
            value={doctorData.informacion}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Actualizar Perfil</button>
      </form>
    </div>
  );
};

export default DoctorProfile;
