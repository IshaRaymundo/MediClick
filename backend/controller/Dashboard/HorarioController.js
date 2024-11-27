const Disponibilidad = require('../../models/Disponibilidad');
const HorarioOcupado = require('../../models/HorarioOcupado');
const Cita = require ('../../models/Cita');

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
    
                    // Agregar el objeto al arreglo con el campo disponibilidadId
                    horarios.push({
                        disponibilidadId: disponibilidad.id, // Incluir disponibilidadId
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
        const { disponibilidadId, fecha, horaInicio, horaFin, doctorId, pacienteId } = req.body;
    
        if (!disponibilidadId || !fecha || !horaInicio || !horaFin || !doctorId || !pacienteId) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios: disponibilidadId, fecha, horaInicio, horaFin, doctorId, pacienteId' });
        }
    
        try {
            // Verificar si el horario ya está ocupado
            const isOcupado = await HorarioOcupado.isHorarioOcupado(disponibilidadId, fecha, horaInicio, horaFin);
    
            if (isOcupado) {
                return res.status(409).json({ message: 'El horario ya está ocupado' });
            }
    
            // Reservar el horario
            await HorarioOcupado.reservarHorario(disponibilidadId, fecha, horaInicio, horaFin);
    
            // Crear la cita correspondiente
            await Cita.createCita({
                doctorId,
                pacienteId,
                fecha,
                horaInicio,
                horaFin,
                estadoId: 1, // Estado "Pendiente"
            });
    
            res.status(201).json({ message: 'Horario reservado y cita creada exitosamente' });
        } catch (error) {
            console.error('Error al reservar horario:', error.message);
            res.status(500).json({ message: 'Error al reservar horario' });
        }
    }

    // Cancelar una reserva (opcional, si quieres permitir cancelaciones)
    static async cancelarReserva(req, res) {
        const { disponibilidadId, fecha, horaInicio, horaFin, citaId } = req.body;
    
        if (!disponibilidadId || !fecha || !horaInicio || !horaFin || !citaId) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios: disponibilidadId, fecha, horaInicio, horaFin, citaId' });
        }
    
        try {
            // Eliminar el horario reservado
            await HorarioOcupado.cancelarHorario(disponibilidadId, fecha, horaInicio, horaFin);
    
            // Actualizar el estado de la cita a "Cancelada" (estado 2)
            await Cita.updateEstadoCita(citaId, 2);
    
            res.status(200).json({ message: 'Reserva cancelada y estado de la cita actualizado a Cancelada' });
        } catch (error) {
            console.error('Error al cancelar reserva:', error.message);
            res.status(500).json({ message: 'Error al cancelar reserva' });
        }
    }

    static async listarCitas(req, res) {
        try {
            const citas = await Cita.getAllCitas(); // Llama al modelo actualizado
            res.status(200).json(citas); // Devuelve el JSON al cliente
        } catch (error) {
            console.error('Error al obtener citas:', error.message);
            res.status(500).json({ message: 'Error al obtener citas' });
        }
    }
    
    
    

    static async finalizarCita(req, res) {
        const { citaId } = req.body;
    
        if (!citaId) {
            return res.status(400).json({ message: 'El campo citaId es obligatorio' });
        }
    
        try {
            // Actualizar el estado de la cita a "Finalizada" (estado 3)
            await Cita.updateEstadoCita(citaId, 3);
    
            res.status(200).json({ message: 'Cita marcada como Finalizada' });
        } catch (error) {
            console.error('Error al finalizar cita:', error.message);
            res.status(500).json({ message: 'Error al finalizar cita' });
        }
    }
    
    
    
}

module.exports = HorarioController;
