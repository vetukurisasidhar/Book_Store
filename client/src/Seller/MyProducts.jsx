import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snavbar from './Snavbar';
import Footer from '../Components/Footer';
import Book from './Book';
import './List.css';

const MyProducts = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    author: '',
    genre: 'Fiction',
    description: '',
    price: '',
    stock: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const token = localStorage.getItem('sellerToken');
    if (!token) {
      navigate('/seller/login');
      return;
    }
    try {
      const res = await axios.get(window.BACKEND_URL + '/api/sellers/books', {
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
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    const token = localStorage.getItem('sellerToken');
    try {
      const res = await axios.delete(`${window.BACKEND_URL}/api/sellers/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(res.data.message);
      fetchBooks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed.');
    }
  };

  const startEdit = (book) => {
    setEditingBook(book);
    setEditFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      price: book.price,
      stock: book.stock
    });
    setEditImageFile(null);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e) => {
    setEditImageFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('sellerToken');
    const data = new FormData();
    data.append('title', editFormData.title);
    data.append('author', editFormData.author);
    data.append('genre', editFormData.genre);
    data.append('description', editFormData.description);
    data.append('price', editFormData.price);
    data.append('stock', editFormData.stock);
    if (editImageFile) {
      data.append('image', editImageFile);
    }

    try {
      const res = await axios.put(`${window.BACKEND_URL}/api/sellers/books/${editingBook._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage(res.data.message);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Snavbar />
      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>My Listed Products</h1>
          <button className="btn btn-accent" style={{ color: 'var(--bg-primary)' }} onClick={() => navigate('/seller/add-book')}>List New Book</button>
        </div>

        {message && (
          <div style={{ padding: '0.8rem', borderRadius: '6px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--accent)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {loading ? (
          <h3>Loading product list...</h3>
        ) : books.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't listed any books in the directory yet.</p>
            <button className="btn btn-accent" style={{ color: 'var(--bg-primary)' }} onClick={() => navigate('/seller/add-book')}>List Your First Book</button>
          </div>
        ) : (
          <div className="seller-grid">
            {books.map((book) => (
              <Book key={book._id} book={book} onEdit={startEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Modal Overlay for Edit */}
        {editingBook && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 15, 25, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
            <div className="glass-card animate-fade" style={{ width: '100%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ marginBottom: '1.2rem', color: 'var(--accent)' }}>Edit Listing</h2>
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Book Title</label>
                  <input type="text" name="title" required value={editFormData.title} onChange={handleEditChange} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Author Name</label>
                  <input type="text" name="author" required value={editFormData.author} onChange={handleEditChange} />
                </div>
                <div className="responsive-grid-3">
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Genre</label>
                    <select name="genre" value={editFormData.genre} onChange={handleEditChange}>
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
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Price (₹)</label>
                    <input type="number" step="0.01" min="0" name="price" required value={editFormData.price} onChange={handleEditChange} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Stock</label>
                    <input type="number" min="0" name="stock" required value={editFormData.stock} onChange={handleEditChange} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Description</label>
                  <textarea name="description" required rows="3" value={editFormData.description} onChange={handleEditChange}></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>Change Cover (Optional)</label>
                  <input type="file" accept="image/*" onChange={handleEditFileChange} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-accent" style={{ flexGrow: 1, color: 'var(--bg-primary)' }}>Update Listing</button>
                  <button type="button" className="btn btn-secondary" style={{ flexGrow: 1 }} onClick={() => setEditingBook(null)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MyProducts;
