'use client';

import { format } from "date-fns";

function formatDate(date) {
  try {
    return format(new Date(date), "dd MMM yyyy");
  } catch {
    return date;
  }
}

export default function YieldTable({ yields, crops }) {
  if (!yields.length) {
    return <p className="text-sm text-muted">Add yield records to track revenue.</p>;
  }

  const cropName = (id) => crops.find((c) => c._id === id)?.name || "Unknown crop";

  return (
    <div className="overflow-x-auto rounded-2xl border surface-border bg-(--card) shadow-soft">
      <table className="min-w-full text-sm">
        <thead className="border-b surface-border text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
            <th className="px-4 py-3 text-left font-semibold">Crop</th>
            <th className="px-4 py-3 text-left font-semibold">Yield</th>
            <th className="px-4 py-3 text-left font-semibold">Price/Unit (₹)</th>
            <th className="px-4 py-3 text-left font-semibold">Revenue (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border) text-heading">
          {yields.map((entry) => {
            const revenue = Number(entry.totalYield || 0) * Number(entry.pricePerUnit || 0);
            return (
              <tr key={entry._id} className="transition hover:bg-[rgba(15,23,42,0.04)]">
                <td className="px-4 py-3 text-muted">{formatDate(entry.date)}</td>
                <td className="px-4 py-3">{cropName(entry.cropId)}</td>
                <td className="px-4 py-3">{entry.totalYield}</td>
                <td className="px-4 py-3">{entry.pricePerUnit}</td>
                <td className="px-4 py-3 font-semibold text-accent">
                  ₹{revenue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

