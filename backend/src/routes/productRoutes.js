const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET all products
router.get('/', productController.getProducts);

// GET product by ID
router.get('/:id', productController.getProductById);

// GET products by category
router.get('/category/:category', productController.getProductsByCategory);

// POST create new product
router.post('/', productController.createProduct);

// PUT update product
router.put('/:id', productController.updateProduct);

// DELETE product
router.delete('/:id', productController.deleteProduct);

module.exports = router;

// Made with Bob