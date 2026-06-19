import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import ProductCard from "@/components/ProductCards";
import { API } from "@/stores/authStore";
import { Search } from "lucide-react";

export function SkeletonCard() {
  return (
    <div className="w-72 rounded-3xl overflow-hidden glass-card">
      <div className="h-64 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 shimmer rounded-lg" />
        <div className="h-4 w-1/2 shimmer rounded-lg" />
        <div className="flex justify-between mt-4">
          <div className="h-8 w-16 shimmer rounded-lg" />
          <div className="h-9 w-24 shimmer rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    API.get("/products")
      .then((r) => {
        if (mounted) setProducts(r.data || []);
      })
      .catch((e) => {
        if (mounted)
          setError(e.response?.data?.message || "Unable to load products.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      {/* ── Hero banner ── */}
      <section className="relative hero-gradient overflow-hidden pt-32 pb-20">
        <div className="orb orb-green w-[500px] h-[500px] -top-40 -right-40 opacity-50 absolute pointer-events-none" />
        <div className="orb orb-teal  w-[350px] h-[350px] bottom-0  -left-20  opacity-35 absolute pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600 mb-3 block">
              PurePuff Collection
            </span>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-tight">
              Our <span className="gradient-text">Products</span>
            </h1>
            <p className="mt-5 max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
              Respiratory wellness products designed to support healthier
              breathing and a refreshing everyday experience.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mt-10 max-w-md mx-auto"
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-luxury pl-11 pr-4 py-4 text-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Products grid ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="flex flex-wrap justify-center gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-lg font-semibold text-red-500 mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-luxury px-6 py-3 rounded-xl text-white text-sm"
            >
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center"
          >
            <p className="text-5xl mb-4">🌿</p>
            <p className="text-xl font-semibold text-slate-700">
              No products found.
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-green-600 font-medium hover:text-green-700 underline underline-offset-4 transition-colors"
              >
                Clear search
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-8">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filtered.length}
              </span>{" "}
              product{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {filtered.map((product, i) => (
                <Reveal key={product.id} delay={i * 0.08}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
