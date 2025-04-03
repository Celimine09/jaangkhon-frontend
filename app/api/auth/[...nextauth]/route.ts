import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import { NextAuthOptions } from "next-auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.role = 'user';
        
        try {
          const response = await fetch(`${API_URL}/auth/google-verify`, {
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
            if (data.data && data.data.user) {
              token.role = data.data.user.role;
              token.userId = data.data.user.id;
            }
          }
        } catch (error) {
          console.error('Error verifying with backend:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.userId = token.userId as number;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };