"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useAuth } from "../../context/AuthContext";

// TypeScript interfaces
interface ServiceStats {
  totalServices: number;
  activeServices: number;
  pendingServices: number;
  rejectedServices: number;
  categoryCounts: Record<string, number>;
}

interface FreelancerStats {
  totalFreelancers: number;
  activeFreelancers: number;
  newFreelancersThisMonth: number;
  topCategories: Record<string, number>;
}

const FreelancerAdminDashboard: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [serviceStats, setServiceStats] = useState<ServiceStats | null>(null);
  const [freelancerStats, setFreelancerStats] =
    useState<FreelancerStats | null>(null);

  // Mock data for demonstration
  const sampleServiceStats: ServiceStats = {
    totalServices: 1567,
    activeServices: 1245,
    pendingServices: 287,
    rejectedServices: 35,
    categoryCounts: {
      "Web Development": 542,
      Design: 389,
      "Digital Marketing": 247,
      Writing: 201,
      "Video & Animation": 188,
    },
  };

  const sampleFreelancerStats: FreelancerStats = {
    totalFreelancers: 2147,
    activeFreelancers: 1876,
    newFreelancersThisMonth: 124,
    topCategories: {
      "Web Development": 486,
      Design: 342,
      "Digital Marketing": 215,
      Writing: 189,
      Programming: 167,
    },
  };

  // Check authentication and redirect if not admin
  useEffect(() => {
    setIsLoading(true);

    // Simulate API call to fetch stats
    setTimeout(() => {
      if (!isAuthenticated || user?.role !== "admin") {
        router.push("/login");
      } else {
        setServiceStats(sampleServiceStats);
        setFreelancerStats(sampleFreelancerStats);
        setIsLoading(false);
      }
    }, 800);
  }, [isAuthenticated, user, router]);

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

      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-black to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="text-white">Admin</span>{" "}
                  <span className="text-yellow-500">Dashboard</span>
                </h1>
                <p className="text-gray-400">
                Admin platform statistics and performance analytics
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats overview */}
        <section className="bg-gray-900 py-6 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Total Freelancers</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-white mr-2">
                    {freelancerStats?.totalFreelancers.toLocaleString()}
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border-l-2 bg-green-900/30 text-green-400 border-green-500">
                    +7.2%
                  </span>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Total Services</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-white mr-2">
                    {serviceStats?.totalServices.toLocaleString()}
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border-l-2 bg-green-900/30 text-green-400 border-green-500">
                    +5.1%
                  </span>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">Active Freelancers</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-white mr-2">
                    {freelancerStats?.activeFreelancers.toLocaleString()}
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border-l-2 bg-blue-900/30 text-blue-400 border-blue-500">
                    +3.8%
                  </span>
                </div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">New Freelancers</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-white mr-2">
                    {freelancerStats?.newFreelancersThisMonth.toLocaleString()}
                  </p>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium border-l-2 bg-green-900/30 text-green-400 border-green-500">
                    +12.3%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Statistics */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Categories */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
                <h3 className="text-lg font-medium text-yellow-500 mb-4">
                  Service Categories
                </h3>
                <div className="space-y-3">
                  {Object.entries(serviceStats?.categoryCounts || {}).map(
                    ([category, count]) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{category}</span>
                          <span className="text-gray-400">{count}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (count / (serviceStats?.totalServices || 1)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Freelancer Categories */}
              <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-6">
                <h3 className="text-lg font-medium text-yellow-500 mb-4">
                  Top Freelancer Categories
                </h3>
                <div className="space-y-3">
                  {Object.entries(freelancerStats?.topCategories || {}).map(
                    ([category, count]) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{category}</span>
                          <span className="text-gray-400">{count}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (count /
                                  (freelancerStats?.totalFreelancers || 1)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Service Status */}
            <div className="mt-6 bg-gray-900/50 rounded-lg border border-gray-800 p-6">
              <h3 className="text-lg font-medium text-yellow-500 mb-4">
                Service Status
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-400">
                    {serviceStats?.activeServices.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Active Services</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-yellow-400">
                    {serviceStats?.pendingServices.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Pending Services</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-red-400">
                    {serviceStats?.rejectedServices.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">Rejected Services</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreelancerAdminDashboard;
