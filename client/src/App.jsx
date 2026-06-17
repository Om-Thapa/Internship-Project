import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import ContactPage from "./pages/ContactUs/ContactPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import NotFound from "./pages/NotFound/NotFoundPage";
import CartSheet from "./components/cart-sheet";
import CartPage from "./pages/CartPage/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";
import ProductsPage from "./pages/Products/ProductsPage";

import ScrollToTop from "./components/ScrollToTop";
import { useAuthStore } from "./stores/authStore";
import { initAnalytics } from "./utils/analytics";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/RegisterPage/Register";
import VerifyEmail from "./pages/VerifyEmailPage/VerifyEmail";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Checkout from "./pages/CheckoutPage/Checkout";
import OrderSuccess from "./pages/OrderSuccessPage/OrderSuccess";
import MyOrders from "./pages/MyOrdersPage/MyOrders";
import OrderDetails from "./pages/OrderDetailsPage/OrderDetails";
import { useEffect } from "react";

function App() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
    initAnalytics();
  }, [checkSession]);

  return (
    <>
      <ScrollToTop />

      <Navbar />

      <main className="mt-22">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Public Authentication Channels */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Guarded Core Operational Infrastructure */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-success/:orderId"
              element={
                <ProtectedRoute>
                  <OrderSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />

            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />

            <Route path="/contact" element={<ContactPage />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <CartSheet />

      <Footer />
    </>
  );
}

export default App;
