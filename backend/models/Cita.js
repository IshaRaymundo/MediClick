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
        const [result] = await connection.execute(`
            SELECT 
                citas.id AS citaId,
                citas.doctor_id,
                citas.user_id,
                citas.fecha,
                citas.hora_inicio,
                citas.hora_fin,
                citas.estado_id,
                horarios_ocupados.id AS disponibilidad_id,
                usuarios.username AS doctor_nombre,
                GROUP_CONCAT(DISTINCT especialidades.nombre SEPARATOR ', ') AS especialidades
            FROM citas
            JOIN doctores ON citas.doctor_id = doctores.id
            JOIN users AS usuarios ON doctores.user_id = usuarios.id
            LEFT JOIN doctor_especialidad ON doctores.id = doctor_especialidad.doctor_id
            LEFT JOIN especialidades ON doctor_especialidad.especialidad_id = especialidades.id
            LEFT JOIN horarios_ocupados ON horarios_ocupados.disponibilidad_id = citas.doctor_id
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
