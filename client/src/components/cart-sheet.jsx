import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/useCartStore";
import { useCartTotal } from "@/stores/cartSelectors";

const FREE_SHIPPING_AT = 499;

export default function CartSheet() {
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const increaseQuantity = useCartStore((s) => s.increaseQuantity);
  const decreaseQuantity = useCartStore((s) => s.decreaseQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const subtotal = useCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : 49;
  const discount = subtotal >= 299 ? 50 : 0;
  const total = Math.max(subtotal + shipping - discount, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_AT) * 100, 100);

  return (
    <Sheet
      open={isCartOpen}
      onOpenChange={(o) => {
        if (!o) closeCart();
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 glass border-l border-white/60 shadow-2xl"
      >
        {/* Header */}
        <SheetHeader className="border-b border-slate-100 px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <ShoppingBag size={20} className="text-green-600" />
            Your Cart
            {items.length > 0 && (
              <span className="ml-auto text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Free shipping bar */}
        {items.length > 0 && (
          <div className="px-6 py-3 bg-green-50/60 border-b border-green-100/60">
            <div className="flex justify-between text-xs text-slate-600 mb-1.5">
              <span>
                {subtotal >= FREE_SHIPPING_AT
                  ? "🎉 Free shipping unlocked!"
                  : `₹${FREE_SHIPPING_AT - subtotal} more for free shipping`}
              </span>
              <span className="font-semibold text-green-700">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-20 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <ShoppingBag size={36} className="text-green-400" />
                </div>
                <p className="text-slate-700 font-semibold text-base">
                  Your cart is empty
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Add something to get started.
                </p>
                <SheetClose asChild>
                  <Link
                    to="/products"
                    className="btn-luxury mt-6 px-6 py-3 rounded-xl text-white text-sm inline-flex items-center gap-2"
                  >
                    Browse Products <ArrowRight size={15} />
                  </Link>
                </SheetClose>
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: 20,
                    height: 0,
                    marginTop: 0,
                    paddingTop: 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-2xl p-4"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-semibold text-sm text-slate-900 leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 p-1 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 mt-0.5">
                        ₹{item.price}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="size-6 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-green-700 transition-all text-xs"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="size-6 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-green-700 transition-all text-xs"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        <span className="text-sm font-black text-slate-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 bg-white/80 backdrop-blur px-6 py-5 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">
                  ₹{subtotal}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span
                  className={`font-semibold ${shipping === 0 ? "text-green-600" : "text-slate-800"}`}
                >
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 text-xs">
                  <span>Loyalty discount</span>
                  <span className="font-semibold">−₹{discount}</span>
                </div>
              )}
            </div>

            <div className="divider" />

            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">Total</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{total}
              </span>
            </div>

            <SheetClose asChild>
              <Link to="/cart">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-luxury w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  View Cart & Checkout <ArrowRight size={16} />
                </motion.button>
              </Link>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
