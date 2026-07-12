const Razorpay = require('razorpay');
require('dotenv').config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SZnhJiCZvXgEnb',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '1XunNaVEoIlUbjKo0jEDU8oy',
});

instance.orders.create({
  amount: 100 * 100, // 100 INR
  currency: 'INR',
  receipt: 'receipt_test_123'
})
.then(order => {
  console.log("SUCCESS CREATING ORDER:", order);
  process.exit(0);
})
.catch(err => {
  console.error("ERROR CREATING ORDER:", err);
  process.exit(1);
});
