const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define auth routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;
// This code defines the authentication routes for user registration and login.