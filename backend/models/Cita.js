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
static async getAllCitas(doctorId) {
    await checkConnection();
    const connection = await pool.getConnection();
    try {
        // Consulta corregida para obtener el nombre del paciente
        const [result] = await connection.execute(`
            SELECT citas.id, citas.fecha, citas.hora_inicio, citas.hora_fin, citas.estado_id, 
                   users.username AS paciente_nombre
            FROM citas
            JOIN users ON citas.user_id = users.id
            WHERE citas.doctor_id = ?`, [doctorId]); // Filtramos por el doctor actual
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
