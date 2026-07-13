const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search, minPrice, maxPrice, sort } = req.query;

    const query = {};

    // 1. Category Filter (case-insensitive)
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // 2. Featured status Filter
    if (featured === 'true') {
      query.isFeatured = true;
    } else if (featured === 'false') {
      query.isFeatured = false;
    }

    // 3. Search query (matches name or description case-insensitively)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // 4. Price range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 5. Sorting
    let sortOptions = {};
    if (sort) {
      if (sort === 'price_asc') {
        sortOptions.price = 1;
      } else if (sort === 'price_desc') {
        sortOptions.price = -1;
      } else if (sort === 'newest') {
        sortOptions.createdAt = -1;
      } else if (sort === 'popular') {
        sortOptions.rating = -1;
      }
    } else {
      // Default: sort by newest
      sortOptions.createdAt = -1;
    }

    // Fetch matching products
    let products = [];
    try {
      products = await Product.find(query).sort(sortOptions);
    } catch (dbError) {
      console.warn("⚠️ MongoDB query failed in getProducts, returning mock products fallback:", dbError.message);
    }

    // Fallback product items if MongoDB is empty or failed
    if (products.length === 0) {
      products = [
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
    }

    res.json(products);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: 'Server Error fetching products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    let product;
    try {
      product = await Product.findById(req.params.id);
    } catch (dbError) {
      console.warn("⚠️ MongoDB findById failed, fetching from mock products fallback:", dbError.message);
    }

    if (!product) {
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
      product = mockProducts.find(p => p._id === req.params.id) || mockProducts[0];
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching product details', error: error.message });
  }
};
