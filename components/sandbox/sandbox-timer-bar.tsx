"use client";

import { AlertTriangle, Clock, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";

interface SandboxTimerBarProps {
  initialSeconds?: number;
  onExpire: () => void;
  onDestroy: () => void;
  isDestroying?: boolean;
}

export function SandboxTimerBar({
  initialSeconds = 180,
  onExpire,
  onDestroy,
  isDestroying = false,
}: SandboxTimerBarProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = (timeLeft / initialSeconds) * 100;

  const isUrgent = timeLeft < 30;
  const isWarning = timeLeft < 60 && !isUrgent;

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-xs backdrop-blur-md transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={`rounded-lg p-1.5 transition-colors ${
              isUrgent
                ? "animate-pulse bg-rose-100 text-rose-600"
                : isWarning
                  ? "bg-amber-100 text-amber-600"
                  : "bg-emerald-100 text-emerald-600"
            }`}
          >
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Masa Aktif Sandbox (Auto-Destroy)
              </span>
              {isUrgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600">
                  <AlertTriangle className="h-3 w-3" /> Segera Berakhir
                </span>
              )}
            </div>
            <div className="font-mono text-base font-bold text-slate-800">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onDestroy}
          disabled={isDestroying}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          {isDestroying ? "Menghancurkan..." : "Hancurkan Sesi Sekarang"}
        </button>
      </div>

      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isUrgent ? "bg-rose-500" : isWarning ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
