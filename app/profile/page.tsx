"use client";

import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import { useAuth } from "../context/AuthContext";
import { useSession } from "next-auth/react";
import Link from "next/link";

const ProfilePage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: session, status } = useSession();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // ตรวจสอบการเข้าสู่ระบบและเปลี่ยนเส้นทางถ้าจำเป็น
    if (
      !loading &&
      !isAuthenticated &&
      status !== "loading" &&
      status !== "authenticated"
    ) {
      window.location.href = "/login";
      return;
    }

    // ตั้งค่าข้อมูลผู้ใช้เมื่อมีข้อมูล
    if (user) {
      setUserData({
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    } else if (session?.user) {
      setUserData({
        username: session.user.name || "",
        email: session.user.email || "",
        firstName: "",
        lastName: "",
      });
    }
  }, [loading, isAuthenticated, user, session, status]);

  // แสดงการโหลดเมื่อกำลังโหลดข้อมูล
  if (!isClient || loading || status === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-yellow-500 border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // ซ่อนคอมโพเนนต์และให้ useEffect จัดการการเปลี่ยนเส้นทาง
  if (!isAuthenticated && status !== "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-xl overflow-hidden">
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold mb-8">
                <span className="text-white">Profile</span>
                <span className="text-yellow-500"> Information</span>
              </h1>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Username
                    </label>
                    <p className="text-white">{userData.username}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <p className="text-white">{userData.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      First Name
                    </label>
                    <p className="text-white">{userData.firstName || "-"}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Last Name
                    </label>
                    <p className="text-white">{userData.lastName || "-"}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-800">
                  <Link
                    href="/"
                    className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition-colors inline-block"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
