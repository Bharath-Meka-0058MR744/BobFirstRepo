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
        orderId: 'ORDER-123',
        userId,
        amount: 99.99,
        paymentMethod: 'credit_card'
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
        orderId: 'ORDER-123',
        userId,
        amount: 99.99,
        paymentMethod: 'credit_card'
      };
      
      User.findById.mockResolvedValue(null);
      
      await paymentController.createPayment(req, res);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    
    it('should return 400 if payment with order ID already exists', async () => {
      const userId = new mongoose.Types.ObjectId();
      const orderId = 'ORDER-123';
      
      req.body = {
        orderId,
        userId,
        amount: 99.99,
        paymentMethod: 'credit_card'
      };
      
      User.findById.mockResolvedValue({ _id: userId });
      Payment.findOne.mockResolvedValue({ orderId });
      
      await paymentController.createPayment(req, res);
      
      expect(User.findById).toHaveBeenCalledWith(userId);
      expect(Payment.findOne).toHaveBeenCalledWith({ orderId });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Payment with this order ID already exists' });
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
          status: 'completed'
        })
      };
      
      req.params.id = paymentId;
      req.body = { status: 'completed' };
      
      Payment.findById.mockResolvedValue(mockPayment);
      
      await paymentController.updatePaymentStatus(req, res);
      
      expect(Payment.findById).toHaveBeenCalledWith(paymentId);
      expect(mockPayment.status).toBe('completed');
      expect(mockPayment.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        _id: paymentId,
        status: 'completed'
      });
    });
  });
  
  describe('generateReceipt', () => {
    it('should generate a receipt for a payment', async () => {
      const paymentId = 'payment123';
      const mockPayment = {
        _id: paymentId,
        orderId: 'ORDER-123',
        amount: 99.99,
        currency: 'USD',
        status: 'completed',
        generateReceipt: jest.fn().mockReturnValue({
          receiptId: `RCPT-${paymentId}`,
          orderId: 'ORDER-123',
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
        orderId: 'ORDER-123',
        amount: 99.99,
        currency: 'USD'
      });
    });
  });
});

// Made with Bob
