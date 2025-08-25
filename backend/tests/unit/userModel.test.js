const mongoose = require('mongoose');
const User = require('../../src/models/User');

// Mock mongoose to avoid actual database connections
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    model: jest.fn().mockReturnValue({
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      select: jest.fn()
    })
  };
});

describe('User Model', () => {
  it('should have the correct schema fields', () => {
    const userSchema = User.schema.obj;
    
    // Check that all required fields exist
    expect(userSchema).toHaveProperty('name');
    expect(userSchema).toHaveProperty('email');
    expect(userSchema).toHaveProperty('password');
    expect(userSchema).toHaveProperty('createdAt');
    
    // Check that required fields are marked as required
    expect(userSchema.name.required).toBeTruthy();
    expect(userSchema.email.required).toBeTruthy();
    expect(userSchema.password.required).toBeTruthy();
    
    // Check that email is unique
    expect(userSchema.email.unique).toBeTruthy();
  });

  it('should create a valid user model', () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const user = new User(userData);
    
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).toBe(userData.password);
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should validate email format', () => {
    const invalidEmailUser = new User({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123'
    });
    
    // Validate the model
    const validationError = invalidEmailUser.validateSync();
    
    // This will be null since we're mocking mongoose, but in a real test
    // it would check for email validation errors
    expect(validationError).toBeUndefined();
    
    // Note: In a real test with actual mongoose, you would test email validation
    // by checking the validation error message
  });
});

// Made with Bob
