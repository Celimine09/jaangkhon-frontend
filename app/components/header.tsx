"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [displayMenu, setDisplayMenu] = useState(false);
  let timeoutId: NodeJS.Timeout;
  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setDisplayMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setDisplayMenu(false), 200); // หน่วงเวลา 200ms
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-600 flex items-center"
            >
              <span className="text-3xl mr-2">🛒</span>
              <span>Jaangkhon</span>
            </Link>
          </div>

          <div className="w-full max-w-xl px-4">
            <div className="relative">
              <input
                type="text"
                className="w-full h-10 pl-10 pr-4 py-1 text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="ค้นหาสินค้า..."
              />
              <div className="absolute left-4 top-3">
                <svg
                  className="h-4 w-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* ส่วนนี้จะแสดงเมื่อล็อกอินแล้ว */}

                <div
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center space-x-1 p-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{user?.username || "บัญชีของฉัน"}</span>
                  </button>

                  {displayMenu && (
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 "
                    >
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          ข้อมูลส่วนตัว
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          ประวัติการสั่งซื้อ
                        </Link>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          ออกจากระบบ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* ส่วนนี้จะแสดงเมื่อยังไม่ได้ล็อกอิน */}
                <Link
                  href="/login"
                  className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  FreeLance
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
function setIsOpen(arg0: boolean) {
  throw new Error("Function not implemented.");
}
