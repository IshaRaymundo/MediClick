const { pool, checkConnection } = require('../db/conexion');

class Disponibilidad {
    // Crear un nuevo horario para un doctor
    static async createDisponibilidad(doctorId, diaSemana, horaInicio, horaFin, activo = 1) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'INSERT INTO disponibilidades (doctor_id, dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?, ?)',
                [doctorId, diaSemana, horaInicio, horaFin, activo]
            );
        } finally {
            connection.release();
        }
    }

    // Obtener todas las disponibilidades de un doctor
    static async getDisponibilidadesByDoctor(doctorId) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'SELECT * FROM disponibilidades WHERE doctor_id = ?',
                [doctorId]
            );
            return result;
        } finally {
            connection.release();
        }
    }

    // Eliminar una disponibilidad específica
    static async deleteDisponibilidad(id) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute('DELETE FROM disponibilidades WHERE id = ?', [id]);
        } finally {
            connection.release();
        }
    }

    static async updateDisponibilidad(id, diaSemana, horaInicio, horaFin, activo) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'UPDATE disponibilidades SET dia_semana = ?, hora_inicio = ?, hora_fin = ?, activo = ? WHERE id = ?',
                [diaSemana, horaInicio, horaFin, activo, id]
            );
        } finally {
            connection.release();
        }
    }
}

module.exports = Disponibilidad;
