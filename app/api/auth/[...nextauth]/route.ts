import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // เพิ่มข้อมูลจาก profile ลงใน token
      if (account && profile) {
        token.role = 'user'; // หรือตรวจสอบและกำหนด role ตามความเหมาะสม
        
        // หากคุณต้องการเชื่อมต่อกับ backend API ของคุณ
        try {
          const response = await fetch('http://localhost:5000/api/auth/google-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: token.email,
              name: token.name,
              image: token.picture
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            // บันทึกข้อมูลเพิ่มเติมลงใน token
            token.role = data.user.role;
            token.userId = data.user.id;
          }
        } catch (error) {
          console.error('Error verifying with backend:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // ส่งข้อมูลจาก token ไปยัง client
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // เพิ่มโค้ดเพื่อบันทึกหรืออัพเดทข้อมูลผู้ใช้ในฐานข้อมูลของคุณที่นี่
      // ให้ค่า true เพื่ออนุญาตให้เข้าสู่ระบบได้
      return true;
    },
  },
  pages: {
    signIn: '/login', // กำหนดหน้า login แบบกำหนดเอง
  },
  secret: process.env.NEXTAUTH_SECRET,
});