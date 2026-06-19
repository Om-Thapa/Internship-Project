import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/contact", label: "Contact" },
  { to: "/cart", label: "Cart" },
  { to: "/my-orders", label: "My Orders" },
];

const SOCIAL = [
  {
    to: "https://www.linkedin.com/in/renma-innovations-private-limited-0153b1405",
    Icon: FaLinkedin,
    label: "LinkedIn",
  },
  {
    to: "https://www.instagram.com/renmainnovations",
    Icon: FaInstagram,
    label: "Instagram",
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="orb orb-green w-[700px] h-[400px] top-0 left-1/2 -translate-x-1/2 opacity-[0.05] absolute pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-10">
        {/* Top divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-14" />

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* ─── Brand ─── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="size-10 rounded-xl overflow-hidden ring-1 ring-white/20 transition-all duration-300 group-hover:ring-white/40">
                <img
                  src="/LOGO.jpg.jpeg"
                  alt="PurePuff"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-black text-xl gradient-text">PurePuff</span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Respiratory wellness for everyday life. Clean, natural, effective
              — made with care in India.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {SOCIAL.map(({ to, Icon, label }) => (
                <a
                  key={to}
                  href={to}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="size-10 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ─── Navigation ─── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-5">
              Navigate
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Contact ─── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-5">
              Contact
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:renmainnovations@gmail.com"
                className="block text-slate-400 hover:text-white transition-colors duration-200 break-all"
              >
                renmainnovations@gmail.com
              </a>
              <a
                href="tel:+918076474412"
                className="block text-slate-400 hover:text-white transition-colors duration-200"
              >
                +91 8076474412
              </a>
              <p className="text-slate-500 leading-relaxed text-xs">
                Bengaluru, Karnataka
                <br />
                India — 560001
              </p>
            </div>
          </div>

          {/* ─── Certifications ─── */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-5">
              Certified By
            </h4>
            <div className="flex gap-3 mb-5">
              {[
                { src: "/DPIIT.jpg", alt: "DPIIT Recognised" },
                { src: "/MSME.png", alt: "MSME Registered" },
              ].map(({ src, alt }) => (
                <div
                  key={src}
                  className="size-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 p-1.5"
                  title={alt}
                >
                  <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              DPIIT Recognised Startup
              <br />
              MSME Registered Enterprise
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <div className="text-center sm:text-left space-y-1">
            <p>© 2026 RENMA INNOVATION Pvt Ltd. All rights reserved.</p>
            <p>CIN: U10732UT2025PTC018913</p>
          </div>
          <p className="text-slate-700">Made with 🌿 in India</p>
        </div>
      </div>
    </footer>
  );
}
