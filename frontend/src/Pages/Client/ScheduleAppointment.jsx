// ScheduleAppointment.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  // Esta función maneja la selección del día
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Esta función maneja la selección del horario
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Manejar la programación de la cita
  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      // Aquí puedes agregar la lógica para guardar la cita en la base de datos
      alert(`Cita programada para el ${selectedDate} a las ${selectedTime}`);
      navigate('/'); // Redirige al dashboard después de agendar
    } else {
      alert('Por favor, selecciona un día y una hora');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Programar cita</h2>

        {/* Tabla de selección de día */}
        <div className="mb-4">
          <h3 className="text-lg">Elige el día</h3>
          <input
            type="date"
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>

        {/* Tabla de selección de horario */}
        <div className="mb-4">
          <h3 className="text-lg">Elige el horario</h3>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`px-4 py-2 rounded-lg ${
                  selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Botón para programar la cita */}
        <button
          onClick={handleSchedule}
          className="bg-blue-600 text-white w-full py-2 rounded-lg mt-4"
        >
          Programar cita
        </button>
      </div>
    </div>
  );
};

export default ScheduleAppointment;
