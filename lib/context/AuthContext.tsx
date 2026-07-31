"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserSession {
  name: string;
  role: "super_admin" | "admin" | "staff" | "therapist" | "parent";
  username: string;
  phone?: string;
  email?: string;
  centerName?: string;
}

interface AuthContextType {
  user: UserSession | null;
  login: (userData: UserSession) => void;
  signup: (userData: UserSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    // 초기 로컬스토리지 세션 확인
    const savedUser = localStorage.getItem("namulink_session");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("namulink_session");
      }
    } else {
      // 기본 관리자 세션
      const defaultUser: UserSession = {
        name: "박하은",
        role: "admin",
        username: "박하은2607",
        phone: "010-8807-5299",
        centerName: "자라는나무 아동발달센터 대전점",
      };
      setUser(defaultUser);
    }
  }, []);

  const login = (userData: UserSession) => {
    setUser(userData);
    localStorage.setItem("namulink_session", JSON.stringify(userData));
  };

  const signup = (userData: UserSession) => {
    setUser(userData);
    localStorage.setItem("namulink_session", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("namulink_session");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
