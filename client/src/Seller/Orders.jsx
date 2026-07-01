import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snavbar from './Snavbar';
import Footer from '../Components/Footer';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem('sellerToken');
    if (!token) {
      navigate('/seller/login');
      return;
    }
    try {
      const res = await axios.get(window.BACKEND_URL + '/api/sellers/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('sellerToken');
    try {
      const res = await axios.put(`${window.BACKEND_URL}/api/sellers/orders/${orderId}`, 
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      fetchOrders();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Status update failed.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Snavbar />
      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 600 }}>Fulfillment Register</h1>
        
        {message && (
          <div style={{ padding: '0.8rem', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {loading ? (
          <h3>Loading orders...</h3>
        ) : orders.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You haven't received any orders for your books yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order._id} className="glass-card animate-fade" style={{ borderLeft: '4px solid var(--accent)' }}>
                <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID:</span>{' '}
                    <strong style={{ fontSize: '0.9rem' }}>{order._id}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Customer:</span>{' '}
                    <strong style={{ fontSize: '0.9rem' }}>{order.user?.name} ({order.user?.email})</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Fulfillment:</span>
                    <select 
                      value={order.orderStatus} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', width: 'auto' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.books.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <img 
                        src={`${window.BACKEND_URL}/uploads/${item.book?.image}`} 
                        alt={item.book?.title} 
                        style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150x220?text=No+Cover' }}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{item.book?.title || 'Unknown Book'}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Qty: <strong>{item.quantity}</strong> &times; ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <span>
                    Total Merchant Share: <strong style={{ color: 'var(--success)', fontSize: '1.1rem' }}>
                      ₹{order.books.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </strong>
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

export default Orders;
