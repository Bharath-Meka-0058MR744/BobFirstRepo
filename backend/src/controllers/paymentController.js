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
    
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
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
    
    // Update payment fields
    payment.status = status;
    if (transactionId) payment.transactionId = transactionId;
    if (gatewayResponse) payment.gatewayResponse = gatewayResponse;
    payment.updatedAt = Date.now();
    
    const updatedPayment = await payment.save();
    res.json(updatedPayment);
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
    
    // Check if refund amount is valid
    if (refundAmount <= 0 || refundAmount > payment.amount) {
      return res.status(400).json({ 
        message: 'Invalid refund amount',
        maxRefundAmount: payment.amount
      });
    }
    
    // Process refund (in a real app, this would interact with a payment gateway)
    payment.status = 'refunded';
    payment.refundDetails = {
      refundId: `REF-${Date.now()}`,
      refundAmount,
      refundDate: Date.now(),
      refundReason: refundReason || 'Customer request'
    };
    payment.updatedAt = Date.now();
    
    const updatedPayment = await payment.save();
    res.json(updatedPayment);
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

// Made with Bob
