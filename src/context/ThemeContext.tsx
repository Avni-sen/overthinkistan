"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // İlk render sonrası mounted durumunu true yap
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Tarayıcı tercihini veya kaydedilmiş temayı kontrol et
    // Bu kodu sadece client-side'da çalıştır
    if (mounted) {
      try {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setTheme(savedTheme);
        } else if (prefersDark) {
          setTheme("dark");
        }
      } catch (error) {
        console.error("Tema tercihi yüklenirken hata oluştu:", error);
      }
    }
  }, [mounted]);

  useEffect(() => {
    // Tema değiştiğinde HTML elementine class ekle/çıkar
    // Bu kodu sadece client-side'da çalıştır
    if (mounted) {
      try {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        // Temayı localStorage'a kaydet
        localStorage.setItem("theme", theme);
      } catch (error) {
        console.error("Tema değiştirilirken hata oluştu:", error);
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const contextValue = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
