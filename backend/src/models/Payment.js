const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be at least 0.01']
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD']
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto', 'cash_on_delivery']
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
    sparse: true
  },
  gatewayResponse: {
    type: Object,
    default: {}
  },
  refundDetails: {
    refundId: { type: String, default: null },
    refundAmount: { type: Number, default: null },
    refundDate: { type: Date, default: null },
    refundReason: { type: String, default: null }
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

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;

// Made with Bob
