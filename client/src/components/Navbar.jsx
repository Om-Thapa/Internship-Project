import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingCart, User, LogOut, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import { useCartStore } from "@/stores/useCartStore";
import { useCartCount } from "@/stores/cartSelectors";
import { useAuthStore } from "@/stores/authStore";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const openCart = useCartStore((s) => s.openCart);
  const cartCount = useCartCount();
  const { user, token, logout } = useAuthStore();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close user menu on route change */
  useEffect(() => setUserMenuOpen(false), [location.pathname]);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass border-b border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.07)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-xl size-10 ring-2 ring-green-200/60 transition-all duration-300 group-hover:ring-green-400/60 group-hover:shadow-[0_0_16px_rgba(52,201,116,0.30)]">
            <img
              src="/LOGO.jpg.jpeg"
              alt="PurePuff"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <span className="hidden md:block font-bold text-2xl tracking-tight gradient-text-warm">
            PurePuff
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                isActive(to)
                  ? "text-green-700 bg-green-50"
                  : "text-slate-600 hover:text-green-700 hover:bg-green-50/70"
              }`}
            >
              {label}
              {isActive(to) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-green-100/60 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2">
          {/* Auth: logged in */}
          {token ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen((p) => !p)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              >
                <div className="size-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="max-w-24 truncate">
                  {user?.name?.split(" ")[0]}
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-48 glass-card rounded-2xl overflow-hidden py-1 z-50"
                  >
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Package size={15} /> My Orders
                    </Link>
                    <div className="divider mx-3" />
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Auth: logged out */
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 rounded-full hover:bg-green-50 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-luxury px-5 py-2.5 rounded-full text-sm text-white"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Cart button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="relative p-2.5 rounded-full text-slate-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
          >
            <ShoppingCart size={22} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white shadow-sm glow-green-sm"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="p-2.5 rounded-full text-slate-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200"
                >
                  <Menu size={22} />
                </button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-72 glass border-r border-white/60"
              >
                <div className="mt-10 flex flex-col gap-1 px-2">
                  {NAV_LINKS.map(({ to, label }) => (
                    <SheetClose asChild key={to}>
                      <Link
                        to={to}
                        className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                          isActive(to)
                            ? "bg-green-100 text-green-700"
                            : "text-slate-700 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {label}
                      </Link>
                    </SheetClose>
                  ))}

                  <div className="divider my-3" />

                  {token ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          to="/my-orders"
                          className="px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700 transition-all flex items-center gap-2"
                        >
                          <Package size={18} /> My Orders
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <button
                          onClick={logout}
                          className="px-4 py-3 rounded-xl text-base font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all text-left flex items-center gap-2"
                        >
                          <LogOut size={18} /> Sign Out
                        </button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link
                          to="/login"
                          className="px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700 transition-all"
                        >
                          Sign In
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          to="/register"
                          className="btn-luxury text-center px-4 py-3 rounded-xl text-base text-white mt-1"
                        >
                          Get Started
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
