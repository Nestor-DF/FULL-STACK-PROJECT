const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Obtener todas las imágenes
router.get('/avatar', imageController.getAvatar)

// Obtener imágenes por su id
router.get('/avatar/:id', imageController.getAvatarById)

// Arriba están las rutas usadas en el frontend
//---------------------------------------------------------------------------------------------------------------------

module.exports = router;