"use client";

import { Lock, ShieldAlert, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { AUTH_ROUTES } from "@/lib/routes";

export interface AuthGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingType: "url" | "qr" | "apk";
  pendingTarget?: string;
}

export function AuthGateModal({ isOpen, onClose, pendingType, pendingTarget }: AuthGateModalProps) {
  if (!isOpen) return null;

  const returnUrl = pendingTarget
    ? `/?tab=${pendingType}&target=${encodeURIComponent(pendingTarget)}`
    : `/?tab=${pendingType}`;

  const loginRedirect = `${AUTH_ROUTES.login}?redirect=${encodeURIComponent(returnUrl)}`;
  const registerRedirect = `${AUTH_ROUTES.register}?redirect=${encodeURIComponent(returnUrl)}`;

  const typeLabel =
    pendingType === "apk"
      ? "Bongkar Malware APK"
      : pendingType === "qr"
        ? "Pemeriksaan Kode QR"
        : "Deteksi Tautan Phishing";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-gate-title"
      className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <div className="relative flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-stone-200/90 bg-[#FAF9F6] p-6 text-center shadow-2xl shadow-stone-900/20 sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-200/60 hover:text-slate-700"
          aria-label="Tutup dialog"
        >
          <X className="size-4" />
        </button>

        {/* Mascot Shield Icon */}
        <div className="mt-2 flex size-14 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-200">
          <ShieldAlert className="size-7" />
        </div>

        {/* Category Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
          <Lock className="size-3 text-rose-600" />
          <span>Autentikasi Diperlukan • {typeLabel}</span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 id="auth-gate-title" className="text-xl font-extrabold tracking-tight text-slate-900">
            Simpan Temuan Forensik ke Akunmu
          </h3>
          <p className="mx-auto max-w-xs text-xs leading-relaxed text-stone-600 sm:text-sm">
            Untuk melindungi riwayat investigasi dan membuka hasil deteksi AI secara lengkap,
            silakan masuk ke akun Guardian terlebih dahulu.
          </p>
        </div>

        {/* Pending Target Preview Pill */}
        {pendingTarget && (
          <div className="w-full rounded-2xl border border-stone-200/70 bg-white p-2.5 text-left">
            <span className="block text-[10px] font-bold tracking-wider text-stone-400 uppercase">
              Target Investigasi Pending
            </span>
            <code className="font-mono text-xs font-semibold break-all text-slate-800 select-all">
              {pendingTarget}
            </code>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full space-y-2 pt-2">
          <Link
            href={loginRedirect}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-rose-200 transition-all hover:bg-rose-700"
          >
            <Sparkles className="size-4" />
            <span>Masuk Sekarang →</span>
          </Link>

          <Link
            href={registerRedirect}
            className="block w-full cursor-pointer rounded-full border border-stone-200 bg-white px-5 py-2.5 text-center text-xs font-semibold text-slate-800 shadow-xs transition-all hover:bg-stone-100 sm:text-sm"
          >
            Daftar Akun Baru
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer pt-1 text-xs font-semibold text-stone-400 transition-colors hover:text-stone-700"
          >
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
