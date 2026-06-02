"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { User } from "@/types/types";
import { mockUsers } from "@/mock/users";

const STORAGE_KEY = "lamid:user-email";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const found = mockUsers.find(
          (u) => u.email.toLowerCase() === saved.toLowerCase(),
        );
        if (found) setUser(found);
      }
    } catch {
      // localStorage unavailable (SSR / private browsing)
    }
  }, []);

  async function login(email: string, password: string): Promise<boolean> {
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!found) return false;

    // Enforce password when one is set on the account
    if (found.password && found.password !== password) return false;

    // Reject deactivated accounts
    if (found.verificationStatus === "rejected") return false;

    setUser(found);
    try {
      localStorage.setItem(STORAGE_KEY, found.email);
    } catch { /* ignore */ }
    return true;
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
