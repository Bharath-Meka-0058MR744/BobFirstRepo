/**
 * User API Module
 * Exposes user-related API endpoints
 */

const express = require('express');
const userController = require('../controllers/userController');

/**
 * Create a router for user API endpoints
 * @returns {express.Router} Express router with user endpoints
 */
function createUserRouter() {
  const router = express.Router();
  
  /**
   * @api {get} /api/users Get all users
   * @apiName GetUsers
   * @apiGroup User
   * @apiSuccess {Object[]} users List of user objects
   */
  router.get('/', userController.getUsers);
  
  /**
   * @api {get} /api/users/:id Get user by ID
   * @apiName GetUserById
   * @apiGroup User
   * @apiParam {String} id User ID
   * @apiSuccess {Object} user User object
   */
  router.get('/:id', userController.getUserById);
  
  /**
   * @api {post} /api/users Create new user
   * @apiName CreateUser
   * @apiGroup User
   * @apiParam {Object} user User object to create
   * @apiSuccess {Object} user Created user object
   */
  router.post('/', userController.createUser);
  
  /**
   * @api {put} /api/users/:id Update user
   * @apiName UpdateUser
   * @apiGroup User
   * @apiParam {String} id User ID
   * @apiParam {Object} user Updated user data
   * @apiSuccess {Object} user Updated user object
   */
  router.put('/:id', userController.updateUser);
  
  /**
   * @api {delete} /api/users/:id Delete user
   * @apiName DeleteUser
   * @apiGroup User
   * @apiParam {String} id User ID
   * @apiSuccess {Object} message Success message
   */
  router.delete('/:id', userController.deleteUser);
  
  return router;
}

module.exports = {
  createRouter: createUserRouter,
  
  /**
   * Register user API routes with an Express app
   * @param {express.Application} app - Express application
   * @param {string} [basePath='/api/users'] - Base path for user routes
   */
  registerRoutes: function(app, basePath = '/api/users') {
    app.use(basePath, createUserRouter());
  }
};

// Made with Bob
