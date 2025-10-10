/**
 * Product Search API Module
 * Exposes product search-related API endpoints
 */

const express = require('express');
const searchController = require('../controllers/productSearchController');

/**
 * Create a router for search API endpoints
 * @returns {express.Router} Express router with search endpoints
 */
function createSearchRouter() {
  const router = express.Router();
  
  /**
   * @api {get} /api/search/products Search products with filters
   * @apiName SearchProducts
   * @apiGroup Search
   * @apiParam {String} [query] Search query
   * @apiParam {String} [category] Filter by category
   * @apiParam {Number} [minPrice] Minimum price filter
   * @apiParam {Number} [maxPrice] Maximum price filter
   * @apiParam {String} [sortBy] Sort field
   * @apiParam {String} [sortOrder] Sort order (asc/desc)
   * @apiSuccess {Object[]} products List of matching products
   */
  router.get('/products', searchController.searchProducts);
  
  /**
   * @api {get} /api/search/recommendations/:id Get product recommendations
   * @apiName GetProductRecommendations
   * @apiGroup Search
   * @apiParam {String} id Product ID to get recommendations for
   * @apiSuccess {Object[]} products List of recommended products
   */
  router.get('/recommendations/:id', searchController.getProductRecommendations);
  
  /**
   * @api {get} /api/search/trending Get trending products
   * @apiName GetTrendingProducts
   * @apiGroup Search
   * @apiSuccess {Object[]} products List of trending products
   */
  router.get('/trending', searchController.getTrendingProducts);
  
  return router;
}

module.exports = {
  createRouter: createSearchRouter,
  
  /**
   * Register search API routes with an Express app
   * @param {express.Application} app - Express application
   * @param {string} [basePath='/api/search'] - Base path for search routes
   */
  registerRoutes: function(app, basePath = '/api/search') {
    app.use(basePath, createSearchRouter());
  }
};

// Made with Bob
