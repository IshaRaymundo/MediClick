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

    static async updateUser(req, res) {
        const { id } = req.params;
        const { username, email, role_id, password } = req.body; // Incluye `password` en el body
        try {
            // Pasa `password` solo si está presente
            await User.updateUser(id, username, email, password || null);
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }

    static async deleteUser(req, res) {
        const { id } = req.params;
        try {
            await User.deleteUser(id);
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    }
}

module.exports = UsersController;
