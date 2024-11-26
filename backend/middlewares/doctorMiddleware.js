// middleware/doctorMiddleware.js
const Doctor = require('../models/Doctor');

const checkDoctor = async (req, res, next) => {
    try {
        const userId = req.user.id; // Obtenemos el userId del token JWT
        const doctor = await Doctor.getDoctorByUserId(userId); // Verificamos si este usuario es un doctor

        if (!doctor) {
            return res.status(403).json({ message: 'No eres un doctor registrado' });
        }

        req.doctorId = doctor.id; // Añadimos el doctorId a la solicitud
        next(); // Continuamos al siguiente middleware o controlador
    } catch (error) {
        console.error('Error al verificar el doctor:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = checkDoctor;
