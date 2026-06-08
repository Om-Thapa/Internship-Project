import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

const Navbar = () => {
  const { openCart } = useCart();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/95 border-b border-green-100 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-sans text-xl font-semibold rounded-2xl bg-green-500/80 px-5 py-3 text-white"
        >
          PurePuff
        </Link>

        <div className="hidden md:flex items-center gap-8 text-base font-medium text-gray-700">
          <Link to="/" className="transition hover:text-green-600">
            Home
          </Link>
          <Link to="/contact" className="transition hover:text-green-600">
            Contact
          </Link>
        </div>

        <button
          type="button"
          onClick={openCart}
          className="relative rounded-full border border-gray-200 bg-white p-3 text-gray-700 transition hover:border-green-300 hover:text-green-600"
          aria-label="Open cart"
        >
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
            2
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
