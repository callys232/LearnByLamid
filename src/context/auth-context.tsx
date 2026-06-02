"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "@/types/types";
import { currentUser as mockCurrentUser, mockUsers } from "@/mock/users";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockCurrentUser);

  async function login(email: string, _password: string): Promise<boolean> {
    // Mock auth: find user by email; any non-empty password is accepted until real backend is wired
    const found = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (found && _password.length > 0) {
      setUser(found);
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
