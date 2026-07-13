const express = require('express');
const router = express.Router();
const { createOrder, createRazorpayOrder, verifyRazorpayPayment, getUserOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Public order paths for mock checkout/submission ease
router.post('/', createOrder);
router.post('/razorpay', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);

// Standard retrieval paths
router.get('/myorders', getUserOrders);

module.exports = router;
