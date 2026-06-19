import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/useCartStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative w-72 glass-card rounded-3xl overflow-hidden product-card"
    >
      {/* Image area */}
      <Link
        to={`/products/${product.slug}`}
        className="block relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 h-64"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-108"
          style={{ "--tw-scale-x": 1.08, "--tw-scale-y": 1.08 }}
        />

        {/* Quick-view overlay */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-300 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1 }}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 glass rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold text-slate-800 shadow-lg"
          >
            <Eye size={15} /> Quick View
          </motion.div>
        </div>

        {/* Stock badge */}
        {product.stock < 20 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
            Only {product.stock} left
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-100 border border-red-200 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
            Sold Out
          </div>
        )}
      </Link>

      {/* Info area */}
      <div className="p-5">
        <Link to={`/products/${product.slug}`}>
          <h3 className="font-bold text-slate-900 text-lg leading-tight hover:text-green-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-black text-slate-900">
              ₹{product.price}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              added
                ? "bg-green-100 text-green-700 border border-green-200"
                : product.stock === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "btn-luxury text-white"
            }`}
          >
            <ShoppingCart size={15} />
            {added ? "Added!" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
