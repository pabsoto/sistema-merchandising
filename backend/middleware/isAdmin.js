const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Acceso denegado: se requiere rol administrador' });
    }
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = isAdmin;
