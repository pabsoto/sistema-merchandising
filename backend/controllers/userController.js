const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    // Verifica si el usuario es admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find().select('-password'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

module.exports = {
  getAllUsers,
};
