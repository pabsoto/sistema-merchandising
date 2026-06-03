const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Obtener el carrito del usuario
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.status(200).json(cart || { user: req.user.id, items: [] });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
};

// Añadir o actualizar un producto en el carrito
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.equals(productId));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al añadir al carrito" });
  }
};
exports.updateCartItem = (req, res) => {
  res.json({ message: "Update Cart Item - OK" });
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.items = cart.items.filter(item => !item.product.equals(productId));
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
};

// Vaciar carrito
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({ message: "Carrito vaciado" });
  } catch (err) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};
