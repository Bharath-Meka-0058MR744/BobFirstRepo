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
  
  describe('addBulkProducts', () => {
    it('should create multiple products and return 201', async () => {
      // Mock request with multiple products
      req.body = {
        products: [
          {
            name: 'Product 1',
            description: 'Description 1',
            price: 19.99,
            category: 'Electronics',
            inStock: true,
            imageUrl: 'image1.jpg'
          },
          {
            name: 'Product 2',
            description: 'Description 2',
            price: 29.99,
            category: 'Clothing',
            inStock: false,
            imageUrl: 'image2.jpg'
          }
        ]
      };
      
      // Mock the Product.insertMany method
      const mockSavedProducts = req.body.products.map((product, index) => ({
        _id: `product${index}Id`,
        ...product
      }));
      
      Product.insertMany = jest.fn().mockResolvedValue(mockSavedProducts);
      
      // Call the controller method
      await productController.addBulkProducts(req, res);
      
      // Assertions
      expect(Product.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Product 1',
            description: 'Description 1',
            price: 19.99,
            category: 'Electronics'
          }),
          expect.objectContaining({
            name: 'Product 2',
            description: 'Description 2',
            price: 29.99,
            category: 'Clothing'
          })
        ])
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        count: 2,
        products: mockSavedProducts
      }));
    });
    
    it('should return 400 if products array is missing or empty', async () => {
      // Test with missing products array
      req.body = {};
      await productController.addBulkProducts(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('products array')
      }));
      
      // Reset mock
      jest.clearAllMocks();
      
      // Test with empty products array
      req.body = { products: [] };
      await productController.addBulkProducts(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('products array')
      }));
    });
    
    it('should handle partial success with valid and invalid products', async () => {
      // Mock request with valid and invalid products
      req.body = {
        products: [
          {
            name: 'Valid Product',
            description: 'Valid Description',
            price: 19.99,
            category: 'Electronics'
          },
          {
            // Missing required fields
            name: 'Invalid Product',
            price: -5 // Invalid price
          }
        ]
      };
      
      // Mock the Product.insertMany method for the valid product
      const mockSavedProduct = {
        _id: 'validProductId',
        ...req.body.products[0]
      };
      
      Product.insertMany = jest.fn().mockResolvedValue([mockSavedProduct]);
      
      // Call the controller method
      await productController.addBulkProducts(req, res);
      
      // Assertions
      expect(Product.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'Valid Product',
          description: 'Valid Description',
          price: 19.99,
          category: 'Electronics'
        })
      ]);
      expect(res.status).toHaveBeenCalledWith(207); // Multi-Status
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        count: 1,
        products: [mockSavedProduct],
        failures: expect.arrayContaining([
          expect.objectContaining({
            product: req.body.products[1],
            errors: expect.arrayContaining([
              expect.any(String) // At least one error message
            ])
          })
        ])
      }));
    });
    
    it('should validate each product and report specific validation errors', async () => {
      // Mock request with products having different validation issues
      req.body = {
        products: [
          {
            // Missing name
            description: 'Description 1',
            price: 19.99,
            category: 'Electronics'
          },
          {
            name: 'Product 2',
            // Missing description
            price: 29.99,
            category: 'Clothing'
          },
          {
            name: 'Product 3',
            description: 'Description 3',
            // Negative price
            price: -10,
            category: 'Books'
          },
          {
            name: 'Product 4',
            description: 'Description 4',
            price: 39.99
            // Missing category
          },
          {
            name: 'Product 5',
            description: 'Description 5',
            // Invalid price format (more than 2 decimal places)
            price: 49.999,
            category: 'Electronics'
          }
        ]
      };
      
      // No valid products, so insertMany won't be called
      
      // Call the controller method
      await productController.addBulkProducts(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('No valid products'),
        failures: expect.arrayContaining([
          expect.objectContaining({
            product: req.body.products[0],
            errors: expect.arrayContaining(['Name is required'])
          }),
          expect.objectContaining({
            product: req.body.products[1],
            errors: expect.arrayContaining(['Description is required'])
          }),
          expect.objectContaining({
            product: req.body.products[2],
            errors: expect.arrayContaining(['Price cannot be negative'])
          }),
          expect.objectContaining({
            product: req.body.products[3],
            errors: expect.arrayContaining(['Category is required'])
          }),
          expect.objectContaining({
            product: req.body.products[4],
            errors: expect.arrayContaining(['Price must be in US dollars format (up to two decimal places)'])
          })
        ])
      }));
    });
    
    it('should validate price format for US dollars', async () => {
      // Mock request with products having price format issues
      req.body = {
        products: [
          {
            name: 'Valid Product',
            description: 'Valid Description',
            price: 19.99, // Valid price (two decimal places)
            category: 'Electronics'
          },
          {
            name: 'Invalid Price Product',
            description: 'Invalid Price Description',
            price: 29.999, // Invalid price (three decimal places)
            category: 'Clothing'
          }
        ]
      };
      
      // Mock the Product.insertMany method for the valid product
      const mockSavedProduct = {
        _id: 'validProductId',
        ...req.body.products[0]
      };
      
      Product.insertMany = jest.fn().mockResolvedValue([mockSavedProduct]);
      
      // Call the controller method
      await productController.addBulkProducts(req, res);
      
      // Assertions
      expect(Product.insertMany).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'Valid Product',
          description: 'Valid Description',
          price: 19.99,
          category: 'Electronics'
        })
      ]);
      expect(res.status).toHaveBeenCalledWith(207); // Multi-Status
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        count: 1,
        products: [mockSavedProduct],
        failures: expect.arrayContaining([
          expect.objectContaining({
            product: req.body.products[1],
            errors: expect.arrayContaining([
              'Price must be in US dollars format (up to two decimal places)'
            ])
          })
        ])
      }));
    });
    
    it('should handle database errors and return 500', async () => {
      // Mock request with valid products
      req.body = {
        products: [
          {
            name: 'Product 1',
            description: 'Description 1',
            price: 19.99,
            category: 'Electronics'
          }
        ]
      };
      
      // Mock database error
      const errorMessage = 'Database error';
      Product.insertMany = jest.fn().mockRejectedValue(new Error(errorMessage));
      
      // Call the controller method
      await productController.addBulkProducts(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: errorMessage
      }));
    });
  });
});

// Made with Bob
