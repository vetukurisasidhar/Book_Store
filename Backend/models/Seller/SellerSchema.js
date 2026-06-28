const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  role: { type: String, default: 'seller' }
}, { timestamps: true });

module.exports = mongoose.model('Seller', SellerSchema);
