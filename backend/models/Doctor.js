const { pool, checkConnection } = require('../db/conexion');

class Doctor {

    static async getAllDoctorsWithEspecialidades() {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(`
                SELECT 
                    d.id AS doctorId,
                    u.username,
                    u.email,
                    d.foto_url AS fotoUrl,
                    d.informacion,
                    GROUP_CONCAT(e.nombre) AS especialidades
                FROM doctores d
                INNER JOIN users u ON d.user_id = u.id
                LEFT JOIN doctor_especialidad de ON d.id = de.doctor_id
                LEFT JOIN especialidades e ON de.especialidad_id = e.id
                GROUP BY d.id, u.username, u.email, d.foto_url, d.informacion
            `);
            return result;
        } finally {
            connection.release();
        }
    }

    static async removeEspecialidades(doctorId) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'DELETE FROM doctor_especialidad WHERE doctor_id = ?',
                [doctorId]
            );
        } finally {
            connection.release();
        }
    }

    // Eliminar el registro del doctor
    static async removeDoctor(doctorId) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'DELETE FROM doctores WHERE id = ?',
                [doctorId]
            );
        } finally {
            connection.release();
        }
    }

    // Eliminar el usuario asociado al doctor
    static async removeUser(userId) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'DELETE FROM users WHERE id = ?',
                [userId]
            );
        } finally {
            connection.release();
        }
    }
    static async getDoctorByUserId(userId) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            console.log("Consultando doctor para user_id:", userId); // Verifica el userId recibido
            const [result] = await connection.execute(
                'SELECT * FROM doctores WHERE user_id = ?',
                [userId]
            );
            console.log("Resultado de la consulta:", result); // Verifica el resultado de la consulta
            return result[0];
        } finally {
            connection.release();
        }
    }
    

    static async getEspecialidadesByDoctorId(doctorId) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                `SELECT e.id, e.nombre, e.descripcion 
                 FROM doctor_especialidad de
                 INNER JOIN especialidades e ON de.especialidad_id = e.id
                 WHERE de.doctor_id = ?`,
                [doctorId]
            );
            return result;
        } finally {
            connection.release();
        }
    }

    static async addEspecialidadToDoctor(doctorId, especialidadId) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'INSERT INTO doctor_especialidad (doctor_id, especialidad_id) VALUES (?, ?)',
                [doctorId, especialidadId]
            );
        } finally {
            connection.release();
        }
    }

    static async removeEspecialidadFromDoctor(doctorId, especialidadId) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'DELETE FROM doctor_especialidad WHERE doctor_id = ? AND especialidad_id = ?',
                [doctorId, especialidadId]
            );
        } finally {
            connection.release();
        }
    }

    static async updateDoctorInfo(userId, fotoUrl = null, informacion = null) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const updates = [];
            const values = [];

            if (fotoUrl !== null) {
                updates.push('foto_url = ?');
                values.push(fotoUrl);
            }
            if (informacion !== null) {
                updates.push('informacion = ?');
                values.push(informacion);
            }

            if (updates.length === 0) {
                throw new Error('No se proporcionaron campos para actualizar');
            }

            const query = `UPDATE doctores SET ${updates.join(', ')} WHERE user_id = ?`;
            values.push(userId);

            await connection.execute(query, values);
        } finally {
            connection.release();
        }
    }
}

module.exports = Doctor;
