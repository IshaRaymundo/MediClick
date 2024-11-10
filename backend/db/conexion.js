// database.js
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mediclick',
    port: 8889
};

const pool = mysql.createPool(dbConfig); // Crea el pool de conexiones una vez

async function checkConnection() {
    try {
        const connection = await pool.getConnection(); // Obtiene una conexión del pool para verificar
        await connection.ping(); // Verifica la conexión con un ping
        connection.release(); // Libera la conexión de vuelta al pool
        console.log('Conexión al pool verificada correctamente');
    } catch (error) {
        console.error('Error al verificar la conexión:', error);
    }
}

module.exports = { checkConnection, pool };
