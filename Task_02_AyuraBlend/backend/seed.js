const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ayurablend';

const dummyProducts = [
  {
    _id: new mongoose.Types.ObjectId('60d5ec499b17ac1111111111'),
    name: 'Ayur Moringa Spice',
    slug: 'ayura-moringa-spice',
    price: 249,
    compareAtPrice: 299,
    image: 'https://res.cloudinary.com/dq0kfbnrx/image/upload/v1783841305/ayurablend_products/ayur_moringa_spice.jpg',
    description: 'A flavorful spice blend made with moringa and traditional Andhra ingredients.',
    category: 'Superfoods',
    isFeatured: true,
    stock: 100,
    isAvailable: true,
    attributes: {
      weight: '100g',
      brand: 'Ayur Moringa',
      origin: 'India'
    }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec499b17ac1111111112'),
    name: 'Ayur Moringa Vital',
    slug: 'ayura-moringa-vital',
    price: 399,
    compareAtPrice: 450,
    image: 'https://res.cloudinary.com/dq0kfbnrx/image/upload/v1783841308/ayurablend_products/ayur_moringa_vital.jpg',
    description: 'A carefully crafted blend of moringa and amla wellness blend.',
    category: 'Superfoods',
    isFeatured: true,
    stock: 100,
    isAvailable: true,
    attributes: {
      weight: '100g',
      brand: 'Ayur Moringa',
      origin: 'India'
    }
  },
  {
    _id: new mongoose.Types.ObjectId('60d5ec499b17ac1111111113'),
    name: 'Ayur Moringa Pure',
    slug: 'ayura-moringa-pure',
    price: 349,
    compareAtPrice: 399,
    image: 'https://res.cloudinary.com/dq0kfbnrx/image/upload/v1783841311/ayurablend_products/ayur_moringa_pure.jpg',
    description: 'Premium-quality moringa leaf powder made from carefully selected leaves.',
    category: 'Superfoods',
    isFeatured: true,
    stock: 100,
    isAvailable: true,
    attributes: {
      weight: '250g',
      brand: 'Ayur Moringa',
      origin: 'India'
    }
  }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB via seeding script');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    await Product.insertMany(dummyProducts);
    console.log('Dummy products seeded successfully');
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
