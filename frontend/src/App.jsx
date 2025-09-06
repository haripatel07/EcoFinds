import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WishlistProvider } from './context/WishlistContext';
import { UIProvider } from './context/UIContext';
import AdminRoute from './components/AdminRoute';
import FlagsModeration from './pages/FlagsModeration';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckEmail from './pages/CheckEmail';
import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import WishlistPage from './pages/WishlistPage';
import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';
import EditListing from './pages/EditListing';
import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <UIProvider>
          <WishlistProvider>
            <BrowserRouter>
              <Navbar />
              <ErrorBoundary>
                <main className="ef-page-shell">
                  <div className="ef-container">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/check-email" element={<CheckEmail />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/products/:id" element={<ProductPage />} />
                      <Route path="/create-listing" element={<RequireAuth><CreateListing /></RequireAuth>} />
                      <Route path="/my-listings" element={<RequireAuth><MyListings /></RequireAuth>} />
                      <Route path="/edit-listing/:id" element={<RequireAuth><EditListing /></RequireAuth>} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/wishlist" element={<RequireAuth><WishlistPage /></RequireAuth>} />
                      <Route path="/admin/flags" element={<AdminRoute><FlagsModeration /></AdminRoute>} />
                    </Routes>
                  </div>
                </main>
              </ErrorBoundary>
            </BrowserRouter>
          </WishlistProvider>
        </UIProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
