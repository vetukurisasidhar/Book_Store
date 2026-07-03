import React from 'react';
import { getBookImageUrl, handleImageError } from '../utils/image';

const Book = ({ book, onEdit, onDelete }) => {
  return (
    <div className="glass-card seller-book-card animate-fade">
      <div>
        <img 
          src={getBookImageUrl(book.image)} 
          alt={book.title}
          onError={(e) => handleImageError(e, '150x220')}
        />
        <div className="seller-book-details">
          <h3>{book.title}</h3>
          <p style={{ fontStyle: 'italic' }}>By {book.author}</p>
          <p style={{ maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {book.description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
            <span>Genre: <strong>{book.genre}</strong></span>
            <span>Stock: <strong>{book.stock}</strong></span>
          </div>
        </div>
      </div>
      <div className="seller-book-meta">
        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>₹{book.price.toFixed(2)}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => onEdit(book)}>Edit</button>
          <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => onDelete(book._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Book;
