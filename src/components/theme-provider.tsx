"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "lamid-theme";
type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  setTheme: () => {},
  toggle: () => {},
});

function apply(t: Theme) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(t);
  localStorage.setItem(STORAGE_KEY, t);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const preferred = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const resolved  = stored ?? preferred;
    apply(resolved);
    setThemeState(resolved);
  }, []);

  function setTheme(t: Theme) {
    apply(t);
    setThemeState(t);
  }

  function toggle() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
