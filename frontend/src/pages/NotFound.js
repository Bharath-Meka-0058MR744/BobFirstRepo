import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found" style={notFoundStyle}>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn">
        Go Home
      </Link>
    </div>
  );
};

const notFoundStyle = {
  textAlign: 'center',
  padding: '50px 0'
};

export default NotFound;

// Made with Bob
