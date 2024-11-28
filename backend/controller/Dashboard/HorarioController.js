const Disponibilidad = require('../../models/Disponibilidad');
const HorarioOcupado = require('../../models/HorarioOcupado');
const Cita = require ('../../models/Cita');
const Doctor = require('../../models/Doctor');

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
    
            // Reservar el horario y obtener su ID
            const horarioOcupadoId = await HorarioOcupado.reservarHorario(disponibilidadId, fecha, horaInicio, horaFin);
    
            if (!horarioOcupadoId) {
                return res.status(500).json({ message: 'Error al reservar el horario' });
            }
    
            // Crear la cita usando el ID del horario reservado
            await Cita.createCita({
                doctorId,
                pacienteId,
                fecha,
                horaInicio,
                horaFin,
                estadoId: 1, // Estado "Pendiente"
                disponibilidadId: horarioOcupadoId, // Usa el ID generado
            });
    
            res.status(201).json({ message: 'Horario reservado y cita creada exitosamente' });
        } catch (error) {
            console.error('Error al reservar horario:', error.message);
            res.status(500).json({ message: 'Error al reservar horario' });
        }
    }
    

    static async cancelarReserva(req, res) {
        const { disponibilidadId, fecha, horaInicio, horaFin, citaId } = req.body;
    
        if (!disponibilidadId || !fecha || !horaInicio || !horaFin || !citaId) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios: disponibilidadId, fecha, horaInicio, horaFin, citaId",
            });
        }
    
        try {
            await HorarioOcupado.cancelarHorario(disponibilidadId, fecha, horaInicio, horaFin);
            await Cita.updateEstadoCita(citaId, 2);
            res.status(200).json({ message: "Reserva cancelada y estado de la cita actualizado a Cancelada" });
        } catch (error) {
            console.error("Error al cancelar reserva:", error.message);
            res.status(500).json({ message: "Error al cancelar reserva" });
        }
    }
    

static async listarCitas(req, res) {
    try {
        const { user_id } = req.query; // Extrae user_id del query string
        console.log("user_id recibido en listarCitas:", user_id); // Depuración

        if (!user_id) {
            return res.status(400).json({ message: "Falta el parámetro user_id" });
        }

        const citas = await Cita.getAllCitas(user_id); // Llama al modelo con user_id
        console.log("Citas encontradas:", citas); // Depuración
        res.status(200).json(citas); // Devuelve las citas al cliente
    } catch (error) {
        console.error("Error al obtener citas:", error.message);
        res.status(500).json({ message: "Error al obtener citas" });
    }
}

    
static async listarCitasPorDoctor(req, res) {
    try {
        const { user_id } = req.query;
        console.log("user_id recibido para listar citas del doctor:", user_id);

        if (!user_id) {
            return res.status(400).json({ message: "Falta el parámetro user_id" });
        }

        // Obtener el doctor_id usando el user_id
        const doctor = await Doctor.getDoctorByUserId(user_id);
        if (!doctor) {
            return res.status(404).json({ message: "No se encontró el doctor para este usuario" });
        }

        const doctorId = doctor.id;
        console.log("doctor_id obtenido:", doctorId);

        // Obtener las citas del doctor
        const citas = await Cita.getAllCitasByDoctorId(doctorId);
        console.log("Citas encontradas para el doctor:", citas);

        res.status(200).json(citas);
    } catch (error) {
        console.error("Error al listar citas por doctor:", error.message);
        res.status(500).json({ message: "Error al listar citas por doctor" });
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
