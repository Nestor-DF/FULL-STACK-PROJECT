const express = require('express');
const router = express.Router();
const carlistController = require('../controllers/carlistController');
const { auth, authorizeRole } = require('../middlewares/authMiddleware');

router.get('/carList/public', carlistController.getCarListPublic);

router.get('/carList/top-rated', carlistController.getCarListTopRated);

router.get('/carList/most-commented', carlistController.getCarListMostCommented);

router.get('/carList/latest', carlistController.getLatestCarLists);

router.get('/carList/random', carlistController.getCarListRandom);

router.post('/carList', auth, carlistController.createCarList);

router.post('/carList/:id/comment', auth, carlistController.addCommentToCarList);

router.delete('/carList/:id', auth, carlistController.deleteCarListById);

router.patch('/carList/:id', auth, carlistController.modifyCarListById)

// Arriba están las rutas usadas en el frontend
//---------------------------------------------------------------------------------------------------------------

module.exports = router;