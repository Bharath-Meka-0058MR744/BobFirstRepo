const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validatePaymentInput, validateRefundInput, validateStatusUpdate, validateCurrencyConversion } = require('../middleware/paymentValidation');

// Get all payments
router.get('/', paymentController.getAllPayments);

// Get payment statistics
router.get('/stats', paymentController.getPaymentStats);

// Get supported currencies
router.get('/currencies', paymentController.getSupportedCurrencies);

// Get payments by user
router.get('/user/:userId', paymentController.getPaymentsByUser);

// Get payments by currency
router.get('/currency/:currencyCode', paymentController.getPaymentsByCurrency);

// Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// Generate receipt for a payment
router.get('/:id/receipt', paymentController.generateReceipt);

// Get payment in a different currency
router.get('/:id/convert/:targetCurrency', validateCurrencyConversion, paymentController.getPaymentInCurrency);

// Create a new payment
router.post('/', validatePaymentInput, paymentController.createPayment);

// Update payment status
router.patch('/:id/status', validateStatusUpdate, paymentController.updatePaymentStatus);

// Process refund
router.post('/:id/refund', validateRefundInput, paymentController.processRefund);

module.exports = router;

// Made with Bob
