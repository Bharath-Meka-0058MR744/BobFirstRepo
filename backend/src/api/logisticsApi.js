/**
 * Product Logistics API Module
 * Exposes product logistics-related API endpoints
 */

const express = require('express');
const logisticsController = require('../controllers/productLogisticsController');

/**
 * Create a router for logistics API endpoints
 * @returns {express.Router} Express router with logistics endpoints
 */
function createLogisticsRouter() {
  const router = express.Router();
  
  /**
   * @api {get} /api/logistics Get all products with logistics info
   * @apiName GetAllProductsWithLogistics
   * @apiGroup Logistics
   * @apiSuccess {Object[]} products List of products with logistics information
   */
  router.get('/', logisticsController.getAllProductsWithLogistics);
  
  /**
   * @api {get} /api/logistics/warehouse/:warehouse Get products by warehouse
   * @apiName GetProductsByWarehouse
   * @apiGroup Logistics
   * @apiParam {String} warehouse Warehouse identifier
   * @apiSuccess {Object[]} products List of products in the specified warehouse
   */
  router.get('/warehouse/:warehouse', logisticsController.getProductsByWarehouse);
  
  /**
   * @api {get} /api/logistics/special-handling Get products that require special handling
   * @apiName GetSpecialHandlingProducts
   * @apiGroup Logistics
   * @apiSuccess {Object[]} products List of products requiring special handling
   */
  router.get('/special-handling', logisticsController.getSpecialHandlingProducts);
  
  /**
   * @api {get} /api/logistics/product/:productId Get logistics info for a product
   * @apiName GetLogisticsInfo
   * @apiGroup Logistics
   * @apiParam {String} productId Product ID
   * @apiSuccess {Object} logistics Logistics information for the product
   */
  router.get('/product/:productId', logisticsController.getLogisticsInfo);
  
  /**
   * @api {post} /api/logistics/product/:productId Create logistics info for a product
   * @apiName CreateLogisticsInfo
   * @apiGroup Logistics
   * @apiParam {String} productId Product ID
   * @apiParam {Object} logistics Logistics information to create
   * @apiSuccess {Object} logistics Created logistics information
   */
  router.post('/product/:productId', logisticsController.createLogisticsInfo);
  
  /**
   * @api {put} /api/logistics/product/:productId Update logistics info for a product
   * @apiName UpdateLogisticsInfo
   * @apiGroup Logistics
   * @apiParam {String} productId Product ID
   * @apiParam {Object} logistics Updated logistics information
   * @apiSuccess {Object} logistics Updated logistics information
   */
  router.put('/product/:productId', logisticsController.updateLogisticsInfo);
  
  /**
   * @api {delete} /api/logistics/product/:productId Delete logistics info for a product
   * @apiName DeleteLogisticsInfo
   * @apiGroup Logistics
   * @apiParam {String} productId Product ID
   * @apiSuccess {Object} message Success message
   */
  router.delete('/product/:productId', logisticsController.deleteLogisticsInfo);
  
  return router;
}

module.exports = {
  createRouter: createLogisticsRouter,
  
  /**
   * Register logistics API routes with an Express app
   * @param {express.Application} app - Express application
   * @param {string} [basePath='/api/logistics'] - Base path for logistics routes
   */
  registerRoutes: function(app, basePath = '/api/logistics') {
    app.use(basePath, createLogisticsRouter());
  }
};

// Made with Bob
