import React from 'react';

const OrderItem = ({ item }) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
      <img 
        src={`${window.BACKEND_URL}/uploads/${item.book?.image}`} 
        alt={item.book?.title} 
        style={{ width: '35px', height: '50px', objectFit: 'cover', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)' }}
        onError={(e) => { e.target.src = 'https://via.placeholder.com/150x220?text=No+Cover' }}
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
