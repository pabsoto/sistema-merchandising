const Merch = require('../models/Merch');

exports.getMerchByArtistId = async (req, res) => {
  try {
    const merch = await Merch.find({ artistId: req.params.artistId });
    res.json(merch);
  } catch (error) {
    console.error("Error obteniendo merch:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.createMerch = async (req, res) => {
  try {
    const nuevoMerch = new Merch(req.body);
    await nuevoMerch.save();
    res.status(201).json(nuevoMerch);
  } catch (error) {
    console.error("Error creando merch:", error);
    res.status(500).json({ message: "Error al guardar producto" });
  }
};

