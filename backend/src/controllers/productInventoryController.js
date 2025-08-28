const Product = require('../models/Product');

// Update product inventory (increase or decrease stock)
exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, action } = req.body;
    
    if (!['increase', 'decrease'].includes(action)) {
      return res.status(400).json({ message: 'Action must be either "increase" or "decrease"' });
    }
    
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // If product doesn't have a stock field yet, initialize it
    if (product.stock === undefined) {
      product.stock = 0;
    }
    
    // Update stock based on action
    if (action === 'increase') {
      product.stock += quantity;
    } else {
      // Prevent negative stock
      if (product.stock < quantity) {
        return res.status(400).json({ 
          message: 'Insufficient stock', 
          currentStock: product.stock,
          requestedQuantity: quantity
        });
      }
      product.stock -= quantity;
    }
    
    // Update inStock status based on stock level
    product.inStock = product.stock > 0;
    
    // Update the updatedAt timestamp
    product.updatedAt = Date.now();
    
    const updatedProduct = await product.save();
    
    res.json({
      message: `Inventory ${action}d successfully`,
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock products (below threshold)
exports.getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const lowStockProducts = await Product.find({
      $or: [
        { stock: { $lte: Number(threshold) } },
        { stock: { $exists: false } }
      ]
    });
    
    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if product is in stock
exports.checkProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.query;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const stock = product.stock || 0;
    const available = stock >= Number(quantity);
    
    res.json({
      productId: id,
      productName: product.name,
      inStock: product.inStock,
      currentStock: stock,
      requestedQuantity: Number(quantity),
      available
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Made with Bob