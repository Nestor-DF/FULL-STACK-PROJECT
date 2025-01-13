const Image = require('../models/Image')

// Obtener todas las imagenes
exports.getAvatar = async (req, res) => {
  try {
    const image = await Image.find({});
    if (!image) {
      return res.status(404).json({ message: 'Imagenes no encontradas' });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obtener imagenes por su id
exports.getAvatarById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}