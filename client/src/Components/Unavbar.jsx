import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

/**
 * Shared Customer/User Navigation Bar.
 * 
 * @param {object} props
 * @param {number} props.cartCount Optional current count of items in the cart
 * @param {function} props.onCartClick Optional handler to trigger when cart button is clicked
 */
const Unavbar = ({ cartCount, onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName') || 'Reader';
  const token = localStorage.getItem('userToken');

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? { borderBottom: '2px solid var(--primary)', color: '#fff' } : {};
  };

  return (
    <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container nav-container" style={{ padding: '1rem 1.5rem' }}>
        <Link to="/user/dashboard" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px' }}>
          BookStore
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/user/dashboard" style={{ padding: '0.3rem 0', color: 'var(--text-secondary)', fontWeight: 500, ...isActive('/user/dashboard') }}>Storefront</Link>
          <Link to="/user/products" style={{ padding: '0.3rem 0', color: 'var(--text-secondary)', fontWeight: 500, ...isActive('/user/products') }}>Browse All</Link>
          {token && (
            <Link to="/user/orders" style={{ padding: '0.3rem 0', color: 'var(--text-secondary)', fontWeight: 500, ...isActive('/user/orders') }}>My Orders</Link>
          )}
          
          {token && onCartClick && (
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', position: 'relative' }} onClick={onCartClick}>
              🛒 Cart
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: 'var(--accent)', color: '#000', borderRadius: '50%', padding: '0.1rem 0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {token ? (
            <>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hello, <strong>{userName}</strong></span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Log Out</button>
            </>
          ) : (
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => navigate('/user/login')}>Log In</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Unavbar;
