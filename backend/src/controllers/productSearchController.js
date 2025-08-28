const Product = require('../models/Product');

// Search products by name, description, or category
exports.searchProducts = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice, inStock } = req.query;
    
    // Build search filter
    const filter = {};
    
    // Text search on name and description
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (category) {
      filter.category = category;
    }
    
    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      
      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }
      
      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }
    
    // Filter by stock availability
    if (inStock !== undefined) {
      filter.inStock = inStock === 'true';
    }
    
    const products = await Product.find(filter);
    
    res.json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product recommendations based on a product
exports.getProductRecommendations = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;
    
    // Find the source product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find similar products in the same category, excluding the source product
    const recommendations = await Product.find({
      _id: { $ne: id },
      category: product.category,
      inStock: true
    }).limit(Number(limit));
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trending products (most viewed/purchased)
exports.getTrendingProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // In a real app, this would use view counts or purchase data
    // For this example, we'll just return products sorted by price (as a placeholder)
    const trendingProducts = await Product.find({ inStock: true })
      .sort({ price: -1 })
      .limit(Number(limit));
    
    res.json(trendingProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Made with Bob