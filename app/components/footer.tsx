"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-2">💼</span>
              <span className="text-xl font-bold text-yellow-500">
                JAANGKHON
              </span>
            </div>
            <p className="text-gray-400">
              Jaangkhon is a luxury marketplace platform offering high-quality
              products from trusted sellers.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <address className="not-italic text-gray-400">
              <p>1 Chalong Krung 1 Alley, Lat Krabang,</p>
              <p> Bangkok 10520, Thailand</p>
              <p className="mt-2">
                <a
                  href="mailto:contact@jaangkhon.com"
                  className="hover:text-yellow-500 transition-colors"
                >
                  contact@jaangkhon.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+6623456789"
                  className="hover:text-yellow-500 transition-colors"
                >
                  02-376-8883
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Jaangkhon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
