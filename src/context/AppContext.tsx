"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FAVORITES_UPDATED_EVENT, getFavorites } from "@/lib/storage";
import {
  AUTH_UPDATED_EVENT,
  AuthUser,
  clearStoredUser,
  getStoredUser,
  storeUser,
} from "@/lib/auth";

type EducationLevel = "all" | "undergraduate" | "postgraduate";

interface AppContextType {
  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;
  favoriteCount: number;
  refreshFavorites: () => void;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("all");
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refreshFavorites = () => {
    if (typeof window !== "undefined") {
      setFavoriteCount(getFavorites().length);
    }
  };

  useEffect(() => {
    refreshFavorites();
    setUser(getStoredUser());
    
    // Listen for storage changes
    const handleStorageChange = () => {
      refreshFavorites();
      setUser(getStoredUser());
    };
    
    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom event (for same-tab updates)
    window.addEventListener(FAVORITES_UPDATED_EVENT, handleStorageChange);
    window.addEventListener(AUTH_UPDATED_EVENT, handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(FAVORITES_UPDATED_EVENT, handleStorageChange);
      window.removeEventListener(AUTH_UPDATED_EVENT, handleStorageChange);
    };
  }, []);

  const login = (nextUser: AuthUser) => {
    storeUser(nextUser);
    setUser(nextUser);
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        educationLevel,
        setEducationLevel,
        favoriteCount,
        refreshFavorites,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
