// routes/authRoutes.js
const express = require('express');
const AuthController = require('../controller/AuthController');
const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/users', AuthController.getUsers);
router.put('/users/:id/role', AuthController.updateUserRole);

module.exports = router;
