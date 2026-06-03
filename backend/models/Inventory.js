const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
