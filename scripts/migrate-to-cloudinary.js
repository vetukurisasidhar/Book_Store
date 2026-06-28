const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.resolve(__dirname, '../Backend/.env') });

cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });

const Book = require('../Backend/models/Seller/BookSchema');

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/BookStore');
  console.log('Connected to MongoDB');

  const uploadsDir = path.resolve(__dirname, '../Backend/uploads');

  const books = await Book.find();
  console.log('Books to process:', books.length);

  for (const book of books) {
    try {
      const filename = book.image;
      if (!filename) continue;

      // If already a full URL, skip
      if (String(filename).startsWith('http')) {
        console.log('Skipping already-URL:', filename);
        continue;
      }

      const filepath = path.join(uploadsDir, filename);
      if (!fs.existsSync(filepath)) {
        console.warn('File missing:', filepath);
        continue;
      }

      // upload
      const res = await cloudinary.uploader.upload(filepath, {
        folder: 'bookstore/covers',
        use_filename: true,
        unique_filename: false,
      });

      book.image = res.secure_url; // cloud URL
      await book.save();
      console.log(`Uploaded ${filename} -> ${res.secure_url}`);
    } catch (err) {
      console.error('Error processing book', book._id, err.message);
    }
  }

  await mongoose.disconnect();
  console.log('Done');
}

main().catch(err => { console.error(err); process.exit(1); });
