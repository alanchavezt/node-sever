const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/', authController.handleLogin);
router.get('/verify-email', authController.verifyEmail)
router.post('/resend-verification', authController.resendVerification)

module.exports = router;
