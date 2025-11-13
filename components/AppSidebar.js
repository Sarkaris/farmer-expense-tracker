"use client";

import {
  BrainCircuit,
  CloudSun,
  FileSpreadsheet,
  LayoutDashboard,
  Sprout,
  Wallet,
  Wheat,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { useDashboard } from "./DashboardProvider";

export const NAV_ITEMS = [
  {
    id: "weather",
    label: "Weather & Conditions",
    description: "Live weather, rainfall outlook, and field readiness.",
    icon: CloudSun,
    href: "/weather",
  },
  {
    id: "overview",
    label: "Farm Overview",
    description: "Profitability trends, AI highlights, and charts.",
    icon: LayoutDashboard,
    href: "/overview",
  },
  {
    id: "profile",
    label: "Farmer Profile",
    description: "Manage farmer contact info and farm location.",
    icon: Sprout,
    href: "/profile",
  },
  {
    id: "crops",
    label: "Crop Management",
    description: "Plan seasons, acreage, and crop performance.",
    icon: Wheat,
    href: "/crops",
  },
  {
    id: "expenses",
    label: "Expenses",
    description: "Track costs and distribute shared inputs fairly.",
    icon: Wallet,
    href: "/expenses",
  },
  {
    id: "yields",
    label: "Yields",
    description: "Record harvest output and revenue per crop.",
    icon: FileSpreadsheet,
    href: "/yields",
  },
  {
    id: "insights",
    label: "AI Insights",
    description: "Gemini guidance for profitability and planning.",
    icon: BrainCircuit,
    href: "/insights",
  },
  {
    id: "market-prices",
    label: "Market Prices",
    description: "Live crop prices and market trends.",
    icon: TrendingUp,
    href: "/market-prices",
  },
];

export default function AppSidebar({ open, onClose, activePath }) {
  const { theme } = useTheme();
  const { demoMode, enableDemoMode, disableDemoMode } = useDashboard();

  useEffect(() => {
    if (!open) return;
    const handler = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      <aside
        className={`sidebar fixed inset-y-0 left-0 z-50 flex w-64 sm:w-72 flex-col justify-between px-4 sm:px-5 py-4 sm:py-6 shadow-lg transition-transform duration-300 ease-out lg:static lg:z-auto lg:translate-x-0 lg:overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6 sm:space-y-8">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-muted">QuantQuest</span>
              <p className="text-heading text-base sm:text-lg font-semibold truncate">Farm Expense HQ</p>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border surface-border text-muted transition hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 lg:hidden shrink-0"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <nav>
            <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activePath === item.href || (item.href !== "/" && activePath.startsWith(item.href));
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="nav-link flex items-center gap-2 sm:gap-3 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium"
                      data-active={isActive}
                      onClick={onClose}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (demoMode) {
                      disableDemoMode();
                    } else {
                      enableDemoMode();
                    }
                    onClose();
                  }}
                  className={`nav-link w-full flex items-center gap-2 sm:gap-3 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                    demoMode ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : ""
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{demoMode ? "Exit Demo" : "Demo Mode"}</span>
                </button>
              </li>
              
            </ul>
          </nav>
        </div>

        <div className="rounded-2xl border surface-border bg-[rgba(16,185,129,0.08)] p-3 sm:p-4">
          <p className="text-xs sm:text-sm font-semibold text-heading">Need a quick overview?</p>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Generate PDF or Excel reports to share summaries with your farm partners.
          </p>
          <div className="mt-3 sm:mt-4 flex items-center justify-between rounded-xl bg-white/60 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-heading dark:bg-slate-900/50">
            <span>Current theme</span>
            <span className="tag uppercase tracking-widest text-[10px] sm:text-xs">{theme}</span>
          </div>
        </div>
      </aside>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}

