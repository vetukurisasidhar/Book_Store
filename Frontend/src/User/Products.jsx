import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';
import './uhome.css';

const Products = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const genres = ['All', 'Fiction', 'Non-fiction', 'Science', 'Romance', 'Children', 'Biography', 'History'];

  const fetchBooks = async () => {
    try {
      const res = await axios.get(window.BACKEND_URL + '/api/users/books');
      setBooks(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addToCart = async (bookId) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    try {
      await axios.post(window.BACKEND_URL + '/api/users/cart', { bookId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container flex-between" style={{ padding: '1rem 1.5rem' }}>
          <Link to="/user/dashboard" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>
            BookStore
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link to="/user/dashboard" style={{ color: 'var(--text-secondary)' }}>Storefront</Link>
            <Link to="/user/orders" style={{ color: 'var(--text-secondary)' }}>My Orders</Link>
            <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => navigate('/user/dashboard')}>Back to Dashboard</button>
          </div>
        </div>
      </header>

      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        {message && (
          <div style={{ position: 'fixed', top: '80px', right: '20px', backgroundColor: 'var(--success)', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px', zIndex: 1000 }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Explore Our Collection</h1>
          <div style={{ width: '100%', maxWidth: '300px' }}>
            <input 
              type="text" 
              placeholder="Search title, author..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem' }}>
          {/* Side Genres Panel */}
          <div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Categories</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {genres.map(genre => (
                <button 
                  key={genre} 
                  className={`genre-badge ${selectedGenre === genre ? 'active' : ''}`}
                  style={{ textAlign: 'left', borderRadius: '8px' }}
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Books List Grid */}
          <div>
            {loading ? (
              <h3>Loading catalog...</h3>
            ) : filteredBooks.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No books match the selected category or query.</p>
            ) : (
              <div className="book-catalog-grid">
                {filteredBooks.map(book => (
                  <div key={book._id} className="glass-card book-store-card animate-fade">
                    <div onClick={() => navigate(`/user/book/${book._id}`)}>
                      {
                        (() => {
                          const imageUrl = `${window.BACKEND_URL}/uploads/${encodeURIComponent(book.image || '')}`;
                          return (
                            <img
                              src={imageUrl}
                              alt={book.title}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150x220?text=No+Cover';
                                e.target.classList.add('img-loaded');
                              }}
                              onLoad={(e) => e.target.classList.add('img-loaded')}
                            />
                          );
                        })()
                      }
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>By {book.author}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{book.price.toFixed(2)}</span>
                      {book.stock > 0 ? (
                        <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => addToCart(book._id)}>Add</button>
                      ) : (
                        <span style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>Out of Stock</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
