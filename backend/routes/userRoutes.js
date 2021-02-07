const express = require('express');

const userController = require('../controllers/userController');

const { protect, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', userController.registerUser);
router.get('/', [protect, isAdmin], userController.getUsers);

router.post('/login', userController.authUser);

router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);

router.delete('/:id', [protect, isAdmin], userController.deleteUser);
router.get('/:id', [protect, isAdmin], userController.getUserById);
router.put('/:id', [protect, isAdmin], userController.updateUser);



module.exports = router;