"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "../services/auth.service";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: session, status } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Avoid state updates during SSR
    if (typeof window === "undefined") return;

    // Skip if already initialized and session hasn't changed
    if (isInitialized && status === "authenticated" && isAuthenticated) return;
    if (
      isInitialized &&
      status === "unauthenticated" &&
      !isAuthenticated &&
      !loading
    )
      return;

    const checkAuthStatus = async () => {
      try {
        setLoading(true);

        // Check NextAuth session
        if (session && session.user) {
          console.log("NextAuth session found:", session);

          // Create user data from session
          const userData = {
            id: (session.user as any).userId || 0,
            username: session.user.name || "",
            email: session.user.email || "",
            role: (session.user as any).role || "user",
          };

          setUser(userData);
          setIsAuthenticated(true);

          // Store data in localStorage for normal system usage
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(userData));
          }

          setLoading(false);
          setIsInitialized(true);
          return;
        }

        // If no NextAuth session, check normal token
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuthStatus();
  }, [session, status, isInitialized, isAuthenticated]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      await authService.register(userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Logout from NextAuth
    nextAuthSignOut({ redirect: false }).then(() => {
      // After NextAuth logout, clear local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setUser(null);
      setIsAuthenticated(false);

      // Navigate to home page after logout
      window.location.href = "/";
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
