"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";
import { productService } from "../services/product.service";

// Define TypeScript interfaces
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  userId: number;
  rating?: number;
  reviews?: Review[];
}

interface Review {
  id: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface User {
  id: number;
  name: string;
  rating?: number;
  completedJobs?: number;
}

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // In a real application, you would get the product ID from the URL
  // For now, we'll use a static ID for demonstration
  const productId = 1;

  useEffect(() => {
    const checkUserAccess = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        
        if (token && user) {
          const parsedUser = JSON.parse(user);
          const userRole = parsedUser.role;
          console.log("User role detected:", userRole);
          
          // If not a regular user, redirect immediately
          if (userRole !== "user") {
            console.log("Unauthorized access, redirecting to alert page");
            router.push("/alert");
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error("Error checking user access:", error);
        return true; // Continue loading on error
      }
    };
    setIsLoading(false);

    // For demonstration, set sample data
    const product: Product = {
      id: 1,
      name: "Professional Website Development",
      description:
        "Get a custom-built responsive website with modern design. Includes 5 pages, contact form, SEO optimization, and mobile-friendly layout. Perfect for small businesses, portfolios, or personal brands looking to establish an online presence.",
      price: 12000,
      category: "Web Development",
      imageUrl: "",
      isActive: true,
      userId: 1,
      rating: 4.7,
      reviews: [
        {
          id: 1,
          userId: 2,
          username: "JohnDoe",
          rating: 5,
          comment:
            "Exceptional work! The website exceeded my expectations and was delivered ahead of schedule.",
          createdAt: "2025-03-15",
        },
        {
          id: 2,
          userId: 3,
          username: "MariaS",
          rating: 4,
          comment:
            "Great design and functionality. Would recommend for any small business.",
          createdAt: "2025-03-10",
        },
      ],
    };

    const sampleSeller: User = {
      id: 1,
      name: "Alex Developer",
      rating: 4.8,
      completedJobs: 32,
    };

    setProduct(product);
    setSeller(sampleSeller);
    setIsLoading(false);
  }, [productId]);



  const handlePurchase = () => {
    router.push("/payment");

    // In a real application, you would call an API to initiate purchase
    console.log(`Purchasing ${quantity} of product ${productId}`);

    // Show success message
    setShowSuccessMessage(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Product added to cart successfully!
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-gray-900 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm">
            <button
              className="text-gray-400 hover:text-white"
            >
              Home
            </button>
            <span className="mx-2 text-gray-600">/</span>
            <button
              className="text-gray-400 hover:text-white"
            >
              {product.category}
            </button>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-yellow-500">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-80 lg:h-96 object-cover"
                />
              ) : (
                <div className="w-full h-80 lg:h-96 flex items-center justify-center bg-gray-800">
                  <svg
                    className="h-24 w-24 text-gray-700"
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
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-white mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">{product.rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(product.rating || 0)
                            ? "text-yellow-500"
                            : "text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="mx-2 text-gray-600">|</span>
                <span className="text-gray-400">
                  {product.reviews?.length || 0} reviews
                </span>
              </div>

              <div className="text-3xl font-bold text-yellow-500 mb-6">
                ฿{product.price.toLocaleString()}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-400">{product.description}</p>
              </div>

              {/* Seller Information */}
              <div className="mb-8 bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-2">
                  About the Seller
                </h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                    {seller?.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-white">{seller?.name}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="flex items-center">
                        <svg
                          className="h-4 w-4 text-yellow-500 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {seller?.rating} ({seller?.completedJobs} jobs)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity and Purchase */}
              <div className="mt-auto">
                <div className="flex items-center mb-4">
                  <label className="block text-sm font-medium text-gray-400 mr-4">
                    Quantity:
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={decrementQuantity}
                      className="p-2 rounded-l-md bg-gray-800 text-white hover:bg-gray-700"
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="px-4 py-2 bg-gray-800 text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-2 rounded-r-md bg-gray-800 text-white hover:bg-gray-700"
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

                <div className="flex space-x-4">
                  <button
                    onClick={handlePurchase}
                    className="w-full py-4 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-400 transition-colors flex items-center justify-center"
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Purchase Now
                  </button>
                  <button
                    className="p-4 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                    title="Add to favorites"
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Customer Reviews
            </h2>

            {(product.reviews?.length || 0) > 0 ? (
              <div className="space-y-6">
                {product.reviews?.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                          {review.username.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-white">
                            {review.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {review.createdAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-5 w-5 ${
                              star <= review.rating
                                ? "text-yellow-500"
                                : "text-gray-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-white">
                  No reviews yet
                </h3>
                <p className="mt-1 text-gray-500">
                  Be the first to review this product!
                </p>
              </div>
            )}
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Similar Services
              </h2>
              <button
                className="text-yellow-500 hover:text-yellow-400"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 transition-transform hover:scale-105 cursor-pointer"
                >
                  <div className="h-48 bg-gray-800 flex items-center justify-center">
                    <div className="flex items-center justify-center text-gray-600">
                      <svg
                        className="h-16 w-16 text-gray-700"
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
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-white mb-1 line-clamp-2">
                      {item === 1
                        ? "E-commerce Website Development"
                        : item === 2
                        ? "WordPress Site with SEO"
                        : "Custom Web Application"}
                    </h3>
                    <div className="flex justify-between items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= 4 ? "text-yellow-500" : "text-gray-600"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-lg font-bold text-yellow-500">
                        ฿{(10000 + item * 2000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
