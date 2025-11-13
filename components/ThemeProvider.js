"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children, defaultTheme = "light" }) {
  const [theme, setTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("farm-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : defaultTheme);
    }
    setMounted(true);
  }, [defaultTheme]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("farm-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      mounted,
    }),
    [theme, toggleTheme, setTheme, mounted]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}


