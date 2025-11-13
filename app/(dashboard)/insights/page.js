"use client";

import SectionCard from "@/components/SectionCard";
import InsightPanel from "@/components/InsightPanel";
import { useDashboard } from "@/components/DashboardProvider";
import { useI18n } from "@/lib/i18n";

export default function InsightsPage() {
  const { insights, insightsLoading, loadInsights, user, error } = useDashboard();
  const { t } = useI18n();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-8 lg:px-10">
      {error ? <div className="alert-error text-xs sm:text-sm p-3 sm:p-4">{error}</div> : null}
      <SectionCard
        title={t("insights.pageTitle")}
        description={t("insights.pageDesc")}
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


