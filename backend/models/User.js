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
            const [result] = await connection.execute('SELECT id, username, email, role_id FROM users');
            return result;
        } finally {
            connection.release();
        }
    }

    static async updateUser(id, username, email, password) {
        await checkConnection();
        const connection = await pool.getConnection();
        try {
            if (password) {
                // Si se proporciona una nueva contraseña, la encripta
                const hashedPassword = await bcrypt.hash(password, 10);
                await connection.execute(
                    'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
                    [username, email, hashedPassword, id]
                );
            } else {
                // Si no hay nueva contraseña, solo actualiza el nombre y correo
                await connection.execute(
                    'UPDATE users SET username = ?, email = ? WHERE id = ?',
                    [username, email, id]
                );
            }
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
