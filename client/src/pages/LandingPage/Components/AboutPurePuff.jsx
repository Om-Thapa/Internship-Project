import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Leaf, Shield, Wind, Zap } from "lucide-react";

const PILLARS = [
  { icon: Leaf,   text: "Supports respiratory wellness"      },
  { icon: Shield, text: "Non-addictive, safe formulation"    },
  { icon: Wind,   text: "Portable and affordable for all"    },
  { icon: Zap,    text: "Creates awareness about pollution"  },
];

export default function AboutPurePuff() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* ── Image side ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center order-2 lg:order-1"
        >
          {/* Glow behind mascot */}
          <div className="absolute w-72 h-72 rounded-full bg-green-200/40 blur-[60px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <img
            src="/FROGGU-removebg-preview.png"
            alt="PurePuff Mascot"
            className="relative z-10 w-full max-w-md drop-shadow-2xl"
          />
        </motion.div>

        {/* ── Content side ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 lg:order-2"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600">
            About PurePuff
          </span>

          <h2 className="text-5xl font-black mt-4 mb-6 text-slate-900 leading-[1.1]">
            Every Breath
            <br />
            <span className="gradient-text">Deserves Better</span>
          </h2>

          <p className="text-slate-600 leading-relaxed text-lg mb-10">
            PurePuff was founded to tackle two growing challenges: air pollution
            and tobacco-related respiratory damage. We build accessible wellness
            products that support lung health while raising awareness about
            cleaner, healthier living.
          </p>

          {/* Pillars */}
          <div className="space-y-4">
            {PILLARS.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  delay: 0.3 + i * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex items-center gap-4"
              >
                <div className="size-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-green-700" />
                </div>
                <span className="text-slate-700 font-medium text-base">{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
