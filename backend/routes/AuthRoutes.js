// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controller/Auth/AuthController');
const UsersController = require('../controller/Cruds/Users');
const ForgotPasswordController = require('../controller/Auth/ForgotPassword');
const ClientController = require('../controller/Dashboard/Client');

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


module.exports = router;