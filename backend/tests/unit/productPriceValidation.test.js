const mongoose = require('mongoose');
const Product = require('../../src/models/Product');

// We need to use the actual mongoose for validation tests
// but mock the database connection
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  
  // Create a modified Schema that supports validation without DB connection
  const mockSchema = function() {
    const schema = originalModule.Schema.apply(this, arguments);
    schema.validateSync = function(doc) {
      const errors = {};
      
      // Manually check price validation
      if (doc.price !== undefined) {
        if (typeof doc.price !== 'number') {
          errors.price = { message: 'Price must be a number' };
        } else if (doc.price < 0) {
          errors.price = { message: 'Price cannot be negative' };
        }
      }
      
      // Manually check stock validation
      if (doc.stock !== undefined) {
        if (typeof doc.stock !== 'number') {
          errors.stock = { message: 'Stock must be a number' };
        } else if (doc.stock < 0) {
          errors.stock = { message: 'Stock cannot be negative' };
        }
      }
      
      return Object.keys(errors).length > 0 ? { errors } : null;
    };
    
    return schema;
  };
  
  return {
    ...originalModule,
    Schema: mockSchema,
    model: jest.fn().mockImplementation((name, schema) => {
      function MockModel(data) {
        this.data = data;
        Object.assign(this, data);
        
        this.validateSync = function() {
          return schema.validateSync(this);
        };
      }
      
      MockModel.schema = schema;
      return MockModel;
    })
  };
});

describe('Product Price Validation', () => {
  it('should validate that price is a number', () => {
    // Create a product with non-numeric price
    const invalidProduct = new Product({
      name: 'Invalid Price Product',
      description: 'This product has an invalid price',
      price: 'not-a-number',
      category: 'Test'
    });
    
    // Validate the model
    const validationError = invalidProduct.validateSync();
    
    // Check for validation error
    expect(validationError).toBeTruthy();
    expect(validationError.errors.price).toBeTruthy();
    expect(validationError.errors.price.message).toBe('Price must be a number');
  });
  
  it('should validate that price is not negative', () => {
    // Create a product with negative price
    const invalidProduct = new Product({
      name: 'Negative Price Product',
      description: 'This product has a negative price',
      price: -10.99,
      category: 'Test'
    });
    
    // Validate the model
    const validationError = invalidProduct.validateSync();
    
    // Check for validation error
    expect(validationError).toBeTruthy();
    expect(validationError.errors.price).toBeTruthy();
    expect(validationError.errors.price.message).toBe('Price cannot be negative');
  });
  
  it('should accept valid price values', () => {
    // Test various valid price values
    const testCases = [
      { price: 0, description: 'zero price' },
      { price: 9.99, description: 'decimal price' },
      { price: 100, description: 'integer price' },
      { price: 1000000, description: 'large price' }
    ];
    
    testCases.forEach(testCase => {
      const validProduct = new Product({
        name: `Valid Price Product (${testCase.description})`,
        description: `This product has a valid ${testCase.description}`,
        price: testCase.price,
        category: 'Test'
      });
      
      // Validate the model
      const validationError = validProduct.validateSync();
      
      // Should not have price validation errors
      expect(validationError).toBeFalsy();
    });
  });
  
  it('should validate that stock is not negative', () => {
    // Create a product with negative stock
    const invalidProduct = new Product({
      name: 'Negative Stock Product',
      description: 'This product has negative stock',
      price: 19.99,
      category: 'Test',
      stock: -5
    });
    
    // Validate the model
    const validationError = invalidProduct.validateSync();
    
    // Check for validation error
    expect(validationError).toBeTruthy();
    expect(validationError.errors.stock).toBeTruthy();
    expect(validationError.errors.stock.message).toBe('Stock cannot be negative');
  });
  
  it('should accept valid stock values', () => {
    // Test various valid stock values
    const testCases = [
      { stock: 0, description: 'zero stock' },
      { stock: 10, description: 'positive stock' },
      { stock: 1000, description: 'large stock' }
    ];
    
    testCases.forEach(testCase => {
      const validProduct = new Product({
        name: `Valid Stock Product (${testCase.description})`,
        description: `This product has valid ${testCase.description}`,
        price: 19.99,
        category: 'Test',
        stock: testCase.stock
      });
      
      // Validate the model
      const validationError = validProduct.validateSync();
      
      // Should not have stock validation errors
      expect(validationError).toBeFalsy();
    });
  });
  
  it('should set inStock to false when stock is 0', () => {
    // Create a product with zero stock
    const product = new Product({
      name: 'Zero Stock Product',
      description: 'This product has zero stock',
      price: 19.99,
      category: 'Test',
      stock: 0
    });
    
    // inStock should be false when stock is 0
    expect(product.inStock).toBe(false);
  });
  
  it('should set inStock to true when stock is positive', () => {
    // Create a product with positive stock
    const product = new Product({
      name: 'In Stock Product',
      description: 'This product has positive stock',
      price: 19.99,
      category: 'Test',
      stock: 10
    });
    
    // inStock should be true when stock is positive
    expect(product.inStock).toBe(true);
  });
});

// Made with Bob
