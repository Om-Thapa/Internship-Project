import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, Wind, Shield, Leaf, Zap, } from "lucide-react";

import ProductCard from "@/components/ProductCards";
import AboutPurePuff from "./Components/AboutPurePuff";
import ImpactStats from "./Components/ImpactStats";
import { API } from "@/stores/authStore";
import { SkeletonCard } from "../Products/ProductsPage";
import TemplateCarousel from "./Components/TemplateCarousel";
// import products from "@/data/products";

/* ─── Reusable reveal wrapper ── */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Feature pill ── */
function FeaturePill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-green-100 rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
      <Icon size={15} className="text-green-600" />
      {label}
    </div>
  );
}

/* ─── Stat card ── */
function HeroStat({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold gradient-text">{value}</div>
      <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    API.get("/products")
      .then((r) => {
        // if (mounted) setTimeout(() => setProducts(r.data || []), 2000);
        setProducts(r.data || []);
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

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /* Parallax values */
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const orbY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <div className="w-full overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center hero-gradient overflow-hidden"
      >
        {/* Decorative orbs */}
        <motion.div
          style={{ y: orbY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="orb orb-green w-[600px] h-[600px] -top-40 -right-40 opacity-60" />
          <div className="orb orb-teal w-[400px] h-[400px] bottom-0 -left-20 opacity-40" />
          <div className="orb orb-emerald w-[300px] h-[300px] top-1/2 left-1/3 opacity-30" />
        </motion.div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#16a34a 1px, transparent 1px), linear-gradient(90deg, #16a34a 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <motion.div style={{ y: heroY, opacity: heroOp }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="inline-flex items-center gap-2 bg-green-100/80 border border-green-200 text-green-700 text-4xl font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                PUREPUFF
              </h1>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-slate-900"
            >
              Every Breath
              <br />
              <span className="gradient-text text-glow-green">Deserves</span>
              <br />
              Better.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed"
            >
              Non-addictive respiratory wellness products crafted to support
              lung health and promote cleaner, fresher living every day.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <FeaturePill icon={Leaf} label="Non-Addictive" />
              <FeaturePill icon={Shield} label="Safe Formula" />
              <FeaturePill icon={Wind} label="Supports Lungs Detox" />
              <FeaturePill icon={Zap} label="Instant Relief" />
              <FeaturePill icon={Shield} label="In-Vitro Tested" />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Link
                to="/products"
                className="btn-luxury flex items-center gap-2 px-8 py-4 rounded-2xl text-base text-white"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <a
                href="#about"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-slate-700 bg-white/70 backdrop-blur border border-slate-200/80 hover:border-green-300 hover:bg-white transition-all duration-300 shadow-sm"
              >
                Learn More
              </a>
            </motion.div>

            {/* Hero stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex gap-8 mt-12 pt-8 border-t border-slate-200/60"
            >
              <HeroStat value="2+" label="Products" />
              <HeroStat value="100%" label="Natural" />
              <HeroStat value="0" label="Nicotine" />
            </motion.div>
          </motion.div>

          {/* Right: product image */}
          <motion.div
            style={{ y: imgY }}
            className="relative flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-full bg-green-300/30 blur-[60px] scale-90" />

              <img
                src="/FROGGU-removebg-preview.png"
                alt="PurePuff Candy"
                className="relative z-10 w-full max-w-sm lg:max-w-md drop-shadow-2xl"
              />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute top-8 -right-4 glass-card rounded-2xl px-4 py-3 shadow-lg z-20"
              >
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rating
                </div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">
                  ⭐ 4.9 / 5
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute bottom-12 -left-4 glass-card rounded-2xl px-4 py-3 shadow-lg z-20"
              >
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  100%
                </div>
                <div className="text-sm font-bold text-green-600 mt-0.5">
                  Non-addictive
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-slate-300 to-transparent"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          IMPACT STATS
      ═══════════════════════════════════════════════════ */}
      <section className="bg-slate-900 relative overflow-hidden py-24">
        <div className="orb orb-green w-[500px] h-[500px] -top-32 left-1/2 opacity-20 absolute" />
        <Reveal>
          <ImpactStats />
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════
          ABOUT
      ═══════════════════════════════════════════════════ */}
      <section id="about" className="bg-white py-28">
        <Reveal>
          <AboutPurePuff />
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════
          PRODUCTS
      ═══════════════════════════════════════════════════ */}
      <section
        id="products"
        className="hero-gradient py-28 relative overflow-hidden"
      >
        <div className="orb orb-teal w-[400px] h-[400px] top-0 -right-20 opacity-40 absolute" />
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600 mb-4 block">
              Our Collection
            </span>
            <h2 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
              Wellness <span className="gradient-text">Elevated</span>
            </h2>
            <p className="mt-4 text-slate-600 max-w-xl mx-auto text-lg">
              Thoughtfully crafted products for everyday respiratory support.
            </p>
          </Reveal>

          {loading ? (
            <div className="flex flex-wrap justify-center gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
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
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {products.slice(0, 4).map((product, i) => (
                <Reveal key={product.id} delay={i * 0.1}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={0.2} className="text-center mt-14">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 btn-luxury px-8 py-4 rounded-2xl text-white text-base"
            >
              View All Products <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TEMPLATE CAROUSEL
      ═══════════════════════════════════════════════════ */}
      <TemplateCarousel />

      {/* ═══════════════════════════════════════════════════
          BOTTOM CTA BAND
      ═══════════════════════════════════════════════════ */}
      <section className="bg-slate-900 py-20 relative overflow-hidden">
        <div className="orb orb-green w-[600px] h-[300px] top-0 left-1/2 -translate-x-1/2 opacity-15 absolute" />
        <Reveal className="relative z-10 text-center px-6">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Start Breathing
            <span className="gradient-text"> Cleaner Today.</span>
          </h2>
          <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
            Join thousands who've made respiratory wellness part of their daily
            routine.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Link
              to="/products"
              className="btn-luxury px-8 py-4 rounded-2xl text-white text-base inline-flex items-center gap-2"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-2xl text-sm font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/10 backdrop-blur transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
