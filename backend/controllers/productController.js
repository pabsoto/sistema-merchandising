const Product = require('../models/Product');


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los productos: ' + err.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar el producto: ' + err.message });
  }
};


exports.getPremiumProducts = async (req, res) => {
  try {
    const premiumProducts = await Product.find({ isPremium: true });

    res.json({
      message: 'Lista de productos exclusivos para miembros',
      products: premiumProducts,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos premium: ' + err.message });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, image, isPremium } = req.body;

    
    if (!name || !description || price == null || stock == null) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben estar completos.' });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      image,
      isPremium: isPremium || false,
    });

    await product.save();

    res.status(201).json({ message: 'Producto creado exitosamente', product });
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el producto: ' + err.message });
  }
};


exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    const lowStockProducts = await Product.find({ stock: { $lte: threshold } });

    res.json({
      message: `Productos con stock menor o igual a ${threshold}`,
      products: lowStockProducts,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos con bajo stock: ' + err.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado para actualizar.' });
    }

    res.json({ message: 'Producto actualizado correctamente', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el producto: ' + err.message });
  }
};

// Eliminar un producto (solo admins)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado para eliminar.' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el producto: ' + err.message });
  }
};
