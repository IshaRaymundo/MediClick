// models/User.js
const { pool, checkConnection } = require('../db/conexion');

class User {
    static async findByEmail(email) {
        await checkConnection(); // Verifica que el pool esté activo
        const connection = await pool.getConnection(); // Obtiene una conexión del pool
        try {
            const [result] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            return result[0];
        } finally {
            connection.release(); // Libera la conexión de vuelta al pool
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

    static async getAllUsers() {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('SELECT id, username, role_id FROM users');
            return result;
        } finally {
            connection.release();
        }
    }

    static async updateUserRole(id, role_id) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            await connection.execute('UPDATE users SET role_id = ? WHERE id = ?', [role_id, id]);
        } finally {
            connection.release();
        }
    }
}

module.exports = User;
