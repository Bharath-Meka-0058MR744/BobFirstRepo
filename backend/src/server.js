const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const api = require('./api');
const { setupSwagger } = require('./swagger');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
// Note: This will only work when MongoDB and Node.js are installed
// connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all API routes
api.registerRoutes(app);

// Setup Swagger documentation
setupSwagger(app);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

// Made with Bob
