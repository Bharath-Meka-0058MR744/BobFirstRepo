const mongoose = require('mongoose');
const ProductLogistics = require('../../src/models/ProductLogistics');

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

describe('ProductLogistics Model', () => {
  it('should have the correct schema fields', () => {
    const logisticsSchema = ProductLogistics.schema.obj;
    
    // Check that all required fields exist
    expect(logisticsSchema).toHaveProperty('productId');
    expect(logisticsSchema).toHaveProperty('warehouse');
    expect(logisticsSchema).toHaveProperty('location');
    expect(logisticsSchema).toHaveProperty('shippingDetails');
    expect(logisticsSchema).toHaveProperty('dimensions');
    expect(logisticsSchema).toHaveProperty('weight');
    expect(logisticsSchema).toHaveProperty('handlingInstructions');
    expect(logisticsSchema).toHaveProperty('isFragile');
    expect(logisticsSchema).toHaveProperty('isHazardous');
    expect(logisticsSchema).toHaveProperty('requiresRefrigeration');
    expect(logisticsSchema).toHaveProperty('createdAt');
    expect(logisticsSchema).toHaveProperty('updatedAt');
    
    // Check that required fields are marked as required
    expect(logisticsSchema.productId.required).toBeTruthy();
    expect(logisticsSchema.warehouse.required).toBeTruthy();
    expect(logisticsSchema.location.required).toBeTruthy();
    expect(logisticsSchema.shippingDetails.carrier.required).toBeTruthy();
    expect(logisticsSchema.shippingDetails.estimatedDeliveryDays.required).toBeTruthy();
    expect(logisticsSchema.dimensions.length.required).toBeTruthy();
    expect(logisticsSchema.dimensions.width.required).toBeTruthy();
    expect(logisticsSchema.dimensions.height.required).toBeTruthy();
    expect(logisticsSchema.weight.value.required).toBeTruthy();
  });

  it('should create a valid logistics model', () => {
    const productId = new mongoose.Types.ObjectId();
    const logisticsData = {
      productId,
      warehouse: 'Main Warehouse',
      location: 'New York',
      shippingDetails: {
        carrier: 'FedEx',
        estimatedDeliveryDays: 3,
        trackingAvailable: true
      },
      dimensions: {
        length: 10,
        width: 5,
        height: 2,
        unit: 'cm'
      },
      weight: {
        value: 1.5,
        unit: 'kg'
      },
      handlingInstructions: 'Handle with care',
      isFragile: true,
      isHazardous: false,
      requiresRefrigeration: false
    };
    
    const logistics = new ProductLogistics(logisticsData);
    
    expect(logistics.productId).toEqual(productId);
    expect(logistics.warehouse).toBe(logisticsData.warehouse);
    expect(logistics.location).toBe(logisticsData.location);
    expect(logistics.shippingDetails.carrier).toBe(logisticsData.shippingDetails.carrier);
    expect(logistics.shippingDetails.estimatedDeliveryDays).toBe(logisticsData.shippingDetails.estimatedDeliveryDays);
    expect(logistics.shippingDetails.trackingAvailable).toBe(logisticsData.shippingDetails.trackingAvailable);
    expect(logistics.dimensions.length).toBe(logisticsData.dimensions.length);
    expect(logistics.dimensions.width).toBe(logisticsData.dimensions.width);
    expect(logistics.dimensions.height).toBe(logisticsData.dimensions.height);
    expect(logistics.dimensions.unit).toBe(logisticsData.dimensions.unit);
    expect(logistics.weight.value).toBe(logisticsData.weight.value);
    expect(logistics.weight.unit).toBe(logisticsData.weight.unit);
    expect(logistics.handlingInstructions).toBe(logisticsData.handlingInstructions);
    expect(logistics.isFragile).toBe(logisticsData.isFragile);
    expect(logistics.isHazardous).toBe(logisticsData.isHazardous);
    expect(logistics.requiresRefrigeration).toBe(logisticsData.requiresRefrigeration);
    expect(logistics.createdAt).toBeInstanceOf(Date);
    expect(logistics.updatedAt).toBeInstanceOf(Date);
  });

  it('should set default values correctly', () => {
    const productId = new mongoose.Types.ObjectId();
    const minimalLogistics = new ProductLogistics({
      productId,
      warehouse: 'Secondary Warehouse',
      location: 'Los Angeles',
      shippingDetails: {
        carrier: 'UPS',
        estimatedDeliveryDays: 2
      },
      dimensions: {
        length: 20,
        width: 15,
        height: 10
      },
      weight: {
        value: 2.5
      }
    });
    
    expect(minimalLogistics.shippingDetails.trackingAvailable).toBe(true);
    expect(minimalLogistics.dimensions.unit).toBe('cm');
    expect(minimalLogistics.weight.unit).toBe('kg');
    expect(minimalLogistics.handlingInstructions).toBe('No special handling required');
    expect(minimalLogistics.isFragile).toBe(false);
    expect(minimalLogistics.isHazardous).toBe(false);
    expect(minimalLogistics.requiresRefrigeration).toBe(false);
    expect(minimalLogistics.createdAt).toBeInstanceOf(Date);
    expect(minimalLogistics.updatedAt).toBeInstanceOf(Date);
  });
});

// Made with Bob
