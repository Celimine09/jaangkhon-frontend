"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "../services/auth.service";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "user", // ค่าเริ่มต้นเป็น user
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Form data being submitted:", formData);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Password Not Match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password need to be at least 8 letters!");
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      );
      setLoading(false);
      return;
    }

    try {
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        role: formData.role, // ส่งข้อมูล role ไปด้วย
      });

      // Redirect to login page after successful registration
      router.push("/login");
    } catch (err) {
      console.error("Registration error:", err);

      // ปรับปรุงการแสดงข้อความผิดพลาด
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null) {
        setError(JSON.stringify(err));
      } else {
        setError("Register Failed! Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="text-2xl font-bold text-yellow-500 flex items-center"
        >
          <span className="text-6xl">💼</span>
          <span className="ml-2 pt-3 text-5xl">JAANGKHON</span>
        </Link>
      </div>

      <div className="max-w-md w-full backdrop-blur-sm bg-gray-900/80 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Register
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Or{" "}
              <Link
                href="/login"
                className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-900/30 p-4 text-sm text-red-400 border-l-4 border-red-500">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                placeholder="Username"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  First Name (Optional)
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="First name"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Last Name (Optional)
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must contain at least one uppercase letter, one
                lowercase letter, and one number
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange("user")}
                  className={`flex flex-col items-center justify-center p-4 border ${
                    formData.role === "user"
                      ? "border-yellow-500 bg-yellow-500/10"
                      : "border-gray-700 bg-gray-800"
                  } rounded-lg transition-all duration-200 hover:border-yellow-500/70`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full mb-2">
                    <svg
                      className={`w-6 h-6 ${
                        formData.role === "user"
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      formData.role === "user" ? "text-white" : "text-gray-400"
                    }`}
                  >
                    User
                  </span>
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    Regular customer account
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`flex flex-col items-center justify-center p-4 border ${
                    formData.role === "admin"
                      ? "border-yellow-500 bg-yellow-500/10"
                      : "border-gray-700 bg-gray-800"
                  } rounded-lg transition-all duration-200 hover:border-yellow-500/70`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-full mb-2">
                    <svg
                      className={`w-6 h-6 ${
                        formData.role === "admin"
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      formData.role === "admin" ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Admin
                  </span>
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    Administrative privileges
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 bg-gray-800 border-gray-700 rounded"
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-300"
              >
                I agree with{" "}
                <Link
                  href="/terms"
                  className="font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  Terms and Conditions
                </Link>{" "}
                of this website
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Jaangkhon. All rights reserved.
      </div>
    </div>
  );
};

export default RegisterPage;
