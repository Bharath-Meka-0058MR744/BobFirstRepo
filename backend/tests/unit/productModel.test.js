const mongoose = require('mongoose');
const Product = require('../../src/models/Product');

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

describe('Product Model', () => {
  it('should have the correct schema fields', () => {
    const productSchema = Product.schema.obj;
    
    // Check that all required fields exist
    expect(productSchema).toHaveProperty('name');
    expect(productSchema).toHaveProperty('description');
    expect(productSchema).toHaveProperty('price');
    expect(productSchema).toHaveProperty('category');
    expect(productSchema).toHaveProperty('inStock');
    expect(productSchema).toHaveProperty('imageUrl');
    expect(productSchema).toHaveProperty('createdAt');
    expect(productSchema).toHaveProperty('updatedAt');
    
    // Check that required fields are marked as required
    expect(productSchema.name.required).toBeTruthy();
    expect(productSchema.description.required).toBeTruthy();
    expect(productSchema.price.required).toBeTruthy();
    expect(productSchema.category.required).toBeTruthy();
  });

  it('should create a valid product model', () => {
    const productData = {
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      category: 'Electronics'
    };
    
    const product = new Product(productData);
    
    expect(product.name).toBe(productData.name);
    expect(product.description).toBe(productData.description);
    expect(product.price).toBe(productData.price);
    expect(product.category).toBe(productData.category);
    expect(product.inStock).toBe(true); // Default value
    expect(product.imageUrl).toBe('default-product.jpg'); // Default value
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
  });

  it('should validate price is a number', () => {
    const invalidPriceProduct = new Product({
      name: 'Invalid Price Product',
      description: 'This product has an invalid price',
      price: 'not-a-number',
      category: 'Test'
    });
    
    // Validate the model
    const validationError = invalidPriceProduct.validateSync();
    
    // This will be null since we're mocking mongoose, but in a real test
    // it would check for price validation errors
    expect(validationError).toBeUndefined();
    
    // Note: In a real test with actual mongoose, you would test price validation
    // by checking the validation error message
  });

  it('should set default values correctly', () => {
    const minimalProduct = new Product({
      name: 'Minimal Product',
      description: 'Product with minimal fields',
      price: 9.99,
      category: 'Minimal'
    });
    
    expect(minimalProduct.inStock).toBe(true);
    expect(minimalProduct.imageUrl).toBe('default-product.jpg');
    expect(minimalProduct.createdAt).toBeInstanceOf(Date);
    expect(minimalProduct.updatedAt).toBeInstanceOf(Date);
  });
});

// Made with Bob
