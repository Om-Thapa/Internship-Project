import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import ContactPage from "./pages/ContactUs/ContactPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import NotFound from "./pages/NotFound/NotFoundPage";
import CartSheet from "./components/cart-sheet";

function App() {
  return (
    <>
      <Navbar />
      <main className="mt-22">
        <ErrorBoundary>
          <Routes>
            <Route path="" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
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
