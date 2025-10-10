/**
 * Swagger Configuration
 * This file contains the configuration for Swagger documentation
 */

const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BobFirstWebAPP API',
      version: '1.0.0',
      description: 'API documentation for BobFirstWebAPP',
      contact: {
        name: 'API Support',
        email: 'support@bobfirstwebapp.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://bobfirstwebapp.com',
        description: 'Production server'
      }
    ],
    tags: [
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Products', description: 'Product management endpoints' },
      { name: 'Inventory', description: 'Product inventory management endpoints' },
      { name: 'Search', description: 'Product search endpoints' },
      { name: 'Logistics', description: 'Product logistics endpoints' },
      { name: 'Payments', description: 'Payment processing endpoints' }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User name' },
            email: { type: 'string', description: 'User email' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Product ID' },
            name: { type: 'string', description: 'Product name' },
            description: { type: 'string', description: 'Product description' },
            price: { type: 'number', description: 'Product price' },
            category: { type: 'string', description: 'Product category' },
            stock: { type: 'integer', description: 'Available stock' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' }
          }
        },
        ProductLogistics: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Product ID' },
            warehouse: { type: 'string', description: 'Warehouse location' },
            specialHandling: { type: 'boolean', description: 'Requires special handling' },
            dimensions: {
              type: 'object',
              properties: {
                length: { type: 'number' },
                width: { type: 'number' },
                height: { type: 'number' },
                unit: { type: 'string' }
              }
            },
            weight: {
              type: 'object',
              properties: {
                value: { type: 'number' },
                unit: { type: 'string' }
              }
            }
          }
        },
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Payment ID' },
            userId: { type: 'string', description: 'User ID' },
            amount: { type: 'number', description: 'Payment amount' },
            currency: { type: 'string', description: 'Currency code' },
            status: { type: 'string', description: 'Payment status' },
            createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', description: 'Error message' },
            code: { type: 'integer', description: 'Error code' }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'The specified resource was not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        BadRequest: {
          description: 'The request contains invalid parameters',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        InternalError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js'
  ]
};

module.exports = swaggerConfig;

// Made with Bob
