"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";

const AlertPage: React.FC = () => {
  const router = useRouter();
  const [redirectPath, setRedirectPath] = useState<string>("/");
  const [countdown, setCountdown] = useState<number>(5);
  const [message, setMessage] = useState<string>(
    "You do not have permission to access this page."
  );

  useEffect(() => {
    // Check user role and set appropriate redirect path
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        const parsedUser = JSON.parse(user);
        const userRole = parsedUser.role;

        if (userRole === "freelancer") {
          setRedirectPath("/freelancer");
          setMessage(
            "This area is not accessible to freelancers. Redirecting to your dashboard."
          );
        } else if (userRole === "user") {
          setRedirectPath("/");
          setMessage(
            "This area is not accessible to regular users. Redirecting to homepage."
          );
        } else if (userRole === "admin") {
          setRedirectPath("/admin");
          setMessage("Redirecting to admin dashboard.");
        } else {
          setRedirectPath("/");
          setMessage("Unknown user role. Redirecting to homepage.");
        }
      } else {
        // No user logged in
        setMessage("Please log in to access this content.");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setMessage("An error occurred while checking your access permissions.");
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-redirect after countdown finishes
    const redirectTimeout = setTimeout(() => {
      router.push(redirectPath);
    }, 5000);

    // Clear timeout and interval on component unmount
    return () => {
      clearTimeout(redirectTimeout);
      clearInterval(timer);
    };
  }, [router, redirectPath]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Alert content */}
      <main className="flex-grow flex items-center justify-center py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">
              <span className="text-white">Access</span>{" "}
              <span className="text-red-500">Denied</span>
            </h1>

            <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto mb-4"></div>

            <p className="text-gray-300 text-center mb-6">{message}</p>

            <div className="text-sm text-gray-500 text-center mb-6">
              You will be redirected in{" "}
              <span className="text-yellow-500 font-medium">{countdown}</span>{" "}
              seconds.
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => router.push(redirectPath)}
                className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AlertPage;
