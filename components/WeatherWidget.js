'use client';

import { Droplets, Sun, CloudRain, Wind, Cloud, CloudSnow, CloudLightning, Eye, Loader2 } from "lucide-react";
import React from "react";
import { useI18n } from "@/lib/i18n";

const icons = {
  clear: Sun,
  rain: CloudRain,
  drizzle: CloudRain,
  snow: CloudSnow,
  thunderstorm: CloudLightning,
  mist: Droplets,
  haze: Droplets,
  fog: Droplets,
  clouds: Cloud,
};

function pickIcon(description = "") {
  const desc = (description || "").toLowerCase();
  const key = Object.keys(icons).find((k) => desc.includes(k));
  return icons[key] || Sun;
}

function WeatherIconDisplay({ description, size = "h-16 w-16" }) {
  const IconComponent = pickIcon(description);
  return React.createElement(IconComponent, { className: `${size} text-accent` });
}

export default function WeatherWidget({ current, forecast, loading = false }) {
  const { t } = useI18n();
  // Show loading state
  if (loading) {
    return (
      <div className="card-surface space-y-4 p-6 rounded-2xl border surface-border shadow-sm">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          <p className="text-heading text-sm font-medium">{t("weather.loading")}</p>
        </div>
      </div>
    );
  }

  // Check if weather data exists
  if (!current || !current.location || current.temperature === undefined) {
    return (
      <div className="card-surface space-y-4 p-6 rounded-2xl border surface-border shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(var(--muted-rgb, 100, 116, 139), 0.2)' }}>
            <Sun className="h-6 w-6 text-muted" />
          </div>
          <div>
            <h3 className="text-heading text-lg font-semibold">{t("weather.widgetTitle")}</h3>
            <p className="text-xs text-muted">{t("weather.noData")}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-muted">
          <p>
            {t("weather.hint")}
          </p>
          <p className="text-xs">
            {t("weather.getKey")}{" "}
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline hover:text-accent-hover"
            >
              {t("weather.openWeather")}
            </a>
          </p>
        </div>
      </div>
    );
  }

  const nextDayRainfall = forecast?.[0]?.rainfall ?? 0;
  const safeForecast = Array.isArray(forecast) ? forecast : [];

  return (
    <div className="space-y-4">
      {/* Main Weather Card */}
      <div className="card-surface rounded-2xl border surface-border shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6" style={{ background: 'linear-gradient(135deg, rgba(4, 120, 87, 0.1) 0%, rgba(4, 120, 87, 0.05) 50%, transparent 100%)' }}>
          <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-widest text-muted mb-1">{t("weather.current")}</p>
              <h3 className="text-heading text-xl sm:text-2xl font-bold mb-1 truncate">{current.location || 'Unknown Location'}</h3>
              <p className="text-sm capitalize text-muted">{current.description || 'Clear sky'}</p>
            </div>
            <div className="flex flex-col items-center sm:items-end">
              <WeatherIconDisplay description={current.description} size="h-12 w-12 sm:h-16 sm:w-16" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-heading text-4xl sm:text-5xl font-bold">{current.temperature ?? '--'}</span>
            <span className="text-heading text-xl sm:text-2xl font-semibold text-muted">°C</span>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 border surface-border" style={{ background: 'var(--card)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-5 w-5 text-accent" />
              <p className="text-xs uppercase tracking-widest text-muted">{t("weather.humidity")}</p>
            </div>
            <p className="text-heading text-xl sm:text-2xl font-bold">{current.humidity ?? '--'}%</p>
          </div>
          <div className="rounded-xl p-4 border surface-border" style={{ background: 'var(--card)' }}>
            <div className="flex items-center gap-2 mb-2">
              <CloudRain className="h-5 w-5 text-accent" />
              <p className="text-xs uppercase tracking-widest text-muted">{t("weather.next24h")}</p>
            </div>
            <p className="text-heading text-xl sm:text-2xl font-bold">
              {nextDayRainfall > 0 ? `${nextDayRainfall.toFixed(1)} mm` : "0 mm"}
            </p>
          </div>
        </div>
      </div>

      {/* Forecast Card */}
      {safeForecast.length > 0 && (
        <div className="card-surface rounded-2xl border surface-border shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-accent" />
            <h3 className="text-heading text-base sm:text-lg font-semibold">{t("weather.sevenDay")}</h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {safeForecast.slice(0, 7).map((day, index) => {
              const date = new Date(day.date);
              const isToday = index === 0;
              const IconComponent = pickIcon(day.description || "");
              
              return (
                <div
                  key={day.date}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-xl border surface-border transition-colors gap-3 ${
                    isToday ? 'bg-accent/5 border-accent/20' : ''
                  }`}
                  style={!isToday ? { background: 'var(--card)' } : {}}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                    <div className="flex flex-col min-w-[70px] sm:min-w-[80px]">
                      <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-accent' : 'text-heading'}`}>
                        {isToday ? 'Today' : date.toLocaleDateString("en-IN", { weekday: "short" })}
                      </span>
                      <span className="text-xs text-muted">
                        {date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-muted shrink-0" />
                      <span className="text-xs sm:text-sm capitalize text-muted truncate">{day.description || "Clear"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-heading font-semibold">{day.tempDay ?? '--'}°</span>
                      <span className="text-muted"> / {day.tempNight ?? '--'}°</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
                      <span className="text-heading font-medium">
                        {(day.rainfall ?? 0).toFixed(1)} mm
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

