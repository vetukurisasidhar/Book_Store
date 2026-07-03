import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Route guard wrapper that redirects unauthenticated users or users with mismatching roles.
 * Centrally validates local storage tokens.
 * 
 * @param {object} props
 * @param {string} props.role The required role to access the nested routes ('admin', 'seller', or 'user')
 */
const ProtectedRoute = ({ role }) => {
  const adminToken = localStorage.getItem('adminToken');
  const sellerToken = localStorage.getItem('sellerToken');
  const userToken = localStorage.getItem('userToken');

  if (role === 'admin') {
    if (!adminToken) {
      return <Navigate to="/admin/login" replace />;
    }
  } else if (role === 'seller') {
    if (!sellerToken) {
      return <Navigate to="/seller/login" replace />;
    }
  } else if (role === 'user') {
    if (!userToken) {
      return <Navigate to="/user/login" replace />;
    }
  }

  // Render the nested route content
  return <Outlet />;
};

export default ProtectedRoute;
