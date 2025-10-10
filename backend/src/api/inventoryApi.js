/**
 * Product Inventory API Module
 * Exposes product inventory-related API endpoints
 */

const express = require('express');
const inventoryController = require('../controllers/productInventoryController');

/**
 * Create a router for inventory API endpoints
 * @returns {express.Router} Express router with inventory endpoints
 */
function createInventoryRouter() {
  const router = express.Router();
  
  /**
   * @api {put} /api/inventory/products/:id/inventory Update product inventory
   * @apiName UpdateInventory
   * @apiGroup Inventory
   * @apiParam {String} id Product ID
   * @apiParam {Object} update Inventory update data (quantity, action)
   * @apiSuccess {Object} product Updated product with inventory information
   */
  router.put('/products/:id/inventory', inventoryController.updateInventory);
  
  /**
   * @api {get} /api/inventory/low-stock Get low stock products
   * @apiName GetLowStockProducts
   * @apiGroup Inventory
   * @apiSuccess {Object[]} products List of products with low stock
   */
  router.get('/low-stock', inventoryController.getLowStockProducts);
  
  /**
   * @api {get} /api/inventory/products/:id/stock Check product stock
   * @apiName CheckProductStock
   * @apiGroup Inventory
   * @apiParam {String} id Product ID
   * @apiSuccess {Object} stockInfo Product stock information
   */
  router.get('/products/:id/stock', inventoryController.checkProductStock);
  
  return router;
}

module.exports = {
  createRouter: createInventoryRouter,
  
  /**
   * Register inventory API routes with an Express app
   * @param {express.Application} app - Express application
   * @param {string} [basePath='/api/inventory'] - Base path for inventory routes
   */
  registerRoutes: function(app, basePath = '/api/inventory') {
    app.use(basePath, createInventoryRouter());
  }
};

// Made with Bob
