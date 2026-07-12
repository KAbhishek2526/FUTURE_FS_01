const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public Onboarding Paths
router.post('/register', registerUser);
router.post('/login', loginUser);

// OTP Verification Actions
const { requestOtp, verifyRegisterOtp, verifyLoginOtp } = require('../controllers/userController');
router.post('/request-otp', requestOtp);
router.post('/verify-register-otp', verifyRegisterOtp);
router.post('/verify-login-otp', verifyLoginOtp);

// Secure Member-Only Profile Path (Protected by our middleware guard)
router.get('/profile', protect, getUserProfile);

module.exports = router;
