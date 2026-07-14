const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const leadRoutes = require('./routes/leadRoutes');
const chatRoutes = require('./routes/chatRoutes');


const app = express();

// 1. BULLETPROOF CORS LAYER (Must execute before any route definitions)
const allowedOrigins = [
  'https://ayurblend-storefront.vercel.app', // Your production frontend
  'http://localhost:3000',                   // Local development options
  'http://localhost:5001',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like server-to-server, Postman, or mobile apps) or allowed list
    if (
      !origin || 
      allowedOrigins.includes(origin) || 
      origin.startsWith('http://localhost:') || 
      origin.includes('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('CORS Policy Defeated: Origin not allowed.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. SAFE PRE-FLIGHT HANDLER
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
app.use('/api/leads', leadRoutes);   // CRM Lead Management
app.use('/api/chat',  chatRoutes);   // AI CRM Agent


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
