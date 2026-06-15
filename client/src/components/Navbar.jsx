import { Link } from "react-router-dom";
import { Menu, ShoppingCart } from "lucide-react";

import { useCartStore } from "@/stores/useCartStore";
import { useCartCount } from "@/stores/cartSelectors";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
  const openCart = useCartStore((state) => state.openCart);
  const cartCount = useCartCount();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/95 border-b border-green-100 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center text-base font-medium text-gray-700">
          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="rounded-full border border-gray-200 bg-white p-3 text-gray-700 transition hover:border-green-300 hover:text-green-600"
                  aria-label="Open menu"
                >
                  <Menu size={24} />
                </button>
              </SheetTrigger>

              <SheetContent side="left" className="w-70">
                <div className="mt-8 ml-5 flex flex-col gap-4">
                  <SheetClose asChild>
                    <Link
                      to="/"
                      className="text-lg font-semibold text-green-400"
                    >
                      Home
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      to="/products"
                      className="text-lg font-semibold text-green-400"
                    >
                      Products
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link
                      to="/contact"
                      className="text-lg font-semibold text-green-400"
                    >
                      Contact
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link to="/" className="flex gap-6">
            <div className="object-contain size-12">
              <img src="/LOGO.jpg.jpeg" alt="Logo" />
            </div>
            {/* <div className="object-contain size-12">
              <img src="/FROGGU-removebg-preview.png" alt="Logo" />
            </div> */}
            <div className="hidden md:block font-sans text-xl font-semibold rounded-2xl bg-green-500/80 px-5 py-3 text-white">
              PurePuff
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-base font-medium text-gray-700">
          <Link to="/" className="transition hover:text-green-600">
            Home
          </Link>

          <Link to="/contact" className="transition hover:text-green-600">
            Contact
          </Link>

          <Link to="/products" className="transition hover:text-green-600">
            Products
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-full border border-gray-200 bg-white p-3 text-gray-700 transition hover:border-green-300 hover:text-green-600"
            aria-label="Open cart"
          >
            <ShoppingCart size={24} />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
