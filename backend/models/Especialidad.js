// models/Especialidad.js
const { pool, checkConnection } = require('../db/conexion');

class Especialidad {
    static async getAllEspecialidades() {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('SELECT * FROM especialidades');
            return result;
        } finally {
            connection.release();
        }
    }

    static async getEspecialidadById(id) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('SELECT * FROM especialidades WHERE id = ?', [id]);
            return result[0];
        } finally {
            connection.release();
        }
    }

    static async createEspecialidad(nombre, descripcion) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'INSERT INTO especialidades (nombre, descripcion) VALUES (?, ?)',
                [nombre, descripcion]
            );
        } finally {
            connection.release();
        }
    }

    static async updateEspecialidad(id, nombre, descripcion) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'UPDATE especialidades SET nombre = ?, descripcion = ? WHERE id = ?',
                [nombre, descripcion, id]
            );
        } finally {
            connection.release();
        }
    }

    static async deleteEspecialidad(id) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute('DELETE FROM especialidades WHERE id = ?', [id]);
        } finally {
            connection.release();
        }
    }
}

module.exports = Especialidad;
