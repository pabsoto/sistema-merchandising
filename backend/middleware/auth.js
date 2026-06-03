const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifica el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or invalid format. Use: Bearer <token>' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Verifica si el usuario es admin
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    
    if (!user.isAdmin && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    next();
  } catch (err) {
    console.error('Error in verifyAdmin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
