const productLogisticsController = require('../../src/controllers/productLogisticsController');
const ProductLogistics = require('../../src/models/ProductLogistics');
const Product = require('../../src/models/Product');
const mongoose = require('mongoose');

// Mock the ProductLogistics and Product models
jest.mock('../../src/models/ProductLogistics');
jest.mock('../../src/models/Product');

describe('Product Logistics Controller', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getLogisticsInfo', () => {
    it('should return logistics info for a product', async () => {
      const productId = new mongoose.Types.ObjectId();
      const mockProduct = { _id: productId, name: 'Test Product' };
      const mockLogistics = { 
        productId, 
        warehouse: 'Test Warehouse',
        location: 'Test Location'
      };
      
      req.params.productId = productId;
      
      Product.findById.mockResolvedValue(mockProduct);
      ProductLogistics.findOne.mockResolvedValue(mockLogistics);
      
      await productLogisticsController.getLogisticsInfo(req, res);
      
      expect(Product.findById).toHaveBeenCalledWith(productId);
      expect(ProductLogistics.findOne).toHaveBeenCalledWith({ productId });
      expect(res.json).toHaveBeenCalledWith(mockLogistics);
    });
    
    it('should return 404 if product not found', async () => {
      const productId = new mongoose.Types.ObjectId();
      req.params.productId = productId;
      
      Product.findById.mockResolvedValue(null);
      
      await productLogisticsController.getLogisticsInfo(req, res);
      
      expect(Product.findById).toHaveBeenCalledWith(productId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
    
    it('should return 404 if logistics info not found', async () => {
      const productId = new mongoose.Types.ObjectId();
      const mockProduct = { _id: productId, name: 'Test Product' };
      
      req.params.productId = productId;
      
      Product.findById.mockResolvedValue(mockProduct);
      ProductLogistics.findOne.mockResolvedValue(null);
      
      await productLogisticsController.getLogisticsInfo(req, res);
      
      expect(Product.findById).toHaveBeenCalledWith(productId);
      expect(ProductLogistics.findOne).toHaveBeenCalledWith({ productId });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logistics information not found for this product' });
    });
  });
  
  describe('createLogisticsInfo', () => {
    it('should create logistics info for a product', async () => {
      const productId = new mongoose.Types.ObjectId();
      const mockProduct = { _id: productId, name: 'Test Product' };
      const logisticsData = {
        warehouse: 'Main Warehouse',
        location: 'New York',
        shippingDetails: {
          carrier: 'FedEx',
          estimatedDeliveryDays: 3
        },
        dimensions: {
          length: 10,
          width: 5,
          height: 2
        },
        weight: {
          value: 1.5
        }
      };
      
      const savedLogistics = { 
        _id: new mongoose.Types.ObjectId(),
        productId,
        ...logisticsData
      };
      
      req.params.productId = productId;
      req.body = logisticsData;
      
      Product.findById.mockResolvedValue(mockProduct);
      ProductLogistics.findOne.mockResolvedValue(null);
      
      const mockSave = jest.fn().mockResolvedValue(savedLogistics);
      ProductLogistics.mockImplementation(() => ({
        save: mockSave
      }));
      
      await productLogisticsController.createLogisticsInfo(req, res);
      
      expect(Product.findById).toHaveBeenCalledWith(productId);
      expect(ProductLogistics.findOne).toHaveBeenCalledWith({ productId });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedLogistics);
    });
    
    it('should return 404 if product not found', async () => {
      const productId = new mongoose.Types.ObjectId();
      req.params.productId = productId;
      
      Product.findById.mockResolvedValue(null);
      
      await productLogisticsController.createLogisticsInfo(req, res);
      
      expect(Product.findById).toHaveBeenCalledWith(productId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
    
    it('should return 400 if logistics info already exists', async () => {
      const productId = new mongoose.Types.ObjectId();
      const mockProduct = { _id: productId, name: 'Test Product' };
      const existingLogistics = { 
        productId, 
        warehouse: 'Existing Warehouse' 
      };
      
      req.params.productId = productId;
      
      Product.findById.mockResolvedValue(mockProduct);
      ProductLogistics.findOne.mockResolvedValue(existingLogistics);
      
      await productLogisticsController.createLogisticsInfo(req, res);
      
      expect(Product.findById).toHaveBeenCalledWith(productId);
      expect(ProductLogistics.findOne).toHaveBeenCalledWith({ productId });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Logistics information already exists for this product' });
    });
  });
});

// Made with Bob
