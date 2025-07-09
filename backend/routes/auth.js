const express = require('express');
const router = express.Router();

const { registerController, loginController,forgotController,resetPasswordController } = require('../controllers/authController');

router.post('/register', registerController);
router.post('/login', loginController);
router.post("/forgot-password", forgotController);
router.post("/reset-password/:token", resetPasswordController);

module.exports = router;
