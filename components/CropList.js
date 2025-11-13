'use client';

import { format } from "date-fns";
import { Leaf, CalendarRange, Ruler } from "lucide-react";

function formatDate(value) {
  if (!value) return "Present";
  try {
    return format(new Date(value), "dd MMM yyyy");
  } catch {
    return value;
  }
}

export default function CropList({ crops }) {
  if (!crops.length) {
    return <p className="text-sm text-muted">Add crops to begin tracking performance.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {crops.map((crop) => (
        <div
          key={crop._id}
          className="space-y-3 rounded-2xl border surface-border bg-(--card) p-5 shadow-soft transition hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-500/15 p-2 text-accent">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-heading text-base font-semibold">{crop.name}</h3>
              <p className="text-xs uppercase tracking-wide text-muted">Crop overview</p>
            </div>
          </div>
          <div className="grid gap-3 text-sm text-heading">
            <div className="flex items-center gap-2 text-muted">
              <Ruler className="h-4 w-4 text-accent" />
              <span className="text-heading">{crop.area} acres</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <CalendarRange className="h-4 w-4 text-[#0ea5e9]" />
              <span className="text-heading">
                {formatDate(crop.startDate)} → {formatDate(crop.endDate)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

