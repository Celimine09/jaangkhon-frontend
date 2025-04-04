"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useAuth } from "../../context/AuthContext";

interface FreelancerProfile {
  id: number;
  skills: string[];
  experience: string;
  hourlyRate: number;
  rating?: number;
  completedJobs?: number;
}

const FreelancerStats: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sampleProfile: FreelancerProfile = {
    id: 1,
    skills: ["React", "Next.js", "TypeScript", "UI/UX Design", "SEO"],
    experience: "5 years of professional experience in web development and design.",
    hourlyRate: 800,
    rating: 4.8,
    completedJobs: 32,
  };

  useEffect(() => {
    // In a real app, fetch the profile data here
    setProfile(sampleProfile);
    setIsLoading(false);
  }, []);
  
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
  
  const navigateToServices = () => {
    router.push("/freelancer");
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
                  <span className="text-yellow-500">Statistics</span>
                </h1>
                <p className="text-gray-400">
                  Track your performance and earnings
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
                <p className="text-gray-400 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold text-white">
                  ฿{(profile?.completedJobs || 0) * (profile?.hourlyRate || 0)}
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
                className="px-6 py-3 font-medium text-gray-400 hover:text-yellow-400"
                onClick={navigateToServices}
              >
                My Services
              </button>
              <button
                className="px-6 py-3 font-medium text-yellow-500 border-b-2 border-yellow-500"
              >
                Statistics
              </button>
            </div>

            {/* Stats content */}
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreelancerStats;