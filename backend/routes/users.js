const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Ruta protegida: solo admins
router.get('/', auth.verifyToken, auth.verifyAdmin, userController.getAllUsers);

module.exports = router;
