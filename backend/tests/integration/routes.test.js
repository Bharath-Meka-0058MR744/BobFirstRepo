const request = require('supertest');
const express = require('express');
const userRoutes = require('../../src/routes/userRoutes');
const productRoutes = require('../../src/routes/productRoutes');
const User = require('../../src/models/User');
const Product = require('../../src/models/Product');

// Mock the models
jest.mock('../../src/models/User');
jest.mock('../../src/models/Product');

// Create a test express app
const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('User Routes', () => {
    describe('GET /api/users', () => {
      it('should return all users', async () => {
        // Mock the User.find method
        const mockUsers = [
          { _id: '1', name: 'User 1', email: 'user1@example.com' },
          { _id: '2', name: 'User 2', email: 'user2@example.com' }
        ];
        
        User.find.mockReturnValue({
          select: jest.fn().mockResolvedValue(mockUsers)
        });
        
        // Make the request
        const response = await request(app).get('/api/users');
        
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUsers);
        expect(User.find).toHaveBeenCalled();
      });
    });
    
    describe('GET /api/users/:id', () => {
      it('should return a user by ID', async () => {
        // Mock the User.findById method
        const mockUser = { _id: '123', name: 'Test User', email: 'test@example.com' };
        User.findById.mockReturnValue({
          select: jest.fn().mockResolvedValue(mockUser)
        });
        
        // Make the request
        const response = await request(app).get('/api/users/123');
        
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
        expect(User.findById).toHaveBeenCalledWith('123');
      });
      
      it('should return 404 if user not found', async () => {
        // Mock the User.findById method to return null
        User.findById.mockReturnValue({
          select: jest.fn().mockResolvedValue(null)
        });
        
        // Make the request
        const response = await request(app).get('/api/users/nonexistent');
        
        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'User not found');
      });
    });
    
    describe('POST /api/users', () => {
      it('should create a new user', async () => {
        // Mock User.findOne and user.save
        User.findOne.mockResolvedValue(null);
        
        const userData = {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123'
        };
        
        const savedUser = { _id: 'new123', ...userData };
        
        // Mock the User constructor and save method
        User.mockImplementation(() => ({
          save: jest.fn().mockResolvedValue(savedUser)
        }));
        
        // Make the request
        const response = await request(app)
          .post('/api/users')
          .send(userData);
        
        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toEqual(savedUser);
      });
    });
  });
  
  describe('Product Routes', () => {
    describe('GET /api/products', () => {
      it('should return all products', async () => {
        // Mock the Product.find method
        const mockProducts = [
          { _id: '1', name: 'Product 1', price: 19.99 },
          { _id: '2', name: 'Product 2', price: 29.99 }
        ];
        
        Product.find.mockResolvedValue(mockProducts);
        
        // Make the request
        const response = await request(app).get('/api/products');
        
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalled();
      });
    });
    
    describe('GET /api/products/:id', () => {
      it('should return a product by ID', async () => {
        // Mock the Product.findById method
        const mockProduct = { _id: '123', name: 'Test Product', price: 19.99 };
        Product.findById.mockResolvedValue(mockProduct);
        
        // Make the request
        const response = await request(app).get('/api/products/123');
        
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProduct);
        expect(Product.findById).toHaveBeenCalledWith('123');
      });
      
      it('should return 404 if product not found', async () => {
        // Mock the Product.findById method to return null
        Product.findById.mockResolvedValue(null);
        
        // Make the request
        const response = await request(app).get('/api/products/nonexistent');
        
        // Assertions
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');
      });
    });
    
    describe('GET /api/products/category/:category', () => {
      it('should return products by category', async () => {
        // Mock the Product.find method
        const mockProducts = [
          { _id: '1', name: 'Electronics Product 1', category: 'Electronics' },
          { _id: '2', name: 'Electronics Product 2', category: 'Electronics' }
        ];
        
        Product.find.mockResolvedValue(mockProducts);
        
        // Make the request
        const response = await request(app).get('/api/products/category/Electronics');
        
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProducts);
        expect(Product.find).toHaveBeenCalledWith({ category: 'Electronics' });
      });
    });
    
    describe('POST /api/products', () => {
      it('should create a new product', async () => {
        // Mock product data and save
        const productData = {
          name: 'New Product',
          description: 'A brand new product',
          price: 39.99,
          category: 'New'
        };
        
        const savedProduct = { _id: 'new123', ...productData };
        
        // Mock the Product constructor and save method
        Product.mockImplementation(() => ({
          save: jest.fn().mockResolvedValue(savedProduct)
        }));
        
        // Make the request
        const response = await request(app)
          .post('/api/products')
          .send(productData);
        
        // Assertions
        expect(response.status).toBe(201);
        expect(response.body).toEqual(savedProduct);
      });
    });
  });
});

// Made with Bob
