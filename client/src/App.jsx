import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';

// Admin Pages (Lazy Loaded)
const Alogin = lazy(() => import('./Admin/Alogin'));
const Asignup = lazy(() => import('./Admin/Asignup'));
const Ahome = lazy(() => import('./Admin/Ahome'));
const SellerManager = lazy(() => import('./Admin/Seller'));
const UsersManager = lazy(() => import('./Admin/Users'));
const AdminItems = lazy(() => import('./Admin/items'));

// Seller Pages (Lazy Loaded)
const Slogin = lazy(() => import('./Seller/Slogin'));
const Ssignup = lazy(() => import('./Seller/Ssignup'));
const Shome = lazy(() => import('./Seller/Shome'));
const AddBook = lazy(() => import('./Seller/Addbook'));
const MyProducts = lazy(() => import('./Seller/MyProducts'));
const SellerOrders = lazy(() => import('./Seller/Orders'));

// User/Customer Pages (Lazy Loaded)
const UserLogin = lazy(() => import('./User/Login'));
const UserSignup = lazy(() => import('./User/Signup'));
const Uhome = lazy(() => import('./User/Uhome'));
const ProductsCatalog = lazy(() => import('./User/Products'));
const BookDetail = lazy(() => import('./User/Uitem'));
const UserOrders = lazy(() => import('./User/MyOrders'));

function App() {
  return (
    <Router>
      <Suspense fallback={
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
          <h2 style={{ fontWeight: 500, letterSpacing: '0.5px' }}>Loading Bookstore...</h2>
        </div>
      }>
        <Routes>
          {/* Core Entry Portal */}
          <Route path="/" element={<Home />} />

          {/* Admin Flow */}
          <Route path="/admin/login" element={<Alogin />} />
          <Route path="/admin/signup" element={<Asignup />} />
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<Ahome />} />
            <Route path="/admin/sellers" element={<SellerManager />} />
            <Route path="/admin/users" element={<UsersManager />} />
            <Route path="/admin/books" element={<AdminItems />} />
          </Route>

          {/* Seller Flow */}
          <Route path="/seller/login" element={<Slogin />} />
          <Route path="/seller/signup" element={<Ssignup />} />
          <Route element={<ProtectedRoute role="seller" />}>
            <Route path="/seller/dashboard" element={<Shome />} />
            <Route path="/seller/add-book" element={<AddBook />} />
            <Route path="/seller/products" element={<MyProducts />} />
            <Route path="/seller/orders" element={<SellerOrders />} />
          </Route>

          {/* User Flow */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/dashboard" element={<Uhome />} />
          <Route path="/user/products" element={<ProductsCatalog />} />
          <Route path="/user/book/:id" element={<BookDetail />} />
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/user/orders" element={<UserOrders />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

