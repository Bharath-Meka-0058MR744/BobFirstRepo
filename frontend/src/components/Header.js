import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={headerStyle}>
      <div className="container" style={containerStyle}>
        <h1>
          <Link to="/" style={logoStyle}>BobFirstWebAPP</Link>
        </h1>
        <nav>
          <ul style={navStyle}>
            <li>
              <Link to="/" style={linkStyle}>Home</Link>
            </li>
            <li>
              <Link to="/users" style={linkStyle}>Users</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

const headerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '10px 0',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const logoStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '1.5rem'
};

const navStyle = {
  display: 'flex',
  listStyle: 'none'
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '0 15px'
};

export default Header;

// Made with Bob
