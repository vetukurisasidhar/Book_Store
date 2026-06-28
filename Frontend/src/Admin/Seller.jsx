import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Anavbar from './Anavbar';
import Footer from '../Components/Footer';

const Seller = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchSellers = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    try {
      const res = await axios.get(window.BACKEND_URL + '/api/admin/sellers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSellers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [navigate]);

  const handleApprove = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.put(`${window.BACKEND_URL}/api/admin/sellers/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      fetchSellers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Approval failed.');
    }
  };

  const handleBlockToggle = async (id) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.put(`${window.BACKEND_URL}/api/admin/sellers/${id}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      fetchSellers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Toggle block failed.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Anavbar />
      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 600 }}>Merchant Verification Directory</h1>
        
        {message && (
          <div style={{ padding: '0.8rem', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {loading ? (
          <h3>Loading registered sellers...</h3>
        ) : sellers.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No merchants registered on this platform.</p>
        ) : (
          <div className="glass-card" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Merchant Name</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Business Name</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Email Address</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Account Status</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{seller.name}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{seller.businessName}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{seller.email}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {seller.isBlocked ? (
                        <span style={{ color: 'var(--danger)', fontSize: '0.85rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>Blocked</span>
                      ) : seller.isApproved ? (
                        <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px' }}>Approved</span>
                      ) : (
                        <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, padding: '0.2rem 0.5rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '4px' }}>Pending Approval</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      {!seller.isApproved && (
                        <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleApprove(seller._id)}>Approve</button>
                      )}
                      <button className={seller.isBlocked ? "btn btn-secondary" : "btn btn-danger"} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleBlockToggle(seller._id)}>
                        {seller.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Seller;
