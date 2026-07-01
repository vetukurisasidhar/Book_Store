const fs = require('fs');
const path = require('path');
const envResult = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log('Dotenv error check:', envResult.error || 'No error loading .env');
console.log('CLOUDINARY_URL present in env:', !!process.env.CLOUDINARY_URL);

const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

cloudinary.config();

const Book = require('../models/Seller/BookSchema');

async function main() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/BookStore';
  console.log('Connecting to MongoDB at:', mongoUri);
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB successfully.');

  const uploadsDir = path.resolve(__dirname, '../uploads');
  console.log('Reading local uploads from:', uploadsDir);

  const books = await Book.find();
  console.log('Total books in database:', books.length);

  let migratedCount = 0;

  for (const book of books) {
    try {
      const filename = book.image;
      if (!filename) continue;

      // If already a full URL, skip
      if (String(filename).startsWith('http')) {
        console.log(`Skipping: "${book.title}" - Already migrated (URL: ${filename})`);
        continue;
      }

      const filepath = path.join(uploadsDir, filename);
      if (!fs.existsSync(filepath)) {
        console.warn(`Warning: Local file not found for "${book.title}" (${filename}) at path: ${filepath}`);
        continue;
      }

      console.log(`Uploading cover for "${book.title}" (${filename}) to Cloudinary...`);
      
      const res = await cloudinary.uploader.upload(filepath, {
        folder: 'bookstore/covers',
        use_filename: true,
        unique_filename: false,
      });

      book.image = res.secure_url;
      await book.save();
      console.log(`Successfully migrated: "${book.title}" -> ${res.secure_url}`);
      migratedCount++;
    } catch (err) {
      console.error(`Error migrating book "${book.title}" (${book._id}):`, err);
    }
  }

  await mongoose.disconnect();
  console.log(`Migration process completed. Successfully migrated ${migratedCount} covers.`);
}

main().catch(err => {
  console.error('Fatal Migration Error:', err);
  process.exit(1);
});
