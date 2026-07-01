const User = require('../models/Users/UserSchema');
const Book = require('../models/Seller/BookSchema');
const Seller = require('../models/Seller/SellerSchema');
const Order = require('../models/Users/MyOrderSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to normalize image paths for both old and new formats
const normalizeImage = (imagePath) => {
  if (!imagePath) return null;
  // Remove "Backend/uploads/" prefix if it exists (old format)
  return imagePath.replace(/^Backend\/uploads\//, '');
};

// User Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: 'user', name: user.name },
      process.env.JWT_SECRET || 'mySuperSecretKeyForBookStoreApp123!',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'user' }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Browse books (only from approved and non-blocked sellers)
exports.getBooks = async (req, res) => {
  try {
    // Find active sellers (approved and not blocked)
    const activeSellers = await Seller.find({ isApproved: true, isBlocked: false }).select('_id');
    const activeSellerIds = activeSellers.map(s => s._id);

    // Find books belonging to active sellers
    let books = await Book.find({ seller: { $in: activeSellerIds } }).populate('seller', 'name businessName').lean();
    
    // Normalize images for both old and new formats
    books = books.map(book => ({
      ...book,
      image: normalizeImage(book.image)
    }));
    
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single book detail
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    let book = await Book.findById(id).populate('seller', 'name businessName').lean();
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    // Normalize image for both old and new formats
    book.image = normalizeImage(book.image);
    
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.book', 'title author price stock image');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add item to Cart
exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check stock
    const qty = quantity ? parseInt(quantity) : 1;
    if (book.stock < qty) {
      return res.status(400).json({ message: 'Insufficient stock available' });
    }

    const cartItemIndex = user.cart.findIndex(item => item.book.toString() === bookId);
    if (cartItemIndex > -1) {
      // Check total combined stock
      const totalQty = user.cart[cartItemIndex].quantity + qty;
      if (book.stock < totalQty) {
        return res.status(400).json({ message: 'Insufficient stock available for this quantity' });
      }
      user.cart[cartItemIndex].quantity = totalQty;
    } else {
      user.cart.push({ book: bookId, quantity: qty });
    }

    await user.save();
    await user.populate('cart.book', 'title author price stock image');
    res.status(200).json({ message: 'Added to cart successfully', cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Cart item quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const qty = parseInt(quantity);
    if (qty <= 0) {
      user.cart = user.cart.filter(item => item.book.toString() !== bookId);
    } else {
      if (book.stock < qty) {
        return res.status(400).json({ message: 'Insufficient stock available' });
      }
      const cartItemIndex = user.cart.findIndex(item => item.book.toString() === bookId);
      if (cartItemIndex > -1) {
        user.cart[cartItemIndex].quantity = qty;
      }
    }

    await user.save();
    await user.populate('cart.book', 'title author price stock image');
    res.status(200).json({ message: 'Cart updated successfully', cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = user.cart.filter(item => item.book.toString() !== bookId);
    await user.save();
    await user.populate('cart.book', 'title author price stock image');
    res.status(200).json({ message: 'Removed from cart successfully', cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Checkout & Create Order
exports.checkout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.book');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Verify stock and prepare order items
    const orderBooks = [];
    let totalAmount = 0;

    for (let cartItem of user.cart) {
      const book = cartItem.book;
      if (!book) {
        return res.status(400).json({ message: 'One of the books in your cart is no longer available.' });
      }
      if (book.stock < cartItem.quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${book.title}". Available: ${book.stock}` });
      }
      orderBooks.push({
        book: book._id,
        quantity: cartItem.quantity,
        price: book.price
      });
      totalAmount += book.price * cartItem.quantity;
    }

    // Deduct stock
    for (let cartItem of user.cart) {
      cartItem.book.stock -= cartItem.quantity;
      await cartItem.book.save();
    }

    // Create Order
    const order = new Order({
      user: user._id,
      books: orderBooks,
      totalAmount,
      paymentStatus: 'Completed' // Mock payment completion for demo
    });
    await order.save();

    // Clear user cart
    user.cart = [];
    await user.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User's Order History
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('books.book', 'title author price image');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
