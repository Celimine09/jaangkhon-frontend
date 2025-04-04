"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import { useAuth } from "../context/AuthContext";

// Define TypeScript interfaces
interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  status: "active" | "pending" | "rejected";
}

interface FreelancerProfile {
  id: number;
  skills: string[];
  experience: string;
  hourlyRate: number;
  rating?: number;
  completedJobs?: number;
}

const FreelancerDashboard: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"services" | "stats" | "profile">(
    "services"
  );
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const sampleServices: Service[] = [
    {
      id: 1,
      title: "Professional Website Development",
      description:
        "I will create a responsive, modern website using React and Next.js with clean design and optimized performance.",
      price: 15000,
      category: "Web Development",
      imageUrl: "",
      createdAt: "2023-11-15",
      status: "active",
    },
    {
      id: 2,
      title: "UX/UI Design for Mobile Apps",
      description:
        "I will design intuitive and beautiful user interfaces for your mobile application with Figma.",
      price: 8000,
      category: "Design",
      imageUrl: "",
      createdAt: "2023-12-01",
      status: "active",
    },
    {
      id: 3,
      title: "SEO Optimization Service",
      description:
        "I will optimize your website for search engines to improve visibility and organic traffic.",
      price: 5000,
      category: "Digital Marketing",
      imageUrl: "",
      createdAt: "2024-01-10",
      status: "pending",
    },
  ];

  const sampleProfile: FreelancerProfile = {
    id: 1,
    skills: ["React", "Next.js", "TypeScript", "UI/UX Design", "SEO"],
    experience:
      "5 years of professional experience in web development and design.",
    hourlyRate: 800,
    rating: 4.8,
    completedJobs: 32,
  };

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call to fetch services and profile
    setTimeout(() => {
      setServices(sampleServices);
      setProfile(sampleProfile);
      setIsLoading(false);
    }, 800);

    // In a real application, you would fetch data from your API
    // if (!isAuthenticated || user?.role !== 'freelancer') {
    //   router.push('/login');
    // } else {
    //   // Fetch freelancer services
    //   api.get('/freelancer/services').then(response => {
    //     setServices(response.data);
    //     setIsLoading(false);
    //   });
    //
    //   // Fetch freelancer profile
    //   api.get('/freelancer/profile').then(response => {
    //     setProfile(response.data);
    //   });
    // }
  }, []);

  const handleAddService = () => {
    router.push("/freelancer/add-service");
  };

  const handleEditService = (id: number) => {
    router.push(`/freelancer/edit-service/${id}`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900/30 text-green-400 border-green-500";
      case "pending":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-500";
      case "rejected":
        return "bg-red-900/30 text-red-400 border-red-500";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-500";
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      {/* Main content */}
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="text-white">Freelancer</span>{" "}
                  <span className="text-yellow-500">Dashboard</span>
                </h1>
                <p className="text-gray-400">
                  Manage your services and track your performance
                </p>
              </div>
              <button
                onClick={handleAddService}
                className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors"
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Service
              </button>
            </div>
          </div>
        </section>

        {/* Stats overview */}
        <section className="bg-gray-900 py-6 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Services Listed</p>
                <p className="text-2xl font-bold text-white">
                  {services.length}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Completed Jobs</p>
                <p className="text-2xl font-bold text-white">
                  {profile?.completedJobs || 0}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Rating</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-white mr-2">
                    {profile?.rating || 0}
                  </p>
                  <svg
                    className="h-5 w-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Hourly Rate</p>
                <p className="text-2xl font-bold text-white">
                  ฿{profile?.hourlyRate || 0}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard tabs */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <div className="flex border-b border-gray-800 mb-6">
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "services"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-400 hover:text-yellow-400"
                }`}
                onClick={() => setActiveTab("services")}
              >
                My Services
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "stats"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-400 hover:text-yellow-400"
                }`}
                onClick={() => setActiveTab("stats")}
              >
                Statistics
              </button>
            </div>

            {/* Services tab content */}
            {activeTab === "services" && (
              <div>
                {services.length === 0 ? (
                  <div className="text-center py-16 bg-gray-900/50 rounded-lg border border-gray-800">
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
                      No services yet
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Get started by adding your first service.
                    </p>
                    <button
                      onClick={handleAddService}
                      className="mt-6 px-6 py-3 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors"
                    >
                      Add Service
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 transition-transform hover:scale-105"
                      >
                        <div className="h-48 bg-gray-800 flex items-center justify-center">
                          {service.imageUrl ? (
                            <img
                              src={service.imageUrl}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
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
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-white mb-1 line-clamp-2">
                                {service.title}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-l-4 ${getStatusBadgeClass(
                                  service.status
                                )}`}
                              >
                                {service.status.charAt(0).toUpperCase() +
                                  service.status.slice(1)}
                              </span>
                            </div>
                            <span className="text-lg font-bold text-yellow-500">
                              ฿{service.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-yellow-500">
                              {service.category}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-400 line-clamp-3">
                            {service.description}
                          </p>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Added on: {service.createdAt}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditService(service.id)}
                                className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-yellow-500 hover:bg-gray-700 transition-colors"
                                title="Edit"
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
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                              <button
                                className="p-2 rounded-full bg-gray-800 text-gray-300 hover:text-yellow-500 hover:bg-gray-700 transition-colors"
                                title="Preview"
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
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stats tab content */}
            {activeTab === "stats" && (
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
                <h2 className="text-xl font-bold mb-6">
                  Performance Statistics
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium text-yellow-500 mb-4">
                      Monthly Earnings
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-400">
                        Chart will be displayed here
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium text-yellow-500 mb-4">
                      Service Views
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                      <p className="text-gray-400">
                        Chart will be displayed here
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-yellow-500 mb-4">
                    Recent Orders
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-900 divide-y divide-gray-800">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            #12345
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            Professional Website Development
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            John Smith
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            2024-01-15
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                            ฿15,000
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-900/30 text-green-400">
                              Completed
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            #12346
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            UX/UI Design for Mobile Apps
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            Sarah Johnson
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            2024-01-20
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                            ฿8,000
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/30 text-blue-400">
                              In Progress
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreelancerDashboard;
