const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendWhatsAppTemplate } = require('../services/whatsappService');

/**
 * @desc    Listen to incoming Razorpay payment capture events and update order records
 * @route   POST /api/webhooks/razorpay
 * @access  Public (Secured via crypto HMAC payload verification)
 */
exports.handleRazorpayWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  // 1. Grab the signature sent by Razorpay from the headers
  const signature = req.headers['x-razorpay-signature'];

  if (!signature) {
    return res.status(400).json({ success: false, message: 'Missing tracking signature payload.' });
  }

  try {
    // 2. Validate signature using HMAC-SHA256 hashing against your raw body content
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.rawBody) // Handled by our custom route parser setup below
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('❌ Malicious or invalid webhook signature detected.');
      return res.status(400).json({ success: false, message: 'Signature verification failed.' });
    }

    const eventPayload = JSON.parse(req.rawBody.toString());
    const eventType = eventPayload.event;

    console.log(`🔔 Verified Webhook Event Received from Razorpay: ${eventType}`);

    // 3. Filter for successful payment events
    if (eventType === 'payment.captured') {
      const paymentEntity = eventPayload.payload.payment.entity;
      
      // Look up matching order using the internal reference passed during checkout initialization
      const orderId = paymentEntity.notes.orderId;
      const razorpayPaymentId = paymentEntity.id;

      const order = await Order.findById(orderId);

      if (!order) {
        console.error(`⚠️ Order record ${orderId} not found for incoming payment reference.`);
        return res.status(404).json({ success: true, message: 'Order record mapping missing.' });
      }

      // 4. Idempotency Guard: Stop processing if the order has already been marked as paid
      if (order.status === 'Paid' || order.status === 'Shipped') {
        console.log(`ℹ️ Order ${orderId} has already been fully processed. Skipping hooks.`);
        return res.status(200).json({ success: true, message: 'Duplicate event handled cleanly.' });
      }

      // 5. Atomic Inventory Adjustment Loop
      console.log(`📉 Decrementing inventory warehouse counts for Order: ${orderId}`);
      const bulkStockOperations = order.items.map(item => ({
        updateOne: {
          filter: { _id: item.product, stock: { $gte: item.quantity } },
          update: { $inc: { stock: -item.quantity } }
        }
      }));

      await Product.bulkWrite(bulkStockOperations);

      // 6. Finalize Order Status
      order.status = 'Paid';
      order.paymentDetails = {
        method: 'Razorpay',
        transactionId: razorpayPaymentId,
        paidAt: new Date()
      };

      await order.save();
      console.log(`✅ Order ${orderId} successfully finalized to PAID status.`);

      // Async WhatsApp Dispatch: Does not delay Razorpay's processing window response
      // Variables mapped: {{1}} = Customer Name, {{2}} = Order Amount Total
      sendWhatsAppTemplate(
        order.phone,
        'order_confirmation',
        'en',
        [order.name, order.totalAmount]
      ).catch(err => console.error('Background transactional alert dispatch fail:', err));
    }

    // Always respond with a 200 OK status to let Razorpay know the webhook was processed successfully
    res.status(200).json({ status: 'ok' });

  } catch (error) {
    console.error('❌ Webhook Controller Engine Processing Crash:', error.message);
    res.status(500).json({ success: false, message: 'Internal transaction resolution crash.' });
  }
};
