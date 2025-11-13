"use client";

import { Menu, MoonStar, SunMedium, Sparkles, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useDashboard } from "./DashboardProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LanguageToggle from "./LanguageToggle";

export default function AppNavbar({ onToggleSidebar, pageTitle, pageDescription }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const { demoMode } = useDashboard();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const isDark = theme === "dark";

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="navbar sticky top-0 z-40 flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 shadow-sm lg:px-6">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <button
          type="button"
          className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border surface-border text-muted transition hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:hidden shrink-0"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted truncate">QUANTQUEST</p>
          <h1 className="text-heading text-base sm:text-lg font-semibold lg:text-xl truncate">
            {pageTitle || "Farm Expense HQ"}
          </h1>
          <p className="mt-1 hidden text-xs text-muted sm:block truncate">
            {pageDescription || "Profitability trends, AI highlights, and charts."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {demoMode && (
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2 sm:px-3 py-1 sm:py-1.5">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] sm:text-xs font-medium text-emerald-700 dark:text-emerald-300">Demo Mode</span>
          </div>
        )}
        <div className="hidden sm:block">
          <LanguageToggle className="h-9 sm:h-10" />
        </div>
        <button
          type="button"
          className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border surface-border text-heading transition hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
        >
          {mounted ? (
            isDark ? <SunMedium className="h-4 w-4 sm:h-5 sm:w-5" /> : <MoonStar className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <SunMedium className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border surface-border text-heading transition hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </div>
    </header>
  );
}

