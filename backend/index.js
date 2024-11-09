const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mediclick',
  port: 8889
};

// Conexión inicial
let connection;

// Función para conectar a la base de datos
async function connectToDatabase() {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Conectado a MySQL en MAMP');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
  }
}

// Llama a la función para conectar a la base de datos al iniciar el servidor
connectToDatabase();

// Función para verificar la conexión antes de cada operación
async function checkConnection() {
  if (!connection) {
    await connectToDatabase();
  }
}

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando y escuchando en el puerto ' + PORT);
});

// Ruta de registro de usuario
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    await checkConnection();

    // Verificar si el usuario ya existe
    const [existingUser] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.execute(
      'INSERT INTO users (username, password, email, role_id) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, 3]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en el registro:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    // Crear y devolver un token JWT
    const token = jwt.sign({ id: user.id, role: user.role_id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, role: user.role_id, message: 'Inicio de sesión exitoso' }); // Enviamos el role_id
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// Obtener usuarios
app.get('/users', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT id, username, role_id FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Actualizar rol del usuario
app.put('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;

  try {
    await connection.execute('UPDATE users SET role_id = ? WHERE id = ?', [role_id, id]);
    res.status(200).json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
