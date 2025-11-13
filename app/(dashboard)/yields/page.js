"use client";

import SectionCard from "@/components/SectionCard";
import YieldForm from "@/components/YieldForm";
import YieldTable from "@/components/YieldTable";
import { useDashboard } from "@/components/DashboardProvider";

export default function YieldsPage() {
  const { crops, yields, handleAddYield, disableForms, error } = useDashboard();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-8 lg:px-10">
      {error ? <div className="alert-error text-xs sm:text-sm p-3 sm:p-4">{error}</div> : null}
      <SectionCard
        title="Yield Tracking"
        description="Capture harvest quantity and price per unit to measure crop-level revenue and profitability."
      >
        <YieldForm crops={crops} onCreate={handleAddYield} disabled={disableForms} />
        <YieldTable yields={yields} crops={crops} />
      </SectionCard>
    </div>
  );
}


