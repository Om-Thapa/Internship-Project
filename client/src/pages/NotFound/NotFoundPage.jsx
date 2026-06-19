import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Mail, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafb] hero-gradient flex items-center justify-center px-6 py-28 relative overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-green w-[400px] h-[400px] -top-20 -right-20 opacity-40 absolute pointer-events-none" />
      <div className="orb orb-teal  w-[300px] h-[300px] bottom-0  -left-10 opacity-30 absolute pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-lg"
      >
        {/* 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
        >
          <div className="text-[10rem] font-black leading-none select-none gradient-text text-glow-green">
            404
          </div>
          <div className="absolute inset-0 bg-green-300/20 blur-[60px] -z-10 rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl font-black text-slate-900">Page Not Found</h2>
          <p className="mt-4 text-slate-500 text-base leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist, may have moved, or the URL has a typo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link
              to="/"
              className="btn-luxury flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white text-sm font-bold"
            >
              <Home size={16} /> Go Home
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 border border-slate-200 hover:border-green-300 hover:text-green-700 bg-white/70 backdrop-blur transition-all"
            >
              <Mail size={16} /> Contact Us <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
