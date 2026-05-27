"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FAVORITES_UPDATED_EVENT, getFavorites } from "@/lib/storage";

type EducationLevel = "all" | "undergraduate" | "postgraduate";

interface AppContextType {
  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;
  favoriteCount: number;
  refreshFavorites: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("all");
  const [favoriteCount, setFavoriteCount] = useState(0);

  const refreshFavorites = () => {
    if (typeof window !== "undefined") {
      setFavoriteCount(getFavorites().length);
    }
  };

  useEffect(() => {
    refreshFavorites();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      refreshFavorites();
    };
    
    window.addEventListener("storage", handleStorageChange);
    // Also listen for custom event (for same-tab updates)
    window.addEventListener(FAVORITES_UPDATED_EVENT, handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(FAVORITES_UPDATED_EVENT, handleStorageChange);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        educationLevel,
        setEducationLevel,
        favoriteCount,
        refreshFavorites,
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
