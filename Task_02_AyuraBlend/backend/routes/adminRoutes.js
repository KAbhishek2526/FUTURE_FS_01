const express = require('express');
const router = express.Router();
const { getDashboardStats, updateInventory, updateOrderStatus, dispatchOrderToLogistics, getAllOrders } = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Secure router path natively using the middleware cascade check
router.use(authMiddleware);
router.use(adminMiddleware);

// Admin operations endpoints
router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/products/:id/stock', updateInventory);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/orders/:id/dispatch', dispatchOrderToLogistics);

module.exports = router;
