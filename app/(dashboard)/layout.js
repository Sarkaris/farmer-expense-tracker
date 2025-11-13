"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppNavbar from "@/components/AppNavbar";
import AppSidebar, { NAV_ITEMS } from "@/components/AppSidebar";
import { DashboardProvider } from "@/components/DashboardProvider";
import { useI18n } from "@/lib/i18n";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    // Check authentication
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const activeNav = useMemo(
    () => NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
    [pathname]
  );

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardProvider>
      <div className="app-shell">
        <AppNavbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          pageTitle={activeNav ? t(activeNav.label) : undefined}
          pageDescription={activeNav ? t(activeNav.description) : undefined}
        />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath={pathname} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
