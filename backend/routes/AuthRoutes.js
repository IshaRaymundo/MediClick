// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controller/Auth/AuthController');
const UsersController = require('../controller/Cruds/Users');
const ForgotPasswordController = require('../controller/Auth/ForgotPassword');
const ClientController = require('../controller/Dashboard/Client');
const EspecialidadesController = require('../controller/Cruds/Especialidades');
const DoctorController = require('../controller/Cruds/Doctor');
const DisponibilidadController = require('../controller/Dashboard/HorariosDoctor')
const router = express.Router();

// Rutas para doctores y especialidades
router.get('/doctors', ClientController.getDoctors);
router.get('/especialidades', ClientController.getEspecialidades);

// Authentication routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', AuthController.getUsers);
router.put('/users/:id/role', UsersController.updateUserRole);


// Usa los métodos de la clase ForgotPasswordController como métodos estáticos
router.post('/auth/forgot-password', ForgotPasswordController.forgotPassword);
router.post('/reset-password/:token', ForgotPasswordController.resetPassword);


// CRUD routes de Users
router.get('/users', UsersController.getUsers);
router.put('/users/:id', UsersController.updateUser);
router.delete('/users/:id', UsersController.deleteUser);
router.post('/users/create', UsersController.createUserWithRole); // Nueva ruta para crear usuarios con roles

// CRUD routes de Especialidades
router.get('/especialidades', EspecialidadesController.getAll);
router.get('/especialidades/:id', EspecialidadesController.getById);
router.post('/especialidades', EspecialidadesController.create);
router.put('/especialidades/:id', EspecialidadesController.update);
router.delete('/especialidades/:id', EspecialidadesController.delete);

// CRUD para doctores
router.get('/doctores/:userId', DoctorController.getDoctor); // Obtener información del doctor y sus especialidades
router.post('/doctores/:userId/especialidades', DoctorController.addEspecialidad); // Añadir especialidad
router.delete('/doctores/:userId/especialidades', DoctorController.removeEspecialidad); // Eliminar especialidad
router.put('/doctores/:userId', DoctorController.updateDoctor); // Actualizar foto e información
router.delete('/doctores/:userId', DoctorController.deleteDoctor);// Eliminar doctor


router.post('/disponibilidades', DisponibilidadController.createDisponibilidad);// Crear una nueva disponibilidad
router.get('/disponibilidades/:doctorId', DisponibilidadController.getDisponibilidades);// Obtener todas las disponibilidades de un doctor
router.delete('/disponibilidades/:id', DisponibilidadController.deleteDisponibilidad);// Eliminar una disponibilidad específica
router.put('/disponibilidades/:id', DisponibilidadController.updateDisponibilidad);// Actualizar una disponibilidad existente


module.exports = router;