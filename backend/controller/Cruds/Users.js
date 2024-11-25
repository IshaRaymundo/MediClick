// controllers/Cruds/Users.js

const User = require('../../models/User');

class UsersController {
    static async getUsers(req, res) {
        try {
            const users = await User.getAllUsers();
            res.json(users);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }


        // Método para que el administrador cree usuarios con cualquier rol
        static async createUserWithRole(req, res) {
            const { username, email, password, role_id } = req.body;
        
            try {
                // Llama al método del modelo que maneja la creación y lógica de roles
                await User.createUserWithRole(username, email, password, role_id);
                res.status(201).json({ message: 'Usuario creado exitosamente' });
            } catch (error) {
                console.error('Error al crear usuario:', error.message);
        
                if (error.message === 'Usuario o correo ya existen') {
                    res.status(400).json({ message: 'El nombre de usuario o correo ya están en uso' });
                } else {
                    res.status(500).json({ message: 'Error al crear usuario' });
                }
            }
        }
        

    static async updateUser(req, res) {
        const { id } = req.params;
        const { username, email, role_id, password } = req.body; // Incluye `password` en el body
        try {
            // Pasa `password` solo si está presente
            await User.updateUser(id, username, email, role_id, password || null);
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
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

    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await User.deleteUser(id);
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
            res.status(500).json({ message: 'Error al eliminar usuario' });
        }
    }
    
}

module.exports = UsersController;
