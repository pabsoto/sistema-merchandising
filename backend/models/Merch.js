const mongoose = require('mongoose');

const merchSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  titulo: String,
  precio: Number,
  imagen: String,
  stock: Number,             
  artistId: { type: String, required: true }
});

module.exports = mongoose.model('Merch', merchSchema);
