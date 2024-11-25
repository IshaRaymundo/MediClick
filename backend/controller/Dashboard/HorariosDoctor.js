const Disponibilidad = require('../../models/Disponibilidad');

class DisponibilidadController {
    // Crear una nueva disponibilidad
    static async createDisponibilidad(req, res) {
        const { doctorId, diaSemana, horaInicio, horaFin, activo } = req.body;

        // Validar los datos
        if (!doctorId || !diaSemana || !horaInicio || !horaFin) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        try {
            await Disponibilidad.createDisponibilidad(doctorId, diaSemana, horaInicio, horaFin, activo || 1);
            res.status(201).json({ message: 'Disponibilidad creada correctamente' });
        } catch (error) {
            console.error('Error al crear disponibilidad:', error.message);
            res.status(500).json({ message: 'Error al crear disponibilidad' });
        }
    }

    // Obtener todas las disponibilidades de un doctor
    static async getDisponibilidades(req, res) {
        const { doctorId } = req.params;

        try {
            const disponibilidades = await Disponibilidad.getDisponibilidadesByDoctor(doctorId);
            res.status(200).json(disponibilidades);
        } catch (error) {
            console.error('Error al obtener disponibilidades:', error.message);
            res.status(500).json({ message: 'Error al obtener disponibilidades' });
        }
    }

    // Eliminar una disponibilidad específica
    static async deleteDisponibilidad(req, res) {
        const { id } = req.params;

        try {
            await Disponibilidad.deleteDisponibilidad(id);
            res.status(200).json({ message: 'Disponibilidad eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar disponibilidad:', error.message);
            res.status(500).json({ message: 'Error al eliminar disponibilidad' });
        }
    }

        // Actualizar horario existente
        static async updateDisponibilidad(req, res) {
            const { id } = req.params;
            const { diaSemana, horaInicio, horaFin, activo } = req.body;
    
            // Validar datos
            if (!diaSemana || !horaInicio || !horaFin) {
                return res.status(400).json({ message: 'Todos los campos son obligatorios excepto "activo"' });
            }
    
            try {
                await Disponibilidad.updateDisponibilidad(id, diaSemana, horaInicio, horaFin, activo || 1);
                res.status(200).json({ message: 'Disponibilidad actualizada correctamente' });
            } catch (error) {
                console.error('Error al actualizar disponibilidad:', error.message);
                res.status(500).json({ message: 'Error al actualizar disponibilidad' });
            }
        }
    
}

module.exports = DisponibilidadController;
