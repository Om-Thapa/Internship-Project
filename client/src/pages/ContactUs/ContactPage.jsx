import { Mail, Phone, MapPin, Building2 } from "lucide-react";
import { motion } from "framer-motion";
export default function ContactPage() {
  return (
    <section className="bg-[#F8FCF8] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="uppercase tracking-[0.3em] text-green-600 font-semibold">
            Contact PurePuff
          </span>

          <h1 className="text-6xl font-bold mt-4">
            Let's Start a Conversation
          </h1>

          <p className="text-gray-600 text-xl mt-6 max-w-3xl mx-auto">
            Whether you have questions about our products, want to become a
            distributor, or simply wish to learn more about respiratory
            wellness, we're here to help.
          </p>
        </div>

        {/* Main Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.8, y: -20 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="grid lg:grid-cols-2 gap-12"
        >
          {/* Form */}
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-green-100">
            <h2 className="text-3xl font-bold mb-8">Send us a message</h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-green-600"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-green-600"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-green-600"
              />

              <textarea
                rows={6}
                placeholder="How can we help?"
                className="w-full border border-gray-200 rounded-xl px-5 py-4 outline-none focus:border-green-600"
              />

              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold transition">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="bg-green-600 text-white rounded-3xl p-10">
            <h2 className="text-3xl font-bold mb-10">Reach Us Directly</h2>

            <div className="space-y-8">
              <div className="flex gap-4">
                <Mail className="mt-1" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p>hello@purepuff.in</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone className="mt-1" />
                <div>
                  <p className="font-semibold">Customer Support</p>
                  <p>+91 XXXXX XXXXX</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Building2 className="mt-1" />
                <div>
                  <p className="font-semibold">Business Enquiries</p>
                  <p>partnerships@purepuff.in</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin className="mt-1" />
                <div>
                  <p className="font-semibold">Address</p>
                  <p>
                    Renma Innovation Pvt Ltd
                    <br />
                    Bengaluru, Karnataka, India
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight Box */}
            <div className="mt-12 bg-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-xl mb-4">Why Contact PurePuff?</h3>

              <ul className="space-y-2 text-white/90">
                <li>✓ Product Questions</li>
                <li>✓ Bulk Orders</li>
                <li>✓ Distribution Opportunities</li>
                <li>✓ Corporate Wellness Programs</li>
                <li>✓ Customer Support</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
