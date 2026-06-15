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

function App() {
  return (
    <>
      <ScrollToTop />

      <Navbar />
      
      <main className="mt-22">
        <ErrorBoundary>
          <Routes>
            <Route path="" element={<LandingPage />} />

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
