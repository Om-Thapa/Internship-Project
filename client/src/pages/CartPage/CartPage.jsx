import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";

import { useCartStore } from "@/stores/useCartStore";
import { useCartTotal } from "@/stores/cartSelectors";

const FREE_SHIPPING_AT = 499;
const DISCOUNT_AT      = 299;
const SHIPPING_COST    = 49;
const DISCOUNT_AMOUNT  = 50;

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function CartItem({ item, increaseQuantity, decreaseQuantity, removeItem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex gap-5 items-start">
        {/* Image */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-2"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base leading-snug">{item.name}</h3>
            <button
              onClick={() => removeItem(item.id)}
              className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
              aria-label="Remove item"
            >
              <Trash2 size={15} />
            </button>
          </div>

          <p className="text-sm text-slate-500 mt-1">₹{item.price} each</p>

          <div className="flex items-center justify-between mt-3">
            {/* Qty control */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="size-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-green-700 hover:shadow-sm transition-all"
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center text-sm font-bold text-slate-900">
                {item.quantity}
              </span>
              <button
                onClick={() => increaseQuantity(item.id)}
                className="size-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-green-700 hover:shadow-sm transition-all"
              >
                <Plus size={13} />
              </button>
            </div>

            <span className="font-black text-slate-900 text-lg">
              ₹{item.price * item.quantity}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const items            = useCartStore((s) => s.items);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const removeItem       = useCartStore((s) => s.removeItem);
  const subtotal         = useCartTotal();

  const shipping  = subtotal >= FREE_SHIPPING_AT ? 0       : SHIPPING_COST;
  const discount  = subtotal >= DISCOUNT_AT      ? DISCOUNT_AMOUNT : 0;
  const total     = subtotal + shipping - discount;
  const progress  = Math.min((subtotal / FREE_SHIPPING_AT) * 100, 100);
  const remaining = FREE_SHIPPING_AT - subtotal;

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafb] flex items-center justify-center pt-28 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-sm"
        >
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <ShoppingBag size={48} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Your cart is empty</h1>
          <p className="mt-3 text-slate-500 leading-relaxed">
            Add some PurePuff products and start your wellness journey.
          </p>
          <Link
            to="/products"
            className="btn-luxury mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white text-base"
          >
            Shop Products <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <Reveal>
          <div className="mb-10">
            <h1 className="text-5xl font-black text-slate-900">
              Your <span className="gradient-text">Cart</span>
            </h1>
            <p className="mt-2 text-slate-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          </div>
        </Reveal>

        {/* Free shipping progress */}
        <Reveal delay={0.05}>
          <div className="glass-card rounded-2xl p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">
                {subtotal >= FREE_SHIPPING_AT
                  ? "🎉 You've unlocked free shipping!"
                  : `₹${remaining} away from free shipping`}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                ₹{subtotal} / ₹{FREE_SHIPPING_AT}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">

          {/* ── Items list ── */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  removeItem={removeItem}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order summary ── */}
          <Reveal delay={0.1}>
            <div className="lg:sticky lg:top-28">
              <div className="glass-card rounded-3xl p-7">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Order Summary</h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-slate-900"}`}>
                      {shipping === 0 ? "FREE" : `₹${shipping}`}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1.5">
                        <Tag size={13} /> Loyalty Discount
                      </span>
                      <span className="font-semibold">−₹{discount}</span>
                    </div>
                  )}

                  <div className="divider" />

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-slate-900">₹{total}</span>
                  </div>
                </div>

                {subtotal >= DISCOUNT_AT && discount === 0 && (
                  <p className="mt-4 text-xs text-green-600 font-medium bg-green-50 rounded-xl p-3">
                    🎁 You've unlocked a ₹50 loyalty discount!
                  </p>
                )}

                <Link to="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-luxury w-full mt-6 py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight size={18} />
                  </motion.button>
                </Link>

                <Link to="/products" className="block mt-4 text-center text-sm text-slate-500 hover:text-green-700 transition-colors font-medium">
                  ← Continue Shopping
                </Link>

                <p className="mt-5 text-xs text-center text-slate-400">
                  Secure checkout · Taxes calculated at payment
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
