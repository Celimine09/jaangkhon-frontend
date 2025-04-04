"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Header from "../components/header";
import Footer from "../components/footer";

// สร้าง Interface สำหรับข้อมูลการชำระเงิน
interface PaymentDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

// สร้าง Interface สำหรับข้อมูลการจัดส่ง
interface ShippingDetails {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

// สร้าง Interface สำหรับสินค้าในตะกร้า
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });
  
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Thailand',
    phone: '',
  });

  // เช็คการเข้าถึงของผู้ใช้และโหลดข้อมูลสินค้าในตะกร้า
  useEffect(() => {
    const checkUserAccess = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        
        if (token && user) {
          const parsedUser = JSON.parse(user);
          const userRole = parsedUser.role;
          
          if (userRole !== "user") {
            router.push("/alert");
            return false;
          }
        } else {
          // ถ้าไม่มีการล็อกอิน ให้ไปที่หน้าล็อกอิน
          router.push("/login");
          return false;
        }
        return true;
      } catch (error) {
        console.error("Error checking user access:", error);
        return true;
      }
    };

    const hasAccess = checkUserAccess();
    
    // ถ้ามีสิทธิ์เข้าถึง ให้โหลดข้อมูลตะกร้าสินค้า
    if (hasAccess) {
      // จำลองการโหลดข้อมูลตะกร้าสินค้า
      const mockCartItems: CartItem[] = [
        {
          id: 2,
          name: "Gold Plated Watch",
          price: 12500,
          quantity: 1,
        },
        {
          id: 5,
          name: "Designer Sunglasses",
          price: 5900,
          quantity: 1,
        }
      ];
      
      setCartItems(mockCartItems);
      
      // คำนวณราคารวม
      const itemsSubtotal = mockCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const taxAmount = itemsSubtotal * 0.07; // VAT 7%
      const shippingCost = 500; // ค่าจัดส่งคงที่
      
      setSubtotal(itemsSubtotal);
      setTax(taxAmount);
      setShipping(shippingCost);
      setTotal(itemsSubtotal + taxAmount + shippingCost);
      
      setIsLoading(false);
    }
  }, [router]);

  // จัดการการเปลี่ยนแปลงของฟอร์มการจัดส่ง
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // จัดการการเปลี่ยนแปลงของฟอร์มการชำระเงิน
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // จัดการการส่งฟอร์ม
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      // ตรวจสอบว่ากรอกข้อมูลการจัดส่งครบหรือไม่
      const { fullName, address, city, postalCode, country, phone } = shippingDetails;
      if (fullName && address && city && postalCode && country && phone) {
        setCurrentStep(2);
      } else {
        alert("กรุณากรอกข้อมูลการจัดส่งให้ครบถ้วน");
      }
    } else if (currentStep === 2) {
      // ตรวจสอบว่ากรอกข้อมูลการชำระเงินครบหรือไม่
      const { cardNumber, cardholderName, expiryDate, cvv } = paymentDetails;
      if (cardNumber && cardholderName && expiryDate && cvv) {
        setCurrentStep(3);
      } else {
        alert("กรุณากรอกข้อมูลการชำระเงินให้ครบถ้วน");
      }
    } else if (currentStep === 3) {
      // ส่งคำสั่งซื้อและไปหน้ายืนยัน
      alert("การชำระเงินสำเร็จ!");
    }
  };

  // กลับไปขั้นตอนก่อนหน้า
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // จัดการรูปแบบการแสดงเลขบัตรเครดิต
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // จัดการรูปแบบวันหมดอายุบัตร
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  // แสดงหน้าโหลด
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow py-12 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            <span className="text-white">Checkout</span>{" "}
            <span className="text-yellow-500">Process</span>
          </h1>

          {/* Checkout Steps */}
          <div className="w-full max-w-3xl mx-auto mb-8">
            <div className="flex justify-between items-center">
              <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-yellow-500' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 1 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                  1
                </div>
                <span className="text-sm">การจัดส่ง</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
              <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-yellow-500' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 2 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                  2
                </div>
                <span className="text-sm">การชำระเงิน</span>
              </div>
              <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-yellow-500' : 'bg-gray-700'}`}></div>
              <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-yellow-500' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 3 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-500'}`}>
                  3
                </div>
                <span className="text-sm">ยืนยันคำสั่งซื้อ</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Shipping Details */}
                  {currentStep === 1 && (
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4 text-yellow-500">ข้อมูลการจัดส่ง</h2>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                            ชื่อ-นามสกุล
                          </label>
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={shippingDetails.fullName}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                            ที่อยู่
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={shippingDetails.address}
                            onChange={handleShippingChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                              เมือง/อำเภอ
                            </label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={shippingDetails.city}
                              onChange={handleShippingChange}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-300 mb-1">
                              รหัสไปรษณีย์
                            </label>
                            <input
                              type="text"
                              id="postalCode"
                              name="postalCode"
                              value={shippingDetails.postalCode}
                              onChange={handleShippingChange}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                              ประเทศ
                            </label>
                            <select
                              id="country"
                              name="country"
                              value={shippingDetails.country}
                              onChange={handleShippingChange}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                              required
                            >
                              <option value="Thailand">ไทย</option>
                              <option value="Singapore">สิงคโปร์</option>
                              <option value="Malaysia">มาเลเซีย</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                              เบอร์โทรศัพท์
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={shippingDetails.phone}
                              onChange={handleShippingChange}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Payment Details */}
                  {currentStep === 2 && (
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4 text-yellow-500">ข้อมูลการชำระเงิน</h2>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-300 mb-1">
                            หมายเลขบัตร
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={paymentDetails.cardNumber}
                            onChange={(e) => {
                              const formatted = formatCardNumber(e.target.value);
                              setPaymentDetails({...paymentDetails, cardNumber: formatted});
                            }}
                            placeholder="XXXX XXXX XXXX XXXX"
                            maxLength={19}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-300 mb-1">
                            ชื่อผู้ถือบัตร
                          </label>
                          <input
                            type="text"
                            id="cardholderName"
                            name="cardholderName"
                            value={paymentDetails.cardholderName}
                            onChange={handlePaymentChange}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-300 mb-1">
                              วันหมดอายุ
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={paymentDetails.expiryDate}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                setPaymentDetails({...paymentDetails, expiryDate: formatted});
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-300 mb-1">
                              CVV
                            </label>
                            <input
                              type="password"
                              id="cvv"
                              name="cvv"
                              value={paymentDetails.cvv}
                              onChange={handlePaymentChange}
                              placeholder="XXX"
                              maxLength={3}
                              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="saveCard"
                            name="saveCard"
                            checked={paymentDetails.saveCard}
                            onChange={handlePaymentChange}
                            className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-700 rounded"
                          />
                          <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-300">
                            บันทึกข้อมูลบัตรสำหรับการชำระเงินครั้งต่อไป
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Order Review */}
                  {currentStep === 3 && (
                    <div className="p-6">
                      <h2 className="text-xl font-bold mb-4 text-yellow-500">ยืนยันคำสั่งซื้อ</h2>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">ข้อมูลการจัดส่ง</h3>
                        <div className="bg-gray-800 p-4 rounded-md">
                          <p>{shippingDetails.fullName}</p>
                          <p>{shippingDetails.address}</p>
                          <p>{shippingDetails.city}, {shippingDetails.postalCode}</p>
                          <p>{shippingDetails.country}</p>
                          <p>{shippingDetails.phone}</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">ข้อมูลการชำระเงิน</h3>
                        <div className="bg-gray-800 p-4 rounded-md">
                          <p>บัตรที่ใช้ชำระเงิน: **** **** **** {paymentDetails.cardNumber.slice(-4)}</p>
                          <p>ชื่อผู้ถือบัตร: {paymentDetails.cardholderName}</p>
                          <p>วันหมดอายุ: {paymentDetails.expiryDate}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">รายการสินค้า</h3>
                        <div className="bg-gray-800 p-4 rounded-md space-y-2">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between border-b border-gray-700 pb-2">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-400">จำนวน: {item.quantity}</p>
                              </div>
                              <p className="text-yellow-500">฿{item.price.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form Controls */}
                  <div className="bg-gray-950 px-6 py-4 flex justify-between">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
                      >
                        ย้อนกลับ
                      </button>
                    ) : (
                      <div></div>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-md hover:bg-yellow-400 transition-colors"
                    >
                      {currentStep === 3 ? 'ยืนยันการสั่งซื้อ' : 'ดำเนินการต่อ'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4 text-yellow-500">สรุปคำสั่งซื้อ</h2>
                
                <div className="space-y-2 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center mr-3">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-8 h-8 object-cover" />
                          ) : (
                            <span className="text-xs text-gray-500">ไม่มีรูป</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-400">x{item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">฿{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-800 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-400">ราคาสินค้า</p>
                    <p>฿{subtotal.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-400">ภาษีมูลค่าเพิ่ม (7%)</p>
                    <p>฿{tax.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-400">ค่าจัดส่ง</p>
                    <p>฿{shipping.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-800 pt-2 mt-2">
                    <p>ยอดรวมทั้งสิ้น</p>
                    <p className="text-yellow-500">฿{total.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-gray-800 p-4 rounded-md">
                  <div className="flex items-center mb-4">
                    <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">การชำระเงินที่ปลอดภัย</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">จัดส่งภายใน 2-3 วันทำการ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PaymentPage;