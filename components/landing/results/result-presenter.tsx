"use client";

import { Calendar, Share2, Shield } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DualModeToggle } from "@/components/shared/dual-mode-toggle";
import { PUBLIC_ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { ThreatAnalysisResult } from "@/types/analysis";
import { EmergencyActionPlan } from "./emergency-action-plan";
import { GeekViewPanel } from "./geek-view-panel";
import { KedokCard } from "./kedok-card";
import { ResultError } from "./result-error";
import { ResultSkeleton } from "./result-skeleton";
import { ThreatScoreGauge } from "./threat-score-gauge";

export interface ResultPresenterProps {
  result: ThreatAnalysisResult | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  className?: string;
}

function ResultPresenterInner({
  result,
  isLoading = false,
  error = null,
  onRetry,
  className,
}: ResultPresenterProps) {
  const searchParams = useSearchParams();
  const urlMode = searchParams.get("mode") === "geek" ? "geek" : "human";
  const [localMode, setLocalMode] = useState<"human" | "geek">(urlMode);

  // Sync mode with URL if searchParams change
  const activeMode = searchParams.has("mode") ? urlMode : localMode;

  if (isLoading) {
    return <ResultSkeleton className={className} />;
  }

  if (error || !result) {
    if (error) {
      return <ResultError message={error} onRetry={onRetry} className={className} />;
    }
    return null;
  }

  return (
    <section
      aria-label="Hasil Analisis Forensik Keamanan"
      className={cn(
        "mx-auto w-full max-w-4xl rounded-3xl border p-6 shadow-xl transition-all duration-300 sm:p-8",
        activeMode === "geek"
          ? "border-slate-800 bg-slate-950 text-slate-100 shadow-cyan-950/20"
          : "border-stone-200/80 bg-white/95 text-slate-900 shadow-stone-200/40",
        className,
      )}
    >
      {/* Top Header Bar: Metadata & Dual-Mode Switcher */}
      <div
        className={cn(
          "mb-6 flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center",
          activeMode === "geek" ? "border-slate-800" : "border-stone-100",
        )}
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500">
            <Calendar className="size-3.5 text-stone-400" />
            <span>Hasil Pemindaian Real-Time</span>
          </div>
          <h2
            className={cn(
              "text-xl font-extrabold tracking-tight sm:text-2xl",
              activeMode === "geek" ? "font-mono text-slate-100" : "text-slate-900",
            )}
          >
            Laporan Analisis <span className="text-rose-600">Digital Guardian</span>
          </h2>
        </div>

        {/* URL-Synchronized Dual-Mode Toggle */}
        <DualModeToggle mode={activeMode} onChange={(newMode) => setLocalMode(newMode)} />
      </div>

      {/* Mode Bahasa Manusia (Default View) */}
      {activeMode === "human" && (
        <div className="space-y-6">
          {/* Main Visual Row: Gauge + Kedok Card */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <ThreatScoreGauge
                score={result.riskScore}
                riskLevel={result.riskLevel}
                defangedTarget={result.defangedTarget}
                scamCategory={result.scamCategory}
              />
            </div>
            <div className="lg:col-span-3">
              <KedokCard
                score={result.riskScore}
                scamCategory={result.scamCategory}
                humanFriendlySummary={result.humanFriendlySummary}
                deceptionTricks={result.deceptionTricks}
              />
            </div>
          </div>

          {/* Emergency Action Plan */}
          <EmergencyActionPlan
            ifNotClicked={result.emergencyActionPlan.ifNotClicked}
            ifAlreadyInstalledOrFilled={result.emergencyActionPlan.ifAlreadyInstalledOrFilled}
          />

          {/* Action Navigation Buttons */}
          <div className="flex flex-col items-center justify-end gap-3 border-t border-stone-100 pt-3 sm:flex-row">
            {/* Button 1: Buka di Sandbox Aman */}
            <Link
              href={PUBLIC_ROUTES.sandboxWebWithTarget(result.target)}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold text-stone-800 shadow-xs transition-all hover:scale-[1.01] hover:bg-stone-50 active:scale-[0.99] sm:w-auto sm:text-sm"
              title="Buka tautan di browser cloud terisolasi tanpa risiko perangkat terinfeksi"
            >
              <Shield className="size-4 text-stone-600" />
              <span>Buka di Sandbox Aman</span>
            </Link>

            {/* Button 2: Buat Guardian Share Card */}
            <Link
              href={
                PUBLIC_ROUTES.actWithTarget
                  ? PUBLIC_ROUTES.actWithTarget(result.target, result.id)
                  : `${PUBLIC_ROUTES.act}?target=${encodeURIComponent(result.target)}`
              }
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-200 transition-all hover:scale-[1.01] hover:bg-rose-700 active:scale-[0.99] sm:w-auto sm:text-sm"
              title="Hasilkan poster peringatan 1-klik untuk dikirim ke grup WhatsApp keluarga"
            >
              <Share2 className="size-4" />
              <span>Buat Guardian Share Card</span>
            </Link>
          </div>
        </div>
      )}

      {/* Mode Teknis (Geek View) */}
      {activeMode === "geek" && (
        <div className="space-y-6">
          <GeekViewPanel result={result} />

          {/* Action Navigation Buttons in Geek View */}
          <div className="flex flex-col items-center justify-end gap-3 border-t border-slate-800 pt-3 sm:flex-row">
            <Link
              href={PUBLIC_ROUTES.sandboxWebWithTarget(result.target)}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 font-mono text-xs font-semibold text-slate-200 transition-all hover:bg-slate-800 sm:w-auto sm:text-sm"
            >
              <Shield className="size-4 text-cyan-400" />
              <span>LAUNCH BROWSER SANDBOX</span>
            </Link>

            <Link
              href={
                PUBLIC_ROUTES.actWithTarget
                  ? PUBLIC_ROUTES.actWithTarget(result.target, result.id)
                  : `${PUBLIC_ROUTES.act}?target=${encodeURIComponent(result.target)}`
              }
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-cyan-600 px-6 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-md shadow-cyan-900 transition-all hover:bg-cyan-500 sm:w-auto sm:text-sm"
            >
              <Share2 className="size-4" />
              <span>GENERATE SHARE ARTIFACT</span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

export function ResultPresenter(props: ResultPresenterProps) {
  return (
    <Suspense fallback={<ResultSkeleton className={props.className} />}>
      <ResultPresenterInner {...props} />
    </Suspense>
  );
}
