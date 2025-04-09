import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, authProvider } = await req.json();

    // เชื่อมต่อกับ API หลักของคุณเพื่อขอ token
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';



    const response = await fetch(`${API_URL}/auth/google-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name: email.split('@')[0], // ใส่ข้อมูลพื้นฐาน
        image: ''
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get token from backend: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success || !data.data?.token) {
      throw new Error('Token not found in response');
    }

    return NextResponse.json({
      success: true,
      data: {
        token: data.data.token
      }
    });
  } catch (error) {
    console.error('Error in session-token API:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}