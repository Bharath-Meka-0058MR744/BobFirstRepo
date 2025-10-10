/**
 * Payment API Module
 * Exposes payment-related API endpoints
 */

const express = require('express');
const paymentController = require('../controllers/paymentController');
const { 
  validatePaymentInput, 
  validateRefundInput, 
  validateStatusUpdate, 
  validateCurrencyConversion 
} = require('../middleware/paymentValidation');

/**
 * Create a router for payment API endpoints
 * @returns {express.Router} Express router with payment endpoints
 */
function createPaymentRouter() {
  const router = express.Router();
  
  /**
   * @api {get} /api/payments Get all payments
   * @apiName GetAllPayments
   * @apiGroup Payment
   * @apiSuccess {Object[]} payments List of payment objects
   */
  router.get('/', paymentController.getAllPayments);
  
  /**
   * @api {get} /api/payments/stats Get payment statistics
   * @apiName GetPaymentStats
   * @apiGroup Payment
   * @apiSuccess {Object} stats Payment statistics
   */
  router.get('/stats', paymentController.getPaymentStats);
  
  /**
   * @api {get} /api/payments/currencies Get supported currencies
   * @apiName GetSupportedCurrencies
   * @apiGroup Payment
   * @apiSuccess {Object[]} currencies List of supported currencies
   */
  router.get('/currencies', paymentController.getSupportedCurrencies);
  
  /**
   * @api {get} /api/payments/user/:userId Get payments by user
   * @apiName GetPaymentsByUser
   * @apiGroup Payment
   * @apiParam {String} userId User ID
   * @apiSuccess {Object[]} payments List of payments for the user
   */
  router.get('/user/:userId', paymentController.getPaymentsByUser);
  
  /**
   * @api {get} /api/payments/currency/:currencyCode Get payments by currency
   * @apiName GetPaymentsByCurrency
   * @apiGroup Payment
   * @apiParam {String} currencyCode Currency code
   * @apiSuccess {Object[]} payments List of payments in the specified currency
   */
  router.get('/currency/:currencyCode', paymentController.getPaymentsByCurrency);
  
  /**
   * @api {get} /api/payments/:id Get payment by ID
   * @apiName GetPaymentById
   * @apiGroup Payment
   * @apiParam {String} id Payment ID
   * @apiSuccess {Object} payment Payment object
   */
  router.get('/:id', paymentController.getPaymentById);
  
  /**
   * @api {get} /api/payments/:id/receipt Generate receipt for a payment
   * @apiName GenerateReceipt
   * @apiGroup Payment
   * @apiParam {String} id Payment ID
   * @apiSuccess {Object} receipt Receipt object or file
   */
  router.get('/:id/receipt', paymentController.generateReceipt);
  
  /**
   * @api {get} /api/payments/:id/convert/:targetCurrency Get payment in a different currency
   * @apiName GetPaymentInCurrency
   * @apiGroup Payment
   * @apiParam {String} id Payment ID
   * @apiParam {String} targetCurrency Target currency code
   * @apiSuccess {Object} payment Payment object with converted amounts
   */
  router.get('/:id/convert/:targetCurrency', validateCurrencyConversion, paymentController.getPaymentInCurrency);
  
  /**
   * @api {post} /api/payments Create a new payment
   * @apiName CreatePayment
   * @apiGroup Payment
   * @apiParam {Object} payment Payment object to create
   * @apiSuccess {Object} payment Created payment object
   */
  router.post('/', validatePaymentInput, paymentController.createPayment);
  
  /**
   * @api {patch} /api/payments/:id/status Update payment status
   * @apiName UpdatePaymentStatus
   * @apiGroup Payment
   * @apiParam {String} id Payment ID
   * @apiParam {Object} update Status update information
   * @apiSuccess {Object} payment Updated payment object
   */
  router.patch('/:id/status', validateStatusUpdate, paymentController.updatePaymentStatus);
  
  /**
   * @api {post} /api/payments/:id/refund Process refund
   * @apiName ProcessRefund
   * @apiGroup Payment
   * @apiParam {String} id Payment ID
   * @apiParam {Object} refund Refund information
   * @apiSuccess {Object} refund Refund details
   */
  router.post('/:id/refund', validateRefundInput, paymentController.processRefund);
  
  return router;
}

module.exports = {
  createRouter: createPaymentRouter,
  
  /**
   * Register payment API routes with an Express app
   * @param {express.Application} app - Express application
   * @param {string} [basePath='/api/payments'] - Base path for payment routes
   */
  registerRoutes: function(app, basePath = '/api/payments') {
    app.use(basePath, createPaymentRouter());
  }
};

// Made with Bob
