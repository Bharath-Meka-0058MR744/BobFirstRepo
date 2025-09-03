const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, inStock, imageUrl } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      category,
      inStock: inStock !== undefined ? inStock : true,
      imageUrl: imageUrl || 'default-product.jpg'
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update the updatedAt timestamp
    req.body.updatedAt = Date.now();
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add multiple products at once
/**
 * @api {post} /api/products/bulk Add multiple products
 * @apiName AddBulkProducts
 * @apiGroup Products
 * @apiDescription Creates multiple products in a single request
 *
 * @apiParam {Array} products Array of product objects
 * @apiParam {String} products.name Product name
 * @apiParam {String} products.description Product description
 * @apiParam {Number} products.price Product price in US dollars (up to 2 decimal places)
 * @apiParam {String} products.category Product category
 * @apiParam {Boolean} [products.inStock=true] Whether the product is in stock
 * @apiParam {String} [products.imageUrl='default-product.jpg'] URL to product image
 *
 * @apiSuccess {Boolean} success Indicates if the operation was successful
 * @apiSuccess {Number} count Number of products created
 * @apiSuccess {Array} products Array of created products
 * @apiSuccess {Array} [failures] Array of products that failed validation (if any)
 *
 * @apiSuccessExample {json} Success-Response (201 Created):
 *     HTTP/1.1 201 Created
 *     {
 *       "success": true,
 *       "count": 2,
 *       "products": [
 *         {
 *           "_id": "60d21b4667d0d8992e610c85",
 *           "name": "Product 1",
 *           "description": "Description for product 1",
 *           "price": 19.99,
 *           "category": "Electronics",
 *           "inStock": true,
 *           "imageUrl": "product1.jpg"
 *         },
 *         {
 *           "_id": "60d21b4667d0d8992e610c86",
 *           "name": "Product 2",
 *           "description": "Description for product 2",
 *           "price": 29.99,
 *           "category": "Clothing",
 *           "inStock": false,
 *           "imageUrl": "product2.jpg"
 *         }
 *       ]
 *     }
 */
exports.addBulkProducts = async (req, res) => {
  try {
    const { products } = req.body;
    
    // Validate input is an array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body must contain a non-empty products array'
      });
    }
    
    const validProducts = [];
    const failures = [];
    
    // Process each product
    for (const productData of products) {
      // Extract and validate required fields
      const { name, description, price, category, inStock, imageUrl } = productData;
      
      // Validate required fields
      const errors = [];
      if (!name) errors.push('Name is required');
      if (!description) errors.push('Description is required');
      if (price === undefined || price === null) errors.push('Price is required');
      if (typeof price === 'number' && price < 0) errors.push('Price cannot be negative');
      
      // Validate price format for US dollars (two decimal places)
      if (typeof price === 'number' && Math.round(price * 100) / 100 !== price) {
        errors.push('Price must be in US dollars format (up to two decimal places)');
      }
      
      if (!category) errors.push('Category is required');
      
      if (errors.length > 0) {
        failures.push({
          product: productData,
          errors
        });
        continue; // Skip this product and move to the next one
      }
      
      // Prepare valid product for insertion
      validProducts.push({
        name,
        description,
        price,
        category,
        inStock: inStock !== undefined ? inStock : true,
        imageUrl: imageUrl || 'default-product.jpg',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
    
    // If no valid products, return error
    if (validProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid products to add',
        failures
      });
    }
    
    // Insert valid products into database
    const savedProducts = await Product.insertMany(validProducts);
    
    // Determine response status based on failures
    const status = failures.length > 0 ? 207 : 201;
    
    // Return response
    res.status(status).json({
      success: true,
      count: savedProducts.length,
      products: savedProducts,
      ...(failures.length > 0 && { failures })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Made with Bob