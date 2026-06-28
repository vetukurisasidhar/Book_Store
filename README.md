# 📚 BookStore - MERN Application

A complete full-stack e-commerce bookstore application built with MongoDB, Express, React, and Node.js.

## 🎯 Features

- **User Authentication**: Secure signup/login with JWT
- **Role-Based Access**: Admin, Seller, and User roles
- **Book Management**: Sellers can add, update, and manage books
- **Shopping Cart**: Add/remove books from cart
- **Order Management**: Users can place orders and track them
- **Admin Dashboard**: Manage sellers, users, and books
- **Book Uploads**: Sellers can upload book cover images
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcryptjs
- Multer (File uploads)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- Git

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd BOOKSTORE
```

### 2. Install Backend Dependencies
```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../Frontend
npm install
```

## ⚙️ Configuration

### Backend (.env)
Create a `.env` file in the `Backend` folder:
```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/BookStore
JWT_SECRET=mySuperSecretKeyForBookStoreApp123!
```

## 🎮 Running the Application

The application is now **deployed and live online!**

### **Live Links:**

**Frontend:** https://book-store-jade-six-31.vercel.app  
**Backend API:** https://bookstore-production-dae1.up.railway.app

### **Local Development (Optional):**

If you want to run locally:

**Terminal 1 - Start Backend:**
```bash
cd Backend
npm run dev
```
Backend runs on: **http://localhost:8000**

**Terminal 2 - Start Frontend:**
```bash
cd Frontend
npm run dev
```
Frontend runs on: **http://localhost:5173**

## 📍 Application URLs (Live)

- **Main App**: https://book-store-jade-six-31.vercel.app
- **User Login**: https://book-store-jade-six-31.vercel.app/user/login
- **User Dashboard**: https://book-store-jade-six-31.vercel.app/user/dashboard
- **User Products**: https://book-store-jade-six-31.vercel.app/user/products
- **Seller Login**: https://book-store-jade-six-31.vercel.app/seller/login
- **Seller Dashboard**: https://book-store-jade-six-31.vercel.app/seller/dashboard
- **Admin Login**: https://book-store-jade-six-31.vercel.app/admin/login
- **Admin Dashboard**: https://book-store-jade-six-31.vercel.app/admin/dashboard
- **Backend API Server**: https://bookstore-production-dae1.up.railway.app

## 👥 Default Test Accounts

Create accounts through the signup pages:
- **User**: Regular customer account
- **Seller**: Business account (requires admin approval)
- **Admin**: Administrator account

## 📚 API Endpoints

### User Routes
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/books` - Get all books
- `GET /api/users/cart` - Get user cart
- `POST /api/users/checkout` - Place order
- `GET /api/users/orders` - Get user orders

### Seller Routes
- `POST /api/sellers/signup` - Seller registration
- `POST /api/sellers/login` - Seller login
- `POST /api/sellers/books` - Add book
- `GET /api/sellers/books` - Get seller's books
- `PUT /api/sellers/books/:id` - Update book
- `DELETE /api/sellers/books/:id` - Delete book
- `GET /api/sellers/orders` - Get seller's orders

### Admin Routes
- `POST /api/admin/signup` - Admin registration
- `POST /api/admin/login` - Admin login
- `GET /api/admin/sellers` - Get all sellers
- `PUT /api/admin/sellers/:id/approve` - Approve seller
- `GET /api/admin/users` - Get all users
- `GET /api/admin/books` - Get all books
- `GET /api/admin/stats` - Get statistics

## 📁 Project Structure

```
BOOKSTORE/
├── Backend/
│   ├── config/          # Database connection
│   ├── controllers/      # Route handlers
│   ├── middlewares/      # Authentication & upload
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded files
│   ├── server.js        # Express app
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── Admin/       # Admin pages
│   │   ├── Seller/      # Seller pages
│   │   ├── User/        # User pages
│   │   ├── Components/  # Shared components
│   │   └── App.jsx      # Main app
│   ├── index.html
│   └── package.json
└── README.md
```

## 🤝 Contributing

Feel free to fork this project and submit pull requests.

## 📝 License

This project is open source and available under the MIT License.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Happy Reading! 📖**
