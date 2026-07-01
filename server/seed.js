const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Admin = require('./models/Admin/AdminSchema');
const Seller = require('./models/Seller/SellerSchema');
const User = require('./models/Users/UserSchema');
const Book = require('./models/Seller/BookSchema');
const Order = require('./models/Users/MyOrderSchema');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 1x1 solid-color PNG base64 values (as default fallbacks)
const MOCK_COVERS = {
  red: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  blue: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADEwDNpg930QAAAABJRU5ErkJggg==',
  green: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  amber: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z9BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  teal: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkOPD/PwAEhQGD5s61hgAAAABJRU5ErkJggg==',
  purple: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
};

// Helper to write solid color image to disk (ONLY if file does not exist)
const createMockCover = (colorName, filename) => {
  const filepath = path.join(uploadsDir, filename);
  if (fs.existsSync(filepath) && fs.statSync(filepath).size > 100) {
    console.log(`Preserving existing custom cover: ${filename}`);
    return filename;
  }
  const base64Data = MOCK_COVERS[colorName] || MOCK_COVERS.blue;
  fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));
  console.log(`Created default mock color cover: ${filename}`);
  return filename;
};

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Nutrition_Assistant');
    console.log('Connected! Cleaning old data...');

    // Clear collections
    await Admin.deleteMany({});
    await Seller.deleteMany({});
    await User.deleteMany({});
    await Book.deleteMany({});
    await Order.deleteMany({});

    console.log('Creating standard users and roles...');
    // Create Admin
    const hashedAdminPassword = await bcrypt.hash('adminpassword', 10);
    const admin = new Admin({
      name: 'System Admin',
      email: 'admin@bookstore.com',
      password: hashedAdminPassword
    });
    await admin.save();

    // Create Seller
    const hashedSellerPassword = await bcrypt.hash('sellerpassword', 10);
    const seller = new Seller({
      name: 'Classic Books LLC',
      email: 'seller@bookstore.com',
      password: hashedSellerPassword,
      businessName: 'Classic Tomes & Co.',
      isApproved: true
    });
    await seller.save();

    // Create User
    const hashedUserPassword = await bcrypt.hash('userpassword', 10);
    const user = new User({
      name: 'Jane Doe',
      email: 'user@bookstore.com',
      password: hashedUserPassword
    });
    await user.save();

    console.log('Preparing seeded book assets...');
    // Seed book details with pricing values in INR (₹)
    const booksToSeed = [
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Fiction',
        description: 'Winston Smith wrestles with oppression in Oceania, a place where the Party scrutinizes human actions with ever-watchful Big Brother.',
        price: 299.00,
        stock: 45,
        color: 'red',
        filename: '1984.jpg'
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        description: 'Set in the glamorous Roaring Twenties, a self-made millionaire searches for his lost love in this ultimate American classic.',
        price: 349.00,
        stock: 30,
        color: 'blue',
        filename: 'gatsby.jpg'
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        genre: 'Non-fiction',
        description: 'Harari spans the whole of human history, from the very first humans to walk the earth to the radical breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions.',
        price: 499.00,
        stock: 25,
        color: 'green',
        filename: 'sapiens.jpg'
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        genre: 'Science',
        description: 'A landmark volume in science writing by one of the great minds of our time, exploring the boundaries of the cosmos, black holes, and the origin of the universe.',
        price: 399.00,
        stock: 20,
        color: 'teal',
        filename: 'brief_history.jpg'
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        description: 'The romantic clash between the opinionated Elizabeth Bennet and her proud suitor, Mr. Darcy, in a classic comedy of manners.',
        price: 199.00,
        stock: 50,
        color: 'purple',
        filename: 'pride_prejudice.jpg'
      },
      {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Children',
        description: 'Harry Potter discovers on his eleventh birthday that he is a wizard, leading him to Hogwarts School of Witchcraft and Wizardry.',
        price: 599.00,
        stock: 60,
        color: 'amber',
        filename: 'harry_potter.jpg'
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        genre: 'Biography',
        description: 'Based on more than forty interviews with Jobs conducted over two years, this is the riveting story of the roller-coaster life and searingly intense personality of a creative entrepreneur.',
        price: 699.00,
        stock: 15,
        color: 'blue',
        filename: 'steve_jobs.jpg'
      },
      {
        title: 'SPQR: A History of Ancient Rome',
        author: 'Mary Beard',
        genre: 'History',
        description: 'A sweeping history of ancient Rome, telling the story of how a tiny, unremarkable city-state became the unchallenged ruler of the Mediterranean world.',
        price: 449.00,
        stock: 18,
        color: 'red',
        filename: 'spqr.jpg'
      }
    ];

    console.log('Writing assets and publishing to database...');
    for (let bookData of booksToSeed) {
      try {
        createMockCover(bookData.color, bookData.filename);
        const book = new Book({
          title: bookData.title,
          author: bookData.author,
          genre: bookData.genre,
          description: bookData.description,
          price: bookData.price,
          stock: bookData.stock,
          image: bookData.filename,
          seller: seller._id
        });
        await book.save();
        console.log(`Successfully seeded: ${bookData.title} (${bookData.genre}) at ₹${bookData.price}`);
      } catch (err) {
        console.error(`Error seeding ${bookData.title}:`, err);
      }
    }

    console.log('\n--- SEEDING COMPLETE ---');
    console.log('You can now log in using the following test credentials:');
    console.log('- User: user@bookstore.com (password: userpassword)');
    console.log('- Seller: seller@bookstore.com (password: sellerpassword)');
    console.log('- Admin: admin@bookstore.com (password: adminpassword)');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
