const Seller = require('../models/Seller/SellerSchema');
const Book = require('../models/Seller/BookSchema');
const Order = require('../models/Users/MyOrderSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Seller Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, businessName } = req.body;
    let seller = await Seller.findOne({ email });
    if (seller) return res.status(400).json({ message: 'Seller already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    seller = new Seller({ name, email, password: hashedPassword, businessName });
    await seller.save();

    res.status(201).json({ message: 'Seller registration submitted for admin approval.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Seller Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ message: 'Invalid credentials' });

    if (!seller.isApproved) {
      return res.status(403).json({ message: 'Your account is pending approval by the admin.' });
    }
    if (seller.isBlocked) {
      return res.status(403).json({ message: 'Your account is blocked by the admin.' });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: seller._id, role: 'seller', name: seller.name },
      process.env.JWT_SECRET || 'mySuperSecretKeyForBookStoreApp123!',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      seller: { id: seller._id, name: seller.name, email: seller.email, businessName: seller.businessName, role: 'seller' }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Book
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description, price, stock } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'Book cover image is required' });
    }

    // Store only filename, not full path
    const imageValue = req.file.filename;
    const book = new Book({
      title,
      author,
      genre,
      description,
      price,
      stock,
      image: imageValue,
      seller: req.user.id
    });
    await book.save();

    res.status(201).json({ message: 'Book added successfully', book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Seller's listed books
exports.getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user.id }).lean();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, description, price, stock } = req.body;
    const book = await Book.findOne({ _id: id, seller: req.user.id });
    if (!book) return res.status(404).json({ message: 'Book not found or unauthorized' });

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.description = description || book.description;
    book.price = price !== undefined ? price : book.price;
    book.stock = stock !== undefined ? stock : book.stock;

    if (req.file) {
      book.image = req.file.filename;
    }

    await book.save();
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOneAndDelete({ _id: id, seller: req.user.id });
    if (!book) return res.status(404).json({ message: 'Book not found or unauthorized' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get orders containing seller's books
exports.getMyOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;
    // Find books owned by the seller
    const sellerBooks = await Book.find({ seller: sellerId }).select('_id');
    const sellerBookIds = sellerBooks.map(b => b._id.toString());

    // Find orders containing any of those books
    const orders = await Order.find({ 'books.book': { $in: sellerBookIds } })
      .populate('user', 'name email')
      .populate('books.book', 'title author price image');

    // Filter books inside the orders that belong to this seller only
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.books = orderObj.books.filter(item => item.book && sellerBookIds.includes(item.book._id.toString()));
      return orderObj;
    });

    res.status(200).json(filteredOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Seller Stats
exports.getStats = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const sellerBooks = await Book.find({ seller: sellerId }).select('_id');
    const sellerBookIds = sellerBooks.map(b => b._id.toString());

    const totalListedBooks = sellerBooks.length;

    const orders = await Order.find({ 'books.book': { $in: sellerBookIds }, orderStatus: 'Delivered' });
    let totalSales = 0;
    let totalItemsSold = 0;

    orders.forEach(order => {
      order.books.forEach(item => {
        if (sellerBookIds.includes(item.book.toString())) {
          totalSales += item.price * item.quantity;
          totalItemsSold += item.quantity;
        }
      });
    });

    res.status(200).json({
      totalListedBooks,
      totalSales,
      totalItemsSold
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
