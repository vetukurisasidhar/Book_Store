import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Slogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(window.BACKEND_URL + '/api/sellers/login', formData);
      localStorage.setItem('sellerToken', res.data.token);
      localStorage.setItem('sellerName', res.data.seller.name);
      localStorage.setItem('sellerBusiness', res.data.seller.businessName);
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1.5rem' }}>
      <div className="glass-card animate-fade" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600 }}>
          Seller Login
        </h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '0.5rem', color: 'var(--bg-primary)' }}>Log In</button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          New Seller? <Link to="/seller/signup" style={{ color: 'var(--accent)', fontWeight: 500 }}>Apply for onboarding</Link>
        </p>
      </div>
    </div>
  );
};

export default Slogin;
