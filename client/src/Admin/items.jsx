import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Anavbar from './Anavbar';
import Footer from '../Components/Footer';
import { getBookImageUrl, handleImageError } from '../utils/image';

const Items = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    try {
      const res = await axios.get(window.BACKEND_URL + '/api/admin/books', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooks(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this book from the catalog?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.delete(`${window.BACKEND_URL}/api/admin/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      fetchBooks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Anavbar />
      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 600 }}>Catalog Governance Panel</h1>

        {message && (
          <div style={{ padding: '0.8rem', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {loading ? (
          <h3>Loading platform catalog...</h3>
        ) : books.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No books are currently listed on the platform.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {books.map((book) => (
              <div key={book._id} className="glass-card animate-fade" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img 
                  src={getBookImageUrl(book.image)} 
                  alt={book.title} 
                  style={{ width: '70px', height: '100px', objectFit: 'cover', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)' }}
                  onError={(e) => handleImageError(e, '150x220')}
                />
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{book.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>By {book.author}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent)', marginBottom: '0.4rem' }}>Seller: {book.seller?.businessName || 'Unknown'}</p>
                  </div>
                  <div className="flex-between">
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>₹{book.price.toFixed(2)}</span>
                    <button className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleDelete(book._id)}>Delete</button>
                  </div>
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

export default Items;
