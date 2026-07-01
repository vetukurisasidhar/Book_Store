import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Ssignup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', businessName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.post(window.BACKEND_URL + '/api/sellers/signup', formData);
      setSuccess(res.data.message + ' Redirecting to login...');
      setTimeout(() => navigate('/seller/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1.5rem' }}>
      <div className="glass-card animate-fade" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600 }}>
          Seller Onboarding
        </h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Business Name</label>
            <input type="text" name="businessName" required value={formData.businessName} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '0.5rem', color: 'var(--bg-primary)' }}>Register</button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Already have a seller account? <Link to="/seller/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Ssignup;
