"use client";

import { Clock, Lock, Shield, Sparkles } from "lucide-react";
import { CyberGuardianMascot } from "@/components/shared/mascot";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 lg:pt-18 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headlines & Value Prop (Spans 7 cols) */}
          <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-rose-50 px-3.5 py-1.5 text-xs font-bold tracking-wider text-rose-600 uppercase shadow-xs">
              <Sparkles className="size-3.5 text-rose-500" />
              <span>GUARDIANS OF THE DIGITAL SPACE &bull; MIT-WEEK 2026</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl leading-[1.12] font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Saat tautan mencurigakan mengancam,{" "}
              <span className="text-rose-600">ada ruang aman untukmu.</span>
            </h1>

            {/* Subtitle / Copywriting */}
            <p className="mx-auto max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg lg:mx-0">
              Tak perlu cemas membuka link atau file asing. Di Guardian Lab, kamu bisa menguji link
              phishing di browser terisolasi, membedah malware APK kurir/undangan, dan membongkar
              kedok penipuan tanpa risiko perangkat lokalmu terinfeksi.
            </p>

            {/* Trust Bullets Grid */}
            <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 pt-2 sm:grid-cols-2 lg:mx-0">
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200/70 bg-white/80 p-2.5 text-xs font-semibold text-slate-700 shadow-xs sm:text-sm">
                <Lock className="size-4 shrink-0 text-rose-600" />
                <span>100% PII Masked Scrubber</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200/70 bg-white/80 p-2.5 text-xs font-semibold text-slate-700 shadow-xs sm:text-sm">
                <Clock className="size-4 shrink-0 text-amber-500" />
                <span>180s Auto-Destroy Sandbox</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200/70 bg-white/80 p-2.5 text-xs font-semibold text-slate-700 shadow-xs sm:text-sm">
                <Sparkles className="size-4 shrink-0 text-purple-600" />
                <span>DeepSeek AI Threat Scoring</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200/70 bg-white/80 p-2.5 text-xs font-semibold text-slate-700 shadow-xs sm:text-sm">
                <Shield className="size-4 shrink-0 text-emerald-600" />
                <span>Gratis & Terbuka untuk Publik</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Guardian Mascot & Floating Pills (Spans 5 cols) */}
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <CyberGuardianMascot pose="hero" withFloatingBadges={true} />
          </div>
        </div>
      </div>
    </section>
  );
}
