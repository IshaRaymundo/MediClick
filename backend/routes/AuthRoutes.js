// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controller/Auth/AuthController');
const UsersController = require('../controller/Cruds/Users');
const ForgotPasswordController = require('../controller/Auth/ForgotPassword');

const router = express.Router();


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

module.exports = router;