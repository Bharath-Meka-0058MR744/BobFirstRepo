/**
 * API Documentation for BobFirstWebAPP
 * This file contains documentation for all API endpoints
 */

const apiDocs = {
  info: {
    title: 'BobFirstWebAPP API',
    version: '1.0.0',
    description: 'API documentation for BobFirstWebAPP'
  },
  modules: {
    users: {
      basePath: '/api/users',
      description: 'User management endpoints',
      endpoints: [
        {
          path: '/',
          method: 'GET',
          description: 'Get all users',
          response: 'Array of user objects'
        },
        {
          path: '/:id',
          method: 'GET',
          description: 'Get user by ID',
          response: 'User object'
        },
        {
          path: '/',
          method: 'POST',
          description: 'Create new user',
          response: 'Created user object'
        },
        {
          path: '/:id',
          method: 'PUT',
          description: 'Update user',
          response: 'Updated user object'
        },
        {
          path: '/:id',
          method: 'DELETE',
          description: 'Delete user',
          response: 'Success message'
        }
      ]
    },
    products: {
      basePath: '/api/products',
      description: 'Product management endpoints',
      endpoints: [
        {
          path: '/',
          method: 'GET',
          description: 'Get all products',
          response: 'Array of product objects'
        },
        {
          path: '/:id',
          method: 'GET',
          description: 'Get product by ID',
          response: 'Product object'
        },
        {
          path: '/category/:category',
          method: 'GET',
          description: 'Get products by category',
          response: 'Array of product objects'
        },
        {
          path: '/',
          method: 'POST',
          description: 'Create new product',
          response: 'Created product object'
        },
        {
          path: '/bulk',
          method: 'POST',
          description: 'Create multiple products at once',
          response: 'Array of created product objects'
        },
        {
          path: '/:id',
          method: 'PUT',
          description: 'Update product',
          response: 'Updated product object'
        },
        {
          path: '/:id',
          method: 'DELETE',
          description: 'Delete product',
          response: 'Success message'
        }
      ]
    },
    inventory: {
      basePath: '/api/inventory',
      description: 'Product inventory management endpoints',
      endpoints: [
        {
          path: '/products/:id/inventory',
          method: 'PUT',
          description: 'Update product inventory (increase or decrease stock)',
          response: 'Updated product inventory'
        },
        {
          path: '/low-stock',
          method: 'GET',
          description: 'Get low stock products',
          response: 'Array of low stock product objects'
        },
        {
          path: '/products/:id/stock',
          method: 'GET',
          description: 'Check if product is in stock',
          response: 'Stock status object'
        }
      ]
    },
    search: {
      basePath: '/api/search',
      description: 'Product search endpoints',
      endpoints: [
        {
          path: '/products',
          method: 'GET',
          description: 'Search products with filters',
          response: 'Array of matching product objects'
        },
        {
          path: '/recommendations/:id',
          method: 'GET',
          description: 'Get product recommendations',
          response: 'Array of recommended product objects'
        },
        {
          path: '/trending',
          method: 'GET',
          description: 'Get trending products',
          response: 'Array of trending product objects'
        }
      ]
    },
    logistics: {
      basePath: '/api/logistics',
      description: 'Product logistics endpoints',
      endpoints: [
        {
          path: '/',
          method: 'GET',
          description: 'Get all products with logistics info',
          response: 'Array of products with logistics details'
        },
        {
          path: '/warehouse/:warehouse',
          method: 'GET',
          description: 'Get products by warehouse',
          response: 'Array of products in the specified warehouse'
        },
        {
          path: '/special-handling',
          method: 'GET',
          description: 'Get products that require special handling',
          response: 'Array of products requiring special handling'
        },
        {
          path: '/product/:productId',
          method: 'GET',
          description: 'Get logistics info for a specific product',
          response: 'Logistics information for the product'
        },
        {
          path: '/product/:productId',
          method: 'POST',
          description: 'Create logistics info for a product',
          response: 'Created logistics information'
        },
        {
          path: '/product/:productId',
          method: 'PUT',
          description: 'Update logistics info for a product',
          response: 'Updated logistics information'
        },
        {
          path: '/product/:productId',
          method: 'DELETE',
          description: 'Delete logistics info for a product',
          response: 'Success message'
        }
      ]
    },
    payments: {
      basePath: '/api/payments',
      description: 'Payment processing endpoints',
      endpoints: [
        {
          path: '/',
          method: 'GET',
          description: 'Get all payments',
          response: 'Array of payment objects'
        },
        {
          path: '/stats',
          method: 'GET',
          description: 'Get payment statistics',
          response: 'Payment statistics object'
        },
        {
          path: '/currencies',
          method: 'GET',
          description: 'Get supported currencies',
          response: 'Array of supported currency objects'
        },
        {
          path: '/user/:userId',
          method: 'GET',
          description: 'Get payments by user',
          response: 'Array of payment objects for the user'
        },
        {
          path: '/currency/:currencyCode',
          method: 'GET',
          description: 'Get payments by currency',
          response: 'Array of payment objects in the specified currency'
        },
        {
          path: '/:id',
          method: 'GET',
          description: 'Get payment by ID',
          response: 'Payment object'
        },
        {
          path: '/:id/receipt',
          method: 'GET',
          description: 'Generate receipt for a payment',
          response: 'Receipt object or file'
        },
        {
          path: '/:id/convert/:targetCurrency',
          method: 'GET',
          description: 'Get payment in a different currency',
          response: 'Payment object with converted amounts'
        },
        {
          path: '/',
          method: 'POST',
          description: 'Create a new payment',
          response: 'Created payment object'
        },
        {
          path: '/:id/status',
          method: 'PATCH',
          description: 'Update payment status',
          response: 'Updated payment object'
        },
        {
          path: '/:id/refund',
          method: 'POST',
          description: 'Process refund',
          response: 'Refund details object'
        }
      ]
    }
  }
};

module.exports = apiDocs;

// Made with Bob
