import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      id?: number;
      userId?: number;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role?: string;
    id?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    userId?: number;
  }
}