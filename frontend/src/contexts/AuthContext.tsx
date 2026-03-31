import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole, LoginPayload, RegisterPayload } from "@/types/User";
import { apiService } from "@/services/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload & { companyName?: string }) => Promise<void>;
  initializeSession: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isAuthenticated: !!localStorage.getItem("accessToken"),
    isLoading: false,
  });

  const login = useCallback(async (payload: LoginPayload) => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const user = await apiService.login(payload);
      localStorage.setItem("user", JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error(err.message || "Invalid credentials");
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload & { companyName?: string }) => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      await apiService.register(payload);
      setState((s) => ({ ...s, isLoading: false }));
    } catch (err: any) {
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error(err.message || "Registration failed");
    }
  }, []);

  const initializeSession = useCallback(async (token: string) => {
    localStorage.setItem("accessToken", token);
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const user = await apiService.getMe();
      localStorage.setItem("user", JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      localStorage.removeItem("accessToken");
      setState((s) => ({ ...s, isLoading: false }));
      throw new Error(err.message || "Session initialization failed");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, initializeSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
