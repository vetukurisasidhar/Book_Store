const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const MyOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  books: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Completed'] },
  orderStatus: { type: String, default: 'Processing', enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', MyOrderSchema);
