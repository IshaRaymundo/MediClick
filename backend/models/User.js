// models/User.js
const { pool, checkConnection } = require('../db/conexion');
const bcrypt = require('bcrypt');

class User {
    static async findByEmail(email) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            return result[0];
        } finally {
            connection.release();
        }
    }

    static async findByUsername(username) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
            return result[0];
        } finally {
            connection.release();
        }
    }


static async findById(id) {
    await checkConnection();
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        return result[0];
    } finally {
        connection.release();
    }
}


    static async createUser(username, password, email) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?)',
                [username, password, email, 3]
            );
        } finally {
            connection.release();
        }
    }

        // Método para que el administrador cree usuarios y seleccione el rol
        static async createUserWithRole(username, email, password, role_id) {
            await checkConnection();
            const connection = await pool.getConnection();
            try {
                // Iniciar una transacción
                await connection.beginTransaction();
        
                // Verificar si el usuario o el correo ya existen
                const [existingUsers] = await connection.execute(
                    'SELECT * FROM users WHERE username = ? OR email = ?',
                    [username, email]
                );
        
                if (existingUsers.length > 0) {
                    throw new Error('Usuario o correo ya existen');
                }
        
                // Crear el usuario en la tabla `users`
                const hashedPassword = await bcrypt.hash(password, 10);
                const [result] = await connection.execute(
                    'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
                    [username, email, hashedPassword, role_id]
                );
        
                const userId = result.insertId; // Obtener el ID del usuario recién creado
        
                // Si el rol es `doctor`, insertar en la tabla `doctores`
                if (role_id === 2) {
                    await connection.execute(
                        'INSERT INTO doctores (user_id) VALUES (?)',
                        [userId]
                    );
                }
        
                // Confirmar la transacción
                await connection.commit();
            } catch (error) {
                // Revertir cambios si algo falla
                await connection.rollback();
                throw error;
            } finally {
                connection.release();
            }
        }
        

    static async getAllUsers() {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('SELECT id, username, email, role_id FROM users');
            return result;
        } finally {
            connection.release();
        }
    }

    static async updateUser(id, username, email, role_id, password) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await connection.execute(
                    'UPDATE users SET username = ?, email = ?, role_id = ?, password = ? WHERE id = ?',
                    [username, email, role_id, hashedPassword, id]
                );
            } else {
                await connection.execute(
                    'UPDATE users SET username = ?, email = ?, role_id = ? WHERE id = ?',
                    [username, email, role_id, id]
                );
            }
        } finally {
            connection.release();
        }
    }
    

    static async updateUserRole(id, role_id) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute(
                'UPDATE users SET role_id = ? WHERE id = ?',
                [role_id, id]
            );
        } finally {
            connection.release();
        }
    }

    // Nuevo método para eliminar usuario
    static async deleteUser(id) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute('DELETE FROM users WHERE id = ?', [id]);
        } finally {
            connection.release();
        }
    }
}

module.exports = User;
