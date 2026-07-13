const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public Onboarding Paths
router.post('/register', registerUser);
router.post('/login', loginUser);

// OTP endpoints have been removed in favor of direct credential flow

// Secure Member-Only Profile Path (Protected by our middleware guard)
router.get('/profile', protect, getUserProfile);

module.exports = router;
