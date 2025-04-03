"use client";

import React, { useState, useEffect } from "react";
import Footer from "./components/footer";
import Header from "./components/header";

// Define TypeScript interfaces
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

const LuxuryHomePage: React.FC = () => {
  const [isAuthenticated] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Sample product data
  const sampleProducts: Product[] = [
    {
      id: 1,
      name: "Premium Leather Wallet",
      description:
        "Handcrafted genuine leather wallet with multiple card slots and elegant design.",
      price: 2500,
      category: "Accessories",
      stock: 15,
      imageUrl: "",
    },
    {
      id: 2,
      name: "Gold Plated Watch",
      description:
        "Elegant timepiece with gold plating, Swiss movement, and sapphire crystal face.",
      price: 12500,
      category: "Watches",
      stock: 8,
      imageUrl: "",
    },
    {
      id: 3,
      name: "Silk Necktie",
      description:
        "100% pure silk necktie with sophisticated pattern, perfect for formal occasions.",
      price: 1800,
      category: "Fashion",
      stock: 20,
      imageUrl: "",
    },
    {
      id: 4,
      name: "Diamond Pendant",
      description:
        "Beautiful 0.5 carat diamond pendant on 18k gold chain, certified clarity and color.",
      price: 32000,
      category: "Jewelry",
      stock: 5,
      imageUrl: "",
    },
    {
      id: 5,
      name: "Designer Sunglasses",
      description:
        "Luxury sunglasses with UV protection and premium materials for the style-conscious individual.",
      price: 5900,
      category: "Accessories",
      stock: 12,
      imageUrl: "",
    },
    {
      id: 6,
      name: "Chronograph Watch",
      description:
        "Precision chronograph with premium materials and Swiss movement.",
      price: 18500,
      category: "Watches",
      stock: 6,
      imageUrl: "",
    },
    {
      id: 7,
      name: "Cashmere Scarf",
      description:
        "Luxuriously soft cashmere scarf with elegant design, perfect for any season.",
      price: 3800,
      category: "Fashion",
      stock: 15,
      imageUrl: "",
    },
    {
      id: 8,
      name: "Sapphire Earrings",
      description:
        "Stunning sapphire earrings set in white gold with diamond accents.",
      price: 24000,
      category: "Jewelry",
      stock: 4,
      imageUrl: "",
    },
  ];

  // Sample categories derived from the products
  const categories: string[] = ["Accessories", "Watches", "Fashion", "Jewelry"];

  // Filter products when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredProducts(sampleProducts);
    } else {
      const filtered = sampleProducts.filter(
        (product) => product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory]);

  // Initialize with all products on component mount
  useEffect(() => {
    setFilteredProducts(sampleProducts);
  }, []);

  const handleCategoryClick = (category: string): void => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="text-white">Luxury</span>{" "}
                <span className="text-yellow-500">Redefined</span>
              </h1>
              <p className="mt-6 text-gray-300 text-lg">
                Discover our exclusive collection of premium products crafted
                for those who appreciate the finer things in life.
              </p>
              <div className="mt-8 flex space-x-4">
                <a
                  href="/shop"
                  className="px-6 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors"
                >
                  Shop Now
                </a>
                <a
                  href="/collections"
                  className="px-6 py-3 border border-yellow-500 text-yellow-500 font-medium rounded-md hover:bg-yellow-500 hover:text-black transition-colors"
                >
                  Explore Collection
                </a>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="w-full h-64 md:h-96 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-20 blur-3xl absolute -right-20 top-1/2 transform -translate-y-1/2"></div>
              <div className="relative z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Our</span>{" "}
              <span className="text-yellow-500">Categories</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-6"></div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Browse our exclusive collections of carefully curated luxury
              products
            </p>
          </div>

          {/* Elegant Menu with Golden Accents */}
          <div className="flex justify-center">
            <div className="inline-flex items-center flex-wrap rounded-full border border-gray-800 bg-gray-900/60 backdrop-blur-sm px-1 py-1">
              <button
                onClick={() => handleCategoryClick("All")}
                className={`m-1 px-6 py-2 font-medium rounded-full transition-all duration-300 ${
                  selectedCategory === "All"
                    ? "text-black bg-yellow-500"
                    : "text-gray-300 hover:text-yellow-500 hover:bg-gray-800/50"
                }`}
              >
                All Products
              </button>
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                  className={`m-1 px-6 py-2 font-medium rounded-full transition-all duration-300 ${
                    selectedCategory === category
                      ? "text-black bg-yellow-500"
                      : "text-gray-300 hover:text-yellow-500 hover:bg-gray-800/50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products section - Now filtered by category */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-white">
              {selectedCategory === "All" ? "Featured" : selectedCategory}
            </span>{" "}
            <span className="text-yellow-500">Products</span>
          </h2>
          <p className="text-gray-400 text-center mb-6 max-w-3xl mx-auto">
            {selectedCategory === "All"
              ? "Discover our most exclusive and sought-after luxury items"
              : `Explore our premium selection of ${selectedCategory.toLowerCase()}`}
          </p>

          {/* Product count */}
          <p className="text-center text-gray-500 mb-10">
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 transition-transform hover:scale-105"
                >
                  <a href={`/product/${product.id}`}>
                    <div className="h-48 bg-gray-800 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-600">No image</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-white truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-400 text-sm ml-1">
                            {(4 + Math.random()).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-yellow-500">
                          {product.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-yellow-500">
                          ฿{product.price.toLocaleString()}
                        </span>
                        <button
                          className="p-2 rounded-full bg-yellow-500 text-black hover:bg-yellow-400 transition-colors"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add to cart logic here
                          }}
                        >
                          <svg
                            className="w-5 h-5"
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
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-xl font-medium text-white">
                No products found
              </h3>
              <p className="mt-1 text-gray-500">
                We couldn't find any products in this category.
              </p>
            </div>
          )}

          <div className="mt-12 text-center">
            <a
              href="/shop"
              className="inline-block px-8 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LuxuryHomePage;
