"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Link from "next/link";
import { userService } from "../../services/user.service";

// Define User type based on user.service.ts
interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: "user" | "admin" | "freelancer";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define filter options for user role filtering
type RoleFilter = "all" | "user" | "admin" | "freelancer";

const UsersAdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    usersByRole: {
      user: 0,
      admin: 0,
      freelancer: 0,
    },
  });

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      if (isAuthenticated && user?.role === "admin") {
        try {
          setIsLoading(true);
          const usersData = await userService.getUsers();
          setUsers(usersData);

          // Calculate stats
          const active = usersData.filter((u) => u.isActive).length;
          const roleStats = usersData.reduce(
            (acc, u) => {
              acc[u.role] = (acc[u.role] || 0) + 1;
              return acc;
            },
            { user: 0, admin: 0, freelancer: 0 } as Record<string, number>
          );

          setStats({
            totalUsers: usersData.length,
            activeUsers: active,
            inactiveUsers: usersData.length - active,
            usersByRole: {
              user: roleStats.user || 0,
              admin: roleStats.admin || 0,
              freelancer: roleStats.freelancer || 0,
            },
          });
        } catch (error) {
          console.error("Error fetching users data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();
  }, [isAuthenticated, user]);

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/alert");
    } else if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);

  // Filter users based on search term and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName &&
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName &&
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Calculate percentage for progress bars
  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  // Format date
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle delete user with improved structure
  const handleDeleteUser = (userId: number, username: string) => {
    if (!window.confirm(`Are you sure you want to delete ${username}?`)) {
      return;
    }

    userService
      .deleteUser(userId)
      .then(() => {
        setUsers(users.filter((u) => u.id !== userId));
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  // Render user role badge
  const renderUserRole = (role: string) => {
    let className = "";
    let displayName = "";

    if (role === "admin") {
      className = "bg-green-900/50 text-green-400";
      displayName = "Administrator";
    } else if (role === "freelancer") {
      className = "bg-purple-900/50 text-purple-400";
      displayName = "Freelancer";
    } else {
      className = "bg-blue-900/50 text-blue-400";
      displayName = "User";
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
      >
        {displayName}
      </span>
    );
  };

  // Render user status badge
  const renderUserStatus = (isActive: boolean) => (
    <span
      className={`px-2 py-1 rounded-full text-xs ${
        isActive
          ? "bg-green-900/50 text-green-400"
          : "bg-red-900/50 text-red-400"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );

  // Render action buttons
  const renderActionButtons = (user: User) => (
    <div className="flex space-x-2">
      <Link
        href={`/admin/users/${user.id}`}
        className="text-blue-400 hover:text-blue-300"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </Link>
      <Link
        href={`/admin/users/${user.id}/edit`}
        className="text-yellow-400 hover:text-yellow-300"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </Link>
      <button
        onClick={() => handleDeleteUser(user.id, user.username)}
        className="text-red-400 hover:text-red-300"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );

  // Render user table row
  const renderUserRow = (user: User) => (
    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
      <td className="py-3 pl-4">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {user.profileImage ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.profileImage}
                alt={user.username}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                {user.firstName
                  ? user.firstName.charAt(0).toUpperCase()
                  : user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-white">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-400">@{user.username}</div>
          </div>
        </div>
      </td>
      <td className="py-3 text-sm text-gray-300">{user.email}</td>
      <td className="py-3">{renderUserRole(user.role)}</td>
      <td className="py-3">{renderUserStatus(user.isActive)}</td>
      <td className="py-3 text-sm text-gray-400">
        {formatDate(user.createdAt)}
      </td>
      <td className="py-3">{renderActionButtons(user)}</td>
    </tr>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />

      <main className="flex-grow py-10 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-white">User</span>{" "}
              <span className="text-yellow-500">Management</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6"></div>
            <div className="flex gap-2">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 border border-gray-500 rounded-md text-sm font-medium text-gray-300 bg-black hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-yellow-500 transition-colors shadow-md"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/user"
                className="px-4 py-2 border border-yellow-500 rounded-md text-sm font-medium text-yellow-500 bg-black hover:bg-gray-900 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-yellow-500 transition-colors shadow-md"
              >
                Users
              </Link>
            </div>
          </div>

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
            </div>

            {/* Active Users */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 mb-1">Active Users</p>
                  <h3 className="text-3xl font-bold text-white">
                    {stats.activeUsers}
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Inactive Users */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 transition-transform hover:scale-105">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 mb-1">Inactive Users</p>
                  <h3 className="text-3xl font-bold text-white">
                    {stats.inactiveUsers}
                  </h3>
                </div>
                <div className="p-3 bg-red-500/20 rounded-full">
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Add User Button (Card Style) */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <Link
                href="/admin/user"
                className="h-full w-full flex flex-col justify-center items-center text-black"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="mt-2 font-bold">Add New User</span>
              </Link>
            </div>
          </div>

          {/* User Distribution By Role */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              User Distribution by Role
            </h3>

            <div className="space-y-4">
              {/* Regular Users */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Regular Users</span>
                  <span className="text-white">{stats.usersByRole.user}</span>
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
                  <span className="text-white">{stats.usersByRole.admin}</span>
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

          {/* Filters and Search */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-1/2">
                <label htmlFor="search" className="sr-only">
                  Search Users
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Search by name, email..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-auto flex gap-2">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    roleFilter === "all"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setRoleFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    roleFilter === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setRoleFilter("user")}
                >
                  Users
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    roleFilter === "freelancer"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setRoleFilter("freelancer")}
                >
                  Freelancers
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    roleFilter === "admin"
                      ? "bg-green-500 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setRoleFilter("admin")}
                >
                  Admins
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Users List
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-800">
                    <th className="pb-3 pl-4 font-medium">User</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Created On</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => renderUserRow(user))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-gray-500"
                      >
                        {searchTerm || roleFilter !== "all"
                          ? "No users match your search criteria"
                          : "No users found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UsersAdminDashboard;
