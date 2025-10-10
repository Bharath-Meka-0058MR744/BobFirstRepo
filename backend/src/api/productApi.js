/**
 * Product API Module
 * Exposes product-related API endpoints
 */

const express = require('express');
const productController = require('../controllers/productController');

/**
 * Create a router for product API endpoints
 * @returns {express.Router} Express router with product endpoints
 */
function createProductRouter() {
  const router = express.Router();
  
  /**
   * @api {get} /api/products Get all products
   * @apiName GetProducts
   * @apiGroup Product
   * @apiSuccess {Object[]} products List of product objects
   */
  router.get('/', productController.getProducts);
  
  /**
   * @api {get} /api/products/:id Get product by ID
   * @apiName GetProductById
   * @apiGroup Product
   * @apiParam {String} id Product ID
   * @apiSuccess {Object} product Product object
   */
  router.get('/:id', productController.getProductById);
  
  /**
   * @api {get} /api/products/category/:category Get products by category
   * @apiName GetProductsByCategory
   * @apiGroup Product
   * @apiParam {String} category Product category
   * @apiSuccess {Object[]} products List of products in the category
   */
  router.get('/category/:category', productController.getProductsByCategory);
  
  /**
   * @api {post} /api/products Create new product
   * @apiName CreateProduct
   * @apiGroup Product
   * @apiParam {Object} product Product object to create
   * @apiSuccess {Object} product Created product object
   */
  router.post('/', productController.createProduct);
  
  /**
   * @api {post} /api/products/bulk Create multiple products
   * @apiName AddBulkProducts
   * @apiGroup Product
   * @apiParam {Object[]} products Array of product objects to create
   * @apiSuccess {Object[]} products Array of created product objects
   */
  router.post('/bulk', productController.addBulkProducts);
  
  /**
   * @api {put} /api/products/:id Update product
   * @apiName UpdateProduct
   * @apiGroup Product
   * @apiParam {String} id Product ID
   * @apiParam {Object} product Updated product data
   * @apiSuccess {Object} product Updated product object
   */
  router.put('/:id', productController.updateProduct);
  
  /**
   * @api {delete} /api/products/:id Delete product
   * @apiName DeleteProduct
   * @apiGroup Product
   * @apiParam {String} id Product ID
   * @apiSuccess {Object} message Success message
   */
  router.delete('/:id', productController.deleteProduct);
  
  return router;
}

module.exports = {
  createRouter: createProductRouter,
  
  /**
   * Register product API routes with an Express app
   * @param {express.Application} app - Express application
   * @param {string} [basePath='/api/products'] - Base path for product routes
   */
  registerRoutes: function(app, basePath = '/api/products') {
    app.use(basePath, createProductRouter());
  }
};

// Made with Bob
