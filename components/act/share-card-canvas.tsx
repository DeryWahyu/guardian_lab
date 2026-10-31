import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type React from "react";
import { Mascot } from "@/components/shared/mascot";

interface ShareCardCanvasProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  target: string;
  defangedUrl: string;
  threatBullets: string[];
  riskLevel: string;
  scamCategory: string;
}

export function ShareCardCanvas({
  cardRef,
  target,
  defangedUrl,
  threatBullets,
  riskLevel,
  scamCategory,
}: ShareCardCanvasProps) {
  return (
    <div
      ref={cardRef}
      className="relative w-full max-w-lg space-y-6 overflow-hidden rounded-3xl border-2 border-rose-200/90 bg-gradient-to-br from-white via-rose-50/30 to-amber-50/20 p-6 text-slate-800 shadow-xl sm:p-8"
    >
      {/* Background Watermark Pattern */}
      <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-10 select-none">
        <Mascot size={220} showPills={false} />
      </div>

      {/* Top Banner Alert */}
      <div className="flex items-center justify-between rounded-2xl bg-rose-600 px-4 py-2 text-white shadow-md shadow-rose-600/20">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
          <span className="text-xs font-extrabold tracking-wider uppercase sm:text-sm">
            AWAS MODUS PENIPUAN SIBER!
          </span>
        </div>
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
          {riskLevel}
        </span>
      </div>

      {/* Target & Category */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-rose-600 uppercase">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{scamCategory || "Deteksi Ancaman Digital"}</span>
        </div>
        <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-inner">
          <div className="text-[10px] font-medium text-slate-400">Tautan Berbahaya (Defanged):</div>
          <div className="mt-0.5 font-mono text-xs font-bold break-all text-rose-400 select-all sm:text-sm">
            {defangedUrl || target}
          </div>
        </div>
      </div>

      {/* 3 Threat Bullets */}
      <div className="space-y-2.5 rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <ShieldAlert className="h-4 w-4 text-rose-500" />
          <span>Fakta & Bahaya yang Terdeteksi:</span>
        </div>
        <ul className="space-y-2 text-xs text-slate-700 sm:text-sm">
          {threatBullets.slice(0, 3).map((bullet, idx) => (
            <li key={bullet} className="flex items-start gap-2">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-700">
                {idx + 1}
              </span>
              <span className="leading-snug">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Security Seal */}
      <div className="flex items-center justify-between border-t border-slate-200/80 pt-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Guardian Lab Verified Defense</span>
        </div>
        <span className="font-mono text-slate-400">MIT-Week 2026</span>
      </div>
    </div>
  );
}
