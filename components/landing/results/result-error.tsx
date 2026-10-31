"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ResultErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ResultError({
  message = "Gagal memproses analisis ancaman pada tautan ini. Silakan periksa koneksi Anda dan coba kembali.",
  onRetry,
  className,
}: ResultErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-3xl border border-rose-200/80 bg-rose-50/80 p-6 text-center shadow-lg shadow-rose-100/30 sm:p-8",
        className,
      )}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-xs">
        <AlertTriangle className="size-6" />
      </div>

      <div>
        <h3 className="text-lg font-bold tracking-tight text-slate-900">
          Analisis Tautan Gagal Diproses
        </h3>
        <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-stone-600 sm:text-sm">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-200 transition-all hover:scale-[1.02] hover:bg-rose-700 active:scale-[0.98] sm:text-sm"
        >
          <RefreshCw className="size-3.5" />
          <span>Coba Analisis Lagi</span>
        </button>
      )}
    </div>
  );
}
