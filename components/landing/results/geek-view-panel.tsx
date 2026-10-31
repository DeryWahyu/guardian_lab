"use client";

import { Binary, Check, ChevronDown, ChevronUp, Copy, Radio, Server, Terminal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ThreatAnalysisResult } from "@/types/analysis";

export interface GeekViewPanelProps {
  result: ThreatAnalysisResult;
  className?: string;
}

export function GeekViewPanel({ result, className }: GeekViewPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const {
    entropy = 0,
    typosquatTarget,
    levenshteinDistance,
    c2Endpoints = [],
    botTokens = [],
    ipReputation = {},
    domainAgeDays,
  } = result.technicalEvidence || {};

  const handleCopyDefanged = async () => {
    try {
      await navigator.clipboard.writeText(result.defangedTarget);
      setCopied(true);
      toast.success("Defanged URL disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin teks ke clipboard");
    }
  };

  // Entropy evaluation
  const entropyNormalized = Math.min(Math.max(entropy, 0), 8);
  const entropyPct = (entropyNormalized / 8) * 100;
  const isHighEntropy = entropy >= 3.5;

  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-800 bg-[#0B0F17] p-6 font-mono text-xs text-slate-100 shadow-2xl shadow-cyan-950/20 sm:p-7 sm:text-sm",
        className,
      )}
    >
      {/* Terminal Title Bar */}
      <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-full bg-rose-500/80" />
            <span className="inline-block size-3 rounded-full bg-amber-500/80" />
            <span className="inline-block size-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-xs font-semibold tracking-wider text-slate-400">
            GUARDIAN TELEMETRY &bull; CYBER-FORENSIC v2.4
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-800/60 bg-cyan-950/80 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-400">
          <Radio className="size-3 animate-pulse" />
          <span>LIVE ARTIFACT</span>
        </div>
      </div>

      {/* Target Defanged Presentation */}
      <div className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/90 p-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            DEFANGED TARGET STRING
          </span>
          <code className="font-mono text-xs break-all text-cyan-300 select-all sm:text-sm">
            {result.defangedTarget}
          </code>
        </div>
        <button
          type="button"
          onClick={handleCopyDefanged}
          className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400">Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Telemetry Indicators */}
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Metric 1: Shannon Entropy */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              <Binary className="size-3.5 text-cyan-400" />
              <span>Shannon Entropy</span>
            </span>
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[11px] font-bold",
                isHighEntropy
                  ? "border border-rose-800/60 bg-rose-950 text-rose-400"
                  : "border border-emerald-800/60 bg-emerald-950 text-emerald-400",
              )}
            >
              {isHighEntropy ? "SUSPECTED OBFUSCATION" : "NORMAL ENTROPY"}
            </span>
          </div>

          <div>
            <div className="text-2xl font-bold text-slate-100">
              {entropy.toFixed(3)}{" "}
              <span className="text-xs font-normal text-slate-500">bits/char</span>
            </div>
            {/* Visual Bar */}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isHighEntropy
                    ? "bg-gradient-to-r from-amber-500 to-rose-500"
                    : "bg-gradient-to-r from-cyan-500 to-emerald-500",
                )}
                style={{ width: `${entropyPct}%` }}
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-400">
            Ambivalensi karakter acak. Nilai &gt;3.5 mengindikasikan domain acak / DGA.
          </span>
        </div>

        {/* Metric 2: Typosquatting & Levenshtein Distance */}
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              <Terminal className="size-3.5 text-amber-400" />
              <span>Typosquatting Matrix</span>
            </span>
            <span className="rounded border border-amber-800/60 bg-amber-950 px-2 py-0.5 text-[11px] font-bold text-amber-400">
              LEVENSHTEIN METRIC
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-400">Target Entitas:</div>
            <div className="text-base font-bold text-amber-300">
              {typosquatTarget || "None detected (Original Domain)"}
            </div>
            {levenshteinDistance !== undefined && (
              <div className="mt-1 text-xs text-slate-400">
                Jarak Edit (Levenshtein):{" "}
                <span className="font-semibold text-slate-100">{levenshteinDistance} karakter</span>
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            Perbandingan kemiripan nama brand perbankan/ekspedisi resmi Indonesia.
          </span>
        </div>
      </div>

      {/* Extracted IOCs (Indicators of Compromise) */}
      <div className="mb-5 space-y-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
        <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          EXTRACTED INDICATORS OF COMPROMISE (IOCs)
        </span>

        <div className="space-y-2 text-xs">
          {/* C2 Endpoints */}
          <div className="flex flex-col justify-between gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-2 sm:flex-row sm:items-center">
            <span className="text-slate-400">C2 / Callback Endpoints:</span>
            <code className="break-all text-rose-400 select-all">
              {c2Endpoints.length > 0 ? c2Endpoints.join(", ") : "No active C2 endpoints observed"}
            </code>
          </div>

          {/* Telegram Bot Tokens */}
          <div className="flex flex-col justify-between gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-2 sm:flex-row sm:items-center">
            <span className="text-slate-400">Telegram Bot Tokens:</span>
            <code className="break-all text-amber-400 select-all">
              {botTokens.length > 0
                ? botTokens.join(", ")
                : "None extracted (Clean from hardcoded bot tokens)"}
            </code>
          </div>

          {/* IP & Infrastructure */}
          <div className="flex flex-col justify-between gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-2 sm:flex-row sm:items-center">
            <span className="text-slate-400">IP Reputation / ASN:</span>
            <code className="break-all text-cyan-400 select-all">
              {ipReputation.ip
                ? `${ipReputation.ip} (${ipReputation.asn || "Unknown ASN"}, ${ipReputation.country || "ID"})`
                : "Direct Web Request / Cloudflare Edge Proxy"}
            </code>
          </div>

          {/* Domain Age */}
          {domainAgeDays !== undefined && (
            <div className="flex flex-col justify-between gap-1 rounded-xl border border-slate-800 bg-slate-950/80 p-2 sm:flex-row sm:items-center">
              <span className="text-slate-400">Domain Age:</span>
              <code className="text-slate-200">
                {domainAgeDays} hari lalu{" "}
                {domainAgeDays < 14 ? "(High Risk Newly Registered Domain)" : "(Mature Domain)"}
              </code>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Raw JSON Telemetry */}
      <div className="border-t border-slate-800/80 pt-4">
        <button
          type="button"
          onClick={() => setShowRawJson(!showRawJson)}
          className="flex w-full cursor-pointer items-center justify-between text-xs text-slate-400 transition-colors hover:text-slate-200"
        >
          <span className="flex items-center gap-1.5 font-semibold tracking-wider uppercase">
            <Server className="size-3.5 text-cyan-400" />
            <span>Raw Forensic Telemetry JSON</span>
          </span>
          {showRawJson ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {showRawJson && (
          <pre className="mt-3 max-h-64 scrollbar-thin overflow-x-auto rounded-2xl border border-slate-800 bg-black/80 p-4 text-[11px] text-emerald-400">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
