import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snavbar from './Snavbar';
import Footer from '../Components/Footer';

const Addbook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Fiction',
    description: '',
    price: '',
    stock: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('sellerToken');
    if (!token) {
      navigate('/seller/login');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('genre', formData.genre);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (imageFile) {
      data.append('image', imageFile);
    } else {
      setError('Please upload a cover image');
      setLoading(false);
      return;
    }

    try {
      await axios.post(window.BACKEND_URL + '/api/sellers/books', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('Book listed in catalog successfully!');
      setFormData({ title: '', author: '', genre: 'Fiction', description: '', price: '', stock: '' });
      setImageFile(null);
      document.getElementById('imageInput').value = '';
      setLoading(false);
      setTimeout(() => navigate('/seller/products'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book.');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Snavbar />
      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '600px' }}>
          <h2 style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600 }}>
            List a New Book
          </h2>
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
          {success && <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Book Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g., The Hobbit" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Author Name</label>
                <input type="text" name="author" required value={formData.author} onChange={handleChange} placeholder="e.g., J.R.R. Tolkien" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Genre</label>
                <select name="genre" value={formData.genre} onChange={handleChange}>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-fiction">Non-fiction</option>
                  <option value="Science">Science</option>
                  <option value="Romance">Romance</option>
                  <option value="Children">Children</option>
                  <option value="Biography">Biography</option>
                  <option value="History">History</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Price (₹)</label>
                <input type="number" step="0.01" min="0" name="price" required value={formData.price} onChange={handleChange} placeholder="9.99" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Stock Quantity</label>
                <input type="number" min="0" name="stock" required value={formData.stock} onChange={handleChange} placeholder="50" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Book Description</label>
              <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} placeholder="Write a summary of the book plot, themes, or contents..."></textarea>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Cover Image File</label>
              <input id="imageInput" type="file" accept="image/*" required onChange={handleFileChange} style={{ padding: '0.5rem 0' }} />
            </div>

            <button type="submit" className="btn btn-accent" style={{ marginTop: '0.5rem', color: 'var(--bg-primary)' }} disabled={loading}>
              {loading ? 'Publishing...' : 'List Book'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Addbook;
