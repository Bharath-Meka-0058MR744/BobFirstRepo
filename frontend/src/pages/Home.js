import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="card">
        <h1>Welcome to BobFirstWebAPP</h1>
        <p>This is a full-stack web application built with React and Node.js/Express.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/users" className="btn">
            View Users
          </Link>
        </div>
      </div>
      
      <div className="card">
        <h2>Features</h2>
        <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
          <li>React frontend with React Router</li>
          <li>Express backend with RESTful API</li>
          <li>MongoDB database integration</li>
          <li>User management system</li>
          <li>Responsive design</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;

// Made with Bob
