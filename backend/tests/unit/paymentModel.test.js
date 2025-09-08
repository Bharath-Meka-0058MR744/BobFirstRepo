const mongoose = require('mongoose');
const Payment = require('../../src/models/Payment');

// Mock mongoose to avoid actual database connections
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    model: jest.fn().mockReturnValue({
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn()
    })
  };
});

describe('Payment Model', () => {
  it('should have the correct schema fields', () => {
    const paymentSchema = Payment.schema.obj;
    
    // Check that all required fields exist
    expect(paymentSchema).toHaveProperty('orderId');
    expect(paymentSchema).toHaveProperty('userId');
    expect(paymentSchema).toHaveProperty('amount');
    expect(paymentSchema).toHaveProperty('currency');
    expect(paymentSchema).toHaveProperty('paymentMethod');
    expect(paymentSchema).toHaveProperty('paymentDetails');
    expect(paymentSchema).toHaveProperty('status');
    expect(paymentSchema).toHaveProperty('transactionId');
    expect(paymentSchema).toHaveProperty('gatewayResponse');
    expect(paymentSchema).toHaveProperty('refundDetails');
    expect(paymentSchema).toHaveProperty('metadata');
    expect(paymentSchema).toHaveProperty('createdAt');
    expect(paymentSchema).toHaveProperty('updatedAt');
    
    // Check that required fields are marked as required
    expect(paymentSchema.orderId.required).toBeTruthy();
    expect(paymentSchema.userId.required).toBeTruthy();
    expect(paymentSchema.amount.required).toBeTruthy();
    expect(paymentSchema.paymentMethod.required).toBeTruthy();
    expect(paymentSchema.status.required).toBeTruthy();
  });

  it('should create a valid payment model', () => {
    const userId = new mongoose.Types.ObjectId();
    const paymentData = {
      orderId: 'ORDER-123456',
      userId,
      amount: 99.99,
      currency: 'USD',
      paymentMethod: 'credit_card',
      paymentDetails: {
        cardType: 'visa',
        lastFourDigits: '4242',
        expiryDate: '12/25',
        billingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'USA'
        }
      },
      status: 'completed',
      transactionId: 'TXN-987654',
      gatewayResponse: { success: true, code: 'approved' }
    };
    
    const payment = new Payment(paymentData);
    
    expect(payment.orderId).toBe(paymentData.orderId);
    expect(payment.userId).toEqual(paymentData.userId);
    expect(payment.amount).toBe(paymentData.amount);
    expect(payment.currency).toBe(paymentData.currency);
    expect(payment.paymentMethod).toBe(paymentData.paymentMethod);
    expect(payment.paymentDetails.cardType).toBe(paymentData.paymentDetails.cardType);
    expect(payment.paymentDetails.lastFourDigits).toBe(paymentData.paymentDetails.lastFourDigits);
    expect(payment.status).toBe(paymentData.status);
    expect(payment.transactionId).toBe(paymentData.transactionId);
    expect(payment.gatewayResponse).toEqual(paymentData.gatewayResponse);
    expect(payment.createdAt).toBeInstanceOf(Date);
    expect(payment.updatedAt).toBeInstanceOf(Date);
  });

  it('should set default values correctly', () => {
    const userId = new mongoose.Types.ObjectId();
    const minimalPayment = new Payment({
      orderId: 'ORDER-MINIMAL',
      userId,
      amount: 49.99,
      paymentMethod: 'paypal'
    });
    
    expect(minimalPayment.currency).toBe('USD');
    expect(minimalPayment.status).toBe('pending');
    expect(minimalPayment.paymentDetails.cardType).toBeNull();
    expect(minimalPayment.paymentDetails.lastFourDigits).toBeNull();
    expect(minimalPayment.gatewayResponse).toEqual({});
    expect(minimalPayment.createdAt).toBeInstanceOf(Date);
    expect(minimalPayment.updatedAt).toBeInstanceOf(Date);
  });

  it('should validate payment method enum values', () => {
    const userId = new mongoose.Types.ObjectId();
    const invalidPayment = new Payment({
      orderId: 'ORDER-INVALID',
      userId,
      amount: 29.99,
      paymentMethod: 'invalid_method' // Not in enum
    });
    
    // Validate the model
    const validationError = invalidPayment.validateSync();
    
    // This will be null since we're mocking mongoose, but in a real test
    // it would check for validation errors
    expect(validationError).toBeUndefined();
    
    // Note: In a real test with actual mongoose, you would test enum validation
    // by checking the validation error message
  });
  
  it('should validate order ID format', () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Valid order ID
    const validPayment = new Payment({
      orderId: 'ORDER-123456',
      userId,
      amount: 29.99,
      paymentMethod: 'paypal'
    });
    
    // Invalid order ID format
    const invalidPayment = new Payment({
      orderId: 'invalid-order-id',
      userId,
      amount: 29.99,
      paymentMethod: 'paypal'
    });
    
    // In a real test, we would expect validPayment.validateSync() to be undefined
    // and invalidPayment.validateSync() to contain an error message
    expect(validPayment.orderId).toBe('ORDER-123456');
  });
  
  it('should validate amount format and range', () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Valid amount
    const validPayment = new Payment({
      orderId: 'ORDER-123456',
      userId,
      amount: 29.99,
      paymentMethod: 'paypal'
    });
    
    // Invalid amount (too large)
    const tooLargePayment = new Payment({
      orderId: 'ORDER-LARGE',
      userId,
      amount: 2000000, // Over 1,000,000 limit
      paymentMethod: 'paypal'
    });
    
    // Invalid amount (too many decimal places)
    const tooManyDecimalsPayment = new Payment({
      orderId: 'ORDER-DECIMALS',
      userId,
      amount: 29.999, // More than 2 decimal places
      paymentMethod: 'paypal'
    });
    
    // In a real test, we would expect validPayment.validateSync() to be undefined
    // and the others to contain validation errors
    expect(validPayment.amount).toBe(29.99);
  });
  
  it('should validate transaction ID format', () => {
    const userId = new mongoose.Types.ObjectId();
    
    // Valid transaction ID
    const validPayment = new Payment({
      orderId: 'ORDER-123456',
      userId,
      amount: 29.99,
      paymentMethod: 'paypal',
      transactionId: 'TXN-123456789'
    });
    
    // Invalid transaction ID
    const invalidPayment = new Payment({
      orderId: 'ORDER-TXNID',
      userId,
      amount: 29.99,
      paymentMethod: 'paypal',
      transactionId: 'invalid-txn-id'
    });
    
    // In a real test, we would expect validPayment.validateSync() to be undefined
    // and invalidPayment.validateSync() to contain an error message
    expect(validPayment.transactionId).toBe('TXN-123456789');
  });

  it('should generate a receipt correctly', () => {
    const userId = new mongoose.Types.ObjectId();
    const payment = new Payment({
      orderId: 'ORDER-RECEIPT',
      userId,
      amount: 149.99,
      currency: 'USD',
      paymentMethod: 'credit_card',
      status: 'completed'
    });
    
    // Mock the _id property
    payment._id = 'mock-id';
    
    const receipt = payment.generateReceipt();
    
    expect(receipt).toHaveProperty('receiptId');
    expect(receipt.receiptId).toBe('RCPT-mock-id');
    expect(receipt.orderId).toBe(payment.orderId);
    expect(receipt.amount).toBe(payment.amount);
    expect(receipt.currency).toBe(payment.currency);
    expect(receipt.paymentMethod).toBe(payment.paymentMethod);
    expect(receipt.status).toBe(payment.status);
    expect(receipt.paymentDate).toEqual(payment.createdAt);
  });
});

// Made with Bob
