import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';

const Uitem = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${window.BACKEND_URL}/api/users/books/${id}`);
        setBook(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    if (quantity > book.stock) {
      alert('Insufficient stock quantity available.');
      return;
    }

    try {
      await axios.post(window.BACKEND_URL + '/api/users/cart', { bookId: book._id, quantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Items added to cart successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Loading details...</h2>
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <main className="container" style={{ flexGrow: 1, padding: '2rem 1.5rem', textAlign: 'center' }}>
          <h2>Book not found or no longer available.</h2>
          <Link to="/user/dashboard" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return Storefront</Link>
        </main>
        <Footer />
      </div>
    );
  }

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

      <main className="container animate-fade" style={{ flexGrow: 1, padding: '3rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {message && (
          <div style={{ position: 'fixed', top: '80px', right: '20px', backgroundColor: 'var(--success)', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px', zIndex: 1000 }}>
            {message}
          </div>
        )}

        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', width: '100%', maxWidth: '850px' }}>
          {/* Cover image container */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img 
              src={`${window.BACKEND_URL}/uploads/${book.image}`} 
              alt={book.title} 
              style={{ width: '100%', maxWidth: '280px', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', backgroundColor: 'var(--bg-tertiary)' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/280x400?text=No+Cover' }}
            />
          </div>

          {/* Details container */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>{book.genre}</span>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>{book.title}</h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1rem' }}>By {book.author}</p>
              
              <div style={{ display: 'flex', gap: '1.5rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '0.75rem 0', margin: '1rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Seller: <strong style={{ color: 'var(--text-primary)' }}>{book.seller?.businessName || 'Unknown'}</strong></span>
                <span>Status: {book.stock > 0 ? (
                  <strong style={{ color: 'var(--success)' }}>In Stock ({book.stock} available)</strong>
                ) : (
                  <strong style={{ color: 'var(--danger)' }}>Out of Stock</strong>
                )}</span>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>{book.description}</p>
            </div>

            <div>
              <div className="flex-between" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Price per unit</span>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>₹{book.price.toFixed(2)}</span>
              </div>

              {book.stock > 0 ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '130px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Qty:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max={book.stock} 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(1, Math.min(book.stock, parseInt(e.target.value) || 1)))} 
                      style={{ padding: '0.5rem' }}
                    />
                  </div>
                  <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={handleAddToCart}>Add to Cart</button>
                </div>
              ) : (
                <button className="btn btn-secondary" style={{ width: '100%' }} disabled>Out of Stock</button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Uitem;
