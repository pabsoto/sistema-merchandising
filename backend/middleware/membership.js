const User = require('../models/User');

const checkMembership = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.membership) {
      return res.status(403).json({ message: 'Acceso exclusivo para miembros' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar membresía' });
  }
};

module.exports = checkMembership;
