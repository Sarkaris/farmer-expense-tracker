'use client';

import { format } from "date-fns";

function formatDate(date) {
  try {
    return format(new Date(date), "dd MMM yyyy");
  } catch {
    return date;
  }
}

export default function ExpenseTable({ expenses, crops }) {
  if (!expenses.length) {
    return <p className="text-sm text-muted">Record expenses to analyze cost distribution.</p>;
  }

  const cropName = (id) => crops.find((c) => c._id === id)?.name || "All crops";

  // Deduplicate expenses by _id to prevent showing the same expense twice
  const uniqueExpenses = expenses.filter((expense, index, self) => 
    index === self.findIndex((e) => e._id === expense._id)
  );

  return (
    <div className="overflow-x-auto rounded-2xl border surface-border bg-(--card) shadow-soft">
      <table className="min-w-full text-sm">
        <thead className="text-muted">
          <tr className="border-b surface-border text-xs uppercase tracking-wider">
            <th className="px-4 py-3 text-left font-semibold text-muted">Date</th>
            <th className="px-4 py-3 text-left font-semibold text-muted">Type</th>
            <th className="px-4 py-3 text-left font-semibold text-muted">Amount (₹)</th>
            <th className="px-4 py-3 text-left font-semibold text-muted">Crop</th>
            <th className="px-4 py-3 text-left font-semibold text-muted">Shared</th>
            <th className="px-4 py-3 text-left font-semibold text-muted">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border) text-heading">
          {uniqueExpenses.map((expense) => (
            <tr key={expense._id} className="transition hover:bg-[rgba(15,23,42,0.04)]">
              <td className="px-4 py-3 text-muted">{formatDate(expense.date)}</td>
              <td className="px-4 py-3">{expense.type}</td>
              <td className="px-4 py-3 font-semibold text-accent">
                ₹{Number(expense.amount || 0).toLocaleString("en-IN")}
              </td>
              <td className="px-4 py-3">{cropName(expense.cropId)}</td>
              <td className="px-4 py-3">
                {expense.shared ? (
                  <div className="flex flex-col gap-1 text-xs text-muted">
                    <span className="tag w-fit bg-[rgba(16,185,129,0.16)] text-accent">Shared</span>
                    {expense.distributedShares?.map((share) => (
                      <span key={share.cropId} className="text-heading">
                        {cropName(share.cropId)}: ₹{Number(share.share).toFixed(2)}
                      </span>
                    ))}
                  </div>
                ) : (
                  "No"
                )}
              </td>
              <td className="px-4 py-3 text-muted">{expense.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

