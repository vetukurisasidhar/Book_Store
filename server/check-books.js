require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Seller/BookSchema');
const connectDB = require('./config/connect');

const checkBooks = async () => {
  try {
    await connectDB();
    console.log('Connected to database...\n');

    const books = await Book.find().limit(5).lean();
    
    if (books.length === 0) {
      console.log('No books found in database');
      process.exit(0);
    }

    console.log(`Found ${books.length} books:\n`);
    books.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title}`);
      console.log(`   Image: ${book.image}`);
      console.log(`   Seller: ${book.seller}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkBooks();
