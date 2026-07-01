import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snavbar from './Snavbar';
import Footer from '../Components/Footer';

const Shome = () => {
  const [stats, setStats] = useState({ totalListedBooks: 0, totalSales: 0, totalItemsSold: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sellerToken');
    if (!token) {
      navigate('/seller/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(window.BACKEND_URL + '/api/sellers/stats', {
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
        <h2>Loading seller insights...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Snavbar />
      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: 600 }}>Merchant Overview</h1>
        
        {/* Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Catalog Titles</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 700 }}>{stats.totalListedBooks}</p>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--success)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Books Ordered</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 700 }}>{stats.totalItemsSold}</p>
          </div>
          <div className="glass-card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Total Earnings</h3>
            <p style={{ fontSize: '2.2rem', fontWeight: 700 }}>₹{stats.totalSales.toFixed(2)}</p>
          </div>
        </div>

        {/* Quick Operations Links */}
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Catalog & Sales Operations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Publish New Listings</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Add new titles to the BookStore directory. Upload cover images, set prices, and configure initial inventory stock.
              </p>
            </div>
            <button className="btn btn-accent" style={{ width: '100%', color: 'var(--bg-primary)' }} onClick={() => navigate('/seller/add-book')}>List New Book</button>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Inventory Controls</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Edit existing titles, adjust current stock levels, update pricing, or permanently remove titles from circulation.
              </p>
            </div>
            <button className="btn btn-accent" style={{ width: '100%', color: 'var(--bg-primary)' }} onClick={() => navigate('/seller/products')}>Update Catalog</button>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Fulfillment Panel</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Browse incoming client orders containing your books and update shipping or processing state details.
              </p>
            </div>
            <button className="btn btn-accent" style={{ width: '100%', color: 'var(--bg-primary)' }} onClick={() => navigate('/seller/orders')}>Manage Orders</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shome;
