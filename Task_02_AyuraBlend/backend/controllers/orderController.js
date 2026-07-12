const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendWhatsAppTemplate } = require('../services/whatsappService');

exports.createOrder = async (req, res) => {
  try {
    const { name, phone, address, items, totalAmount, status } = req.body;

    // Parse pincode from address (looks for a 6-digit number)
    const pincodeMatch = address ? address.match(/\b\d{6}\b/) : null;
    const pincode = pincodeMatch ? pincodeMatch[0] : '522001'; // Default Guntur pincode

    // Format items list so both product and productId references are set
    const formattedItems = (items || []).map(item => ({
      product: item.product || item.productId,
      productId: item.productId || item.product,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const newOrder = new Order({
      user: req.user.id,
      items: formattedItems,
      totalAmount,
      status: status || 'Pending',
      deliveryDetails: {
        name: name || req.body.deliveryDetails?.name || 'Valued Customer',
        phone: phone || req.body.deliveryDetails?.phone || '0000000000',
        address: address || req.body.deliveryDetails?.address || '',
        pincode: pincode || req.body.deliveryDetails?.pincode || '522001',
        deliveryNotes: req.body.deliveryDetails?.deliveryNotes || ''
      }
    });

    const savedOrder = await newOrder.save();

    console.log("[WhatsApp Trigger] Order created successfully. ID:", savedOrder._id, "Status:", savedOrder.status);

    if (savedOrder.status === 'Paid' || savedOrder.status === 'Confirmed' || savedOrder.status === 'mock_payment_confirmed') {
      const recipientPhone = savedOrder.deliveryDetails?.phone || phone;
      const recipientName = savedOrder.deliveryDetails?.name || name || 'Valued Customer';
      
      console.log("[WhatsApp Trigger] Dispatching confirmation template. Recipient:", recipientPhone, "Name:", recipientName, "Total:", savedOrder.totalAmount);
      
      sendWhatsAppTemplate(
        recipientPhone,
        'order_confirmation',
        'en',
        [recipientName, savedOrder.totalAmount.toString()]
      ).then(result => {
        console.log("[WhatsApp Trigger] Confirmation dispatch output:", result ? "Success" : "Failed");
      }).catch(err => {
        console.error("[WhatsApp Trigger] Confirmation dispatch failed:", err.message);
      });
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ message: 'Server Error creating order', error: error.message });
  }
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Razorpay Order Creation Failed:", error);
    res.status(500).json({ message: 'Server Error creating Razorpay order', error });
  }
};

exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Generate our own signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Compare signatures natively
    if (razorpay_signature === expectedSign) {
      // Payment validated securely
      // Order DB creation structure logic would securely lock here normally!
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    res.status(500).json({ success: false, message: "Server error verifying payment" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ message: "Server error fetching user orders", error });
  }
};
