// index.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // Importar path para manejar rutas
const { checkConnection } = require('./db/conexion'); // Importa solo checkConnection
const authRoutes = require('./routes/AuthRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(cors());

// Servir la carpeta 'uploads' de forma estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/', authRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
