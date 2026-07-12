const express = require('express');
const router = express.Router();
const { handleRazorpayWebhook } = require('../controllers/webhookController');

// Define route with an explicit raw body layout parsing block
router.post(
  '/razorpay',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Append raw request content onto rawBody parameter for our cryptographic tools
    req.rawBody = req.body;
    next();
  },
  handleRazorpayWebhook
);

module.exports = router;
