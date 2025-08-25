const productController = require('../../src/controllers/productController');
const Product = require('../../src/models/Product');

// Mock the Product model
jest.mock('../../src/models/Product');

describe('Product Controller', () => {
  let req, res;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      params: { 
        id: 'mockProductId',
        category: 'Electronics'
      },
      body: {
        name: 'Test Product',
        description: 'This is a test product',
        price: 19.99,
        category: 'Electronics',
        inStock: true,
        imageUrl: 'test-image.jpg'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('getProducts', () => {
    it('should get all products and return 200', async () => {
      // Mock the Product.find method
      const mockProducts = [
        { _id: '1', name: 'Product 1', price: 19.99 },
        { _id: '2', name: 'Product 2', price: 29.99 }
      ];
      
      Product.find.mockResolvedValue(mockProducts);
      
      // Call the controller method
      await productController.getProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });
    
    it('should handle errors and return 500', async () => {
      // Mock the Product.find method to throw an error
      const errorMessage = 'Database error';
      Product.find.mockRejectedValue(new Error(errorMessage));
      
      // Call the controller method
      await productController.getProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });
  });
  
  describe('getProductById', () => {
    it('should get a product by ID and return 200', async () => {
      // Mock the Product.findById method
      const mockProduct = { 
        _id: 'mockProductId', 
        name: 'Test Product', 
        price: 19.99 
      };
      
      Product.findById.mockResolvedValue(mockProduct);
      
      // Call the controller method
      await productController.getProductById(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });
    
    it('should return 404 if product not found', async () => {
      // Mock the Product.findById method to return null
      Product.findById.mockResolvedValue(null);
      
      // Call the controller method
      await productController.getProductById(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });
  
  describe('createProduct', () => {
    it('should create a new product and return 201', async () => {
      // Mock the product save method
      const mockSavedProduct = {
        _id: 'newProductId',
        ...req.body
      };
      
      // Mock the Product constructor and save method
      Product.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedProduct)
      }));
      
      // Call the controller method
      await productController.createProduct(req, res);
      
      // Assertions
      expect(Product).toHaveBeenCalledWith(expect.objectContaining({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSavedProduct);
    });
  });
  
  describe('updateProduct', () => {
    it('should update a product and return 200', async () => {
      // Mock Product.findById and Product.findByIdAndUpdate
      const mockProduct = { _id: 'mockProductId', name: 'Original Product' };
      Product.findById.mockResolvedValue(mockProduct);
      
      const updatedProduct = { 
        _id: 'mockProductId', 
        name: 'Updated Product',
        updatedAt: new Date()
      };
      Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);
      
      // Call the controller method
      await productController.updateProduct(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockProductId',
        expect.objectContaining({ updatedAt: expect.any(Number) }),
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });
    
    it('should return 404 if product to update is not found', async () => {
      // Mock Product.findById to return null
      Product.findById.mockResolvedValue(null);
      
      // Call the controller method
      await productController.updateProduct(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });
  
  describe('deleteProduct', () => {
    it('should delete a product and return 200', async () => {
      // Mock Product.findById and Product.findByIdAndDelete
      const mockProduct = { _id: 'mockProductId', name: 'Product to Delete' };
      Product.findById.mockResolvedValue(mockProduct);
      Product.findByIdAndDelete.mockResolvedValue({});
      
      // Call the controller method
      await productController.deleteProduct(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('mockProductId');
      expect(res.json).toHaveBeenCalledWith({ message: 'Product removed' });
    });
    
    it('should return 404 if product to delete is not found', async () => {
      // Mock Product.findById to return null
      Product.findById.mockResolvedValue(null);
      
      // Call the controller method
      await productController.deleteProduct(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });
  
  describe('getProductsByCategory', () => {
    it('should get products by category and return 200', async () => {
      // Mock the Product.find method
      const mockProducts = [
        { _id: '1', name: 'Electronics Product 1', category: 'Electronics' },
        { _id: '2', name: 'Electronics Product 2', category: 'Electronics' }
      ];
      
      Product.find.mockResolvedValue(mockProducts);
      
      // Call the controller method
      await productController.getProductsByCategory(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalledWith({ category: 'Electronics' });
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });
  });
});

// Made with Bob
