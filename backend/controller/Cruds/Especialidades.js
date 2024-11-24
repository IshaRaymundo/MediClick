// controllers/Cruds/Especialidades.js
const Especialidad = require('../../models/Especialidad');

class EspecialidadesController {
    static async getAll(req, res) {
        try {
            const especialidades = await Especialidad.getAllEspecialidades();
            res.status(200).json(especialidades);
        } catch (error) {
            console.error('Error al obtener especialidades:', error.message);
            res.status(500).json({ message: 'Error al obtener especialidades' });
        }
    }

    static async getById(req, res) {
        const { id } = req.params;
        try {
            const especialidad = await Especialidad.getEspecialidadById(id);
            if (!especialidad) {
                return res.status(404).json({ message: 'Especialidad no encontrada' });
            }
            res.status(200).json(especialidad);
        } catch (error) {
            console.error('Error al obtener especialidad:', error.message);
            res.status(500).json({ message: 'Error al obtener especialidad' });
        }
    }

    static async create(req, res) {
        const { nombre, descripcion } = req.body;
        try {
            await Especialidad.createEspecialidad(nombre, descripcion);
            res.status(201).json({ message: 'Especialidad creada exitosamente' });
        } catch (error) {
            console.error('Error al crear especialidad:', error.message);
            res.status(500).json({ message: 'Error al crear especialidad' });
        }
    }

    static async update(req, res) {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        try {
            await Especialidad.updateEspecialidad(id, nombre, descripcion);
            res.status(200).json({ message: 'Especialidad actualizada exitosamente' });
        } catch (error) {
            console.error('Error al actualizar especialidad:', error.message);
            res.status(500).json({ message: 'Error al actualizar especialidad' });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        try {
            await Especialidad.deleteEspecialidad(id);
            res.status(200).json({ message: 'Especialidad eliminada exitosamente' });
        } catch (error) {
            console.error('Error al eliminar especialidad:', error.message);
            res.status(500).json({ message: 'Error al eliminar especialidad' });
        }
    }
}

module.exports = EspecialidadesController;
