// controllers/AuthController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = 'your_secret_key';

class AuthController {
    static async register(req, res) {
        const { username, password, email } = req.body;
        try {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'El usuario ya existe' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.createUser(username, hashedPassword, email);
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        } catch (error) {
            console.error('Error en el registro:', error); // Muestra el error completo
            res.status(500).json({ message: 'Error en el servidor', error: error.message });
        }        
    }

    static async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await User.findByUsername(username);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
            }

            const token = jwt.sign({ id: user.id, role: user.role_id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token, role: user.role_id, message: 'Inicio de sesión exitoso' });
        } catch (error) {
            console.error('Error en el login:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    static async getUsers(req, res) {
        try {
            const users = await User.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    static async updateUserRole(req, res) {
        const { id } = req.params;
        const { role_id } = req.body;
        try {
            await User.updateUserRole(id, role_id);
            res.status(200).json({ message: 'Rol actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }


    
}

module.exports = AuthController;
