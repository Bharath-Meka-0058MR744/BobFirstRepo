const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { validatePaymentInput, validateRefundInput, validateStatusUpdate } = require('../middleware/paymentValidation');

// Get all payments
router.get('/', paymentController.getAllPayments);

// Get payment statistics
router.get('/stats', paymentController.getPaymentStats);

// Get payments by user
router.get('/user/:userId', paymentController.getPaymentsByUser);

// Get payment by ID
router.get('/:id', paymentController.getPaymentById);

// Generate receipt for a payment
router.get('/:id/receipt', paymentController.generateReceipt);

// Create a new payment
router.post('/', validatePaymentInput, paymentController.createPayment);

// Update payment status
router.patch('/:id/status', validateStatusUpdate, paymentController.updatePaymentStatus);

// Process refund
router.post('/:id/refund', validateRefundInput, paymentController.processRefund);

module.exports = router;

// Made with Bob
