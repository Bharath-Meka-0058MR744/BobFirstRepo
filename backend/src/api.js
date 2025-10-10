/**
 * API Module Exports
 * This file exports all API modules for easy access
 */

const express = require('express');
const userApi = require('./api/userApi');
const productApi = require('./api/productApi');
const inventoryApi = require('./api/inventoryApi');
const searchApi = require('./api/searchApi');
const logisticsApi = require('./api/logisticsApi');
const paymentApi = require('./api/paymentApi');
const apiDocs = require('./apiDocs');

/**
 * API Module object containing all API modules
 */
const api = {
  /**
   * Documentation for all API endpoints
   */
  docs: apiDocs,
  
  /**
   * User module - handles user management
   */
  users: userApi,
  
  /**
   * Product module - handles product management
   */
  products: productApi,
  
  /**
   * Inventory module - handles product inventory management
   */
  inventory: inventoryApi,
  
  /**
   * Search module - handles product search functionality
   */
  search: searchApi,
  
  /**
   * Logistics module - handles product logistics
   */
  logistics: logisticsApi,
  
  /**
   * Payment module - handles payment processing
   */
  payments: paymentApi,
  
  /**
   * Register all API routes with an Express app
   * @param {express.Application} app - Express application
   * @param {string} [basePath='/api'] - Base path for all API routes
   */
  registerRoutes: function(app, basePath = '/api') {
    // Register all module routes
    this.users.registerRoutes(app, `${basePath}/users`);
    this.products.registerRoutes(app, `${basePath}/products`);
    this.inventory.registerRoutes(app, `${basePath}/inventory`);
    this.search.registerRoutes(app, `${basePath}/search`);
    this.logistics.registerRoutes(app, `${basePath}/logistics`);
    this.payments.registerRoutes(app, `${basePath}/payments`);
    
    // API documentation endpoint
    app.get(`${basePath}/docs`, (req, res) => {
      res.json(this.docs);
    });
    
    // API root endpoint
    app.get(basePath, (req, res) => {
      res.json({
        message: 'Welcome to BobFirstWebAPP API',
        version: this.docs.info.version,
        modules: Object.keys(this.docs.modules).map(key => ({
          name: key,
          basePath: this.docs.modules[key].basePath,
          description: this.docs.modules[key].description
        }))
      });
    });
  }
};

module.exports = api;

// Made with Bob
