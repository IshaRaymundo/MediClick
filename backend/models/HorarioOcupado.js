const { pool, checkConnection } = require('../db/conexion');

class HorarioOcupado {
    // Verificar si un horario está ocupado
    static async isHorarioOcupado(disponibilidadId, fecha, horaInicio, horaFin) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'SELECT * FROM horarios_ocupados WHERE disponibilidad_id = ? AND fecha = ? AND hora_inicio = ? AND hora_fin = ?',
                [disponibilidadId, fecha, horaInicio, horaFin]
            );
            return result.length > 0; // Retorna `true` si el horario ya está ocupado
        } finally {
            connection.release();
        }
    }
    
    // Insertar un horario como ocupado
    static async reservarHorario(disponibilidadId, fecha, horaInicio, horaFin, estado = 'ocupado') {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO horarios_ocupados (disponibilidad_id, fecha, hora_inicio, hora_fin, estado) VALUES (?, ?, ?, ?, ?)',
                [disponibilidadId, fecha, horaInicio, horaFin, estado]
            );
    
            // Retorna el ID del horario ocupado insertado
            return result.insertId;
        } finally {
            connection.release();
        }
    }
    
    

    // Obtener todos los horarios ocupados por disponibilidad y fecha
    static async getHorariosOcupados(disponibilidadId, fecha) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                'SELECT * FROM horarios_ocupados WHERE disponibilidad_id = ? AND fecha = ?',
                [disponibilidadId, fecha]
            );
            return result;
        } finally {
            connection.release();
        }
    }

    // Eliminar un horario reservado (si es necesario en tu lógica)
    static async cancelarHorario(disponibilidadId, fecha, horaInicio, horaFin) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'DELETE FROM horarios_ocupados WHERE disponibilidad_id = ? AND fecha = ? AND hora_inicio = ? AND hora_fin = ?',
                [disponibilidadId, fecha, horaInicio, horaFin]
            );
        } finally {
            connection.release();
        }
    }
    
}

module.exports = HorarioOcupado;
