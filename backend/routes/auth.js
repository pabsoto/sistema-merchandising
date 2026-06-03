const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check-membership', auth.verifyToken, authController.checkMembership);
router.get('/profile', auth.verifyToken, authController.getUserProfile);
router.put('/profile', auth.verifyToken, authController.updateUserProfile);
router.get('/users', auth.verifyToken, auth.verifyAdmin, authController.getAllUsers);
router.delete('/users/:id', auth.verifyToken, auth.verifyAdmin, authController.deleteUser);
router.put('/users/:id', auth.verifyToken, auth.verifyAdmin, authController.updateUserAsAdmin);

module.exports = router;
