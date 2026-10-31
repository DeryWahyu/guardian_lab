"use client";

import { Search } from "lucide-react";

interface HistoryFiltersProps {
  type: string;
  onTypeChange: (val: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  risk: string;
  onRiskChange: (val: string) => void;
}

export function HistoryFilters({
  type,
  onTypeChange,
  search,
  onSearchChange,
  risk,
  onRiskChange,
}: HistoryFiltersProps) {
  const tabs = [
    { id: "ALL", label: "Semua Analisis" },
    { id: "URL", label: "Tautan URL" },
    { id: "QR", label: "QR Code" },
    { id: "APK", label: "Malware APK" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-xs">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTypeChange(tab.id)}
            className={`cursor-pointer rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              type === tab.id
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Risk Selector */}
      <div className="flex w-full items-center gap-3 sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari domain / nama file..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pr-4 pl-9 text-xs text-slate-800 transition-colors outline-none placeholder:text-slate-400 focus:border-rose-400"
          />
        </div>

        <div className="relative">
          <select
            value={risk}
            onChange={(e) => onRiskChange(e.target.value)}
            className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="ALL">Semua Risiko</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="SAFE">Safe</option>
          </select>
        </div>
      </div>
    </div>
  );
}
