const DashboardClient = require('../../models/DashboardClient');

class ClientController {
    // Obtener lista de doctores con especialidades
    static async getDoctors(req, res) {
        try {
            const doctors = await DashboardClient.getAllDoctorsWithEspecialidades();
            res.status(200).json(doctors);
        } catch (error) {
            console.error('Error al obtener doctores:', error.message);
            res.status(500).json({ message: 'Error al obtener la lista de doctores' });
        }
    }

    // Obtener lista de especialidades
    static async getEspecialidades(req, res) {
        try {
            const especialidades = await DashboardClient.getAllEspecialidades();
            res.status(200).json(especialidades);
        } catch (error) {
            console.error('Error al obtener especialidades:', error.message);
            res.status(500).json({ message: 'Error al obtener la lista de especialidades' });
        }
    }

    // Agendar una cita
    static async scheduleAppointment(req, res) {
        const { doctorId, userId, fecha } = req.body;
        try {
            await DashboardClient.scheduleAppointment(doctorId, userId, fecha);
            res.status(201).json({ message: 'Cita agendada exitosamente' });
        } catch (error) {
            console.error('Error al agendar cita:', error.message);
            res.status(500).json({ message: 'Error al agendar la cita' });
        }
    }
}

module.exports = ClientController;
