const { pool, checkConnection } = require('../db/conexion');

class Cita {

    static async createCita({ doctorId, pacienteId, fecha, horaInicio, horaFin, estadoId }) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'INSERT INTO citas (doctor_id, user_id, fecha, hora_inicio, hora_fin, estado_id) VALUES (?, ?, ?, ?, ?, ?)',
                [doctorId, pacienteId, fecha, horaInicio, horaFin, estadoId]
            );
        } finally {
            connection.release();
        }
    }

 // Obtener todas las citas con el nombre del paciente
// Obtener todas las citas con los nombres del doctor y del paciente
static async getAllCitas() {
    await checkConnection();
    const connection = await pool.getConnection();
    try {
        // Consulta para incluir el nombre del doctor y del paciente
        const [result] = await connection.execute(`
            SELECT 
                citas.id,
                citas.doctor_id,
                citas.user_id,  -- Esto es el paciente (usuario)
                citas.fecha,
                citas.hora_inicio,
                citas.hora_fin,
                citas.estado_id,
                doctores.id AS doctor_id,
                usuarios.username AS doctor_nombre,
                pacientes.username AS paciente_nombre,  -- Agregar el nombre del paciente
                GROUP_CONCAT(especialidades.nombre SEPARATOR ', ') AS especialidades
            FROM citas
            JOIN doctores ON citas.doctor_id = doctores.id
            JOIN users AS usuarios ON doctores.user_id = usuarios.id
            JOIN users AS pacientes ON citas.user_id = pacientes.id  -- Aquí unimos la tabla de usuarios para obtener el nombre del paciente
            LEFT JOIN doctor_especialidad ON doctores.id = doctor_especialidad.doctor_id
            LEFT JOIN especialidades ON doctor_especialidad.especialidad_id = especialidades.id
            GROUP BY citas.id
        `);

        return result;
    } finally {
        connection.release();
    }
}


    // Actualizar el estado de una cita
    static async updateEstadoCita(citaId, estadoId) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute('UPDATE citas SET estado_id = ? WHERE id = ?', [estadoId, citaId]);
        } finally {
            connection.release();
        }
    }

    // Crear una nueva cita
    static async createCita({ doctorId, pacienteId, fecha, horaInicio, horaFin, estadoId }) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'INSERT INTO citas (doctor_id, user_id, fecha, hora_inicio, hora_fin, estado_id) VALUES (?, ?, ?, ?, ?, ?)',
                [doctorId, pacienteId, fecha, horaInicio, horaFin, estadoId]
            );
        } finally {
            connection.release();
        }
    }
}

module.exports = Cita;
