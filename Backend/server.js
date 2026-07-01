const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/connect');
const adminRoutes = require('./routes/adminRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded book cover images static folder
// Redirect requests for remote URLs (e.g. Cloudinary) hosted via local path prefix
app.use('/uploads', (req, res, next) => {
  const target = req.url.slice(1); // remove leading slash
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return res.redirect(target);
  }
  const decodedTarget = decodeURIComponent(target);
  if (decodedTarget.startsWith('http://') || decodedTarget.startsWith('https://')) {
    return res.redirect(decodedTarget);
  }
  next();
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/users', userRoutes);

// Basic Route for verification
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the BookStore API server!' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
