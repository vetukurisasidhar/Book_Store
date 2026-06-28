import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <main className="container animate-fade" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, background: 'linear-gradient(135deg, #a78bfa, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
            Welcome to BookStore
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Your one-stop destination for all things books. Choose your role to explore the catalog, start listing books, or manage system activity.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          {/* User Portal Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => navigate('/user/login')} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}>📖</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Customer Portal</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Browse a wide range of books, filter by genre, check detailed descriptions, manage your cart, and place orders.
              </p>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>Enter Shop</button>
          </div>

          {/* Seller Portal Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => navigate('/seller/login')} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--accent)' }}>🤝</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Seller Portal</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                List new books, check your current inventory, modify details, check customer orders, and manage order statuses.
              </p>
            </div>
            <button className="btn btn-accent" style={{ width: '100%', color: 'var(--bg-primary)' }}>Seller Login</button>
          </div>

          {/* Admin Portal Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'pointer' }} onClick={() => navigate('/admin/login')} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--danger)' }}>⚡</div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Admin Portal</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Access dashboard logs, approve or block sellers, view all active users, and monitor overall store statistics.
              </p>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%' }}>Admin Login</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
