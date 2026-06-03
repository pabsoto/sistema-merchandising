// controllers/orderController.js
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { products, total } = req.body;

    const order = new Order({
      user: req.user.id,
      products,
      total
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
