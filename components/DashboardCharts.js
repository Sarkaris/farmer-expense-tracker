'use client';

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useTheme } from "./ThemeProvider";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

function ExpenseRevenueChart({ summaries, palette }) {
  const data = useMemo(() => {
    const labels = summaries.map((item) => item.name);
    return {
      labels,
      datasets: [
        {
          label: "Expense",
          data: summaries.map((item) => item.expense),
          backgroundColor: "rgba(248, 113, 113, 0.65)",
          borderRadius: 12,
        },
        {
          label: "Revenue",
          data: summaries.map((item) => item.revenue),
          backgroundColor: "rgba(16, 185, 129, 0.75)",
          borderRadius: 12,
        },
      ],
    };
  }, [summaries]);

  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "bottom", labels: { color: palette.legend } },
        },
        scales: {
          x: { ticks: { color: palette.axis }, grid: { color: palette.grid } },
          y: { ticks: { color: palette.axis }, grid: { color: palette.grid } },
        },
      }}
    />
  );
}

function RainfallChart({ forecast, palette }) {
  const data = useMemo(() => {
    const labels = forecast.map((day) =>
      new Date(day.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    );
    return {
      labels,
      datasets: [
        {
          label: "Rainfall (mm)",
          data: forecast.map((day) => day.rainfall ?? 0),
          borderColor: "rgba(56, 189, 248, 0.9)",
          backgroundColor: "rgba(56, 189, 248, 0.3)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [forecast]);

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "bottom", labels: { color: palette.legend } },
        },
        scales: {
          x: { ticks: { color: palette.axis }, grid: { display: false } },
          y: { ticks: { color: palette.axis }, grid: { color: palette.grid } },
        },
      }}
    />
  );
}

export default function DashboardCharts({ summaries, forecast }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const palette = useMemo(
    () => ({
      axis: isDark ? "#cbd5f5" : "#475569",
      legend: isDark ? "#e2e8f0" : "#0f172a",
      grid: isDark ? "rgba(148,163,184,0.18)" : "rgba(203,213,225,0.4)",
    }),
    [isDark]
  );

  if (!summaries.length && !forecast.length) {
    return <p className="text-sm text-muted">Add crops and update weather to see charts.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {summaries.length ? (
        <div className="card-surface space-y-4 p-6">
          <h3 className="text-heading text-base font-semibold">Expense vs Revenue</h3>
          <ExpenseRevenueChart summaries={summaries} palette={palette} />
        </div>
      ) : null}
      {forecast.length ? (
        <div className="card-surface space-y-4 p-6">
          <h3 className="text-heading text-base font-semibold">Rainfall Forecast</h3>
          <RainfallChart forecast={forecast} palette={palette} />
        </div>
      ) : null}
    </div>
  );
}

