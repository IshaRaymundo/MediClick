const express = require('express');
const AuthController = require('../controller/Auth/AuthController');
const UsersController = require('../controller/Cruds/Users');
const ForgotPasswordController = require('../controller/Auth/ForgotPassword');
const ClientController = require('../controller/Dashboard/Client');
const EspecialidadesController = require('../controller/Cruds/Especialidades');
const DoctorController = require('../controller/Cruds/Doctor');
const DisponibilidadController = require('../controller/Dashboard/HorariosDoctor');
const HorarioController = require('../controller/Dashboard/HorarioController');
const upload = require('../middlewares/multerConfig'); // Middleware de multer
const router = express.Router();

// Rutas para doctores y especialidades
router.get('/doctors', ClientController.getDoctors);
router.get('/especialidades', ClientController.getEspecialidades);

// Authentication routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', AuthController.getUsers);
router.put('/users/:id/role', UsersController.updateUserRole);

// Forgot Password routes
router.post('/auth/forgot-password', ForgotPasswordController.forgotPassword);
router.post('/reset-password/:token', ForgotPasswordController.resetPassword);

// CRUD routes de Users
router.get('/users', UsersController.getUsers);
router.put('/users/:id', UsersController.updateUser);
router.delete('/users/:id', UsersController.deleteUser);
router.post('/users/create', UsersController.createUserWithRole);

// CRUD routes de Especialidades
router.get('/especialidades', EspecialidadesController.getAll);
router.get('/especialidades/:id', EspecialidadesController.getById);
router.post('/especialidades', EspecialidadesController.create);
router.put('/especialidades/:id', EspecialidadesController.update);
router.delete('/especialidades/:id', EspecialidadesController.delete);

// CRUD para doctores
router.get('/doctores/:userId', DoctorController.getDoctor); // Obtener información del doctor
router.post('/doctores/:userId/especialidades', DoctorController.addEspecialidad); // Añadir especialidad
router.delete('/doctores/:userId/especialidades', DoctorController.removeEspecialidad); // Eliminar especialidad
router.put('/doctores/:userId', upload.single('fotoUrl'), DoctorController.updateDoctor); // Actualizar foto e información
router.delete('/doctores/:userId', DoctorController.deleteDoctor); // Eliminar doctor
router.get('/doctores', DoctorController.getAllDoctors);

// CRUD de disponibilidades
router.post('/disponibilidades', DisponibilidadController.createDisponibilidad);
router.get('/disponibilidades/:doctorId', DisponibilidadController.getDisponibilidades);
router.delete('/disponibilidades/:id', DisponibilidadController.deleteDisponibilidad);
router.put('/disponibilidades/:id', DisponibilidadController.updateDisponibilidad);

// Horarios
router.get('/horarios/disponibles', HorarioController.getHorariosDisponibles);
router.post('/horarios/reservar', HorarioController.reservarHorario);
router.delete('/horarios/cancelar', HorarioController.cancelarReserva);

// Citas
router.get('/citas', HorarioController.listarCitas);
router.post('/citas/finalizar', HorarioController.finalizarCita);

router.get('/citas/doctor', HorarioController.listarCitasPorDoctor);


module.exports = router;
