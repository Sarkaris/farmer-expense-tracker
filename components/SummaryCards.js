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
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {cards.map(({ key, label, icon: Icon, badgeClass, valueKey }) => (
        <div key={key} className="card-surface space-y-2 sm:space-y-3 p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:scale-[1.02]">
          <div className={`inline-flex items-center gap-2 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-semibold ${badgeClass}`}>
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="whitespace-nowrap">{label}</span>
          </div>
          <p className="text-heading text-xl sm:text-2xl lg:text-3xl font-bold">
            ₹{(totals?.[valueKey] || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {valueKey === "profit"
              ? "Revenue minus expenses across all crops"
              : `Aggregated ${valueKey} across your farm`}
          </p>
        </div>
      ))}
    </div>
  );
}

