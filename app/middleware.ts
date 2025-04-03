import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // ตรวจสอบเฉพาะเส้นทางที่ต้องการป้องกัน
  if (path.startsWith('/profile') || path.startsWith('/freelancer')) {
    // ดึง token จาก NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    // ตรวจสอบว่ามี session token จาก NextAuth หรือไม่
    if (!token) {
      // ถ้าไม่มี session token ให้ redirect ไปที่หน้า login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/freelancer/:path*'],
};