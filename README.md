# BobFirstRepo

A full-stack web application built with React.js for the frontend and Node.js/Express for the backend.

## Project Structure

```
BobFirstWebAPP/
├── backend/                 # Backend code
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── server.js        # Express server setup
│   ├── .env                 # Environment variables
│   └── package.json         # Backend dependencies
│
└── frontend/                # Frontend code
    ├── public/              # Static files
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   ├── styles/          # CSS styles
    │   ├── App.js           # Main App component
    │   └── index.js         # Entry point
    └── package.json         # Frontend dependencies
```

## Prerequisites

- Node.js and npm (Node Package Manager)
- MongoDB (for database)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd BobFirstWebAPP
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

## Configuration

1. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/bobfirstwebapp
   ```

## Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```
   cd ../frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Testing

1. Run backend tests:
   ```
   cd backend
   npm test
   ```

2. Run frontend tests:
   ```
   cd frontend
   npm test
   ```

## Features

- User management system
- RESTful API
- Responsive design
- MongoDB database integration

## API Endpoints

- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- POST /api/users - Create a new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

## License

This project is licensed under the MIT License.
