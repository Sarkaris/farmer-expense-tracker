"use client";

import { Loader2 } from "lucide-react";
import SectionCard from "@/components/SectionCard";
import CropForm from "@/components/CropForm";
import CropList from "@/components/CropList";
import { useDashboard } from "@/components/DashboardProvider";

export default function CropsPage() {
  const { crops, handleAddCrop, disableForms, summaryLoading, error } = useDashboard();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-8 lg:px-10">
      {error ? <div className="alert-error text-xs sm:text-sm p-3 sm:p-4">{error}</div> : null}
      <SectionCard
        title="Crop Management"
        description="Track every crop’s acreage, sowing date, and progress. Shared expenses use these acreages to split inputs fairly."
      >
        {summaryLoading && !crops.length ? (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading crops…
          </div>
        ) : null}
        <CropForm onCreate={handleAddCrop} disabled={disableForms} />
        <CropList crops={crops} />
      </SectionCard>
    </div>
  );
}


