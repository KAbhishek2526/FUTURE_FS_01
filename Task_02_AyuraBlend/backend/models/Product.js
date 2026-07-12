const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  description: { 
    type: String, 
    required: [true, 'Product description is required'] 
  },
  category: { 
    type: String, 
    default: 'General' 
  },
  image: { 
    type: String, 
    required: [true, 'Product image URL is required'] 
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  attributes: {
    weight: { type: String, default: '' },
    dimensions: { type: String, default: '' },
    ingredients: { type: [String], default: [] },
    benefits: { type: [String], default: [] },
    howToUse: { type: String, default: '' },
    brand: { type: String, default: 'AyuraBlend' },
    origin: { type: String, default: 'India' }
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
