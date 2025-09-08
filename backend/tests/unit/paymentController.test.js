const paymentController = require('../../src/controllers/paymentController');
const Payment = require('../../src/models/Payment');
const User = require('../../src/models/User');
const mongoose = require('mongoose');

// Mock the Payment and User models
jest.mock('../../src/models/Payment');
jest.mock('../../src/models/User');

describe('Payment Controller', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      params: {},
      body: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getAllPayments', () => {
    it('should return all payments', async () => {
      const mockPayments = [
        { _id: 'payment1', orderId: 'order1' },
        { _id: 'payment2', orderId: 'order2' }
      ];
      
      Payment.find.mockResolvedValue(mockPayments);
      
      await paymentController.getAllPayments(req, res);
      
      expect(Payment.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPayments);
    });
    
    it('should handle errors', async () => {
      const errorMessage = 'Database error';
      Payment.find.mockRejectedValue(new Error(errorMessage));
      
      await paymentController.getAllPayments(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
  
  describe('getPaymentById', () => {
    it('should return a payment by ID', async () => {
      const paymentId = 'payment123';
      const mockPayment = { _id: paymentId, orderId: 'order123' };
      
      req.params.id = paymentId;
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.getPaymentById(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(res.json).toHaveBeenCalledWith(mockPayment);
    });
    
    it('should return 404 if payment not found', async () => {
      const paymentId = 'nonexistent';
      
      req.params.id = paymentId;
      Payment.findById.mockResolvedValue(null);
      
      await paymentController.getPaymentById(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Payment not found' });
    });
  });
  
  describe('createPayment', () => {
    it('should create a new payment', async () => {
      const userId = new mongoose.Types.ObjectId();
      const paymentData = {
        orderId: 'ORDER-123456',
        userId,
        amount: 99.99,
        paymentMethod: 'credit_card',
        paymentDetails: {
          lastFourDigits: '4242'
        }
      };
      
      const savedPayment = {
        _id: 'payment123',
        ...paymentData
      };
      
      req.body = paymentData;
      
      User.findById.mockResolvedValue({ _id: userId });
      Payment.findOne.mockResolvedValue(null);
      
      const mockSave = jest.fn().mockResolvedValue(savedPayment);
      Payment.mockImplementation(() => ({
        save: mockSave
      }));
      
      await paymentController.createPayment(req, res);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(Payment.findOne).toHaveBeenCalledWith({ orderId: paymentData.orderId });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedPayment);
    });
    
    it('should return 404 if user not found', async () => {
      const userId = new mongoose.Types.ObjectId();
      
      req.body = {
        orderId: 'ORDER-123456',
        userId,
        amount: 99.99,
        paymentMethod: 'credit_card',
        paymentDetails: {
          lastFourDigits: '4242'
        }
      };
      
      User.findById.mockResolvedValue(null);
      
      await paymentController.createPayment(req, res);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    
    it('should return 400 if payment with order ID already exists', async () => {
      const userId = new mongoose.Types.ObjectId();
      const orderId = 'ORDER-123456';
      
      req.body = {
        orderId,
        userId,
        amount: 99.99,
        paymentMethod: 'credit_card',
        paymentDetails: {
          lastFourDigits: '4242'
        }
      };
      
      User.findById.mockResolvedValue({ _id: userId });
      Payment.findOne.mockResolvedValue({ orderId });
      
      await paymentController.createPayment(req, res);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(Payment.findOne).toHaveBeenCalledWith({ orderId });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Payment with this order ID already exists' });
    });
    
    it('should return 400 if card payment is missing required details', async () => {
      const userId = new mongoose.Types.ObjectId();
      
      req.body = {
        orderId: 'ORDER-123456',
        userId,
        amount: 99.99,
        paymentMethod: 'credit_card',
        // Missing paymentDetails.lastFourDigits
        paymentDetails: {}
      };
      
      User.findById.mockResolvedValue({ _id: userId });
      Payment.findOne.mockResolvedValue(null);
      
      await paymentController.createPayment(req, res);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: { paymentDetails: 'Last four digits are required for card payments' }
      });
    });
    
    it('should return 400 if transaction ID format is invalid', async () => {
      const userId = new mongoose.Types.ObjectId();
      
      req.body = {
        orderId: 'ORDER-123456',
        userId,
        amount: 99.99,
        paymentMethod: 'paypal',
        transactionId: 'invalid-format'
      };
      
      User.findById.mockResolvedValue({ _id: userId });
      Payment.findOne.mockResolvedValue(null);
      
      await paymentController.createPayment(req, res);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: { transactionId: 'Invalid transaction ID format. Format should be TXN-XXXXXX where X is alphanumeric' }
      });
    });
    
    it('should handle mongoose validation errors', async () => {
      const userId = new mongoose.Types.ObjectId();
      
      req.body = {
        orderId: 'ORDER-123456',
        userId,
        amount: 99.99,
        paymentMethod: 'credit_card',
        paymentDetails: {
          lastFourDigits: '4242'
        }
      };
      
      User.findById.mockResolvedValue({ _id: userId });
      Payment.findOne.mockResolvedValue(null);
      
      const validationError = new Error('Validation error');
      validationError.name = 'ValidationError';
      validationError.errors = {
        amount: { message: 'Amount must be at least 0.01' }
      };
      
      const mockSave = jest.fn().mockRejectedValue(validationError);
      Payment.mockImplementation(() => ({
        save: mockSave
      }));
      
      await paymentController.createPayment(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: { amount: 'Amount must be at least 0.01' }
      });
    });
  });
  
  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      const paymentId = 'payment123';
      const mockPayment = {
        _id: paymentId,
        status: 'pending',
        save: jest.fn().mockResolvedValue({
          _id: paymentId,
          status: 'processing'
        })
      };
      
      req.params.id = paymentId;
      req.body = { status: 'processing' };
      
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.updatePaymentStatus(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(mockPayment.status).toBe('processing');
      expect(mockPayment.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        _id: paymentId,
        status: 'processing'
      });
    });
    
    it('should return 400 for invalid status transition', async () => {
      const paymentId = 'payment123';
      const mockPayment = {
        _id: paymentId,
        status: 'pending',
        save: jest.fn()
      };
      
      req.params.id = paymentId;
      req.body = { status: 'refunded' }; // Invalid transition from pending to refunded
      
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.updatePaymentStatus(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid status transition',
        currentStatus: 'pending',
        requestedStatus: 'refunded',
        allowedTransitions: ['processing', 'cancelled', 'failed']
      });
      expect(mockPayment.save).not.toHaveBeenCalled();
    });
    
    it('should return 400 if transaction ID format is invalid', async () => {
      const paymentId = 'payment123';
      const mockPayment = {
        _id: paymentId,
        status: 'pending',
        save: jest.fn()
      };
      
      req.params.id = paymentId;
      req.body = {
        status: 'processing',
        transactionId: 'invalid-format'
      };
      
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.updatePaymentStatus(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: { transactionId: 'Invalid transaction ID format. Format should be TXN-XXXXXX where X is alphanumeric' }
      });
      expect(mockPayment.save).not.toHaveBeenCalled();
    });
  });
  
  describe('generateReceipt', () => {
    it('should generate a receipt for a payment', async () => {
      const paymentId = 'payment123';
      const mockPayment = {
        _id: paymentId,
        orderId: 'ORDER-123456',
        amount: 99.99,
        currency: 'USD',
        status: 'completed',
        generateReceipt: jest.fn().mockReturnValue({
          receiptId: `RCPT-${paymentId}`,
          orderId: 'ORDER-123456',
          amount: 99.99,
          currency: 'USD'
        })
      };
      
      req.params.id = paymentId;
      
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.generateReceipt(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(mockPayment.generateReceipt).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        receiptId: `RCPT-${paymentId}`,
        orderId: 'ORDER-123456',
        amount: 99.99,
        currency: 'USD'
      });
    });
  });
  
  describe('processRefund', () => {
    it('should process a refund for a completed payment', async () => {
      const paymentId = 'payment123';
      const mockPayment = {
        _id: paymentId,
        orderId: 'ORDER-123456',
        amount: 99.99,
        status: 'completed',
        save: jest.fn().mockImplementation(function() {
          return Promise.resolve(this);
        })
      };
      
      req.params.id = paymentId;
      req.body = {
        refundAmount: 99.99,
        refundReason: 'Customer request'
      };
      
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.processRefund(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(mockPayment.status).toBe('refunded');
      expect(mockPayment.refundDetails).toBeDefined();
      expect(mockPayment.refundDetails.refundAmount).toBe(99.99);
      expect(mockPayment.refundDetails.refundReason).toBe('Customer request');
      expect(mockPayment.save).toHaveBeenCalled();
    });
    
    it('should return 400 if payment is not in completed status', async () => {
      const paymentId = 'payment123';
      const mockPayment = {
        _id: paymentId,
        orderId: 'ORDER-123456',
        amount: 99.99,
        status: 'pending',
        save: jest.fn()
      };
      
      req.params.id = paymentId;
      req.body = {
        refundAmount: 99.99,
        refundReason: 'Customer request'
      };
      
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.processRefund(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Only completed payments can be refunded',
        currentStatus: 'pending'
      });
      expect(mockPayment.save).not.toHaveBeenCalled();
    });
    
    it('should return 400 if refund amount exceeds original payment amount', async () => {
      const paymentId = 'payment123';
      const mockPayment = {
        _id: paymentId,
        orderId: 'ORDER-123456',
        amount: 99.99,
        status: 'completed',
        save: jest.fn()
      };
      
      req.params.id = paymentId;
      req.body = {
        refundAmount: 150.00, // Exceeds original amount
        refundReason: 'Customer request'
      };
      
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.processRefund(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid refund amount',
        maxRefundAmount: 99.99
      });
      expect(mockPayment.save).not.toHaveBeenCalled();
    });
    
    it('should return 400 if payment has already been refunded', async () => {
      const paymentId = 'payment123';
      const mockPayment = {
        _id: paymentId,
        orderId: 'ORDER-123456',
        amount: 99.99,
        status: 'completed',
        refundDetails: {
          refundId: 'REF-123456',
          refundAmount: 99.99,
          refundDate: new Date(),
          refundReason: 'Previous refund'
        },
        save: jest.fn()
      };
      
      req.params.id = paymentId;
      req.body = {
        refundAmount: 99.99,
        refundReason: 'Customer request'
      };
      
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.processRefund(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'This payment has already been refunded',
        refundDetails: mockPayment.refundDetails
      });
      expect(mockPayment.save).not.toHaveBeenCalled();
    });
  });
});

// Made with Bob
