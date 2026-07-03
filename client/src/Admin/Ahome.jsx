import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Anavbar from './Anavbar';
import Footer from '../Components/Footer';

const Ahome = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalSellers: 0, totalBooks: 0, totalSales: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(window.BACKEND_URL + '/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Loading statistics...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Anavbar />
      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 600 }}>System Control Center</h1>
        
        {/* Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Customers</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalUsers}</p>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Merchants</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalSellers}</p>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--success)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Book Titles</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalBooks}</p>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--danger)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Gross Revenue</h3>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>₹{stats.totalSales.toFixed(2)}</p>
          </div>
        </div>

        {/* Shortcut Quick Links */}
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Administrative Operations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Seller Verification</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Review registered merchants, approve pending requests, or block accounts violating guidelines.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/admin/sellers')}>Verify Sellers</button>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Catalog Governance</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Browse the complete collection of listed books and remove items that violate catalog policies.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/admin/books')}>Manage Books</button>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>User Directory</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                View details of all registered users and customers who interact with the bookstore platform.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/admin/users')}>Browse Users</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ahome;
