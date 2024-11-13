// index.js
const express = require('express');
const cors = require('cors');
const { checkConnection } = require('./db/conexion'); // Importa solo checkConnection
const authRoutes = require('./routes/AuthRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/', authRoutes);

// Eliminar la llamada a connectToDatabase()
// Inicia el servidor directamente
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
