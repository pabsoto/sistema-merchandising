const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateToken = (userId, isAdmin) => {
  return jwt.sign(
    { id: userId, isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Registro
const register = async (req, res) => {
  try {
    const { name, email, password, isAdmin, membership } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      isAdmin: req.body.isAdmin === true,
      membership: req.body.membership === true
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateToken(user._id, user.isAdmin);

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// Check membresía
const checkMembership = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('membership name email');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.status(200).json({
      message: 'Estado de membresía consultado correctamente',
      membership: user.membership,
      user: {
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al verificar membresía', error });
  }
};

// Obtener perfil completo del usuario
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Perfil de usuario obtenido correctamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        membership: user.membership,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil de usuario', error: error.message });
  }
};

// Actualizar perfil del usuario
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    if (!name || !email) {
      return res.status(400).json({ message: 'Nombre y email son requeridos' });
    }

    const currentUser = await User.findById(userId);
    if (currentUser.email !== email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        membership: updatedUser.membership,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    
    if (req.params.id === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'No puedes eliminarte a ti mismo' 
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Usuario eliminado correctamente',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar usuario',
      error: error.message 
    });
  }
};

// Actualizar usuario 
const updateUserAsAdmin = async (req, res) => {
  try {
    const { name, email, membership } = req.body;
    
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y email son requeridos'
      });
    }

    
    const existingUser = await User.findOne({ 
      email, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'El email ya está en uso' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, membership },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Usuario actualizado correctamente',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar usuario',
      error: error.message 
    });
  }
};


module.exports = {
  register,
  login,
  checkMembership,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  updateUserAsAdmin
};