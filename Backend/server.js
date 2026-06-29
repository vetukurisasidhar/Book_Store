const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/connect');
const adminRoutes = require('./routes/adminRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Debug helpers: log presence of key env vars and catch uncaught errors
console.log('Starting BookStore API server - debug info');
console.log('MONGO_URI present?', !!process.env.MONGO_URI);
console.log('CLOUDINARY_URL present?', !!process.env.CLOUDINARY_URL);
console.log('PORT (env):', process.env.PORT || 'undefined');

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded book cover images static folder
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
