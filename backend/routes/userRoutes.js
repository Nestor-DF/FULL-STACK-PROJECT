const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorizeRole } = require('../middlewares/authMiddleware');

router.post('/users/signup', userController.signup);

router.post('/users/signin', userController.signin);

// Obtener información personal del usuario
router.get('/users/me', auth, userController.getUserInfo);

router.patch('/users/likelist', auth, userController.likeList);

router.patch('/users/dislikelist', auth, userController.dislikeList);

router.post('/users/islistliked', auth, userController.isListLiked);

router.get('/users/:id', userController.getUserById);

router.patch('/users/:id', auth, userController.modifyUserById)

router.post('/users/follow', auth, userController.followUser);

router.post('/users/unfollow', auth, userController.unfollowUser);

router.get('/users/:id/followers', auth, userController.getFollowers);

router.get('/users/:id/following', auth, userController.getFollowing);

// Arriba están las rutas usadas en el frontend
//---------------------------------------------------------------------------------------------------------------------

router.post('/users', auth, authorizeRole('admin'), userController.createUser)

// (query: ?username= -> nombre username) : Devuelve el usuario por ese username
router.get('/users', auth, authorizeRole('admin'), userController.getUsers);

router.put('/users/:id', auth, authorizeRole('admin'), userController.updateUserById);

router.delete('/users/:id', auth, authorizeRole('admin'), userController.deleteUserById);

module.exports = router;