import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Divider */}
        <div className="border-t border-white/20 mb-12" />

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Us */}
          {/* <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
              About Us
            </h4>
          </div> */}

          {/* Need Help */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
              Need Help?
            </h4>

            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-xl font-semibold">
                  Contact Us
                </Link>
              </li>

              {/* <li>
                <a href="/sitemap" className="text-xl font-semibold">
                  Sitemap
                </a>
              </li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <p className="text-sm mb-2">For Queries email us:</p>

              <a
                href="mailto:welovetalking@godesi.in"
                className="text-xl font-semibold underline underline-offset-4"
              >
                welovetalking@purepuff.in
              </a>
            </div>

            <div>
              <p className="text-sm mb-2">For Any Order Related Queries</p>

              <a
                href="tel:+919353756891"
                className="text-xl font-semibold underline underline-offset-4"
              >
                +91 9353756891
              </a>
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-8">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-6">
              Follow Us At
            </h4>

            {/* Todo Add Links */}
            <div className="flex border border-white/20 w-fit">
              <a
                href="#"
                className="w-16 h-16 flex items-center justify-center border-r border-white/20 hover:bg-white/10 transition"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="#"
                className="w-16 h-16 flex items-center justify-center hover:bg-white/10 transition"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* DPIIT & MSME Logos */}
          <div className="flex-col items-center gap-2">
            <img
              src="/DPIIT.jpg"
              alt="DPIIT"
              className="size-20 object-contain"
            />
            <img
              src="/MSME.png"
              alt="MSME"
              className="size-20 object-contain"
            />
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Company Details */}
          <div>
            <p className="text-sm text-gray-400">
              © 2026 Renma Inovation Pvt Lmt. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">CIN: U10733KA2018PTC109651</p>
            <p className="text-sm text-gray-400">DPIIT No: XXXXXXXX</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
