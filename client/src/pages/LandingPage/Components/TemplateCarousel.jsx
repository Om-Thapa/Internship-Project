import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ImageOff } from "lucide-react";
import templates from "@/data/templates";

/* ── Single template card ─────────────────────────────────────────────── */
function TemplateCard({ template }) {
  const { title, subtitle, tag, accent, image } = template;

  return (
    <div
      className="relative flex-shrink-0 w-[180px] sm:w-[220px] lg:w-[280px] aspect-[9/16] rounded-3xl overflow-hidden mx-2.5 sm:mx-3 group select-none"
      style={{
        background: image
          ? "#0f172a"
          : `linear-gradient(135deg, ${accent}33 0%, #0f172a 65%)`,
      }}
    >
      {/* Image (when provided) */}
      {image ? (
        <img
          src={image}
          alt={title}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        // ── Placeholder state ──────────────────────────────────────────
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 20%, ${accent}55, transparent 60%)`,
            }}
          />
          <ImageOff size={28} className="text-white/15" strokeWidth={1.5} />
        </div>
      )}

      {/* Bottom gradient + text overlay (always on top, like the reference) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full mb-2"
          style={{ backgroundColor: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}
        >
          {tag}
        </span>
        <h3 className="text-white font-bold text-lg leading-snug">{title}</h3>
        <p className="text-white/60 text-xs mt-0.5">{subtitle}</p>
      </div>

      {/* Thin top border for definition against the dark backdrop */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 pointer-events-none" />
    </div>
  );
}

/* ── One infinite-scrolling row ───────────────────────────────────────── */
function MarqueeRow({ items, direction = "left", duration = 40 }) {
  // Render the list twice back-to-back; translating exactly -50% then
  // creates a perfectly seamless loop with no visible jump.
  return (
    <div className="marquee-row">
      <div
        className={`marquee-track ${
          direction === "left" ? "marquee-track--left" : "marquee-track--right"
        }`}
        style={{ "--marquee-duration": `${duration}s` }}
      >
        {[...items, ...items].map((template, i) => (
          <TemplateCard key={`${template.id}-${i}`} template={template} />
        ))}
      </div>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────────────────────── */
export default function TemplateCarousel() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const rowOne = templates.filter((t) => t.row === 1);
  const rowTwo = templates.filter((t) => t.row === 2);

  return (
    <section
      ref={ref}
      className="relative bg-slate-800 py-24 overflow-hidden"
    >
      {/* Ambient glow, consistent with the rest of the site's orb language */}
      <div className="orb orb-green w-[600px] h-[400px] -top-32 left-1/2 -translate-x-1/2 opacity-[0.12] absolute pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-6 flex flex-wrap items-end justify-between gap-4 mb-12"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-green-400 mb-3 block">
            Curated For You
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Explore Our <span className="gradient-text">Wellness Templates</span>
          </h2>
        </div>
        <p className="text-slate-400 text-sm max-w-xs">
          Ready-made wellness routines, paired with the right PurePuff blend
          for every moment of your day.
        </p>
      </motion.div>

      {/* ── Carousel rows wrapper, with top/bottom fade mask ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.15 }}
        className="relative z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <div className="space-y-5 sm:space-y-6">
          <MarqueeRow items={rowOne} direction="left"  duration={40} />
          <MarqueeRow items={rowTwo} direction="right" duration={46} />
        </div>
      </motion.div>
    </section>
  );
}
