import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSheet from "./components/cart-sheet";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "./components/Toast";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./stores/authStore";
import { initAnalytics } from "./utils/analytics";

// Pages
import LandingPage from "./pages/LandingPage/LandingPage";
import ProductsPage from "./pages/Products/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";
import CartPage from "./pages/CartPage/CartPage";
import Checkout from "./pages/CheckoutPage/Checkout";
import OrderSuccess from "./pages/OrderSuccessPage/OrderSuccess";
import MyOrders from "./pages/MyOrdersPage/MyOrders";
import OrderDetails from "./pages/OrderDetailsPage/OrderDetails";
import ContactPage from "./pages/ContactUs/ContactPage";
import Login from "./pages/LoginPage/Login";
import Register from "./pages/LoginPage/Register";
import VerifyEmail from "./pages/VerifyEmailPage/VerifyEmail";
import NotFound from "./pages/NotFound/NotFoundPage";

/* ── Page transition wrapper ── */
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -6 },
};
const pageTransition = {
  type: "tween",
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1],
};

function Page({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const { checkSession } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkSession();

    // TODO:
    // initAnalytics();
  }, [checkSession]);

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <main className="mt-[72px]">
        <ErrorBoundary>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              {/* Public */}
              <Route
                path="/"
                element={
                  <Page>
                    <LandingPage />
                  </Page>
                }
              />
              <Route
                path="/products"
                element={
                  <Page>
                    <ProductsPage />
                  </Page>
                }
              />
              <Route
                path="/products/:slug"
                element={
                  <Page>
                    <ProductDetailPage />
                  </Page>
                }
              />
              <Route
                path="/contact"
                element={
                  <Page>
                    <ContactPage />
                  </Page>
                }
              />
              <Route
                path="/cart"
                element={
                  <Page>
                    <CartPage />
                  </Page>
                }
              />

              {/* Auth */}
              <Route
                path="/login"
                element={
                  <Page>
                    <Login />
                  </Page>
                }
              />
              <Route
                path="/register"
                element={
                  <Page>
                    <Register />
                  </Page>
                }
              />
              <Route
                path="/verify-email"
                element={
                  <Page>
                    <VerifyEmail />
                  </Page>
                }
              />

              {/* Protected — checkout requires verified email */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute requireVerified>
                    <Page>
                      <Checkout />
                    </Page>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-success/:orderId"
                element={
                  <ProtectedRoute>
                    <Page>
                      <OrderSuccess />
                    </Page>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <Page>
                      <MyOrders />
                    </Page>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <Page>
                      <OrderDetails />
                    </Page>
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <Page>
                    <NotFound />
                  </Page>
                }
              />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </main>

      <CartSheet />
      <Footer />
      <ToastContainer />
    </>
  );
}

export default App;
