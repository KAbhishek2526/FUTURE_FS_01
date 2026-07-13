const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ==========================================
// EMERGENCY PRESENTATION BYPASS (PLACE AT TOP)
// ==========================================

// 1. Force Admin Stats to pass through completely bypassing auth middleware
app.get('/api/admin/stats', (req, res) => {
  res.status(200).json({
    success: true,
    revenue: 997,
    aov: 997,
    totalOrders: 1,
    totalProducts: 2,
    lowStockCount: 1,
    lowStockAlerts: [
      { _id: "65c36398f6d6b8f36c5df922", name: "Moringa Spice Pack", stock: 12, price: 249, category: "Spices" }
    ],
    recentOrders: [
      {
        _id: "mock_order_12345",
        totalAmount: 997,
        status: "Paid",
        createdAt: new Date(),
        deliveryDetails: { name: "Nasreen", phone: "919876543210" },
        items: [{ name: "Ayur Moringa Pure Blend", quantity: 1, price: 997 }]
      }
    ],
    categorySales: []
  });
});

// 2. Force Products Fetch to return clean mock items so storefront/dashboard don't crash
app.get('/api/products', (req, res) => {
  const mockProducts = [
    {
      _id: "65c36398f6d6b8f36c5df921",
      name: "Ayur Moringa Pure Blend",
      price: 997,
      description: "Organic premium Moringa leaf powder containing high density antioxidants, essential amino acids, iron, and calcium to support natural energy levels, joint health, and overall daily vitality. Hand-harvested and sun-dried for purity.",
      category: "Wellness",
      stock: 45,
      image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600&auto=format&fit=crop",
      isFeatured: true
    },
    {
      _id: "65c36398f6d6b8f36c5df922",
      name: "Moringa Spice Pack",
      price: 249,
      description: "Custom spice blend of ground Moringa, turmeric, ginger, and black pepper. Perfect for adding to tea, soups, and traditional curries to boost immunity and digestion.",
      category: "Spices",
      stock: 12,
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop",
      isFeatured: false
    }
  ];
  res.status(200).json(mockProducts);
});

// 3. Force Product Detail Fetch to resolve successfully
app.get('/api/products/:id', (req, res) => {
  const mockProducts = [
    {
      _id: "65c36398f6d6b8f36c5df921",
      name: "Ayur Moringa Pure Blend",
      price: 997,
      description: "Organic premium Moringa leaf powder containing high density antioxidants, essential amino acids, iron, and calcium to support natural energy levels, joint health, and overall daily vitality. Hand-harvested and sun-dried for purity.",
      category: "Wellness",
      stock: 45,
      image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600&auto=format&fit=crop",
      isFeatured: true
    },
    {
      _id: "65c36398f6d6b8f36c5df922",
      name: "Moringa Spice Pack",
      price: 249,
      description: "Custom spice blend of ground Moringa, turmeric, ginger, and black pepper. Perfect for adding to tea, soups, and traditional curries to boost immunity and digestion.",
      category: "Spices",
      stock: 12,
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop",
      isFeatured: false
    }
  ];
  const prod = mockProducts.find(p => p._id === req.params.id) || mockProducts[0];
  res.status(200).json(prod);
});

// ==========================================

// Middleware
app.use(cors({
  origin: true, // Dynamically allows the requesting origin (perfect for dev and production)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// SAFE PRE-FLIGHT HANDLER (Replaces the broken app.options line)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(200);
  }
  next();
});

app.use('/api/webhooks', require('./routes/webhookRoutes'));
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');

// Mount routes natively
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB successfully connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
