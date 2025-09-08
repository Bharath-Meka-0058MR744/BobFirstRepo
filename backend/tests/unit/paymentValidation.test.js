const { validatePaymentInput, validateRefundInput, validateStatusUpdate } = require('../../src/middleware/paymentValidation');
const mongoose = require('mongoose');

describe('Payment Validation Middleware', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });
  
  describe('validatePaymentInput', () => {
    it('should call next() for valid payment data', () => {
      const userId = new mongoose.Types.ObjectId();
      req.body = {
        orderId: 'ORDER-123456',
        userId: userId.toString(),
        amount: 99.99,
        paymentMethod: 'credit_card',
        paymentDetails: {
          cardType: 'visa',
          lastFourDigits: '4242',
          expiryDate: '12/25'
        }
      };
      
      validatePaymentInput(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 400 for missing required fields', () => {
      validatePaymentInput(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          orderId: expect.any(String),
          userId: expect.any(String),
          amount: expect.any(String),
          paymentMethod: expect.any(String)
        })
      });
    });
    
    it('should validate order ID format', () => {
      const userId = new mongoose.Types.ObjectId();
      req.body = {
        orderId: 'invalid-format',
        userId: userId.toString(),
        amount: 99.99,
        paymentMethod: 'credit_card',
        paymentDetails: {
          cardType: 'visa',
          lastFourDigits: '4242',
          expiryDate: '12/25'
        }
      };
      
      validatePaymentInput(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          orderId: expect.stringContaining('Invalid order ID format')
        })
      });
    });
    
    it('should validate amount format', () => {
      const userId = new mongoose.Types.ObjectId();
      req.body = {
        orderId: 'ORDER-123456',
        userId: userId.toString(),
        amount: 99.999, // Invalid: 3 decimal places
        paymentMethod: 'credit_card',
        paymentDetails: {
          cardType: 'visa',
          lastFourDigits: '4242',
          expiryDate: '12/25'
        }
      };
      
      validatePaymentInput(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          amount: expect.stringContaining('at most 2 decimal places')
        })
      });
    });
    
    it('should validate payment method', () => {
      const userId = new mongoose.Types.ObjectId();
      req.body = {
        orderId: 'ORDER-123456',
        userId: userId.toString(),
        amount: 99.99,
        paymentMethod: 'invalid_method',
        paymentDetails: {
          cardType: 'visa',
          lastFourDigits: '4242',
          expiryDate: '12/25'
        }
      };
      
      validatePaymentInput(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          paymentMethod: expect.stringContaining('Invalid payment method')
        })
      });
    });
    
    it('should require payment details for card payments', () => {
      const userId = new mongoose.Types.ObjectId();
      req.body = {
        orderId: 'ORDER-123456',
        userId: userId.toString(),
        amount: 99.99,
        paymentMethod: 'credit_card'
        // Missing paymentDetails
      };
      
      validatePaymentInput(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          paymentDetails: expect.stringContaining('required for card payments')
        })
      });
    });
  });
  
  describe('validateRefundInput', () => {
    it('should call next() for valid refund data', () => {
      req.body = {
        refundAmount: 99.99,
        refundReason: 'Customer requested a refund due to product damage'
      };
      
      validateRefundInput(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 400 for missing required fields', () => {
      validateRefundInput(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          refundAmount: expect.any(String),
          refundReason: expect.any(String)
        })
      });
    });
    
    it('should validate refund amount', () => {
      req.body = {
        refundAmount: -10, // Invalid: negative amount
        refundReason: 'Customer requested a refund due to product damage'
      };
      
      validateRefundInput(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          refundAmount: expect.stringContaining('must be a positive number')
        })
      });
    });
    
    it('should validate refund reason length', () => {
      req.body = {
        refundAmount: 99.99,
        refundReason: 'Too' // Too short
      };
      
      validateRefundInput(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          refundReason: expect.stringContaining('between 5 and 500 characters')
        })
      });
    });
  });
  
  describe('validateStatusUpdate', () => {
    it('should call next() for valid status', () => {
      req.body = {
        status: 'completed'
      };
      
      validateStatusUpdate(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should return 400 for missing status', () => {
      validateStatusUpdate(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          status: expect.stringContaining('required')
        })
      });
    });
    
    it('should return 400 for invalid status value', () => {
      req.body = {
        status: 'invalid_status'
      };
      
      validateStatusUpdate(req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Validation failed',
        errors: expect.objectContaining({
          status: expect.stringContaining('Invalid status')
        })
      });
    });
  });
});

// Made with Bob
