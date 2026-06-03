
const mongoose = require('mongoose');

const imagenesSchema = new mongoose.Schema({
  foto_perfil: { type: String, required: true },
  imagen_fondo: String,
  imagen_exclusiva_1: String,
  imagen_exclusiva_2: String,
  imagen_cotidiana: String,
}, { _id: false }); 

// Esquema principal del artista
const artistSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, 
  nombre: { type: String, required: true },
  descripcion: { type: String, default: "" },
  imagenes: imagenesSchema
}, {
  timestamps: true 
});

module.exports = mongoose.model('Artist', artistSchema);
