// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { productService } from "./services/product.service";
import { useAuth } from "./context/AuthContext";
import Header from "./components/header";
import Footer from "./components/footer";

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: string;
  stock: number;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await productService.getProducts(
          selectedCategory || undefined
        );
        setProducts(data);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((product) => product.category))
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
              <div className="mt-10 mx-auto max-w-7xl px-4 lg:px-8 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block">ช้อปปิ้งออนไลน์ที่ดีที่สุด</span>
                    <span className="my-3 block text-blue-200">
                      ด้วยราคาที่คุ้มค่า
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    พบกับสินค้าคุณภาพดี ราคาถูก
                    จัดส่งถึงบ้านคุณอย่างรวดเร็วและปลอดภัย
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <a
                        href="#products"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
                      >
                        ดูสินค้าเลย
                      </a>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <a
                        href="#categories"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-500 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10 transition-colors"
                      >
                        หมวดหมู่สินค้า
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            {/* <div className="h-56 w-full bg-gradient-to-r from-blue-500/30 to-indigo-600/30 backdrop-blur-sm sm:h-72 md:h-96 lg:w-full lg:h-full"></div> */}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Categories */}
          <div id="categories" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              หมวดหมู่สินค้า
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                ทั้งหมด
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div id="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">สินค้าแนะนำ</h2>
              {searchQuery && (
                <p className="text-sm text-gray-500">
                  ผลการค้นหา: "{searchQuery}"
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  ไม่พบสินค้า
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  ลองค้นหาด้วยคำค้นอื่น หรือเลือกหมวดหมู่อื่น
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="h-48 w-full bg-gray-200 group-hover:opacity-90 transition-opacity">
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            {product.name}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {product.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <p className="text-lg font-bold text-gray-900">
                            ฿{product.price.toLocaleString()}
                          </p>
                          <div className="ml-4">
                            <button
                              className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (isLoggedIn) {
                                  console.log("Add to cart:", product);
                                  // In the future, this will connect to the backend
                                } else {
                                  window.location.href = "/login";
                                }
                              }}
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
