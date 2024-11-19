const { pool, checkConnection } = require('../db/conexion');
const bcrypt = require('bcrypt');

class DashboardClient {
    // Obtener todos los doctores con sus especialidades
    static async getAllDoctorsWithEspecialidades() {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const query = `
                SELECT d.id AS doctor_id, u.username AS doctor_name, e.nombre AS especialidad, d.informacion, d.foto_url
                FROM doctores d
                INNER JOIN users u ON d.user_id = u.id
                LEFT JOIN especialidades e ON d.especialidad_id = e.id;
            `;
            const [result] = await connection.execute(query);
            return result;
        } finally {
            connection.release();
        }
    }

    // Agendar una cita
    static async scheduleAppointment(doctorId, userId, fecha) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const query = `
                INSERT INTO citas (doctor_id, user_id, fecha, estado) 
                VALUES (?, ?, ?, 'pendiente');
            `;
            await connection.execute(query, [doctorId, userId, fecha]);
        } finally {
            connection.release();
        }
    }

    // Obtener todas las especialidades
    static async getAllEspecialidades() {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const query = 'SELECT id, nombre, descripcion FROM especialidades;';
            const [result] = await connection.execute(query);
            return result;
        } finally {
            connection.release();
        }
    }
}

module.exports = DashboardClient;
