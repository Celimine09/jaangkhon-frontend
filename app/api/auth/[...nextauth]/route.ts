// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth/next';
import { authOptions } from './options';

// Only export the handler functions
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };