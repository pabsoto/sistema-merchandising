const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkMembership = require('../middleware/membership'); 

router.get('/', auth.verifyToken, checkMembership, (req, res) => {
  res.json({ message: ' Contenido exclusivo para miembros activos o admins' });
});

module.exports = router;
