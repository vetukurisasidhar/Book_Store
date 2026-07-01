const Admin = require('../models/Admin/AdminSchema');
const Seller = require('../models/Seller/SellerSchema');
const User = require('../models/Users/UserSchema');
const Book = require('../models/Seller/BookSchema');
const Order = require('../models/Users/MyOrderSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to normalize image paths
const normalizeImagePath = (imagePath) => {
  if (!imagePath) return null;
  // Remove "Backend/uploads/" prefix if it exists
  return imagePath.replace(/^Backend\/uploads\//, '');
};

// Helper function to normalize book data
const normalizeBooks = (books) => {
  return books.map(book => ({
    ...book,
    image: normalizeImagePath(book.image)
  }));
};

// Admin Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({ name, email, password: hashedPassword });
    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, role: 'admin', name: admin.name },
      process.env.JWT_SECRET || 'mySuperSecretKeyForBookStoreApp123!',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: 'admin' }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sellers
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().select('-password');
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve seller
exports.approveSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    res.status(200).json({ message: 'Seller approved successfully', seller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Block/Unblock seller
exports.toggleBlockSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);
    if (!seller) return res.status(404).json({ message: 'Seller not found' });

    seller.isBlocked = !seller.isBlocked;
    await seller.save();

    res.status(200).json({ message: `Seller ${seller.isBlocked ? 'blocked' : 'unblocked'} successfully`, seller });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all books in bookstore
exports.getAllBooks = async (req, res) => {
  try {
    let books = await Book.find().populate('seller', 'name businessName').lean();
    
    // Normalize image paths for both old and new formats
    books = normalizeBooks(books);
    
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get system stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await Seller.countDocuments();
    const totalBooks = await Book.countDocuments();
    const orders = await Order.find({ orderStatus: 'Delivered' });
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      totalUsers,
      totalSellers,
      totalBooks,
      totalSales
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
