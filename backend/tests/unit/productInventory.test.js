const inventoryController = require('../../src/controllers/productInventoryController');
const Product = require('../../src/models/Product');

// Mock the Product model
jest.mock('../../src/models/Product');

describe('Product Inventory Controller', () => {
  let req, res;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      params: { id: 'mockProductId' },
      body: {
        quantity: 5,
        action: 'increase'
      },
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('updateInventory', () => {
    it('should increase product stock', async () => {
      // Mock product with initial stock
      const mockProduct = {
        _id: 'mockProductId',
        name: 'Test Product',
        stock: 10,
        inStock: true,
        save: jest.fn().mockResolvedValue({
          _id: 'mockProductId',
          name: 'Test Product',
          stock: 15, // 10 + 5
          inStock: true
        })
      };
      
      Product.findById.mockResolvedValue(mockProduct);
      
      // Call the controller method
      await inventoryController.updateInventory(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(mockProduct.stock).toBe(15);
      expect(mockProduct.inStock).toBe(true);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Inventory increased successfully'
      }));
    });
    
    it('should decrease product stock', async () => {
      // Set action to decrease
      req.body.action = 'decrease';
      
      // Mock product with initial stock
      const mockProduct = {
        _id: 'mockProductId',
        name: 'Test Product',
        stock: 10,
        inStock: true,
        save: jest.fn().mockResolvedValue({
          _id: 'mockProductId',
          name: 'Test Product',
          stock: 5, // 10 - 5
          inStock: true
        })
      };
      
      Product.findById.mockResolvedValue(mockProduct);
      
      // Call the controller method
      await inventoryController.updateInventory(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(mockProduct.stock).toBe(5);
      expect(mockProduct.inStock).toBe(true);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Inventory decreased successfully'
      }));
    });
    
    it('should prevent negative stock when decreasing', async () => {
      // Set action to decrease with quantity more than stock
      req.body.action = 'decrease';
      req.body.quantity = 15;
      
      // Mock product with initial stock
      const mockProduct = {
        _id: 'mockProductId',
        name: 'Test Product',
        stock: 10,
        inStock: true
      };
      
      Product.findById.mockResolvedValue(mockProduct);
      
      // Call the controller method
      await inventoryController.updateInventory(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(mockProduct.stock).toBe(10); // Stock should remain unchanged
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Insufficient stock',
        currentStock: 10,
        requestedQuantity: 15
      }));
    });
    
    it('should update inStock status to false when stock becomes zero', async () => {
      // Set action to decrease with quantity equal to stock
      req.body.action = 'decrease';
      req.body.quantity = 10;
      
      // Mock product with initial stock
      const mockProduct = {
        _id: 'mockProductId',
        name: 'Test Product',
        stock: 10,
        inStock: true,
        save: jest.fn().mockResolvedValue({
          _id: 'mockProductId',
          name: 'Test Product',
          stock: 0,
          inStock: false
        })
      };
      
      Product.findById.mockResolvedValue(mockProduct);
      
      // Call the controller method
      await inventoryController.updateInventory(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(mockProduct.stock).toBe(0);
      expect(mockProduct.inStock).toBe(false);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Inventory decreased successfully'
      }));
    });
    
    it('should return 400 for invalid action', async () => {
      // Set invalid action
      req.body.action = 'invalid';
      
      // Call the controller method
      await inventoryController.updateInventory(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Action must be either "increase" or "decrease"'
      }));
    });
    
    it('should return 400 for invalid quantity', async () => {
      // Set invalid quantity
      req.body.quantity = -5;
      
      // Call the controller method
      await inventoryController.updateInventory(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Quantity must be a positive integer'
      }));
    });
  });
  
  describe('getLowStockProducts', () => {
    it('should get products with stock below threshold', async () => {
      // Set threshold in query
      req.query.threshold = 20;
      
      // Mock low stock products
      const mockProducts = [
        { _id: '1', name: 'Low Stock Product 1', stock: 5 },
        { _id: '2', name: 'Low Stock Product 2', stock: 15 }
      ];
      
      Product.find.mockResolvedValue(mockProducts);
      
      // Call the controller method
      await inventoryController.getLowStockProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalledWith({
        $or: [
          { stock: { $lte: 20 } },
          { stock: { $exists: false } }
        ]
      });
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });
    
    it('should use default threshold if not provided', async () => {
      // Mock low stock products
      const mockProducts = [
        { _id: '1', name: 'Low Stock Product 1', stock: 5 },
        { _id: '2', name: 'Low Stock Product 2', stock: 8 }
      ];
      
      Product.find.mockResolvedValue(mockProducts);
      
      // Call the controller method
      await inventoryController.getLowStockProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalledWith({
        $or: [
          { stock: { $lte: 10 } }, // Default threshold
          { stock: { $exists: false } }
        ]
      });
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });
  });
  
  describe('checkProductStock', () => {
    it('should check if product has sufficient stock', async () => {
      // Set quantity in query
      req.query.quantity = 5;
      
      // Mock product with sufficient stock
      const mockProduct = {
        _id: 'mockProductId',
        name: 'Test Product',
        stock: 10,
        inStock: true
      };
      
      Product.findById.mockResolvedValue(mockProduct);
      
      // Call the controller method
      await inventoryController.checkProductStock(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(res.json).toHaveBeenCalledWith({
        productId: 'mockProductId',
        productName: 'Test Product',
        inStock: true,
        currentStock: 10,
        requestedQuantity: 5,
        available: true
      });
    });
    
    it('should check if product has insufficient stock', async () => {
      // Set quantity in query
      req.query.quantity = 15;
      
      // Mock product with insufficient stock
      const mockProduct = {
        _id: 'mockProductId',
        name: 'Test Product',
        stock: 10,
        inStock: true
      };
      
      Product.findById.mockResolvedValue(mockProduct);
      
      // Call the controller method
      await inventoryController.checkProductStock(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(res.json).toHaveBeenCalledWith({
        productId: 'mockProductId',
        productName: 'Test Product',
        inStock: true,
        currentStock: 10,
        requestedQuantity: 15,
        available: false
      });
    });
    
    it('should handle products with no stock field', async () => {
      // Mock product with no stock field
      const mockProduct = {
        _id: 'mockProductId',
        name: 'Test Product',
        inStock: true
      };
      
      Product.findById.mockResolvedValue(mockProduct);
      
      // Call the controller method
      await inventoryController.checkProductStock(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(res.json).toHaveBeenCalledWith({
        productId: 'mockProductId',
        productName: 'Test Product',
        inStock: true,
        currentStock: 0,
        requestedQuantity: 1, // Default
        available: false
      });
    });
  });
});

// Made with Bob
