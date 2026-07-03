const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin/AdminSchema');
const Seller = require('./models/Seller/SellerSchema');
const User = require('./models/Users/UserSchema');
const Book = require('./models/Seller/BookSchema');
const Order = require('./models/Users/MyOrderSchema');

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/BookStore');
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

    console.log('Preparing seeded book assets with Cloudinary URLs...');
    // Seed book details with pricing values in INR (₹) and direct Cloudinary cover URLs
    const booksToSeed = [
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Fiction',
        description: 'Winston Smith wrestles with oppression in Oceania, a place where the Party scrutinizes human actions with ever-watchful Big Brother.',
        price: 299.00,
        stock: 45,
        image: 'https://res.cloudinary.com/dcr9gkj8f/image/upload/v1782922926/bookstore/covers/1984.jpg'
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        description: 'Set in the glamorous Roaring Twenties, a self-made millionaire searches for his lost love in this ultimate American classic.',
        price: 349.00,
        stock: 30,
        image: 'https://res.cloudinary.com/dcr9gkj8f/image/upload/v1782922928/bookstore/covers/gatsby.jpg'
      },
      {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        genre: 'Non-fiction',
        description: 'Harari spans the whole of human history, from the very first humans to walk the earth to the radical breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions.',
        price: 499.00,
        stock: 25,
        image: 'https://res.cloudinary.com/dcr9gkj8f/image/upload/v1782922930/bookstore/covers/sapiens.jpg'
      },
      {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        genre: 'Science',
        description: 'A landmark volume in science writing by one of the great minds of our time, exploring the boundaries of the cosmos, black holes, and the origin of the universe.',
        price: 399.00,
        stock: 20,
        image: 'https://res.cloudinary.com/dcr9gkj8f/image/upload/v1782922931/bookstore/covers/brief_history.jpg'
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        description: 'The romantic clash between the opinionated Elizabeth Bennet and her proud suitor, Mr. Darcy, in a classic comedy of manners.',
        price: 199.00,
        stock: 50,
        image: 'https://res.cloudinary.com/dcr9gkj8f/image/upload/v1782922934/bookstore/covers/pride_prejudice.jpg'
      },
      {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Children',
        description: 'Harry Potter discovers on his eleventh birthday that he is a wizard, leading him to Hogwarts School of Witchcraft and Wizardry.',
        price: 599.00,
        stock: 60,
        image: 'https://res.cloudinary.com/dcr9gkj8f/image/upload/v1782922936/bookstore/covers/harry_potter.jpg'
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        genre: 'Biography',
        description: 'Based on more than forty interviews with Jobs conducted over two years, this is the riveting story of the roller-coaster life and searingly intense personality of a creative entrepreneur.',
        price: 699.00,
        stock: 15,
        image: 'https://res.cloudinary.com/dcr9gkj8f/image/upload/v1782922938/bookstore/covers/steve_jobs.jpg'
      },
      {
        title: 'SPQR: A History of Ancient Rome',
        author: 'Mary Beard',
        genre: 'History',
        description: 'A sweeping history of ancient Rome, telling the story of how a tiny, unremarkable city-state became the unchallenged ruler of the Mediterranean world.',
        price: 449.00,
        stock: 18,
        image: 'https://res.cloudinary.com/dcr9gkj8f/image/upload/v1782922940/bookstore/covers/spqr.jpg'
      }
    ];

    console.log('Publishing seeded books to database...');
    for (let bookData of booksToSeed) {
      try {
        const book = new Book({
          title: bookData.title,
          author: bookData.author,
          genre: bookData.genre,
          description: bookData.description,
          price: bookData.price,
          stock: bookData.stock,
          image: bookData.image,
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
