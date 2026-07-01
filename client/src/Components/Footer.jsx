import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', marginTop: '3rem', textAlign: 'center' }}>
      <div className="container">
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} BookStore. Built with MERN Stack (MongoDB, Express, React, Node.js).
        </p>
      </div>
    </footer>
  );
};

export default Footer;
