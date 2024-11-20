const { pool, checkConnection } = require('../db/conexion');

class Especialidad {
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

module.exports = Especialidad;
