// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controller/AuthController');
const UsersController = require('../controller/Cruds/Users');
const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', AuthController.getUsers);
router.put('/users/:id/role', AuthController.updateUserRole);

router.get('/users', UsersController.getUsers);
router.put('/users/:id', UsersController.updateUser);
router.delete('/users/:id', UsersController.deleteUser);

module.exports = router;
