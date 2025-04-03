import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, authProvider } = await req.json();
    
    // ในกรณีนี้คุณควรเชื่อมต่อกับ API หลักของคุณเพื่อดึง token
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${API_URL}/auth/get-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, authProvider }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get token from backend');
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: {
        token: data.token || data.data?.token
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