"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useAuth } from "../../context/AuthContext";

interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  image?: File | null;
}

const AddServicePage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    description: "",
    price: "",
    category: "Web Development", // ค่าเริ่มต้น
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // สร้าง URL สำหรับแสดงตัวอย่างรูปภาพ
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    try {
      // ในการใช้งานจริง คุณจะส่งข้อมูลไปยัง API
      // const response = await api.post('/freelancer/services', {
      //   title: formData.title,
      //   description: formData.description,
      //   price: Number(formData.price),
      //   category: formData.category,
      //   // สำหรับรูปภาพ คุณอาจจะต้องใช้ FormData
      // });

      // จำลองการส่งข้อมูลสำเร็จ
      console.log("Service submitted:", formData);

      // รอสักครู่ก่อนเปลี่ยนหน้า (จำลองการส่ง API)
      setTimeout(() => {
        router.push("/freelancer");
      }, 1000);
    } catch (err) {
      console.error("Error adding service:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

                {/* รูปภาพ */}
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Service Image
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      {preview ? (
                        <div className="mb-4">
                          <img
                            src={preview}
                            alt="Preview"
                            className="mx-auto h-40 w-auto object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPreview(null);
                              setFormData((prev) => ({ ...prev, image: null }));
                            }}
                            className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-500 bg-red-900/20 hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <svg
                          className="mx-auto h-12 w-12 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                      <div className="flex text-sm text-gray-400">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer rounded-md font-medium text-yellow-500 hover:text-yellow-400 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
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
