import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';

// Helper wrapper to dynamically load components with a retry mechanism.
// If a deployment happens and older chunks are wiped, loading them will throw an error.
// We catch the error, force a page reload to pull the new index.html (which points to current active chunks),
// and recover gracefully instead of showing a blank screen or a 404 error page.
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const hasRetried = window.sessionStorage.getItem('chunk_retry_occurred');
    try {
      const result = await componentImport();
      window.sessionStorage.removeItem('chunk_retry_occurred');
      return result;
    } catch (error) {
      if (!hasRetried) {
        window.sessionStorage.setItem('chunk_retry_occurred', 'true');
        console.warn('Failed to load chunk. Force reloading page to fetch latest build...', error);
        window.location.reload();
        return new Promise(() => {}); // Return a pending promise to prevent rendering half-loaded views
      }
      console.error('Failed to load chunk even after reload:', error);
      throw error;
    }
  });

// Admin Pages (Lazy Loaded)
const Alogin = lazyWithRetry(() => import('./Admin/Alogin'));
const Asignup = lazyWithRetry(() => import('./Admin/Asignup'));
const Ahome = lazyWithRetry(() => import('./Admin/Ahome'));
const SellerManager = lazyWithRetry(() => import('./Admin/Seller'));
const UsersManager = lazyWithRetry(() => import('./Admin/Users'));
const AdminItems = lazyWithRetry(() => import('./Admin/items'));

// Seller Pages (Lazy Loaded)
const Slogin = lazyWithRetry(() => import('./Seller/Slogin'));
const Ssignup = lazyWithRetry(() => import('./Seller/Ssignup'));
const Shome = lazyWithRetry(() => import('./Seller/Shome'));
const AddBook = lazyWithRetry(() => import('./Seller/Addbook'));
const MyProducts = lazyWithRetry(() => import('./Seller/MyProducts'));
const SellerOrders = lazyWithRetry(() => import('./Seller/Orders'));

// User/Customer Pages (Lazy Loaded)
const UserLogin = lazyWithRetry(() => import('./User/Login'));
const UserSignup = lazyWithRetry(() => import('./User/Signup'));
const Uhome = lazyWithRetry(() => import('./User/Uhome'));
const ProductsCatalog = lazyWithRetry(() => import('./User/Products'));
const BookDetail = lazyWithRetry(() => import('./User/Uitem'));
const UserOrders = lazyWithRetry(() => import('./User/MyOrders'));

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

