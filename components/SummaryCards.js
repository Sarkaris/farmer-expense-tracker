'use client';

import { TrendingUp, Wallet, PiggyBank } from "lucide-react";

const cards = [
  {
    key: "expense",
    label: "Total Expense",
    icon: Wallet,
    badgeClass: "badge-expense",
    valueKey: "expense",
  },
  {
    key: "revenue",
    label: "Total Revenue",
    icon: TrendingUp,
    badgeClass: "badge-revenue",
    valueKey: "revenue",
  },
  {
    key: "profit",
    label: "Net Profit",
    icon: PiggyBank,
    badgeClass: "badge-profit",
    valueKey: "profit",
  },
];

export default function SummaryCards({ totals }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, badgeClass, valueKey }) => (
        <div key={key} className="card-surface space-y-3 p-5">
          <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
            <Icon className="h-4 w-4" />
            {label}
          </div>
          <p className="text-heading text-3xl font-semibold">
            ₹{(totals?.[valueKey] || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted">
            {valueKey === "profit"
              ? "Revenue minus expenses across all crops"
              : `Aggregated ${valueKey} across your farm`}
          </p>
        </div>
      ))}
    </div>
  );
}

