"use client";

import { useI18n } from "@/lib/i18n";

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

export default function LanguageToggle({ className = "" }) {
  const { language, setLanguage, mounted } = useI18n();
  if (!mounted) return null;

  return (
    <select
      aria-label="Language"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className={`h-10 rounded-xl border border-(--border) bg-(--card) px-2 text-sm text-(--muted-strong) shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 ${className}`}
    >
      {LANG_OPTIONS.map((opt) => (
        <option key={opt.code} value={opt.code}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}


