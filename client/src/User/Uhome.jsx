import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Components/Footer';
import Unavbar from '../Components/Unavbar';
import { getBookImageUrl, handleImageError } from '../utils/image';
import './uhome.css';

const Uhome = () => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
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

  const fetchCart = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;
    try {
      const res = await axios.get(window.BACKEND_URL + '/api/users/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCart();
  }, []);



  const addToCart = async (bookId) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/user/login');
      return;
    }
    try {
      const res = await axios.post(window.BACKEND_URL + '/api/users/cart', { bookId, quantity: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 1500);
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to cart.');
    }
  };

  const updateCartQty = async (bookId, newQty) => {
    const token = localStorage.getItem('userToken');
    try {
      await axios.put(window.BACKEND_URL + '/api/users/cart', { bookId, quantity: newQty }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update quantity.');
    }
  };

  const removeFromCart = async (bookId) => {
    const token = localStorage.getItem('userToken');
    try {
      await axios.delete(`${window.BACKEND_URL}/api/users/cart/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('userToken');
    try {
      await axios.post(window.BACKEND_URL + '/api/users/checkout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order placed successfully!');
      setIsCartOpen(false);
      fetchCart();
      fetchBooks(); // refresh stock numbers
      navigate('/user/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed.');
    }
  };

  // Filter books based on search query and selected genre
  const filteredBooks = books.filter(book => {
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Navbar */}
      <Unavbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => setIsCartOpen(true)} />

      {/* Main Body */}
      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        {message && (
          <div style={{ position: 'fixed', top: '80px', right: '20px', backgroundColor: 'var(--success)', color: '#fff', padding: '0.8rem 1.5rem', borderRadius: '8px', zIndex: 1000, boxShadow: 'var(--shadow-md)' }}>
            {message}
          </div>
        )}

        {/* Hero Section */}
        <div className="user-hero">
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Find Your Next Favorite Story</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
            Browse hundreds of bestsellers, biographies, fiction, and romance titles published by approved merchants.
          </p>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <input 
              type="text" 
              placeholder="Search by title, author..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.8rem 1.2rem', fontSize: '1rem' }}
            />
          </div>
        </div>

        {/* Genre Filters Scrollable */}
        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1.2rem', marginBottom: '2rem' }}>
          {genres.map(genre => (
            <button 
              key={genre} 
              className={`genre-badge ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Available Titles</h2>
        
        {loading ? (
          <h3>Loading bookshelf...</h3>
        ) : filteredBooks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No books match your criteria.</p>
        ) : (
          <div className="book-catalog-grid">
            {filteredBooks.map(book => (
              <div key={book._id} className="glass-card book-store-card animate-fade">
                <div onClick={() => navigate(`/user/book/${book._id}`)}>
                  <img 
                    src={getBookImageUrl(book.image)} 
                    alt={book.title}
                    onError={(e) => handleImageError(e, '150x220')}
                  />
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>By {book.author}</p>
                  <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--text-secondary)' }}>{book.genre}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{book.price.toFixed(2)}</span>
                  {book.stock > 0 ? (
                    <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => addToCart(book._id)}>Add to Cart</button>
                  ) : (
                    <span style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>Out of Stock</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Slide-out Drawer */}
        {isCartOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 15, 25, 0.8)', display: 'flex', justifyContent: 'flex-end', zIndex: 1000 }}>
            <div className="animate-fade" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-secondary)', height: '100%', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.3rem' }}>Your Shopping Cart</h2>
                <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem' }} onClick={() => setIsCartOpen(false)}>&times; Close</button>
              </div>

              <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {cart.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</p>
                ) : (
                  cart.map(item => (
                    <div key={item._id} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <img 
                        src={getBookImageUrl(item.book?.image)} 
                        alt={item.book?.title} 
                        style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => handleImageError(e, '150x220')}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{item.book?.title}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--success)' }}>₹{item.book?.price.toFixed(2)}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }} onClick={() => updateCartQty(item.book?._id, item.quantity - 1)}>-</button>
                          <span style={{ fontSize: '0.85rem' }}>{item.quantity}</span>
                          <button className="btn btn-secondary" style={{ padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }} onClick={() => updateCartQty(item.book?._id, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <button className="btn btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => removeFromCart(item.book?._id)}>Remove</button>
                    </div>
                  ))
                )}
              </div>

              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <span>Total Amount:</span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--success)' }}>
                    ₹{cart.reduce((sum, item) => sum + (item.book?.price || 0) * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={cart.length === 0} onClick={handleCheckout}>Checkout Order</button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Uhome;
