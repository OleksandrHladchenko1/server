const express = require('express');

const { authenticateToken } = require('../middlewares/authenticateToken');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.patch('/change-password', authenticateToken, authController.changePassword);

module.exports = router;
