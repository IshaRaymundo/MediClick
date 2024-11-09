const express = require('express');
const mysql = require('mysql2/promise'); // Importa la versión de promesas de mysql2
const app = express();
const PORT = process.env.PORT || 3000; // Puerto del servidor Express (diferente de 3306)

// Configuración de la base de datos para XAMPP
const dbConfig = {
  host: 'localhost',       // Servidor MySQL de XAMPP
  user: 'root',            // Usuario predeterminado en XAMPP
  password: '',            // Sin contraseña por defecto para root en XAMPP (verifica en tu configuración)
  database: 'mediclick', // Nombre de la base de datos que creaste en phpMyAdmin
  port: 3306               // Puerto predeterminado de MySQL en XAMPP
};

// Función para conectar a la base de datos
let connection;
async function connectToDatabase() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Conectado a MySQL en XAMPP');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
  }
}

// Llama a la función para conectar a la base de datos
connectToDatabase();

// Ruta principal para probar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('¡Servidor corriendo y conectado a MySQL en XAMPP!');
});

// Ejemplo de ruta para hacer una consulta a la base de datos
app.get('/datos', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM tu_tabla'); // Cambia 'tu_tabla' por el nombre real de tu tabla
    res.json(rows); // Envía los datos en formato JSON
  } catch (error) {
    console.error('Error en la consulta a MySQL:', error);
    res.status(500).send('Error al obtener datos');
  }
});

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
