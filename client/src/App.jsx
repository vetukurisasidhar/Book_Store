import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';

// Admin Pages
import Alogin from './Admin/Alogin';
import Asignup from './Admin/Asignup';
import Ahome from './Admin/Ahome';
import SellerManager from './Admin/Seller';
import UsersManager from './Admin/Users';
import AdminItems from './Admin/items';

// Seller Pages
import Slogin from './Seller/Slogin';
import Ssignup from './Seller/Ssignup';
import Shome from './Seller/Shome';
import AddBook from './Seller/Addbook';
import MyProducts from './Seller/MyProducts';
import SellerOrders from './Seller/Orders';

// User/Customer Pages
import UserLogin from './User/Login';
import UserSignup from './User/Signup';
import Uhome from './User/Uhome';
import ProductsCatalog from './User/Products';
import BookDetail from './User/Uitem';
import UserOrders from './User/MyOrders';

function App() {
  return (
    <Router>
      <Routes>
        {/* Core Entry Portal */}
        <Route path="/" element={<Home />} />

        {/* Admin Flow */}
        <Route path="/admin/login" element={<Alogin />} />
        <Route path="/admin/signup" element={<Asignup />} />
        <Route path="/admin/dashboard" element={<Ahome />} />
        <Route path="/admin/sellers" element={<SellerManager />} />
        <Route path="/admin/users" element={<UsersManager />} />
        <Route path="/admin/books" element={<AdminItems />} />

        {/* Seller Flow */}
        <Route path="/seller/login" element={<Slogin />} />
        <Route path="/seller/signup" element={<Ssignup />} />
        <Route path="/seller/dashboard" element={<Shome />} />
        <Route path="/seller/add-book" element={<AddBook />} />
        <Route path="/seller/products" element={<MyProducts />} />
        <Route path="/seller/orders" element={<SellerOrders />} />

        {/* User Flow */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/dashboard" element={<Uhome />} />
        <Route path="/user/products" element={<ProductsCatalog />} />
        <Route path="/user/book/:id" element={<BookDetail />} />
        <Route path="/user/orders" element={<UserOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
