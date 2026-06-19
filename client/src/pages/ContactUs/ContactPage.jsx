import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Send,
  CheckCircle,
} from "lucide-react";

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const CONTACT_DETAILS = [
  {
    icon: Mail,
    title: "Email",
    detail: "hello@purepuff.in",
    href: "mailto:hello@purepuff.in",
  },
  {
    icon: Phone,
    title: "Customer Support",
    detail: "+91 80764 74412",
    href: "tel:+918076474412",
  },
  {
    icon: Building2,
    title: "Business Enquiries",
    detail: "partnerships@purepuff.in",
    href: "mailto:partnerships@purepuff.in",
  },
  {
    icon: MapPin,
    title: "Address",
    detail: "Renma Innovation Pvt Ltd\nBengaluru, Karnataka, India",
    href: null,
  },
];

const WHY_CONTACT = [
  "Product questions & guidance",
  "Bulk & wholesale orders",
  "Distribution opportunities",
  "Corporate wellness programs",
  "General customer support",
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Replace with real API call when ready
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafb]">
      {/* ── Hero ── */}
      <section className="relative hero-gradient overflow-hidden pt-32 pb-20">
        <div className="orb orb-green w-[500px] h-[500px] -top-40 -right-40 opacity-50 absolute pointer-events-none" />
        <div className="orb orb-teal  w-[300px] h-[300px] bottom-0  -left-20  opacity-30 absolute pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600 mb-3 block">
              Get In Touch
            </span>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05]">
              Let's <span className="gradient-text">Talk</span>
            </h1>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
              Questions, partnership opportunities, or just want to say hello —
              we're always happy to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* ─── Contact form ─── */}
          <Reveal>
            <div className="glass-card rounded-3xl p-8 h-full">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.1,
                    }}
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-[0_0_30px_rgba(52,201,116,0.25)]"
                  >
                    <CheckCircle size={30} className="text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Message Sent!
                  </h3>
                  <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-xs">
                    Thanks for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 text-sm text-green-600 font-semibold hover:text-green-700 underline underline-offset-4 transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-slate-900 mb-7">
                    Send a Message
                  </h2>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    {[
                      {
                        name: "name",
                        label: "Full Name",
                        type: "text",
                        placeholder: "Jane Doe",
                      },
                      {
                        name: "email",
                        label: "Email Address",
                        type: "email",
                        placeholder: "you@example.com",
                      },
                      {
                        name: "phone",
                        label: "Phone Number",
                        type: "tel",
                        placeholder: "+91 98765 43210",
                      },
                    ].map(({ name, label, type, placeholder }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 mb-2">
                          {label}
                        </label>
                        <input
                          type={type}
                          name={name}
                          placeholder={placeholder}
                          required
                          className="input-luxury"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="How can we help you?"
                        required
                        className="input-luxury resize-none"
                      />
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={loading}
                      className="btn-luxury w-full py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <span className="size-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      ) : (
                        <>
                          <Send size={15} /> Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </Reveal>

          {/* ─── Contact info ─── */}
          <div className="space-y-5">
            <Reveal delay={0.1}>
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="orb orb-teal w-64 h-64 -top-20 -right-20 opacity-20 absolute pointer-events-none" />

                <h2 className="text-2xl font-black mb-8 relative z-10">
                  Reach Us Directly
                </h2>

                <div className="space-y-6 relative z-10">
                  {CONTACT_DETAILS.map(
                    ({ icon: Icon, title, detail, href }) => (
                      <div key={title} className="flex gap-4 items-start">
                        <div className="size-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-0.5">
                            {title}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              className="text-sm font-medium hover:text-green-200 transition-colors whitespace-pre-line"
                            >
                              {detail}
                            </a>
                          ) : (
                            <p className="text-sm font-medium whitespace-pre-line">
                              {detail}
                            </p>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 text-base mb-4">
                  We can help with…
                </h3>
                <ul className="space-y-3">
                  {WHY_CONTACT.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <CheckCircle
                        size={15}
                        className="text-green-500 flex-shrink-0"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Response time note */}
            <Reveal delay={0.2}>
              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-lg">
                  ⚡
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Fast Response
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    We typically reply within 24 hours on business days.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
