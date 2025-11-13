"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/components/DashboardProvider";
import SummaryCards from "@/components/SummaryCards";
import DashboardCharts from "@/components/DashboardCharts";
import FarmerPerformance from "@/components/FarmerPerformance";
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
    setError,
    crops,
    expenses,
    yields,
  } = useDashboard();

  // Get first meaningful line of insights, excluding the header if it's already there
  const getInsightsPreview = () => {
    if (!insights) return "";
    const lines = insights.split(/\n/).filter(line => line.trim().length > 0);
    // Skip lines that are just "Based on your farm data analysis:" or similar headers
    const preview = lines.find((line) => {
      const lower = line.toLowerCase().trim();
      return !lower.includes("based on your farm data analysis") && 
             !lower.startsWith("error:") &&
             line.trim().length > 20; // Get a substantial line
    });
    return preview || lines[0] || "";
  };

  const insightsPreview = getInsightsPreview();
  const insightsNav = NAV_ITEMS.find((item) => item.id === "insights");

  const handleRefreshAI = async () => {
    if (!user) {
      setError("Please log in to generate insights.");
      return;
    }
    console.log("Refreshing AI insights for user:", user._id);
    try {
      await loadInsights(user._id);
    } catch (err) {
      console.error("Error refreshing insights:", err);
      setError(err.message || "Failed to refresh insights. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6 lg:space-y-10 px-3 sm:px-4 py-3 sm:py-4 lg:py-8 lg:px-10">
      {error ? <div className="alert-error text-xs sm:text-sm p-3 sm:p-4">{error}</div> : null}

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1.6fr,1fr]">
        <div className="space-y-4 sm:space-y-6">
          <SummaryCards totals={totals} />
          <FarmerPerformance 
            totals={totals}
            cropSummaries={cropSummaries}
            expenses={expenses}
            crops={crops}
            yields={yields}
          />
          <DashboardCharts summaries={cropSummaries} forecast={forecast} />
        </div>
        <div className="card-surface h-full space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
          <div>
            <span className="tag w-fit uppercase tracking-[0.4em] text-xs mb-2 inline-block">AI highlight</span>
            <p className="text-heading text-sm sm:text-base font-semibold mb-2">Based on your farm data analysis:</p>
          </div>
          <p className="text-heading text-sm sm:text-base leading-relaxed">
            {insightsPreview ||
              "Gemini will surface the most profitable crops and savings once you log profile, crop, expense, and yield details."}
          </p>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            Refresh insights whenever a big harvest, rainfall change, or new purchase happens. The
            assistant blends your farm data with the weather outlook so you can plan ahead.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <button
              type="button"
              className="secondary-button text-xs sm:text-sm px-3 sm:px-4 py-2 w-full sm:w-auto"
              onClick={() => router.push("/insights")}
            >
              View full briefing
            </button>
            <button
              type="button"
              className="primary-button text-xs sm:text-sm px-3 sm:px-4 py-2 w-full sm:w-auto"
              onClick={handleRefreshAI}
              disabled={insightsLoading || !user || summaryLoading}
            >
              {insightsLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refreshing…
                </span>
              ) : (
                "Refresh AI"
              )}
            </button>
          </div>
          {insightsNav ? (
            <p className="text-xs text-muted leading-relaxed">
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


