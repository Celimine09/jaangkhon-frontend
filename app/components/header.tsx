"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string>("/");
  let timeoutId: NodeJS.Timeout;

  // Avoid hydration mismatch by detecting client-side rendering
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        const parsedUser = JSON.parse(user);
        const userRole = parsedUser.role;

        if (userRole === "freelancer") {
          setRedirectPath("/freelancer");
        } else if (userRole === "user") {
          setRedirectPath("/");
        } else if (userRole === "admin") {
          setRedirectPath("/admin");
        } else {
          setRedirectPath("/");
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    setIsClient(true);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setDisplayMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setDisplayMenu(false), 200);
  };

  const handleLogout = useCallback(() => {
    setDisplayMenu(false);
    logout();
  }, [logout]);

  return (
    <header className="bg-black border-b border-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href={redirectPath}
              className="text-2xl font-bold text-yellow-500 flex items-center"
            >
              <span className="text-3xl mr-2">💼</span>
              <span>JAANGKHON</span>
            </Link>
          </div>

          <div className="w-full max-w-xl px-4">
            <div className="relative">
              <input
                type="text"
                className={`w-full h-10 pl-10 pr-4 py-1 text-base bg-gray-900 border ${
                  isSearchFocused ? "border-yellow-500" : "border-gray-700"
                } text-white rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors`}
                placeholder="ค้นหาสินค้า..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
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
            {isClient && isAuthenticated ? (
              <>
                {/* ส่วนนี้จะแสดงเมื่อล็อกอินแล้ว */}
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black transform translate-x-1/2 -translate-y-1/2 bg-yellow-500 rounded-full">
                    0
                  </span>
                </Link>

                <div
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center space-x-1 p-2 text-gray-300 hover:text-yellow-500 transition-colors">
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
                      className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-md shadow-lg overflow-hidden z-20"
                    >
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-500"
                        >
                          ข้อมูลส่วนตัว
                        </Link>
                        <Link
                          href="/profile"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-yellow-500"
                        >
                          ประวัติการสั่งซื้อ
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300"
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
                  href="/register/freelance"
                  className="px-4 py-2 border border-yellow-500 rounded-md text-sm font-medium text-yellow-500 bg-black hover:bg-gray-900 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-yellow-500 transition-colors shadow-md"
                >
                  FreeLance
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-yellow-500 transition-colors shadow-md"
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
