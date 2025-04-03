"use client";

import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import { useRouter } from "next/navigation";
import { userService } from "../services/user.service";

// Define TypeScript interfaces
interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  role: 'user' | 'admin' | 'freelancer';
  isActive: boolean;
}

interface Order {
  id: number;
  date: string;
  status: string;
  total: number;
  items: number;
}

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [error, setError] = useState<string | null>(null);
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Temporary state for editing
  const [editProfile, setEditProfile] = useState<UserProfile | null>(null);
  
  // Mock orders data (would be fetched from an order service in a real app)
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 10021,
      date: "2025-03-15",
      status: "Delivered",
      total: 14300,
      items: 2
    },
    {
      id: 10018,
      date: "2025-02-28",
      status: "Processing",
      total: 32000,
      items: 1
    },
    {
      id: 10012,
      date: "2025-01-20",
      status: "Delivered",
      total: 7400,
      items: 3
    }
  ]);

  // Check authentication and fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, you would get the current user's ID from auth context or localStorage
        const userId = 1; // Placeholder - would be dynamic in real app
        
        if (!isAuthenticated) {
          router.push("/login");
          return;
        }
        
        setIsLoading(true);
        const userData = await userService.getUserById(userId);
        setUserProfile(userData);
        setEditProfile(userData);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setError("ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, router]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditProfile({...userProfile!});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditProfile({...userProfile!});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile({
      ...editProfile!,
      [name]: value.trim() === '' ? undefined : value
    });
  };

  const handleSave = async () => {
    if (!editProfile) return;
    
    // สร้างเวอร์ชั่นที่สะอาดของข้อมูลโปรไฟล์ ลบค่าว่างออก
    const cleanedProfile = Object.fromEntries(
      Object.entries(editProfile).filter(([key, value]) => {
        // รักษาค่าที่ไม่ใช่ string และ string ที่ไม่ว่างเปล่า
        return typeof value !== 'string' || value.trim() !== '';
      })
    ) as Partial<UserProfile>;
    
    try {
      setIsSaving(true);
      const updatedUser = await userService.updateUser(editProfile.id, cleanedProfile);
      setUserProfile(updatedUser);
      setIsEditing(false);
      // แสดงการแจ้งเตือนสำเร็จ (จะใช้ toast library ในแอปจริง)
    } catch (error) {
      console.error("Failed to update profile", error);
      setError("ไม่สามารถอัปเดตโปรไฟล์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    // In a real app, call logout API or clear token
    setIsAuthenticated(false);
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl text-red-400">{error || "เกิดข้อผิดพลาด"}</h2>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Profile section */}
      <section className="py-16 flex-grow bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-xl">
            {/* Profile header with cover image */}
            <div className="relative h-40 bg-gradient-to-r from-yellow-600 to-yellow-400">
              <div className="absolute -bottom-16 left-8">
                <div className="h-32 w-32 rounded-full border-4 border-gray-900 bg-gray-800 flex items-center justify-center overflow-hidden">
                  {userProfile.profileImage ? (
                    <img 
                      src={userProfile.profileImage} 
                      alt={userProfile.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl text-yellow-500">
                      {userProfile.firstName?.charAt(0) || userProfile.username.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute bottom-4 right-4">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition-colors"
                  >
                    แก้ไขโปรไฟล์
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        isSaving 
                          ? "bg-gray-500 text-gray-300" 
                          : "bg-yellow-500 text-black hover:bg-yellow-400"
                      }`}
                    >
                      {isSaving ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <div className="mt-20 px-8">
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-3 font-medium transition-colors ${
                    activeTab === "profile"
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  โปรไฟล์
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-3 font-medium transition-colors ${
                    activeTab === "orders"
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  ประวัติการสั่งซื้อ
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`px-4 py-3 font-medium transition-colors ${
                    activeTab === "settings"
                      ? "text-yellow-500 border-b-2 border-yellow-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  ตั้งค่า
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">
                    {isEditing ? "แก้ไขข้อมูลส่วนตัว" : "ข้อมูลส่วนตัว"}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        ชื่อผู้ใช้
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={editProfile?.username || ""}
                          onChange={handleChange}
                          disabled
                          className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white opacity-70"
                        />
                      ) : (
                        <p className="text-white">{userProfile.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        อีเมล
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editProfile?.email || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white"
                        />
                      ) : (
                        <p className="text-white">{userProfile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        ชื่อจริง
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={editProfile?.firstName || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white"
                        />
                      ) : (
                        <p className="text-white">{userProfile.firstName || "-"}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        นามสกุล
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={editProfile?.lastName || ""}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white"
                        />
                      ) : (
                        <p className="text-white">{userProfile.lastName || "-"}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        บทบาท
                      </label>
                      <p className="text-white capitalize">
                        {userProfile.role === "user" ? "ลูกค้า" : 
                         userProfile.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ขาย"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        สถานะ
                      </label>
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${userProfile.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                        <p className="text-white">
                          {userProfile.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-6">
                      <p className="text-sm text-gray-400">
                        * หากต้องการเปลี่ยนรหัสผ่าน กรุณาไปที่แท็บตั้งค่า
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">ประวัติการสั่งซื้อ</h2>
                  
                  {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-800">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              หมายเลขคำสั่งซื้อ
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              วันที่
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              สถานะ
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              จำนวนสินค้า
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              ยอดรวม
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">
                              
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-800/50">
                              <td className="px-4 py-4 text-sm text-white">
                                #{order.id}
                              </td>
                              <td className="px-4 py-4 text-sm text-white">
                                {new Date(order.date).toLocaleDateString('th-TH')}
                              </td>
                              <td className="px-4 py-4 text-sm">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  order.status === "Delivered" 
                                    ? "bg-green-900 text-green-300" 
                                    : order.status === "Processing" 
                                    ? "bg-blue-900 text-blue-300"
                                    : "bg-yellow-900 text-yellow-300"
                                }`}>
                                  {order.status === "Delivered" ? "จัดส่งแล้ว" : 
                                   order.status === "Processing" ? "กำลังดำเนินการ" : "รอการชำระเงิน"}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-white">
                                {order.items} ชิ้น
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-yellow-500">
                                ฿{order.total.toLocaleString()}
                              </td>
                              <td className="px-4 py-4 text-sm text-right">
                                <a 
                                  href={`/order/${order.id}`}
                                  className="text-yellow-500 hover:text-yellow-400"
                                >
                                  ดูรายละเอียด
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
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
                        ยังไม่มีคำสั่งซื้อ
                      </h3>
                      <p className="mt-1 text-gray-500">
                        เริ่มต้นช้อปปิ้งเพื่อดูประวัติการสั่งซื้อของคุณที่นี่
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">ตั้งค่า</h2>
                  
                  <div className="space-y-6">
                    {/* Password Change Section */}
                    <div className="p-6 border border-gray-800 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">เปลี่ยนรหัสผ่าน</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            รหัสผ่านปัจจุบัน
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            รหัสผ่านใหม่
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            ยืนยันรหัสผ่านใหม่
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white"
                          />
                        </div>
                        <div>
                          <button 
                            className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition-colors"
                            onClick={async () => {
                              // In a real app, you would validate and update password
                              alert("ฟังก์ชันนี้จะเชื่อมต่อกับ API ในแอปพลิเคชันจริง");
                            }}
                          >
                            อัปเดตรหัสผ่าน
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Notification Settings */}
                    <div className="p-6 border border-gray-800 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">การแจ้งเตือน</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-white">รับข่าวสารโปรโมชัน</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-white">อัปเดตสถานะคำสั่งซื้อ</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm text-white">อัปเดตสินค้าใหม่</label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProfilePage;