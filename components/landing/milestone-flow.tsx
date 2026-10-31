"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function MilestoneFlowSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "Input Aman & Terisolasi",
      tag: "TAHAP AWAL",
      description:
        "Masukkan tautan mencurigakan, unggah screenshot QR code, atau taruh berkas APK kurir/undangan ke Gateway.",
      telemetry: "RAW_INPUT: [TARGET_UNTRUSTED] -> INTAKE_GATEWAY_V2",
      badge: "Zero Execution",
    },
    {
      num: "02",
      title: "Sanitasi PII Otomatis",
      tag: "PRIVASI DIUTAMAKAN",
      description:
        "PII Scrubber secara otomatis menyensor nomor HP (08xx), 16-digit NIK/rekening, email, dan token bot sebelum AI memproses.",
      telemetry: "SCRUBBER: [0812**** REDACTED] [3171**** REDACTED]",
      badge: "100% Data Safe",
    },
    {
      num: "03",
      title: "Bedah & Isolasi Sandbox",
      tag: "EKSEKUSI TERPISAH",
      description:
        "Ekstraksi fitur leksikal, dekompilasi static manifest APK via jadx, atau streaming Chromium terisolasi dengan auto-destroy 180 detik.",
      telemetry: "SANDBOX: KASMVNC_STREAM // TIMER_EXPIRY: 180s // DEPLOYED",
      badge: "Docker Isolated",
    },
    {
      num: "04",
      title: "Tindakan Penyelamatan",
      tag: "HASIL AKHIR",
      description:
        "Buka kartu 'Kedok Penipu Terbongkar', amati telemetri Geek View, dan hasilkan Guardian Share Card siap kirim ke grup keluarga.",
      telemetry: "OUTPUT: KEDOK_TERBONGKAR // ARTIFACT: SHARE_CARD_PNG",
      badge: "Action Ready",
    },
  ];

  return (
    <section className="border-y border-stone-200/60 bg-stone-50/50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/70 bg-rose-50 px-3 py-1 text-xs font-bold tracking-wider text-rose-600 uppercase">
            LANGKAH DEMI LANGKAH
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Langkah kecil demi <span className="text-rose-600">keamanan digital bersama.</span>
          </h2>
          <p className="text-sm leading-relaxed text-stone-600 sm:text-base">
            Guardian Lab memastikan setiap investigasi berjalan transparan, terisolasi, dan tanpa
            celah kebocoran data pribadi.
          </p>
        </div>

        {/* 2-Column Layout: Left Steps + Right Interactive Journey Preview */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left Column: 4 Numbered Steps (Spans 7 cols) */}
          <div className="space-y-3.5 lg:col-span-7">
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <button
                  type="button"
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={cn(
                    "flex w-full cursor-pointer items-start gap-4 rounded-3xl border p-5 text-left transition-all sm:gap-5 sm:p-6",
                    isSelected
                      ? "scale-[1.01] border-rose-300 bg-white shadow-md shadow-rose-100/50"
                      : "border-stone-200/80 bg-white/60 hover:border-stone-300 hover:bg-white",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-2xl text-lg font-extrabold transition-colors",
                      isSelected
                        ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                        : "bg-stone-100 text-stone-500",
                    )}
                  >
                    {step.num}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-wider text-rose-600 uppercase">
                        {step.tag}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-400">{step.badge}</span>
                    </div>
                    <h3 className="text-base leading-snug font-bold text-slate-900 sm:text-lg">
                      {step.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-stone-600 sm:text-sm">
                      {step.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Telemetry Simulation Preview (Spans 5 cols) */}
          <div className="lg:col-span-5">
            <div className="space-y-4 rounded-3xl border border-slate-800 bg-[#0B0F17] p-6 font-mono text-xs text-slate-100 shadow-2xl sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-rose-500" />
                  <span className="size-2.5 rounded-full bg-amber-500" />
                  <span className="size-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-[11px] text-slate-400">SIMULATOR &bull; PIPELINE</span>
                </div>
                <div className="rounded border border-cyan-800/60 bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                  STEP {steps[activeStep].num} ACTIVE
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-slate-400">ACTIVE STAGE:</span>
                <div className="text-sm font-bold text-cyan-300">{steps[activeStep].title}</div>
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-800/80 bg-slate-950 p-4">
                <span className="block text-[10px] tracking-wider text-slate-500 uppercase">
                  Telemetri Engine:
                </span>
                <code className="block text-[11px] break-all text-emerald-400">
                  {steps[activeStep].telemetry}
                </code>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                <span>Status: Terverifikasi Aman</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  <span>Enforced</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
