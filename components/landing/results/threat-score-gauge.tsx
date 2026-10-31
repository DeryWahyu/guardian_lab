"use client";

import { AlertCircle, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThreatScoreGaugeProps {
  score: number; // 0 - 100
  riskLevel: string;
  defangedTarget: string;
  scamCategory: string;
  className?: string;
}

export function ThreatScoreGauge({
  score,
  riskLevel: _riskLevel,
  defangedTarget,
  scamCategory,
  className,
}: ThreatScoreGaugeProps) {
  // Color configuration based on 3-tier threat threshold
  const isSafe = score < 30;
  const isWarning = score >= 30 && score < 70;

  const config = isSafe
    ? {
        label: "AMAN (RISIKO RENDAH)",
        colorClass: "text-emerald-600",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        strokeClass: "stroke-emerald-500",
        glowClass: "from-emerald-500/10 to-transparent",
        Icon: ShieldCheck,
        reassurance: "Tautan ini memiliki parameter normal tanpa kejanggalan.",
      }
    : isWarning
      ? {
          label: "WASPADA (MENCURIGAKAN)",
          colorClass: "text-amber-600",
          badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
          strokeClass: "stroke-amber-500",
          glowClass: "from-amber-500/10 to-transparent",
          Icon: AlertCircle,
          reassurance: "Terdapat indikator mencurigakan pada domain ini.",
        }
      : {
          label: "BAHAYA TINGGI (PHISHING)",
          colorClass: "text-rose-600",
          badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
          strokeClass: "stroke-rose-600",
          glowClass: "from-rose-500/15 to-transparent",
          Icon: ShieldAlert,
          reassurance: "Tautan terindikasi kuat sebagai penipuan berbahaya!",
        };

  // SVG Gauge calculations
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-3xl border border-stone-200/80 bg-white/90 p-6 text-center shadow-md shadow-stone-100",
        className,
      )}
    >
      {/* Category Pill Badge */}
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100/80 px-3 py-1 text-xs font-bold tracking-wider text-stone-700 uppercase">
        <config.Icon className={cn("size-3.5", config.colorClass)} />
        <span>{scamCategory || "Analisis Ancaman Digital"}</span>
      </div>

      {/* Circular Dial Container */}
      <div className="relative my-2 flex size-44 items-center justify-center sm:size-48">
        {/* Soft Radial Glow */}
        <div className={cn("absolute inset-0 rounded-full bg-radial", config.glowClass)} />

        <svg className="size-full -rotate-90" viewBox="0 0 140 140">
          <title>Threat Score Gauge</title>
          {/* Background Track */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="11"
            className="text-stone-100"
          />
          {/* Animated Value Stroke */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            strokeWidth="11"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-out", config.strokeClass)}
          />
        </svg>

        {/* Center Display */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {score}
          </span>
          <span className="mt-0.5 text-xs font-semibold text-stone-400">/ 100 SKOR INDIKATOR</span>
        </div>
      </div>

      {/* Threat Status Pill */}
      <div
        className={cn(
          "mt-2 mb-1 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-bold tracking-wide",
          config.badgeBg,
        )}
      >
        <config.Icon className="size-3.5" />
        <span>{config.label}</span>
      </div>

      <p className="mt-1 mb-4 max-w-xs text-xs text-stone-500">{config.reassurance}</p>

      {/* Defanged Target Card */}
      <div className="flex w-full flex-col gap-1 rounded-2xl border border-stone-200/60 bg-stone-50/80 p-3 text-left">
        <div className="flex items-center justify-between text-[11px] font-medium text-stone-500">
          <span>Target Tautan (Defanged)</span>
          <span
            className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-600"
            title="Tautan dinonaktifkan agar aman dari klik tidak disengaja"
          >
            <Info className="size-3" />
            <span>Aman</span>
          </span>
        </div>
        <code className="font-mono text-xs font-medium break-all text-slate-800 select-all">
          {defangedTarget}
        </code>
      </div>
    </div>
  );
}
