const userController = require('../../src/controllers/userController');
const User = require('../../src/models/User');

// Mock the User model
jest.mock('../../src/models/User');

describe('User Controller', () => {
  let req, res;
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      params: { id: 'mockUserId' },
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('getUsers', () => {
    it('should get all users and return 200', async () => {
      // Mock the User.find method
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@example.com' },
        { _id: '2', name: 'User 2', email: 'user2@example.com' }
      ];
      
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });
      
      // Call the controller method
      await userController.getUsers(req, res);
      
      // Assertions
      expect(User.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });
    
    it('should handle errors and return 500', async () => {
      // Mock the User.find method to throw an error
      const errorMessage = 'Database error';
      User.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error(errorMessage))
      });
      
      // Call the controller method
      await userController.getUsers(req, res);
      
      // Assertions
      expect(User.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });
  });
  
  describe('getUserById', () => {
    it('should get a user by ID and return 200', async () => {
      // Mock the User.findById method
      const mockUser = { _id: 'mockUserId', name: 'Test User', email: 'test@example.com' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      // Call the controller method
      await userController.getUserById(req, res);
      
      // Assertions
      expect(User.findById).toHaveBeenCalledWith('mockUserId');
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
    
    it('should return 404 if user not found', async () => {
      // Mock the User.findById method to return null
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });
      
      // Call the controller method
      await userController.getUserById(req, res);
      
      // Assertions
      expect(User.findById).toHaveBeenCalledWith('mockUserId');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });
  
  describe('createUser', () => {
    it('should create a new user and return 201', async () => {
      // Mock User.findOne and user.save
      User.findOne.mockResolvedValue(null);
      
      const mockSavedUser = {
        _id: 'newUserId',
        ...req.body
      };
      
      // Mock the User constructor and save method
      User.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedUser)
      }));
      
      // Call the controller method
      await userController.createUser(req, res);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(User).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockSavedUser);
    });
    
    it('should return 400 if user already exists', async () => {
      // Mock User.findOne to return an existing user
      User.findOne.mockResolvedValue({ email: req.body.email });
      
      // Call the controller method
      await userController.createUser(req, res);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
  });
  
  // Additional tests for updateUser and deleteUser would follow a similar pattern
});

// Made with Bob
