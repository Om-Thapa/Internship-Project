import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { value: "1.3B",  label: "Smokers worldwide exposed to harmful toxins daily"        },
  { value: "8.1M",  label: "Deaths globally linked to air pollution every year"        },
  { value: "7M",    label: "Annual deaths caused by direct tobacco use"               },
  { value: "99%",   label: "Of people breathe air that exceeds safe WHO limits"       },
  { value: "2B+",   label: "People affected by indoor air pollution"                  },
  { value: "24/7",  label: "Continuous exposure to harmful airborne particles"        },
];

export default function ImpactStats() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-green-400 mb-3 block">
          The Reality
        </span>
        <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight">
          The Air We Breathe
          <br />
          <span className="gradient-text">Is Changing</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
          Pollution and tobacco exposure silently impact millions of lives.
          Understanding the scale is the first step toward lasting change.
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="glass-dark rounded-2xl p-8 hover:bg-white/[0.12] transition-colors duration-300 group"
          >
            <div className="text-5xl lg:text-6xl font-black gradient-text mb-4 group-hover:scale-105 transition-transform duration-300 origin-left">
              {stat.value}
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
