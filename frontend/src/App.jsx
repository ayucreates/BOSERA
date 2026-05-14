import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import WishlistPage from './pages/WishlistPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <ScrollToTop />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),_transparent_55%)]" />
      <Header />

      <main className="relative flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/order/:id" element={<OrderDetailPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />

          <Route path="" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          <Route path="" element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/add" element={<AdminAddProduct />} />
            <Route path="/admin/products/:id/edit" element={<AdminEditProduct />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
          </Route>
        </Routes>
      </main>

      <Footer />

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
        toastClassName="!rounded-2xl !shadow-xl"
      />
    </div>
  );
}

export default App;