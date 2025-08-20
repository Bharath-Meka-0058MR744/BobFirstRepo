import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} BobFirstWebAPP. All rights reserved.</p>
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '20px 0',
  textAlign: 'center',
  marginTop: '20px'
};

export default Footer;

// Made with Bob
