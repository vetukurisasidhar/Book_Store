require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Seller/BookSchema');
const connectDB = require('./config/connect');

const fixImagePaths = async () => {
  try {
    await connectDB();
    console.log('Connected to database...');

    // Find all books
    const books = await Book.find();
    console.log(`Found ${books.length} books`);

    let updated = 0;
    for (let book of books) {
      if (book.image && book.image.includes('Backend/uploads/')) {
        // Remove the "Backend/uploads/" prefix
        book.image = book.image.replace('Backend/uploads/', '');
        await book.save();
        updated++;
        console.log(`Fixed: ${book.title} → ${book.image}`);
      }
    }

    console.log(`\n✅ Updated ${updated} books`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixImagePaths();
