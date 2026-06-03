const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Ruta protegida de ejemplo para admin
router.get('/dashboard', auth.verifyToken, auth.verifyAdmin, (req, res) => {
  res.json({ message: 'Área de administrador' });
});

// Ruta para obtener todos los usuarios (solo admins)
router.get('/users', auth.verifyToken, auth.verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

module.exports = router;
