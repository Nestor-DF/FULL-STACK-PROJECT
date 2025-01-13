const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { auth, authorizeRole } = require('../middlewares/authMiddleware');


// Ruta para obtener coches aleatorios 
// (query: ?limit= -> número de coches) : Devuelve coches random con respecto a ese número(por defecto 5)
router.get('/cars/random', carController.getCarRandom)

router.get('/cars/metadata', carController.getCarMetadata);

// Ruta para obtener un coche por ID
router.get('/cars/:id', carController.getCarById);

router.post('/cars/filter', carController.filterCars);

// Arriba están las rutas usadas en el frontend
//---------------------------------------------------------------------------------------------------------------------

// Ruta para añadir un nuevo coche
router.post('/cars', auth, authorizeRole('admin'), carController.createCar);

// Ruta para actualizar un coche por ID
router.put('/cars/:id', auth, authorizeRole('admin'), carController.updateCarById);

// Ruta para eliminar un coche por ID
router.delete('/cars/:id', auth, authorizeRole('admin'), carController.deleteCarById);

module.exports = router;