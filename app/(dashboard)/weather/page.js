"use client";

import { DownloadCloud, Loader2, RefreshCw } from "lucide-react";
import WeatherWidget from "@/components/WeatherWidget";
import { useDashboard } from "@/components/DashboardProvider";

export default function WeatherPage() {
  const {
    weather,
    forecast,
    crops,
    expenses,
    yields,
    user,
    reportLoading,
    disableForms,
    summaryLoading,
    weatherLoading,
    initializing,
    error,
    handleGenerateReport,
    handleRefreshFarmData,
  } = useDashboard();

  const nextDayRainfall = forecast?.[0]?.rainfall ?? 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-8 lg:px-10">
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="min-h-full">
          <WeatherWidget current={weather} forecast={forecast} loading={weatherLoading || initializing} />
        </div>
        <div className="space-y-4 sm:space-y-6">
          <div className="card-surface  space-y-4 sm:space-y-5 p-4 sm:p-6">
            <div>
              <h2 className="text-heading text-lg font-semibold">Field snapshot</h2>
              <p className="text-sm text-muted">
                Review today’s conditions before organising irrigation, labour, or harvest runs.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border surface-border px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: 'var(--card)' }}>
                <p className="text-xs uppercase tracking-widest text-muted">Total crops</p>
                <p className="mt-1 sm:mt-2 text-heading text-lg sm:text-xl font-semibold">{crops.length}</p>
              </div>
              <div className="rounded-xl border surface-border px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: 'var(--card)' }}>
                <p className="text-xs uppercase tracking-widest text-muted">Expenses logged</p>
                <p className="mt-1 sm:mt-2 text-heading text-lg sm:text-xl font-semibold">{expenses.length}</p>
              </div>
              <div className="rounded-xl border surface-border px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: 'var(--card)' }}>
                <p className="text-xs uppercase tracking-widest text-muted">Yields recorded</p>
                <p className="mt-1 sm:mt-2 text-heading text-lg sm:text-xl font-semibold">{yields.length}</p>
              </div>
              <div className="rounded-xl border surface-border px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: 'var(--card)' }}>
                <p className="text-xs uppercase tracking-widest text-muted">Profile status</p>
                <p className="mt-1 sm:mt-2 text-heading text-xs sm:text-sm font-semibold">
                  {user ? "Ready for insights" : "Set up your farm details"}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={reportLoading || disableForms}
                className="primary-button h-10 sm:h-11 px-4 sm:px-5 text-xs sm:text-sm"
              >
                {reportLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Preparing report…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <DownloadCloud className="h-4 w-4" />
                    Download reports
                  </span>
                )}
              </button>
              <button
                type="button"
                className="secondary-button h-10 sm:h-11 px-4 sm:px-5 text-xs sm:text-sm"
                onClick={handleRefreshFarmData}
                disabled={summaryLoading || initializing || !user}
              >
                {summaryLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Refreshing…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh farm data
                  </span>
                )}
              </button>
            </div>
            {initializing ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Syncing your farm data…
              </p>
            ) : null}
          </div>
          <div className="card-surface p-4 sm:p-6">
            <h3 className="text-heading text-xs sm:text-sm font-semibold uppercase tracking-widest">
              Today's focus
            </h3>
            <ul className="mt-3 space-y-2 list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-muted">
              <li>
                {forecast?.length
                  ? `Rain over the next day: ${nextDayRainfall} mm. Schedule labour and irrigation accordingly.`
                  : "Add your pincode in the profile to unlock rainfall planning."}
              </li>
              <li>Capture new expenses and yields daily to keep profit tracking accurate.</li>
              <li>Check the AI briefing for suggestions tailored to each crop.</li>
            </ul>
          </div>
        </div>
      </div>
      {error ? <div className="alert-error">{error}</div> : null}
    </div>
  );
}


