const searchController = require('../../src/controllers/productSearchController');
const Product = require('../../src/models/Product');

// Mock the Product model
jest.mock('../../src/models/Product');

describe('Product Search Controller', () => {
  let req, res;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      params: { id: 'mockProductId' },
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('searchProducts', () => {
    it('should search products by text query', async () => {
      // Set query parameter
      req.query.query = 'test';
      
      // Mock products matching the query
      const mockProducts = [
        { _id: '1', name: 'Test Product 1', description: 'Description 1' },
        { _id: '2', name: 'Another Test', description: 'Description 2' }
      ];
      
      Product.find.mockResolvedValue(mockProducts);
      
      // Call the controller method
      await searchController.searchProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: 'test', $options: 'i' } },
          { description: { $regex: 'test', $options: 'i' } }
        ]
      });
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        products: mockProducts
      });
    });
    
    it('should filter products by category', async () => {
      // Set category parameter
      req.query.category = 'Electronics';
      
      // Mock products in the category
      const mockProducts = [
        { _id: '1', name: 'Product 1', category: 'Electronics' },
        { _id: '2', name: 'Product 2', category: 'Electronics' }
      ];
      
      Product.find.mockResolvedValue(mockProducts);
      
      // Call the controller method
      await searchController.searchProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalledWith({
        category: 'Electronics'
      });
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        products: mockProducts
      });
    });
    
    it('should filter products by price range', async () => {
      // Set price range parameters
      req.query.minPrice = '10';
      req.query.maxPrice = '50';
      
      // Mock products in the price range
      const mockProducts = [
        { _id: '1', name: 'Product 1', price: 19.99 },
        { _id: '2', name: 'Product 2', price: 39.99 }
      ];
      
      Product.find.mockResolvedValue(mockProducts);
      
      // Call the controller method
      await searchController.searchProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalledWith({
        price: {
          $gte: 10,
          $lte: 50
        }
      });
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        products: mockProducts
      });
    });
    
    it('should filter products by stock availability', async () => {
      // Set inStock parameter
      req.query.inStock = 'true';
      
      // Mock in-stock products
      const mockProducts = [
        { _id: '1', name: 'Product 1', inStock: true },
        { _id: '2', name: 'Product 2', inStock: true }
      ];
      
      Product.find.mockResolvedValue(mockProducts);
      
      // Call the controller method
      await searchController.searchProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalledWith({
        inStock: true
      });
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        products: mockProducts
      });
    });
    
    it('should combine multiple search filters', async () => {
      // Set multiple parameters
      req.query.query = 'test';
      req.query.category = 'Electronics';
      req.query.minPrice = '10';
      req.query.maxPrice = '50';
      req.query.inStock = 'true';
      
      // Mock products matching all filters
      const mockProducts = [
        { _id: '1', name: 'Test Product', category: 'Electronics', price: 19.99, inStock: true }
      ];
      
      Product.find.mockResolvedValue(mockProducts);
      
      // Call the controller method
      await searchController.searchProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalledWith({
        $or: [
          { name: { $regex: 'test', $options: 'i' } },
          { description: { $regex: 'test', $options: 'i' } }
        ],
        category: 'Electronics',
        price: {
          $gte: 10,
          $lte: 50
        },
        inStock: true
      });
      expect(res.json).toHaveBeenCalledWith({
        count: 1,
        products: mockProducts
      });
    });
  });
  
  describe('getProductRecommendations', () => {
    it('should get product recommendations based on category', async () => {
      // Mock source product
      const sourceProduct = {
        _id: 'mockProductId',
        name: 'Source Product',
        category: 'Electronics'
      };
      
      // Mock recommended products
      const recommendedProducts = [
        { _id: 'rec1', name: 'Recommended 1', category: 'Electronics' },
        { _id: 'rec2', name: 'Recommended 2', category: 'Electronics' }
      ];
      
      Product.findById.mockResolvedValue(sourceProduct);
      Product.find.mockReturnValue({
        limit: jest.fn().mockResolvedValue(recommendedProducts)
      });
      
      // Call the controller method
      await searchController.getProductRecommendations(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(Product.find).toHaveBeenCalledWith({
        _id: { $ne: 'mockProductId' },
        category: 'Electronics',
        inStock: true
      });
      expect(res.json).toHaveBeenCalledWith(recommendedProducts);
    });
    
    it('should return 404 if source product not found', async () => {
      // Mock product not found
      Product.findById.mockResolvedValue(null);
      
      // Call the controller method
      await searchController.getProductRecommendations(req, res);
      
      // Assertions
      expect(Product.findById).toHaveBeenCalledWith('mockProductId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
    
    it('should limit the number of recommendations', async () => {
      // Set limit parameter
      req.query.limit = '3';
      
      // Mock source product
      const sourceProduct = {
        _id: 'mockProductId',
        name: 'Source Product',
        category: 'Electronics'
      };
      
      // Mock recommended products
      const recommendedProducts = [
        { _id: 'rec1', name: 'Recommended 1', category: 'Electronics' },
        { _id: 'rec2', name: 'Recommended 2', category: 'Electronics' },
        { _id: 'rec3', name: 'Recommended 3', category: 'Electronics' }
      ];
      
      Product.findById.mockResolvedValue(sourceProduct);
      Product.find.mockReturnValue({
        limit: jest.fn().mockResolvedValue(recommendedProducts)
      });
      
      // Call the controller method
      await searchController.getProductRecommendations(req, res);
      
      // Assertions
      expect(Product.find().limit).toHaveBeenCalledWith(3);
      expect(res.json).toHaveBeenCalledWith(recommendedProducts);
    });
  });
  
  describe('getTrendingProducts', () => {
    it('should get trending products', async () => {
      // Mock trending products
      const trendingProducts = [
        { _id: '1', name: 'Trending 1', price: 99.99 },
        { _id: '2', name: 'Trending 2', price: 89.99 }
      ];
      
      Product.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(trendingProducts)
        })
      });
      
      // Call the controller method
      await searchController.getTrendingProducts(req, res);
      
      // Assertions
      expect(Product.find).toHaveBeenCalledWith({ inStock: true });
      expect(Product.find().sort).toHaveBeenCalledWith({ price: -1 });
      expect(Product.find().sort().limit).toHaveBeenCalledWith(10); // Default limit
      expect(res.json).toHaveBeenCalledWith(trendingProducts);
    });
    
    it('should limit the number of trending products', async () => {
      // Set limit parameter
      req.query.limit = '5';
      
      // Mock trending products
      const trendingProducts = [
        { _id: '1', name: 'Trending 1', price: 99.99 },
        { _id: '2', name: 'Trending 2', price: 89.99 },
        { _id: '3', name: 'Trending 3', price: 79.99 },
        { _id: '4', name: 'Trending 4', price: 69.99 },
        { _id: '5', name: 'Trending 5', price: 59.99 }
      ];
      
      Product.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(trendingProducts)
        })
      });
      
      // Call the controller method
      await searchController.getTrendingProducts(req, res);
      
      // Assertions
      expect(Product.find().sort().limit).toHaveBeenCalledWith(5);
      expect(res.json).toHaveBeenCalledWith(trendingProducts);
    });
  });
});

// Made with Bob
