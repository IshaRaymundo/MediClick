const Disponibilidad = require('../../models/Disponibilidad');
const HorarioOcupado = require('../../models/HorarioOcupado');

class HorarioController {
    // Mapear horarios disponibles
    static async getHorariosDisponibles(req, res) {
        const { doctorId, fecha } = req.query;

        if (!doctorId || !fecha) {
            return res.status(400).json({ message: 'doctorId y fecha son obligatorios' });
        }

        try {
            // Determinar el día de la semana a partir de la fecha
            const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
            const diaSemana = diasSemana[new Date(fecha).getDay()];

            // Obtener disponibilidades para el doctor en ese día de la semana
            const disponibilidades = await Disponibilidad.getDisponibilidadesByDoctorIdAndDiaSemana(doctorId, diaSemana);

            const horarios = [];

            for (const disponibilidad of disponibilidades) {
                // Generar los horarios para la fecha exacta pasada
                let current = new Date(`${fecha}T${disponibilidad.hora_inicio}`);
                const end = new Date(`${fecha}T${disponibilidad.hora_fin}`);

                while (current < end) {
                    const next = new Date(current);
                    next.setHours(current.getHours() + 1);

                    // Verificar si el horario ya está ocupado para la fecha específica
                    const isOcupado = await HorarioOcupado.isHorarioOcupado(
                        disponibilidad.id,
                        fecha,
                        current.toTimeString().slice(0, 8),
                        next.toTimeString().slice(0, 8)
                    );

                    horarios.push({
                        fecha, // Incluye la fecha específica
                        horaInicio: current.toTimeString().slice(0, 8),
                        horaFin: next.toTimeString().slice(0, 8),
                        ocupado: isOcupado,
                    });

                    current = next;
                }
            }

            res.status(200).json(horarios);
        } catch (error) {
            console.error('Error al obtener horarios disponibles:', error.message);
            res.status(500).json({ message: 'Error al obtener horarios disponibles' });
        }
    }
    

    // Reservar un horario
    static async reservarHorario(req, res) {
        const { disponibilidadId, fecha, horaInicio, horaFin } = req.body;

        if (!disponibilidadId || !fecha || !horaInicio || !horaFin) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios: disponibilidadId, fecha, horaInicio, horaFin' });
        }

        try {
            // Verificar si el horario ya está ocupado
            const isOcupado = await HorarioOcupado.isHorarioOcupado(disponibilidadId, fecha, horaInicio, horaFin);

            if (isOcupado) {
                return res.status(409).json({ message: 'El horario ya está ocupado' });
            }

            // Insertar el horario como ocupado
            await HorarioOcupado.reservarHorario(disponibilidadId, fecha, horaInicio, horaFin);

            res.status(201).json({ message: 'Horario reservado exitosamente' });
        } catch (error) {
            console.error('Error al reservar horario:', error.message);
            res.status(500).json({ message: 'Error al reservar horario' });
        }
    }

    // Cancelar una reserva (opcional, si quieres permitir cancelaciones)
    static async cancelarReserva(req, res) {
        const { disponibilidadId, fecha, horaInicio, horaFin } = req.body;

        if (!disponibilidadId || !fecha || !horaInicio || !horaFin) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios: disponibilidadId, fecha, horaInicio, horaFin' });
        }

        try {
            // Eliminar el horario de la tabla horarios_ocupados
            await HorarioOcupado.cancelarHorario(disponibilidadId, fecha, horaInicio, horaFin);

            res.status(200).json({ message: 'Reserva cancelada exitosamente' });
        } catch (error) {
            console.error('Error al cancelar reserva:', error.message);
            res.status(500).json({ message: 'Error al cancelar reserva' });
        }
    }
}

module.exports = HorarioController;
