"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from "../services/api";
import Link from "next/link";

// Dashboard stats interface
interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  usersByRole: {
    user: number;
    admin: number;
    freelancer: number;
  };
  productsByCategory: Record<string, number>;
}

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    usersByRole: {
      user: 0,
      admin: 0,
      freelancer: 0,
    },
    productsByCategory: {},
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAuthenticated && user?.role === "admin") {
        try {
          setIsLoading(true);
          const dashboardData = await api.get("/admin/dashboard-stats");
          setStats(dashboardData.data);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user]);

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/");
    } else if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString()}`;
  };

  // Calculate percentage for progress bars
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main className="flex-grow py-10 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">Admin</span>{" "}
              <span className="text-yellow-500">Dashboard</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6"></div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 border border-yellow-500 rounded-md text-sm font-medium text-yellow-500 bg-black hover:bg-gray-900 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-yellow-500 transition-colors shadow-md"
            >
              สรุปผล
            </Link>
                      
            <Link
              href="/admin/user"
              className="px-4 py-2 border border-yellow-500 rounded-md text-sm font-medium text-yellow-500 bg-black hover:bg-gray-900 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-yellow-500 transition-colors shadow-md"
            >
              ผู้ใช้
            </Link>
          </div>
          

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 transition-transform hover:scale-105">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 mb-1">Total Users</p>
                      <h3 className="text-3xl font-bold text-white">
                        {stats.totalUsers}
                      </h3>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-full">
                      <svg
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-green-500 text-sm flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      <span>+12% from last month</span>
                    </p>
                  </div>
                </div>

                {/* Total Products */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 transition-transform hover:scale-105">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 mb-1">Total Products</p>
                      <h3 className="text-3xl font-bold text-white">
                        {stats.totalProducts}
                      </h3>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-full">
                      <svg
                        className="w-6 h-6 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-green-500 text-sm flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      <span>+5% from last month</span>
                    </p>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 transition-transform hover:scale-105">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 mb-1">Total Orders</p>
                      <h3 className="text-3xl font-bold text-white">
                        {stats.totalOrders}
                      </h3>
                    </div>
                    <div className="p-3 bg-green-500/20 rounded-full">
                      <svg
                        className="w-6 h-6 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-green-500 text-sm flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      <span>+18% from last month</span>
                    </p>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 transition-transform hover:scale-105">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-400 mb-1">Total Revenue</p>
                      <h3 className="text-3xl font-bold text-white">
                        {formatCurrency(stats.totalRevenue)}
                      </h3>
                    </div>
                    <div className="p-3 bg-yellow-500/20 rounded-full">
                      <svg
                        className="w-6 h-6 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-green-500 text-sm flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      <span>+22% from last month</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* User Distribution and Product Categories */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* User Distribution By Role */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    User Distribution by Role
                  </h3>

                  <div className="space-y-4">
                    {/* Regular Users */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Regular Users</span>
                        <span className="text-white">
                          {stats.usersByRole.user}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${calculatePercentage(
                              stats.usersByRole.user,
                              stats.totalUsers
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Freelancers */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Freelancers</span>
                        <span className="text-white">
                          {stats.usersByRole.freelancer}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${calculatePercentage(
                              stats.usersByRole.freelancer,
                              stats.totalUsers
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Admins */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Administrators</span>
                        <span className="text-white">
                          {stats.usersByRole.admin}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width: `${calculatePercentage(
                              stats.usersByRole.admin,
                              stats.totalUsers
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Categories */}
                <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Products by Category
                  </h3>

                  <div className="space-y-4">
                    {Object.entries(stats.productsByCategory).map(
                      ([category, count], index) => {
                        const colors = [
                          "bg-green-500",
                          "bg-yellow-500",
                          "bg-blue-500",
                          "bg-purple-500",
                        ];
                        const colorIndex = index % colors.length;

                        return (
                          <div key={category}>
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-400">{category}</span>
                              <span className="text-white">{count}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className={`${colors[colorIndex]} h-2 rounded-full`}
                                style={{
                                  width: `${calculatePercentage(
                                    count,
                                    stats.totalProducts
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Recent Orders
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 border-b border-gray-800">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.length > 0 ? (
                        stats.recentOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b border-gray-800"
                          >
                            <td className="py-3 text-white">{order.id}</td>
                            <td className="py-3 text-white">
                              {order.customer}
                            </td>
                            <td className="py-3 text-gray-400">
                              {new Date(order.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-white">
                              {formatCurrency(order.amount)}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === "Completed"
                                    ? "bg-green-900/50 text-green-400"
                                    : order.status === "Processing"
                                    ? "bg-blue-900/50 text-blue-400"
                                    : order.status === "Pending"
                                    ? "bg-yellow-900/50 text-yellow-400"
                                    : "bg-red-900/50 text-red-400"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-4 text-center text-gray-500"
                          >
                            No recent orders
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-center">
                  <a
                    href="/admin/orders"
                    className="inline-block px-4 py-2 text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                  >
                    View All Orders →
                  </a>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a
                  href="/admin/users"
                  className="bg-gray-900 rounded-lg border border-gray-800 p-6 flex flex-col items-center text-center hover:border-yellow-500 transition-colors"
                >
                  <div className="p-3 bg-blue-500/20 rounded-full mb-4">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-1">Manage Users</h3>
                  <p className="text-gray-400 text-sm">
                    View and manage user accounts
                  </p>
                </a>

                <a
                  href="/admin/products"
                  className="bg-gray-900 rounded-lg border border-gray-800 p-6 flex flex-col items-center text-center hover:border-yellow-500 transition-colors"
                >
                  <div className="p-3 bg-purple-500/20 rounded-full mb-4">
                    <svg
                      className="w-6 h-6 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-1">
                    Manage Products
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Add, edit or remove products
                  </p>
                </a>

                <a
                  href="/admin/orders"
                  className="bg-gray-900 rounded-lg border border-gray-800 p-6 flex flex-col items-center text-center hover:border-yellow-500 transition-colors"
                >
                  <div className="p-3 bg-green-500/20 rounded-full mb-4">
                    <svg
                      className="w-6 h-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-medium mb-1">Manage Orders</h3>
                  <p className="text-gray-400 text-sm">
                    Track and update order status
                  </p>
                </a>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;