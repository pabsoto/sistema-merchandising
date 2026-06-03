const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth.verifyToken, orderController.createOrder);


router.get('/my-orders', auth.verifyToken, orderController.getOrdersByUser);

module.exports = router;
