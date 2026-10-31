"use client";

import { AlertOctagon, CheckCircle2, VenetianMask, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KedokCardProps {
  score: number;
  scamCategory: string;
  humanFriendlySummary: string;
  deceptionTricks?: string[];
  className?: string;
}

export function KedokCard({
  score,
  scamCategory,
  humanFriendlySummary,
  deceptionTricks = [],
  className,
}: KedokCardProps) {
  const isSafe = score < 30;

  // Safe Mode View
  if (isSafe) {
    return (
      <div
        className={cn(
          "flex flex-col gap-4 rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-white to-sky-50/40 p-6 shadow-md shadow-emerald-100/40 sm:p-7",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
              Verifikasi Keamanan
            </span>
            <h3 className="text-lg leading-tight font-bold text-slate-900">
              Tautan Terverifikasi Wajar & Aman
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 text-sm leading-relaxed text-stone-700">
          {humanFriendlySummary ||
            "Pemeriksaan otomatis tidak mendeteksi tanda manipulasi psikologis, peniruan merk, atau domain jebakan phishing."}
        </div>

        <p className="text-xs leading-relaxed text-stone-500">
          Tetap waspada: Jangan pernah membagikan kode OTP, PIN ATM, atau kata sandi pribadi Anda
          kepada siapa pun, bahkan di situs yang sah.
        </p>
      </div>
    );
  }

  // Deception / Phishing Mode View ("Kedok Penipu Terbongkar")
  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-3xl border border-rose-200/80 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/50 p-6 shadow-md shadow-rose-100/30 sm:p-7",
        className,
      )}
    >
      {/* Header Pill & Title */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-xs">
          <VenetianMask className="size-5" />
        </div>
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-rose-700 uppercase">
            <AlertOctagon className="size-3" />
            <span>Kedok Penipu Terbongkar</span>
          </div>
          <h3 className="text-xl leading-snug font-extrabold tracking-tight text-slate-900">
            Modus & Rekayasa Sosial Terdeteksi
          </h3>
          <p className="mt-0.5 text-xs font-medium text-rose-700/90">
            Kategori: {scamCategory || "Phishing / Manipulasi Digital"}
          </p>
        </div>
      </div>

      {/* Human Friendly Summary Box */}
      <div className="rounded-2xl border border-rose-100/80 bg-white/95 p-4 text-sm leading-relaxed text-stone-800 shadow-xs sm:text-base">
        <p className="mb-1 font-medium text-slate-900">Ringkasan Bahaya:</p>
        <p className="text-stone-700">{humanFriendlySummary}</p>
      </div>

      {/* Deception Tricks Breakdown */}
      {deceptionTricks.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold tracking-wider text-stone-500 uppercase">
            Trik Manipulasi yang Digunakan Pelaku:
          </h4>
          <div className="grid gap-2">
            {deceptionTricks.map((trick) => (
              <div
                key={trick}
                className="flex items-start gap-3 rounded-2xl border border-rose-100/70 bg-rose-50/60 p-3 text-xs leading-snug text-stone-800 sm:text-sm"
              >
                <XCircle className="mt-0.5 size-4 shrink-0 text-rose-500" />
                <span>{trick}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
