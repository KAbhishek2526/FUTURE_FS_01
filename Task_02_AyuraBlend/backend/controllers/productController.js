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
    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: 'Server Error fetching products', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching product details' });
  }
};
