const express = require('express');
const router = express.Router();
const searchController = require('../controllers/productSearchController');

// Search products with filters
router.get('/products', searchController.searchProducts);

// Get product recommendations
router.get('/recommendations/:id', searchController.getProductRecommendations);

// Get trending products
router.get('/trending', searchController.getTrendingProducts);

module.exports = router;

// Made with Bob