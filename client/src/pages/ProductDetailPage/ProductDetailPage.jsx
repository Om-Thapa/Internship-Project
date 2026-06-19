import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ShoppingCart,
  ArrowLeft,
  CheckCircle,
  Shield,
  Leaf,
  Wind,
} from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { API } from "@/stores/authStore";

const GUARANTEES = [
  { icon: Leaf, text: "100% Natural Ingredients" },
  { icon: Shield, text: "Safe & Non-Addictive" },
  { icon: Wind, text: "Supports Respiratory Health" },
];

const HOW_TO_USE = [
  "Open the PurePuff pack.",
  "Consume after meals or when needed.",
  "Enjoy as part of your daily wellness routine.",
];

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#f8fafb] pt-28">
      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16">
        <div className="rounded-3xl h-[480px] shimmer" />
        <div className="space-y-5 pt-8">
          <div className="h-4 w-32 shimmer rounded-lg" />
          <div className="h-12 w-4/5 shimmer rounded-xl" />
          <div className="h-8  w-24 shimmer rounded-lg" />
          <div className="space-y-2 pt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 shimmer rounded-lg" />
            ))}
          </div>
          <div className="h-14 w-full shimmer rounded-2xl mt-8" />
        </div>
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    API.get(`/products/${slug}`)
      .then((r) => {
        if (mounted) setProduct(r.data);
      })
      .catch((e) => {
        if (mounted)
          setError(e.response?.data?.message || "Product not found.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Skeleton />;

  if (error || !product)
    return (
      <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center px-4 text-center pt-28">
        <p className="text-5xl mb-4">🌿</p>
        <p className="text-xl font-semibold text-slate-700 mb-2">
          {error || "Product not found."}
        </p>
        <Link
          to="/products"
          className="mt-4 btn-luxury px-6 py-3 rounded-xl text-white text-sm inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-4">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700 transition-colors font-medium"
        >
          <ArrowLeft size={15} /> All Products
        </Link>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* ── Image panel ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-12 shadow-[0_4px_40px_rgba(0,0,0,0.07)]">
              {/* Glow */}
              <div className="absolute inset-0 bg-green-300/10 rounded-3xl" />
              <img
                src={product.image}
                alt={product.name}
                className="relative z-10 w-full max-h-[420px] object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Guarantee row */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {GUARANTEES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="glass-card rounded-2xl p-4 text-center"
                >
                  <Icon size={20} className="text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600 leading-tight">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Info panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:sticky lg:top-28"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600">
              Respiratory Wellness
            </span>

            <h1 className="mt-3 text-5xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mt-5">
              <span className="text-4xl font-black text-slate-900">
                ₹{product.price}
              </span>
              <span className="text-sm text-slate-500">Incl. all taxes</span>
            </div>

            {/* Stock */}
            <div className="mt-4">
              {product.stock > 0 ? (
                <span className="badge-success">
                  ✓ In Stock — {product.stock} units
                </span>
              ) : (
                <span className="badge-pending">Out of Stock</span>
              )}
            </div>

            {/* Qty selector */}
            <div className="mt-8">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="size-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:border-green-400 hover:text-green-700 transition-all font-bold text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center text-lg font-bold text-slate-900">
                  {qty}
                </span>
                <button
                  onClick={() =>
                    setQty((q) => Math.min(product.stock || 99, q + 1))
                  }
                  className="size-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:border-green-400 hover:text-green-700 transition-all font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`w-full mt-8 flex items-center justify-center gap-3 py-5 rounded-2xl text-base font-bold transition-all duration-300 ${
                added
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : product.stock === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "btn-luxury text-white"
              }`}
            >
              {added ? (
                <>
                  <CheckCircle size={20} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={20} /> Add to Cart — ₹
                  {product.price * qty}
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="divider my-8" />

            {/* How to use */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">
                How to Use
              </h3>
              <ol className="space-y-3">
                {HOW_TO_USE.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <span className="flex-shrink-0 size-6 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
