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
// Modelo: Cita.js
static async getAllCitas(userId) {
    await checkConnection();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            `
            SELECT 
                citas.id AS citaId,
                citas.doctor_id,
                citas.user_id,
                citas.fecha,
                citas.hora_inicio,
                citas.hora_fin,
                citas.estado_id,
                COALESCE(citas.disponibilidad_id, NULL) AS disponibilidad_id, -- Asegura que disponibilidad_id sea NULL si no está presente
                usuarios.username AS doctor_nombre,
                paciente.username AS paciente_nombre, 
                GROUP_CONCAT(DISTINCT especialidades.nombre SEPARATOR ', ') AS especialidades
            FROM citas
            JOIN doctores ON citas.doctor_id = doctores.id
            JOIN users AS usuarios ON doctores.user_id = usuarios.id
            LEFT JOIN users AS paciente ON citas.user_id = paciente.id  
            LEFT JOIN doctor_especialidad ON doctores.id = doctor_especialidad.doctor_id
            LEFT JOIN especialidades ON doctor_especialidad.especialidad_id = especialidades.id
            WHERE citas.user_id = ?
            GROUP BY citas.id
            `,
            [userId]
        );

        return result;
    } finally {
        connection.release();
    }
}

static async getAllCitasByDoctorId(doctorId) {
    await checkConnection();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute(
            `
            SELECT 
                citas.id AS citaId,
                citas.doctor_id,
                citas.user_id,
                citas.fecha,
                citas.hora_inicio,
                citas.hora_fin,
                citas.estado_id,
                COALESCE(citas.disponibilidad_id, NULL) AS disponibilidad_id,
                usuarios.username AS doctor_nombre,
                paciente.username AS paciente_nombre,
                GROUP_CONCAT(DISTINCT especialidades.nombre SEPARATOR ', ') AS especialidades
            FROM citas
            JOIN doctores ON citas.doctor_id = doctores.id
            JOIN users AS usuarios ON doctores.user_id = usuarios.id
            LEFT JOIN users AS paciente ON citas.user_id = paciente.id
            LEFT JOIN doctor_especialidad ON doctores.id = doctor_especialidad.doctor_id
            LEFT JOIN especialidades ON doctor_especialidad.especialidad_id = especialidades.id
            WHERE citas.doctor_id = ?
            GROUP BY citas.id
            `,
            [doctorId]
        );

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
    static async createCita({ doctorId, pacienteId, fecha, horaInicio, horaFin, estadoId, disponibilidadId }) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'INSERT INTO citas (doctor_id, user_id, fecha, hora_inicio, hora_fin, estado_id, disponibilidad_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [doctorId, pacienteId, fecha, horaInicio, horaFin, estadoId, disponibilidadId]
            );
        } finally {
            connection.release();
        }
    }
    
}

module.exports = Cita;


