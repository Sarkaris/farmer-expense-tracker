"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/components/DashboardProvider";
import SummaryCards from "@/components/SummaryCards";
import DashboardCharts from "@/components/DashboardCharts";
import { NAV_ITEMS } from "@/components/AppSidebar";

export default function OverviewPage() {
  const router = useRouter();
  const {
    totals,
    cropSummaries,
    forecast,
    insights,
    insightsLoading,
    user,
    loadInsights,
    summaryLoading,
    error,
  } = useDashboard();

  const insightsPreview = insights?.split(/\n/).find((line) => line.trim().length) || "";
  const insightsNav = NAV_ITEMS.find((item) => item.id === "insights");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 sm:space-y-10 px-3 sm:px-4 py-4 sm:py-8 lg:px-10">
      {error ? <div className="alert-error text-xs sm:text-sm p-3 sm:p-4">{error}</div> : null}

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.6fr,1fr]">
        <div className="space-y-6">
          <SummaryCards totals={totals} />
          <DashboardCharts summaries={cropSummaries} forecast={forecast} />
        </div>
        <div className="card-surface h-full space-y-4 p-4 sm:p-6">
          <span className="tag w-fit uppercase tracking-[0.4em] text-xs">AI highlight</span>
          <p className="text-heading text-sm sm:text-base leading-relaxed">
            {insightsPreview ||
              "Gemini will surface the most profitable crops and savings once you log profile, crop, expense, and yield details."}
          </p>
          <p className="text-xs sm:text-sm text-muted">
            Refresh insights whenever a big harvest, rainfall change, or new purchase happens. The
            assistant blends your farm data with the weather outlook so you can plan ahead.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <button
              type="button"
              className="secondary-button text-xs sm:text-sm px-4 py-2"
              onClick={() => router.push("/insights")}
            >
              View full briefing
            </button>
            <button
              type="button"
              className="primary-button text-xs sm:text-sm px-4 py-2"
              onClick={() => (user ? loadInsights(user._id) : null)}
              disabled={insightsLoading || !user || summaryLoading}
            >
              {insightsLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing…
                </span>
              ) : (
                "Refresh AI"
              )}
            </button>
          </div>
          {insightsNav ? (
            <p className="text-xs text-muted">
              Tip: Visit{" "}
              <span className="font-semibold text-heading">{insightsNav.label}</span> for the full
              Gemini report with weather and profitability context.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}


