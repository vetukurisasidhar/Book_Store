import React from 'react';
import { getBookImageUrl, handleImageError } from '../utils/image';

const OrderItem = ({ item }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
      <img 
        src={getBookImageUrl(item.book?.image)} 
        alt={item.book?.title} 
        style={{ width: '35px', height: '50px', objectFit: 'cover', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }}
        onError={(e) => handleImageError(e, '150x220')}
      />
      <div style={{ flexGrow: 1 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.book?.title || 'Removed Book'}</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Qty: <strong>{item.quantity}</strong> &times; ₹{item.price.toFixed(2)}
        </span>
      </div>
      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
        ₹{(item.price * item.quantity).toFixed(2)}
      </span>
    </div>
  );
};

export default OrderItem;
