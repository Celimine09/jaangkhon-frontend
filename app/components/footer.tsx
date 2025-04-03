"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-2">🛒</span>
              <span className="text-xl font-bold">Your Marketplace</span>
            </div>
            <p className="text-gray-300">
              Your Marketplace
              เป็นแพลตฟอร์มซื้อขายสินค้าออนไลน์ที่รวบรวมสินค้าคุณภาพดีจากผู้ขายที่น่าเชื่อถือ
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">ลิงก์ด่วน</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  หน้าหลัก
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">ติดต่อเรา</h3>
            <address className="not-italic text-gray-300">
              <p>123 ถนนสุขุมวิท</p>
              <p>กรุงเทพมหานคร 10110</p>
              <p className="mt-2">
                <a
                  href="mailto:contact@yourmarketplace.com"
                  className="hover:text-white transition-colors"
                >
                  contact@yourmarketplace.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+6623456789"
                  className="hover:text-white transition-colors"
                >
                  02-345-6789
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Jaangkhon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
