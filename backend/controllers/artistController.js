// controllers/artistController.js
const mongoose = require('mongoose');
const Artist = require('../models/Artist');

// GET todos los artistas
exports.getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los artistas' });
  }
};

// POST crear nuevo artista
exports.createArtist = async (req, res) => {
  try {
    const newArtist = new Artist(req.body);
    await newArtist.save();
    res.status(201).json(newArtist);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear el artista', details: err.message });
  }
};


exports.getArtistById = async (req, res) => {
  try {
    let id = req.params.id;
    console.log('ID recibido:', id);
    
    let artist = null;
    
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      console.log('Buscando por ObjectId');
      artist = await Artist.findById(id);
    } else {
      
      console.log('Buscando por campos alternativos');
      artist = await Artist.findOne({
        $or: [
          { codigo: id },          
          { nombre: id },          
          { slug: id }             
        ]
      });
    }
    
    if (!artist) {
      console.log(' Artista no encontrado');
      return res.status(404).json({ 
        error: 'Artista no encontrado',
        searchedId: id
      });
    }

    console.log(' Artista encontrado:', artist);
    res.json(artist);
  } catch (err) {
    console.error('Error interno:', err.message);
    res.status(500).json({ error: 'Error al obtener el artista', details: err.message });
  }
};



exports.deleteArtist = async (req, res) => {
  try {
    const artistaEliminado = await Artist.findByIdAndDelete(req.params.id); 
    if (!artistaEliminado) return res.status(404).json({ error: "Artista no encontrado" });
    res.json({ message: "Artista eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

