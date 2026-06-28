import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Snavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const business = localStorage.getItem('sellerBusiness') || 'Merchant';

  const handleLogout = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerName');
    localStorage.removeItem('sellerBusiness');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? { borderBottom: '2px solid var(--accent)', color: '#fff' } : {};
  };

  return (
    <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex-between" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/seller/dashboard" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.5px' }}>
            BookStore <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', backgroundColor: '#f59e0b', color: '#0b0f19', borderRadius: '4px', marginLeft: '0.4rem', verticalAlign: 'middle', fontWeight: 600 }}>Seller</span>
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            <Link to="/seller/dashboard" style={{ padding: '0.3rem 0', ...isActive('/seller/dashboard') }}>Dashboard</Link>
            <Link to="/seller/products" style={{ padding: '0.3rem 0', ...isActive('/seller/products') }}>My Products</Link>
            <Link to="/seller/add-book" style={{ padding: '0.3rem 0', ...isActive('/seller/add-book') }}>Add Book</Link>
            <Link to="/seller/orders" style={{ padding: '0.3rem 0', ...isActive('/seller/orders') }}>Orders</Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Store: <strong>{business}</strong></span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Log Out</button>
        </div>
      </div>
    </header>
  );
};

export default Snavbar;
