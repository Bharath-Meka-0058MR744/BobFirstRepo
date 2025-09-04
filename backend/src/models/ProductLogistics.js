const mongoose = require('mongoose');

const productLogisticsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  warehouse: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  shippingDetails: {
    carrier: {
      type: String,
      required: true
    },
    estimatedDeliveryDays: {
      type: Number,
      required: true,
      min: [1, 'Estimated delivery days must be at least 1']
    },
    trackingAvailable: {
      type: Boolean,
      default: true
    }
  },
  dimensions: {
    length: {
      type: Number,
      required: true,
      min: [0, 'Length cannot be negative']
    },
    width: {
      type: Number,
      required: true,
      min: [0, 'Width cannot be negative']
    },
    height: {
      type: Number,
      required: true,
      min: [0, 'Height cannot be negative']
    },
    unit: {
      type: String,
      enum: ['cm', 'in'],
      default: 'cm'
    }
  },
  weight: {
    value: {
      type: Number,
      required: true,
      min: [0, 'Weight cannot be negative']
    },
    unit: {
      type: String,
      enum: ['kg', 'lb'],
      default: 'kg'
    }
  },
  handlingInstructions: {
    type: String,
    default: 'No special handling required'
  },
  isFragile: {
    type: Boolean,
    default: false
  },
  isHazardous: {
    type: Boolean,
    default: false
  },
  requiresRefrigeration: {
    type: Boolean,
    default: false
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

const ProductLogistics = mongoose.model('ProductLogistics', productLogisticsSchema);

module.exports = ProductLogistics;

// Made with Bob
