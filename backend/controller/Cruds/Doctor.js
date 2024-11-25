const Doctor = require('../../models/Doctor');

class DoctorController {

    static async getAllDoctors(req, res) {
        try {
            const doctors = await Doctor.getAllDoctorsWithEspecialidades();
            res.status(200).json(doctors);
        } catch (error) {
            console.error('Error al obtener todos los doctores:', error.message);
            res.status(500).json({ message: 'Error al obtener todos los doctores' });
        }
    }

    static async deleteDoctor(req, res) {
        const { userId } = req.params;

        try {
            // Obtener el doctor asociado al usuario
            const doctor = await Doctor.getDoctorByUserId(userId);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor no encontrado' });
            }

            // Eliminar especialidades asociadas
            await Doctor.removeEspecialidades(doctor.id);

            // Eliminar el registro del doctor
            await Doctor.removeDoctor(doctor.id);

            // Eliminar el usuario asociado al doctor
            await Doctor.removeUser(userId);

            res.status(200).json({ message: 'Doctor eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar doctor:', error.message);
            res.status(500).json({ message: 'Error al eliminar doctor' });
        }
    }

    static async getDoctor(req, res) {
        const { userId } = req.params;
        try {
            const doctor = await Doctor.getDoctorByUserId(userId);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor no encontrado' });
            }

            const especialidades = await Doctor.getEspecialidadesByDoctorId(doctor.id);
            res.status(200).json({ doctor, especialidades });
        } catch (error) {
            console.error('Error al obtener doctor:', error.message);
            res.status(500).json({ message: 'Error al obtener doctor' });
        }
    }

    static async addEspecialidad(req, res) {
        const { userId } = req.params;
        const { especialidadId } = req.body;

        if (!especialidadId) {
            return res.status(400).json({ message: 'El campo especialidadId es obligatorio' });
        }

        try {
            const doctor = await Doctor.getDoctorByUserId(userId);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor no encontrado' });
            }

            await Doctor.addEspecialidadToDoctor(doctor.id, especialidadId);
            res.status(201).json({ message: 'Especialidad añadida correctamente' });
        } catch (error) {
            console.error('Error al añadir especialidad:', error.message);
            res.status(500).json({ message: 'Error al añadir especialidad' });
        }
    }

    static async removeEspecialidad(req, res) {
        const { userId } = req.params;
        const { especialidadId } = req.body;

        if (!especialidadId) {
            return res.status(400).json({ message: 'El campo especialidadId es obligatorio' });
        }

        try {
            const doctor = await Doctor.getDoctorByUserId(userId);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor no encontrado' });
            }

            await Doctor.removeEspecialidadFromDoctor(doctor.id, especialidadId);
            res.status(200).json({ message: 'Especialidad eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar especialidad:', error.message);
            res.status(500).json({ message: 'Error al eliminar especialidad' });
        }
    }

    static async updateDoctor(req, res) {
        const { userId } = req.params;
        const { fotoUrl, informacion } = req.body;

        try {
            await Doctor.updateDoctorInfo(userId, fotoUrl || null, informacion || null);
            res.status(200).json({ message: 'Información del doctor actualizada correctamente' });
        } catch (error) {
            console.error('Error al actualizar doctor:', error.message);
            if (error.message === 'No se proporcionaron campos para actualizar') {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error al actualizar doctor' });
            }
        }
    }
}

module.exports = DoctorController;
