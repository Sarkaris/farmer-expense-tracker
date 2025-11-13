"use client";

import { DownloadCloud, Loader2, RefreshCw } from "lucide-react";
import WeatherWidget from "@/components/WeatherWidget";
import { useDashboard } from "@/components/DashboardProvider";
import { useI18n } from "@/lib/i18n";

export default function WeatherPage() {
  const { t } = useI18n();
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
              <h2 className="text-heading text-lg font-semibold">{t("weather.snapshot")}</h2>
              <p className="text-sm text-muted">
                {t("weather.snapshotDesc")}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-xl border surface-border px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: 'var(--card)' }}>
                <p className="text-xs uppercase tracking-widest text-muted">{t("weather.totalCrops")}</p>
                <p className="mt-1 sm:mt-2 text-heading text-lg sm:text-xl font-semibold">{crops.length}</p>
              </div>
              <div className="rounded-xl border surface-border px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: 'var(--card)' }}>
                <p className="text-xs uppercase tracking-widest text-muted">{t("weather.expensesLogged")}</p>
                <p className="mt-1 sm:mt-2 text-heading text-lg sm:text-xl font-semibold">{expenses.length}</p>
              </div>
              <div className="rounded-xl border surface-border px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: 'var(--card)' }}>
                <p className="text-xs uppercase tracking-widest text-muted">{t("weather.yieldsRecorded")}</p>
                <p className="mt-1 sm:mt-2 text-heading text-lg sm:text-xl font-semibold">{yields.length}</p>
              </div>
              <div className="rounded-xl border surface-border px-3 py-2.5 sm:px-4 sm:py-3" style={{ background: 'var(--card)' }}>
                <p className="text-xs uppercase tracking-widest text-muted">{t("weather.profileStatus")}</p>
                <p className="mt-1 sm:mt-2 text-heading text-xs sm:text-sm font-semibold">
                  {user ? t("weather.ready") : t("weather.setup")}
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
                    {t("weather.preparing")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <DownloadCloud className="h-4 w-4" />
                    {t("weather.download")}
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
                    {t("weather.refreshing")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    {t("weather.refresh")}
                  </span>
                )}
              </button>
            </div>
            {initializing ? (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("weather.syncing")}
              </p>
            ) : null}
          </div>
          <div className="card-surface p-4 sm:p-6">
            <h3 className="text-heading text-xs sm:text-sm font-semibold uppercase tracking-widest">
              {t("weather.focus")}
            </h3>
            <ul className="mt-3 space-y-2 list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-muted">
              <li>
                {forecast?.length
                  ? t("weather.rainNext", `Rain over the next day: ${nextDayRainfall} mm.`)
                  : t("weather.addPincode")}
              </li>
              <li>{t("weather.tipCapture")}</li>
              <li>{t("weather.tipAI")}</li>
            </ul>
          </div>
        </div>
      </div>
      {error ? <div className="alert-error">{error}</div> : null}
    </div>
  );
}


