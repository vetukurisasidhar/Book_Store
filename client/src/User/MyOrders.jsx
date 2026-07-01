import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';
import OrderItem from './OrderItem';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/user/login');
        return;
      }
      try {
        const res = await axios.get(window.BACKEND_URL + '/api/users/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Sort orders by newest first
        setOrders(res.data.reverse());
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'var(--accent)';
      case 'Shipped': return 'var(--primary)';
      case 'Delivered': return 'var(--success)';
      case 'Cancelled': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container flex-between" style={{ padding: '1rem 1.5rem' }}>
          <Link to="/user/dashboard" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
            BookStore
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/user/dashboard" style={{ color: 'var(--text-secondary)' }}>Storefront</Link>
            <Link to="/user/products" style={{ color: 'var(--text-secondary)' }}>Catalog</Link>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/user/dashboard')}>Storefront</button>
          </div>
        </div>
      </header>

      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2.5rem 1.5rem', maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 600 }}>My Purchase Registry</h1>

        {loading ? (
          <h3>Loading your order history...</h3>
        ) : orders.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
            <button className="btn btn-primary" onClick={() => navigate('/user/dashboard')}>Start Shopping</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order._id} className="glass-card" style={{ borderLeft: `4px solid ${getStatusColor(order.orderStatus)}` }}>
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Placed:</span>{' '}
                    <strong style={{ fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>{' '}
                    <strong style={{ fontSize: '0.9rem', color: getStatusColor(order.orderStatus) }}>{order.orderStatus}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Payment:</span>{' '}
                    <strong style={{ fontSize: '0.9rem', color: 'var(--success)' }}>{order.paymentStatus}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {order.books.map((item, idx) => (
                    <OrderItem key={idx} item={item} />
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID: {order._id}</span>
                  <span style={{ fontSize: '1rem' }}>
                    Total Order Price: <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>₹{order.totalAmount.toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;
