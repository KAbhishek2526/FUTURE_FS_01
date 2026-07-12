const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    deliveryDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      pincode: { type: String, required: true },
      deliveryNotes: { type: String, default: '' },
    },
    paymentDetails: {
      method: { type: String, default: 'Razorpay' },
      transactionId: { type: String, default: '' },
      paidAt: { type: Date },
    },
    logisticsDetails: {
      shiprocketOrderId: String,
      shipmentId: String,
      awbCode: String,
      dispatchedAt: Date
    }
  },
  { timestamps: true }
);

// Virtual getters mapping root level parameters to nested properties for full backwards-compatibility
orderSchema.virtual('name').get(function () {
  return this.deliveryDetails ? this.deliveryDetails.name : '';
});

orderSchema.virtual('phone').get(function () {
  return this.deliveryDetails ? this.deliveryDetails.phone : '';
});

orderSchema.virtual('address').get(function () {
  return this.deliveryDetails ? this.deliveryDetails.address : '';
});

// Configure schemas to serialize virtuals to JSON/Object
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
