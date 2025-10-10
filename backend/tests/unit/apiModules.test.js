/**
 * API Modules Test
 * Tests the API modules to ensure they are properly exposed
 */

const api = require('../../src/api');
const express = require('express');

describe('API Modules', () => {
  test('API object should have all required modules', () => {
    expect(api).toHaveProperty('docs');
    expect(api).toHaveProperty('users');
    expect(api).toHaveProperty('products');
    expect(api).toHaveProperty('inventory');
    expect(api).toHaveProperty('search');
    expect(api).toHaveProperty('logistics');
    expect(api).toHaveProperty('payments');
    expect(api).toHaveProperty('registerRoutes');
  });

  test('Each module should have a createRouter function', () => {
    expect(typeof api.users.createRouter).toBe('function');
    expect(typeof api.products.createRouter).toBe('function');
    expect(typeof api.inventory.createRouter).toBe('function');
    expect(typeof api.search.createRouter).toBe('function');
    expect(typeof api.logistics.createRouter).toBe('function');
    expect(typeof api.payments.createRouter).toBe('function');
  });

  test('Each module should have a registerRoutes function', () => {
    expect(typeof api.users.registerRoutes).toBe('function');
    expect(typeof api.products.registerRoutes).toBe('function');
    expect(typeof api.inventory.registerRoutes).toBe('function');
    expect(typeof api.search.registerRoutes).toBe('function');
    expect(typeof api.logistics.registerRoutes).toBe('function');
    expect(typeof api.payments.registerRoutes).toBe('function');
  });

  test('API registerRoutes should register all module routes', () => {
    // Create a mock Express app
    const app = {
      use: jest.fn(),
      get: jest.fn()
    };

    // Mock each module's registerRoutes function
    api.users.registerRoutes = jest.fn();
    api.products.registerRoutes = jest.fn();
    api.inventory.registerRoutes = jest.fn();
    api.search.registerRoutes = jest.fn();
    api.logistics.registerRoutes = jest.fn();
    api.payments.registerRoutes = jest.fn();

    // Call the API's registerRoutes function
    api.registerRoutes(app);

    // Verify that each module's registerRoutes function was called
    expect(api.users.registerRoutes).toHaveBeenCalledWith(app, '/api/users');
    expect(api.products.registerRoutes).toHaveBeenCalledWith(app, '/api/products');
    expect(api.inventory.registerRoutes).toHaveBeenCalledWith(app, '/api/inventory');
    expect(api.search.registerRoutes).toHaveBeenCalledWith(app, '/api/search');
    expect(api.logistics.registerRoutes).toHaveBeenCalledWith(app, '/api/logistics');
    expect(api.payments.registerRoutes).toHaveBeenCalledWith(app, '/api/payments');

    // Verify that the API documentation and root endpoints were registered
    expect(app.get).toHaveBeenCalledTimes(2);
  });

  test('API docs should contain information for all modules', () => {
    expect(api.docs).toHaveProperty('info');
    expect(api.docs).toHaveProperty('modules');
    
    expect(api.docs.modules).toHaveProperty('users');
    expect(api.docs.modules).toHaveProperty('products');
    expect(api.docs.modules).toHaveProperty('inventory');
    expect(api.docs.modules).toHaveProperty('search');
    expect(api.docs.modules).toHaveProperty('logistics');
    expect(api.docs.modules).toHaveProperty('payments');
  });
});

// Made with Bob
