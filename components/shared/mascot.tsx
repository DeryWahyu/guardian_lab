"use client";

import { Lock, Shield, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type MascotPose = "hero" | "recognize" | "protect" | "investigate" | "act" | "cta";

interface CyberGuardianMascotProps {
  pose?: MascotPose;
  className?: string;
  withFloatingBadges?: boolean;
  size?: number;
  showPills?: boolean;
}

export function CyberGuardianMascot({
  pose = "hero",
  className,
  withFloatingBadges = false,
  size,
  showPills,
}: CyberGuardianMascotProps) {
  const displayBadges = showPills ?? withFloatingBadges;
  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none", className)}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* Ambient Pastel Glow Behind Mascot */}
      <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-tr from-rose-400/20 via-amber-300/20 to-purple-400/20 blur-2xl" />

      {/* Floating Trust / Security Pills (Hero Pose) */}
      {displayBadges && (
        <>
          {/* Badge 1: Top-Left */}
          <div className="absolute -top-3 -left-4 z-20 flex animate-bounce items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-md shadow-stone-200/50 duration-1000 sm:-left-8">
            <Lock className="size-3 text-rose-600" />
            <span>100% PII Masked</span>
          </div>

          {/* Badge 2: Top-Right */}
          <div className="absolute -top-1 -right-3 z-20 flex animate-pulse items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-md shadow-stone-200/50 sm:-right-6">
            <Zap className="size-3 text-amber-500" />
            <span>Auto-Destroy 180s</span>
          </div>

          {/* Badge 3: Bottom-Left */}
          <div className="absolute -bottom-2 -left-3 z-20 flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-md shadow-xs shadow-stone-200/50 sm:-left-6">
            <Shield className="size-3 text-emerald-600" />
            <span>Anti-Quishing Guard</span>
          </div>

          {/* Badge 4: Bottom-Right */}
          <div className="absolute -right-2 -bottom-3 z-20 flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/95 px-3 py-1.5 text-[11px] font-bold text-slate-800 shadow-md shadow-xs shadow-stone-200/50 sm:-right-4">
            <Sparkles className="size-3 text-purple-600" />
            <span>AI Real-Time Scan</span>
          </div>
        </>
      )}

      {/* 3D Cyber Guardian Character Vector SVG */}
      <svg
        viewBox="0 0 280 280"
        className="h-auto w-full max-w-[260px] drop-shadow-xl sm:max-w-[300px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Cyber Guardian Mascot</title>
        <defs>
          {/* Gradients */}
          <linearGradient
            id="hoodGrad"
            x1="40"
            y1="20"
            x2="240"
            y2="240"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F43F5E" />
            <stop offset="0.6" stopColor="#E11D48" />
            <stop offset="1" stopColor="#9F1239" />
          </linearGradient>

          <linearGradient
            id="innerHoodGrad"
            x1="70"
            y1="60"
            x2="210"
            y2="200"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#881337" />
            <stop offset="1" stopColor="#4C0519" />
          </linearGradient>

          <linearGradient
            id="faceGrad"
            x1="90"
            y1="80"
            x2="190"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFF1F2" />
            <stop offset="1" stopColor="#FFE4E6" />
          </linearGradient>

          <linearGradient
            id="shieldGrad"
            x1="160"
            y1="130"
            x2="260"
            y2="240"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F59E0B" />
            <stop offset="0.5" stopColor="#D97706" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>

          <linearGradient
            id="shieldEmblemGrad"
            x1="180"
            y1="160"
            x2="240"
            y2="210"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#38BDF8" />
            <stop offset="1" stopColor="#0284C7" />
          </linearGradient>

          <linearGradient
            id="capeGrad"
            x1="30"
            y1="120"
            x2="120"
            y2="260"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#E11D48" />
            <stop offset="1" stopColor="#881337" />
          </linearGradient>

          <radialGradient id="eyeGlow" cx="0.5" cy="0.5" r="0.5">
            <stop stopColor="#06B6D4" />
            <stop offset="0.8" stopColor="#0891B2" />
            <stop offset="1" stopColor="#164E63" />
          </radialGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Cape Wings (Fluttering Behind) */}
        <path
          d="M75 140 C40 180 30 230 45 260 C75 255 105 235 115 195 Z"
          fill="url(#capeGrad)"
          opacity="0.9"
        />
        <path
          d="M205 140 C240 180 250 230 235 260 C205 255 175 235 165 195 Z"
          fill="url(#capeGrad)"
          opacity="0.9"
        />

        {/* Torso & Suit */}
        <path
          d="M95 165 C95 150 115 140 140 140 C165 140 185 150 185 165 L195 240 C195 255 170 262 140 262 C110 262 85 255 85 240 Z"
          fill="#1E293B"
        />
        {/* Chest Armor Plate */}
        <path
          d="M110 165 L140 185 L170 165 L160 215 L140 230 L120 215 Z"
          fill="#334155"
          stroke="#0EA5E9"
          strokeWidth="2"
        />
        {/* Chest Glowing Core */}
        <circle cx="140" cy="195" r="8" fill="#38BDF8" filter="url(#softGlow)" />
        <circle cx="140" cy="195" r="4" fill="#FFFFFF" />

        {/* Large Rounded Hood (Guardian Signature) */}
        <ellipse cx="140" cy="115" rx="65" ry="70" fill="url(#hoodGrad)" />
        {/* Hood Shadow / Depth Layer */}
        <ellipse cx="140" cy="120" rx="55" ry="58" fill="url(#innerHoodGrad)" />

        {/* Cute Face Inside Hood */}
        <ellipse cx="140" cy="124" rx="46" ry="46" fill="url(#faceGrad)" />

        {/* Soft Blushing Cheeks */}
        <ellipse cx="116" cy="140" rx="7" ry="4" fill="#FB7185" opacity="0.6" />
        <ellipse cx="164" cy="140" rx="7" ry="4" fill="#FB7185" opacity="0.6" />

        {/* Expressive Anime/Pixar Cyber Visor Eyes */}
        {pose === "recognize" ? (
          // Inquisitive / Winking Detective Eyes
          <>
            <ellipse cx="122" cy="124" rx="8" ry="10" fill="url(#eyeGlow)" />
            <circle cx="120" cy="121" r="3" fill="#FFFFFF" />
            {/* Winking right eye */}
            <path
              d="M152 124 Q162 118 172 124"
              stroke="#0891B2"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        ) : (
          // Bright Vigilant Eyes
          <>
            {/* Left Eye */}
            <ellipse cx="122" cy="124" rx="9" ry="11" fill="url(#eyeGlow)" />
            <circle cx="120" cy="120" r="3.5" fill="#FFFFFF" />
            <circle cx="124" cy="126" r="1.5" fill="#A5F3FC" />

            {/* Right Eye */}
            <ellipse cx="158" cy="124" rx="9" ry="11" fill="url(#eyeGlow)" />
            <circle cx="156" cy="120" r="3.5" fill="#FFFFFF" />
            <circle cx="160" cy="126" r="1.5" fill="#A5F3FC" />
          </>
        )}

        {/* Friendly Confident Smile */}
        <path
          d="M132 144 Q140 152 148 144"
          stroke="#881337"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Golden Cyber Shield in Forearm */}
        <g transform="translate(10, 0)">
          {/* Shield Outline & Body */}
          <path
            d="M175 145 C205 145 228 152 230 178 C232 215 195 245 175 255 C155 245 118 215 120 178 C122 152 145 145 175 145 Z"
            fill="url(#shieldGrad)"
            stroke="#FEF3C7"
            strokeWidth="3"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
          />
          {/* Inner Emblem Plate */}
          <path
            d="M175 158 C195 158 210 163 212 182 C214 208 188 230 175 238 C162 230 136 208 138 182 C140 163 155 158 175 158 Z"
            fill="#1E293B"
          />
          {/* Golden Shield Star / Check */}
          <path
            d="M175 170 L180 185 L195 186 L183 195 L187 210 L175 200 L163 210 L167 195 L155 186 L170 185 Z"
            fill="url(#shieldEmblemGrad)"
          />
        </g>

        {/* Floating Sparks / Stars */}
        <circle cx="68" cy="75" r="3" fill="#FDE047" />
        <circle cx="215" cy="65" r="4" fill="#FDE047" />
        <circle cx="230" cy="110" r="2.5" fill="#F43F5E" />
      </svg>
    </div>
  );
}

export const Mascot = CyberGuardianMascot;
export default CyberGuardianMascot;
