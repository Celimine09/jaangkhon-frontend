"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  category: string;
}

const AddServicePage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    price: "",
    category: "Web Development", // ค่าเริ่มต้น
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ตรวจสอบการล็อกอินและบทบาทของผู้ใช้
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "freelancer") {
      router.push("/alert");
      return;
    }
  }, [isAuthenticated, user, router]);

  // Categories for the dropdown
  const categories = [
    "Web Development",
    "Mobile Development",
    "Design",
    "Digital Marketing",
    "Content Writing",
    "Translation",
    "Video & Animation",
    "Data & Analytics",
    "Business",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ตรวจสอบข้อมูล
    if (!formData.title.trim()) {
      setError("Please enter a service title");
      setLoading(false);
      return;
    }

    if (!formData.description.trim() || formData.description.length < 20) {
      setError("Please enter a description (at least 20 characters)");
      setLoading(false);
      return;
    }

    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      setError("Please enter a valid price");
      setLoading(false);
      return;
    }

    if (!user || !user.id) {
      setError("You need to be logged in to create a service");
      setLoading(false);
      return;
    }

    try {
      // สร้าง service object ที่จะส่งไปยัง API
      const serviceData = {
        name: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: 1, // กำหนดค่าเริ่มต้น
        isActive: true,
        // ไม่ต้องส่ง userId เพราะ backend จะดึงจาก JWT token (req.user.id)
      };

      // ส่งข้อมูลไปยัง API
      const response = await api.post("/products", serviceData);

      // แสดงข้อความสำเร็จและเปลี่ยนเส้นทาง
      setTimeout(() => {
        router.push("/freelancer");
      }, 1000);
    } catch (err) {
      // ดึงข้อความ error จาก response ของ API (ถ้ามี)
      let errorMessage = "Failed to add service. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null) {
        // ตรวจสอบว่ามี response data หรือไม่
        const anyErr = err as any;
        if (
          anyErr.response &&
          anyErr.response.data &&
          anyErr.response.data.message
        ) {
          errorMessage = anyErr.response.data.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ถ้ากำลังตรวจสอบการล็อกอิน
  if (loading && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                href="/freelancer"
                className="flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-3xl font-bold">
              <span className="text-white">Add New</span>{" "}
              <span className="text-yellow-500">Service</span>
            </h1>
            <p className="mt-2 text-gray-400">
              Create a new service to showcase your skills and attract clients
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

          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* ชื่อบริการ */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Professional Website Development"
                  />
                </div>

                {/* หมวดหมู่ */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 20 20"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* รายละเอียด */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Describe your service in detail. What do you offer? What's included? What's your process?"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Min. 20 characters. Be specific about what you're offering
                    to attract the right clients.
                  </p>
                </div>

                {/* ราคา */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Price (THB) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">฿</span>
                    </div>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={formData.price}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* แสดงข้อมูลผู้สร้าง service */}
                <div className="mt-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">
                      Service Provider Information
                    </h3>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 mr-3">
                        {user?.firstName?.charAt(0) ||
                          user?.username?.charAt(0) ||
                          "U"}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {user?.username || "User"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      You are creating this service as a freelancer. Your
                      profile information will be shown to potential clients.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end">
                  <Link
                    href="/freelancer"
                    className="mr-4 inline-flex justify-center py-3 px-6 border border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Saving...
                      </>
                    ) : (
                      "Save Service"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddServicePage;
