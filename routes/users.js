const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController'); // Corrected import

// Auth routes
router.post('/register', register); // User registration
router.post('/login', login);        // User login

module.exports = router;
