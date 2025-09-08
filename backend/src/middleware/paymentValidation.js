const validatePaymentInput = (req, res, next) => {
  const { orderId, userId, amount, paymentMethod, paymentDetails } = req.body;
  const errors = {};

  // Validate required fields
  if (!orderId) {
    errors.orderId = 'Order ID is required';
  } else if (!/^ORDER-[A-Z0-9]{6,12}$/.test(orderId)) {
    errors.orderId = 'Invalid order ID format. Format should be ORDER-XXXXXX where X is alphanumeric';
  }

  if (!userId) {
    errors.userId = 'User ID is required';
  } else if (!isValidObjectId(userId)) {
    errors.userId = 'Invalid user ID format';
  }

  if (amount === undefined || amount === null) {
    errors.amount = 'Amount is required';
  } else if (isNaN(amount) || amount <= 0) {
    errors.amount = 'Amount must be a positive number';
  } else if (amount > 1000000) {
    errors.amount = 'Amount cannot exceed 1,000,000';
  } else if (!/^\d+(\.\d{1,2})?$/.test(amount.toString())) {
    errors.amount = 'Amount can have at most 2 decimal places';
  }

  if (!paymentMethod) {
    errors.paymentMethod = 'Payment method is required';
  } else {
    const validMethods = ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto', 'cash_on_delivery'];
    if (!validMethods.includes(paymentMethod)) {
      errors.paymentMethod = `Invalid payment method. Valid options are: ${validMethods.join(', ')}`;
    }
  }

  // Validate payment details if provided
  if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
    if (!paymentDetails) {
      errors.paymentDetails = 'Payment details are required for card payments';
    } else {
      // Validate card details
      if (paymentDetails.cardType && !['visa', 'mastercard', 'amex', 'discover', 'other'].includes(paymentDetails.cardType)) {
        errors.cardType = 'Invalid card type';
      }
      
      if (paymentDetails.lastFourDigits && !/^\d{4}$/.test(paymentDetails.lastFourDigits)) {
        errors.lastFourDigits = 'Last four digits must be 4 numeric characters';
      }
      
      if (paymentDetails.expiryDate && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentDetails.expiryDate)) {
        errors.expiryDate = 'Expiry date must be in MM/YY format';
      }
    }
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors 
    });
  }

  // If validation passes, proceed to the next middleware/controller
  next();
};

const validateRefundInput = (req, res, next) => {
  const { refundAmount, refundReason } = req.body;
  const errors = {};

  if (refundAmount === undefined || refundAmount === null) {
    errors.refundAmount = 'Refund amount is required';
  } else if (isNaN(refundAmount) || refundAmount <= 0) {
    errors.refundAmount = 'Refund amount must be a positive number';
  } else if (!/^\d+(\.\d{1,2})?$/.test(refundAmount.toString())) {
    errors.refundAmount = 'Refund amount can have at most 2 decimal places';
  }

  if (!refundReason) {
    errors.refundReason = 'Refund reason is required';
  } else if (refundReason.length < 5 || refundReason.length > 500) {
    errors.refundReason = 'Refund reason must be between 5 and 500 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors 
    });
  }

  next();
};

const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  const errors = {};

  if (!status) {
    errors.status = 'Status is required';
  } else {
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'];
    if (!validStatuses.includes(status)) {
      errors.status = `Invalid status. Valid options are: ${validStatuses.join(', ')}`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ 
      message: 'Validation failed',
      errors 
    });
  }

  next();
};

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id) {
  const ObjectId = require('mongoose').Types.ObjectId;
  
  try {
    const objectId = new ObjectId(id);
    return objectId.toString() === id;
  } catch (error) {
    return false;
  }
}

module.exports = {
  validatePaymentInput,
  validateRefundInput,
  validateStatusUpdate
};

// Made with Bob
