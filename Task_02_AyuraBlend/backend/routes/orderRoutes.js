const express = require('express');
const router = express.Router();
const { createOrder, createRazorpayOrder, verifyRazorpayPayment, getUserOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect execution paths securely!
router.post('/', authMiddleware, createOrder);
router.post('/razorpay', authMiddleware, createRazorpayOrder);
router.post('/verify', authMiddleware, verifyRazorpayPayment);

// Standard retrieval paths
router.get('/myorders', authMiddleware, getUserOrders);

module.exports = router;
