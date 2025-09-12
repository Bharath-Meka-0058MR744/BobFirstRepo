const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^ORDER-[A-Z0-9]{6,12}$/.test(v);
      },
      message: props => `${props.value} is not a valid order ID format! Format should be ORDER-XXXXXX where X is alphanumeric`
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be at least 0.01'],
    max: [1000000, 'Amount cannot exceed 1,000,000'],
    validate: {
      validator: function(v) {
        // Check that amount has at most 2 decimal places
        return /^\d+(\.\d{1,2})?$/.test(v.toString());
      },
      message: props => `${props.value} is not a valid amount format! Amount can have at most 2 decimal places`
    }
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CNY', 'CHF', 'SGD', 'NZD', 'MXN', 'BRL', 'ZAR', 'HKD', 'SEK', 'NOK', 'DKK', 'AED', 'SAR'],
    validate: {
      validator: function(v) {
        // This is a redundant check with enum, but allows for a custom error message
        const validCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CNY', 'CHF', 'SGD', 'NZD', 'MXN', 'BRL', 'ZAR', 'HKD', 'SEK', 'NOK', 'DKK', 'AED', 'SAR'];
        return validCurrencies.includes(v);
      },
      message: props => `${props.value} is not a supported currency`
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: {
      values: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto', 'cash_on_delivery'],
      message: '{VALUE} is not a supported payment method'
    }
  },
  paymentDetails: {
    cardType: {
      type: String,
      enum: ['visa', 'mastercard', 'amex', 'discover', 'other', null],
      default: null
    },
    lastFourDigits: {
      type: String,
      validate: {
        validator: function(v) {
          return v === null || /^\d{4}$/.test(v);
        },
        message: props => `${props.value} is not a valid last four digits format!`
      },
      default: null
    },
    expiryDate: {
      type: String,
      validate: {
        validator: function(v) {
          return v === null || /^(0[1-9]|1[0-2])\/\d{2}$/.test(v);
        },
        message: props => `${props.value} is not a valid expiry date format (MM/YY)!`
      },
      default: null
    },
    billingAddress: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      state: { type: String, default: null },
      postalCode: { type: String, default: null },
      country: { type: String, default: null }
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return v === null || v === undefined || /^TXN-[A-Z0-9]{6,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid transaction ID format! Format should be TXN-XXXXXX where X is alphanumeric`
    }
  },
  gatewayResponse: {
    type: Object,
    default: {}
  },
  refundDetails: {
    refundId: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          return v === null || /^REF-[A-Z0-9]{6,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid refund ID format! Format should be REF-XXXXXX where X is alphanumeric`
      }
    },
    refundAmount: {
      type: Number,
      default: null,
      validate: {
        validator: function(v) {
          if (v === null) return true;
          // Check that refund amount is positive and not greater than original amount
          return v > 0 && v <= this.amount;
        },
        message: props => `Refund amount must be positive and not exceed the original payment amount`
      }
    },
    refundDate: { type: Date, default: null },
    refundReason: {
      type: String,
      default: null,
      validate: {
        validator: function(v) {
          return v === null || (v.length >= 5 && v.length <= 500);
        },
        message: props => `Refund reason must be between 5 and 500 characters`
      }
    }
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt timestamp
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to generate a receipt
paymentSchema.methods.generateReceipt = function() {
  return {
    receiptId: `RCPT-${this._id}`,
    orderId: this.orderId,
    amount: this.amount,
    currency: this.currency,
    paymentMethod: this.paymentMethod,
    paymentDate: this.createdAt,
    status: this.status
  };
};

// Static method to find payments by user
paymentSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find recent payments
paymentSchema.statics.findRecent = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Add method to convert amount to a different currency
paymentSchema.methods.getAmountInCurrency = function(targetCurrency) {
  const currencyUtils = require('../utils/currencyUtils');
  
  if (!currencyUtils.isCurrencySupported(targetCurrency)) {
    throw new Error(`Currency ${targetCurrency} is not supported`);
  }
  
  return currencyUtils.convertCurrency(this.amount, this.currency, targetCurrency);
};

// Add method to format amount with currency symbol
paymentSchema.methods.getFormattedAmount = function() {
  const currencyUtils = require('../utils/currencyUtils');
  return currencyUtils.formatCurrencyAmount(this.amount, this.currency);
};

// Add static method to get payments in a specific currency
paymentSchema.statics.findByCurrency = function(currencyCode) {
  return this.find({ currency: currencyCode }).sort({ createdAt: -1 });
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

// Made with Bob
