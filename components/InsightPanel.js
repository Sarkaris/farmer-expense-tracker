'use client';

import { Sparkle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function InsightPanel({ insights, loading, onRefresh }) {
  const { t } = useI18n();
  return (
    <div className="card-surface space-y-4 p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[rgba(16,185,129,0.16)] p-2 text-accent">
            <Sparkle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">
              {t("insights.title")}
            </p>
            <h3 className="text-heading text-lg font-semibold">{t("insights.subtitle")}</h3>
          </div>
        </div>
        <button className="secondary-button" type="button" onClick={onRefresh} disabled={loading}>
          {loading ? t("insights.analyzing") : t("insights.refresh")}
        </button>
      </header>
      <article className="rounded-xl border surface-border bg-(--card) p-4 text-sm leading-relaxed text-heading shadow-inner whitespace-pre-line">
        {loading
          ? t("insights.loading")
          : insights || t("insights.empty")}
      </article>
    </div>
  );
}

