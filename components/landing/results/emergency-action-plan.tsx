"use client";

import { AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmergencyActionPlanProps {
  ifNotClicked: string | string[];
  ifAlreadyInstalledOrFilled: string | string[];
  className?: string;
}

export function EmergencyActionPlan({
  ifNotClicked,
  ifAlreadyInstalledOrFilled,
  className,
}: EmergencyActionPlanProps) {
  // Normalize strings or arrays into string arrays
  const notClickedSteps = Array.isArray(ifNotClicked)
    ? ifNotClicked
    : ifNotClicked
      ? [ifNotClicked]
      : [
          "Jangan klik tautan atau unduh berkas apa pun dari pesan tersebut.",
          "Hapus pesan dan blokir nomor kontak pengirim di WhatsApp/SMS.",
          "Unduh Guardian Share Card untuk memperingatkan keluarga di grup chat.",
        ];

  const alreadyClickedSteps = Array.isArray(ifAlreadyInstalledOrFilled)
    ? ifAlreadyInstalledOrFilled
    : ifAlreadyInstalledOrFilled
      ? [ifAlreadyInstalledOrFilled]
      : [
          "SEGERA aktifkan Mode Pesawat (matikan Wi-Fi & data seluler) jika sempat mengunduh file APK.",
          "Ganti kata sandi m-banking dan PIN ATM Anda sekarang juga dari perangkat lain.",
          "Hubungi call center resmi bank untuk memblokir sementara rekening Anda.",
          "Buka Pengaturan HP > Aplikasi, lalu copot pemasangan (uninstall) aplikasi penipu.",
        ];

  return (
    <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2", className)}>
      {/* Prevention Box: Jika Belum Diklik */}
      <div className="flex flex-col gap-3 rounded-3xl border border-emerald-200/70 bg-emerald-50/50 p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">
              Jika Belum Diklik (Langkah Pencegahan)
            </h4>
            <span className="text-[11px] font-medium text-emerald-700">
              Data Anda masih aman! Lakukan tindakan ini:
            </span>
          </div>
        </div>

        <ul className="mt-1 space-y-2">
          {notClickedSteps.map((step) => (
            <li
              key={step}
              className="flex items-start gap-2.5 text-xs leading-relaxed text-emerald-900 sm:text-sm"
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Emergency Mitigation Box: Jika Sudah Terlanjur Diklik */}
      <div className="flex flex-col gap-3 rounded-3xl border border-rose-200/70 bg-rose-50/60 p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <AlertTriangle className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-950">
              Jika Sudah Terlanjur Diklik / Isi Data
            </h4>
            <span className="text-[11px] font-medium text-rose-700">
              Jangan panik, lakukan mitigasi cepat ini:
            </span>
          </div>
        </div>

        <ul className="mt-1 space-y-2">
          {alreadyClickedSteps.map((step) => (
            <li
              key={step}
              className="flex items-start gap-2.5 text-xs leading-relaxed text-rose-900 sm:text-sm"
            >
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-rose-500" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
