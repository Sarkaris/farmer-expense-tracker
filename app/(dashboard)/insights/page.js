"use client";

import SectionCard from "@/components/SectionCard";
import InsightPanel from "@/components/InsightPanel";
import { useDashboard } from "@/components/DashboardProvider";

export default function InsightsPage() {
  const { insights, insightsLoading, loadInsights, user, error } = useDashboard();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-8 lg:px-10">
      {error ? <div className="alert-error text-xs sm:text-sm p-3 sm:p-4">{error}</div> : null}
      <SectionCard
        title="Gemini Farm Advisor"
        description="Use Google’s Gemini to evaluate profits, weather risks, and crop performance. Refresh whenever you update farm records."
      >
        <InsightPanel
          insights={insights}
          loading={insightsLoading}
          onRefresh={() => (user ? loadInsights(user._id) : null)}
        />
      </SectionCard>
    </div>
  );
}


