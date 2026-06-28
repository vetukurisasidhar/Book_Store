import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Anavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = localStorage.getItem('adminName') || 'Admin';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? { borderBottom: '2px solid var(--danger)', color: '#fff' } : {};
  };

  return (
    <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex-between" style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/admin/dashboard" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--danger)', letterSpacing: '0.5px' }}>
            BookStore <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', backgroundColor: '#dc2626', color: '#fff', borderRadius: '4px', marginLeft: '0.4rem', verticalAlign: 'middle' }}>Admin</span>
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            <Link to="/admin/dashboard" style={{ padding: '0.3rem 0', ...isActive('/admin/dashboard') }}>Dashboard</Link>
            <Link to="/admin/sellers" style={{ padding: '0.3rem 0', ...isActive('/admin/sellers') }}>Sellers</Link>
            <Link to="/admin/users" style={{ padding: '0.3rem 0', ...isActive('/admin/users') }}>Users</Link>
            <Link to="/admin/books" style={{ padding: '0.3rem 0', ...isActive('/admin/books') }}>Books</Link>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Welcome, <strong>{name}</strong></span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Log Out</button>
        </div>
      </div>
    </header>
  );
};

export default Anavbar;
