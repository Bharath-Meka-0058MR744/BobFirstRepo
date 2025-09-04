const ProductLogistics = require('../models/ProductLogistics');
const Product = require('../models/Product');

// Get logistics info for a product
exports.getLogisticsInfo = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const logisticsInfo = await ProductLogistics.findOne({ productId });
    
    if (!logisticsInfo) {
      return res.status(404).json({ message: 'Logistics information not found for this product' });
    }
    
    res.json(logisticsInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create logistics info for a product
exports.createLogisticsInfo = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if logistics info already exists for this product
    const existingLogistics = await ProductLogistics.findOne({ productId });
    if (existingLogistics) {
      return res.status(400).json({ message: 'Logistics information already exists for this product' });
    }
    
    // Create new logistics info
    const logisticsInfo = new ProductLogistics({
      productId,
      ...req.body
    });
    
    const savedLogistics = await logisticsInfo.save();
    res.status(201).json(savedLogistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update logistics info for a product
exports.updateLogisticsInfo = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update the updatedAt timestamp
    req.body.updatedAt = Date.now();
    
    const updatedLogistics = await ProductLogistics.findOneAndUpdate(
      { productId },
      req.body,
      { new: true }
    );
    
    if (!updatedLogistics) {
      return res.status(404).json({ message: 'Logistics information not found for this product' });
    }
    
    res.json(updatedLogistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete logistics info for a product
exports.deleteLogisticsInfo = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const result = await ProductLogistics.findOneAndDelete({ productId });
    
    if (!result) {
      return res.status(404).json({ message: 'Logistics information not found for this product' });
    }
    
    res.json({ message: 'Logistics information removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products with logistics info
exports.getAllProductsWithLogistics = async (req, res) => {
  try {
    const logisticsInfo = await ProductLogistics.find().populate('productId');
    res.json(logisticsInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by warehouse
exports.getProductsByWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.params;
    
    const logisticsInfo = await ProductLogistics.find({ warehouse }).populate('productId');
    
    res.json(logisticsInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products that require special handling
exports.getSpecialHandlingProducts = async (req, res) => {
  try {
    const specialProducts = await ProductLogistics.find({
      $or: [
        { isFragile: true },
        { isHazardous: true },
        { requiresRefrigeration: true }
      ]
    }).populate('productId');
    
    res.json(specialProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Made with Bob
