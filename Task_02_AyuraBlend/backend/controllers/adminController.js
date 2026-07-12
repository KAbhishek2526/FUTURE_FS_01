const Order = require('../models/Order');
const Product = require('../models/Product');
const shiprocketService = require('../services/shiprocketService');
const { sendWhatsAppTemplate } = require('../services/whatsappService');

// Aggregates business operations metrics for the admin dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Run aggregation to calculate total revenue and AOV (Average Order Value)
    // We count orders with status: Confirmed, Processing, Shipped, Delivered, or Paid
    const salesAggregation = await Order.aggregate([
      {
        $match: {
          status: { $in: ['Paid', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          orderCount: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = salesAggregation.length > 0 ? salesAggregation[0].totalRevenue : 0;
    const paidOrdersCount = salesAggregation.length > 0 ? salesAggregation[0].orderCount : 0;
    const averageOrderValue = paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0;

    // 2. Count total orders and products
    const totalOrdersCount = await Order.countDocuments({});
    const totalProductsCount = await Product.countDocuments({});

    // 3. Find low-stock products (stock <= 15)
    const lowStockAlerts = await Product.find({ stock: { $lte: 15 } })
      .select('name stock price category')
      .sort({ stock: 1 });

    // 4. Fetch the last 5 orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // 5. Aggregate category sales distribution (Count items sold in each category)
    const categorySales = await Order.aggregate([
      {
        $match: {
          status: { $in: ['Paid', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      { $unwind: '$productDetails' },
      {
        $group: {
          _id: '$productDetails.category',
          totalUnitsSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.status(200).json({
      revenue: totalRevenue,
      aov: averageOrderValue,
      totalOrders: totalOrdersCount,
      totalProducts: totalProductsCount,
      lowStockCount: lowStockAlerts.length,
      lowStockAlerts,
      recentOrders,
      categorySales
    });
  } catch (error) {
    console.error("Dashboard Stats Aggregation Error:", error);
    res.status(500).json({ message: 'Server error aggregating metrics', error: error.message });
  }
};

// Manually adjust stock inventory count for a product
exports.updateInventory = async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ message: 'Valid stock number is required' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock, isAvailable: stock > 0 },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Inventory updated successfully', product });
  } catch (error) {
    console.error("Inventory Update Error:", error);
    res.status(500).json({ message: 'Server error adjusting inventory', error: error.message });
  }
};

// Manually update order fulfillment status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, deliveryNotes } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;

    const updateData = {};
    if (status) updateData.status = status;
    if (deliveryNotes !== undefined) {
      updateData['deliveryDetails.deliveryNotes'] = deliveryNotes;
    }

    // Use findByIdAndUpdate with runValidators: false to safely update legacy orders
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    // Trigger WhatsApp Dispatch if order moves to transit state
    if (status === 'Out for Delivery' && previousStatus !== 'Out for Delivery') {
      const recipientPhone = updatedOrder.phone;
      const recipientName = updatedOrder.name || 'Valued Customer';
      const notes = deliveryNotes || 'Our courier is on the way.';

      console.log("[WhatsApp Trigger] [Admin manual override] Dispatching out_for_delivery_alert template. Recipient:", recipientPhone, "Name:", recipientName, "Notes:", notes);

      sendWhatsAppTemplate(
        recipientPhone,
        'out_for_delivery_alert',
        'en',
        [recipientName, notes]
      ).then(result => {
        console.log("[WhatsApp Trigger] [Admin manual override] Transit alert dispatch output:", result ? "Success" : "Failed");
      }).catch(err => {
        console.error("[WhatsApp Trigger] [Admin manual override] Transit alert dispatch failed:", err.message);
      });
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error("Order Status Update Error:", error);
    res.status(500).json({ message: 'Server error updating order status', error: error.message });
  }
};

// Dispatch order to Shiprocket
exports.dispatchOrderToLogistics = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Target order record not found.' });
    }

    if (order.status === 'Shipped' || (order.logisticsDetails && order.logisticsDetails.shipmentId)) {
      return res.status(400).json({ success: false, message: 'This order has already been dispatched.' });
    }

    console.log(`🚚 Initiating logistics manifest generation for Order: ${order._id}`);
    
    // Fire the background API integration hook
    const logisticsResult = await shiprocketService.createForwardOrder(order);

    // Save tracking details directly into the order record
    order.status = 'Shipped';
    order.logisticsDetails = {
      shiprocketOrderId: logisticsResult.shiprocketOrderId,
      shipmentId: logisticsResult.shipmentId,
      awbCode: logisticsResult.awbCode,
      dispatchedAt: new Date()
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order pushed to Shiprocket successfully. Manifest generated.',
      logisticsDetails: order.logisticsDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to process logistics pipeline automation.',
      error: error.message
    });
  }
};

// Retrieve all system orders for Admin Dashboard
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Fetch All Orders Error:", error);
    res.status(500).json({ success: false, message: 'Server error retrieving orders', error: error.message });
  }
};
