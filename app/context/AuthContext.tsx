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

  // Helper functions to reduce complexity
  const buildUserDataFromSession = (session: any) => {
    return {
      id: (session.user as any).userId || 0,
      username: session.user.name || "",
      email: session.user.email || "",
      role: (session.user as any).role || "user",
    };
  };

  const storeUserDataInLocalStorage = (userData: any, token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const processTokenFromSession = (session: any, accessToken: string) => {
    // Create user data from session
    const userData = buildUserDataFromSession(session);

    // Store data in localStorage
    storeUserDataInLocalStorage(userData, accessToken);

    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
    setIsInitialized(true);
  };

  const fetchTokenFromAPI = async (session: any) => {
    try {
      const response = await fetch("/api/auth/session-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          authProvider: "google",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.token) {
          // Create user data from session
          const userData = buildUserDataFromSession(session);

          // Store data in localStorage
          storeUserDataInLocalStorage(userData, data.data.token);

          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
          setIsInitialized(true);
          return true;
        }
      } else {
        console.error("Failed to get token from API");
      }
    } catch (error) {
      console.error("Error fetching token from API:", error);
    }
    return false;
  };

  const processNextAuthSession = async (session: any) => {
    // ดึง token จาก session
    const accessToken = (session as any).accessToken;

    if (accessToken) {
      processTokenFromSession(session, accessToken);
      return true;
    } else {
      return await fetchTokenFromAPI(session);
    }
  };

  const checkLocalStorageAuth = () => {
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
  };

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
          const sessionProcessed = await processNextAuthSession(session);
          if (sessionProcessed) {
            return;
          }
        }

        // If no NextAuth session or failed to get token, check normal token
        checkLocalStorageAuth();
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
  }, [session, status, isInitialized, isAuthenticated, loading]);

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
