const Payment = require('../models/Payment');
const User = require('../models/User');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payments by user ID
exports.getPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const payments = await Payment.findByUser(userId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const {
      orderId,
      userId,
      amount,
      currency,
      paymentMethod,
      paymentDetails,
      status,
      transactionId,
      gatewayResponse,
      metadata
    } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if payment with this orderId already exists
    const existingPayment = await Payment.findOne({ orderId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment with this order ID already exists' });
    }
    
    // Additional validations
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!paymentDetails || !paymentDetails.lastFourDigits) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: { paymentDetails: 'Last four digits are required for card payments' }
        });
      }
    }
    
    // Validate transaction ID format if provided
    if (transactionId && !/^TXN-[A-Z0-9]{6,15}$/.test(transactionId)) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: { transactionId: 'Invalid transaction ID format. Format should be TXN-XXXXXX where X is alphanumeric' }
      });
    }
    
    const payment = new Payment({
      orderId,
      userId,
      amount,
      currency: currency || 'USD',
      paymentMethod,
      paymentDetails,
      status: status || 'pending',
      transactionId,
      gatewayResponse,
      metadata
    });
    
    try {
      const savedPayment = await payment.save();
      res.status(201).json(savedPayment);
    } catch (validationError) {
      // Handle mongoose validation errors
      if (validationError.name === 'ValidationError') {
        const errors = {};
        
        for (const field in validationError.errors) {
          errors[field] = validationError.errors[field].message;
        }
        
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }
      throw validationError; // Re-throw if it's not a validation error
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, transactionId, gatewayResponse } = req.body;
    
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Validate status transition
    if (!isValidStatusTransition(payment.status, status)) {
      return res.status(400).json({
        message: 'Invalid status transition',
        currentStatus: payment.status,
        requestedStatus: status,
        allowedTransitions: getAllowedStatusTransitions(payment.status)
      });
    }
    
    // Validate transaction ID format if provided
    if (transactionId && !/^TXN-[A-Z0-9]{6,15}$/.test(transactionId)) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: { transactionId: 'Invalid transaction ID format. Format should be TXN-XXXXXX where X is alphanumeric' }
      });
    }
    
    // Update payment fields
    payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    if (gatewayResponse) payment.gatewayResponse = gatewayResponse;
    payment.updatedAt = Date.now();
    
    try {
      const updatedPayment = await payment.save();
      res.json(updatedPayment);
    } catch (validationError) {
      // Handle mongoose validation errors
      if (validationError.name === 'ValidationError') {
        const errors = {};
        
        for (const field in validationError.errors) {
          errors[field] = validationError.errors[field].message;
        }
        
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }
      throw validationError; // Re-throw if it's not a validation error
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Process refund
exports.processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundAmount, refundReason } = req.body;
    
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if payment is completed
    if (payment.status !== 'completed') {
      return res.status(400).json({
        message: 'Only completed payments can be refunded',
        currentStatus: payment.status
      });
    }
    
    // Check if payment has already been refunded
    if (payment.refundDetails && payment.refundDetails.refundId) {
      return res.status(400).json({
        message: 'This payment has already been refunded',
        refundDetails: payment.refundDetails
      });
    }
    
    // Check if refund amount is valid
    if (refundAmount <= 0 || refundAmount > payment.amount) {
      return res.status(400).json({
        message: 'Invalid refund amount',
        maxRefundAmount: payment.amount
      });
    }
    
    // Generate a unique refund ID
    const refundId = `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Process refund (in a real app, this would interact with a payment gateway)
    payment.status = 'refunded';
    payment.refundDetails = {
      refundId,
      refundAmount,
      refundDate: Date.now(),
      refundReason: refundReason || 'Customer request'
    };
    payment.updatedAt = Date.now();
    
    try {
      const updatedPayment = await payment.save();
      res.json(updatedPayment);
    } catch (validationError) {
      // Handle mongoose validation errors
      if (validationError.name === 'ValidationError') {
        const errors = {};
        
        for (const field in validationError.errors) {
          errors[field] = validationError.errors[field].message;
        }
        
        return res.status(400).json({
          message: 'Validation failed',
          errors
        });
      }
      throw validationError; // Re-throw if it's not a validation error
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate receipt
exports.generateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    const receipt = payment.generateReceipt();
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const totalCount = await Payment.countDocuments();
    
    const statusCounts = await Payment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const methodCounts = await Payment.aggregate([
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
    ]);
    
    const totalAmount = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$currency', totalAmount: { $sum: '$amount' } } }
    ]);
    
    res.json({
      totalCount,
      byStatus: statusCounts,
      byMethod: methodCounts,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to validate payment status transitions
function isValidStatusTransition(currentStatus, newStatus) {
  const statusTransitions = {
    'pending': ['processing', 'cancelled', 'failed'],
    'processing': ['completed', 'failed'],
    'completed': ['refunded'],
    'failed': ['pending'],
    'refunded': [],
    'cancelled': ['pending']
  };
  
  return statusTransitions[currentStatus]?.includes(newStatus) || false;
}

// Helper function to get allowed status transitions
function getAllowedStatusTransitions(currentStatus) {
  const statusTransitions = {
    'pending': ['processing', 'cancelled', 'failed'],
    'processing': ['completed', 'failed'],
    'completed': ['refunded'],
    'failed': ['pending'],
    'refunded': [],
    'cancelled': ['pending']
  };
  
  return statusTransitions[currentStatus] || [];
}

// Made with Bob
