"use client";

import { ArrowLeft, Calendar, Share2, Shield, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EmergencyActionPlan } from "@/components/landing/results/emergency-action-plan";
import { GeekViewPanel } from "@/components/landing/results/geek-view-panel";
import { KedokCard } from "@/components/landing/results/kedok-card";
import { ThreatScoreGauge } from "@/components/landing/results/threat-score-gauge";
import { DualModeToggle } from "@/components/shared/dual-mode-toggle";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import type { ThreatAnalysisResult } from "@/types/analysis";

interface ForensicRecordDetail {
  id: string;
  target: string;
  type: "URL" | "QR" | "APK";
  riskLevel: ThreatAnalysisResult["riskLevel"];
  riskScore: number;
  scamCategory: string;
  summary: string;
  deceptionTricks?: string[];
  technicalEvidence?: Record<string, unknown>;
  defangedTarget?: string;
  createdAt: string;
}

export function HistoryDetailView({ recordId }: { recordId: string }) {
  const router = useRouter();
  const [record, setRecord] = useState<ForensicRecordDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"human" | "geek">("human");

  useEffect(() => {
    let mounted = true;
    async function loadDetail() {
      try {
        const res = await fetch(`/api/history/${recordId}`);
        if (res.ok && mounted) {
          const data = await res.json();
          setRecord(data);
        }
      } catch (err) {
        console.error("Error loading detail:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDetail();
    return () => {
      mounted = false;
    };
  }, [recordId]);

  if (loading) {
    return (
      <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-400">
        Memuat detail laporan forensik...
      </div>
    );
  }

  if (!record) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-12 text-center">
        <h3 className="text-lg font-bold text-slate-900">Laporan Tidak Ditemukan</h3>
        <p className="text-xs text-slate-500">
          ID rekaman forensik tidak terdaftar di sistem atau Anda tidak memiliki akses.
        </p>
        <Link
          href={PROTECTED_ROUTES.history}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-600 px-5 py-2 text-xs font-semibold text-white"
        >
          &larr; Kembali ke Riwayat
        </Link>
      </div>
    );
  }

  const threatResult: ThreatAnalysisResult = {
    id: record.id,
    target: record.target,
    type: record.type,
    riskLevel: record.riskLevel,
    riskScore: record.riskScore,
    scamCategory: record.scamCategory,
    humanFriendlySummary: record.summary,
    deceptionTricks: Array.isArray(record.deceptionTricks) ? record.deceptionTricks : [],
    technicalEvidence: record.technicalEvidence || {},
    emergencyActionPlan: {
      ifNotClicked: "Jangan klik atau sebarkan tautan ini.",
      ifAlreadyInstalledOrFilled: "Segera putus koneksi internet dan hubungi bank.",
    },
    defangedTarget: record.defangedTarget || record.target,
  };

  return (
    <div className="space-y-6">
      {/* Back button & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={PROTECTED_ROUTES.history}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Riwayat
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <DualModeToggle mode={mode} onChange={setMode} />

          <button
            type="button"
            onClick={() => router.push(PUBLIC_ROUTES.actWithTarget(record.target, record.id))}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100"
          >
            <Share2 className="h-3.5 w-3.5" /> Buat Share Card
          </button>

          {record.type !== "APK" && (
            <button
              type="button"
              onClick={() => router.push(PUBLIC_ROUTES.sandboxWebWithTarget(record.target))}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Shield className="h-3.5 w-3.5 text-emerald-600" /> Buka di Sandbox
            </button>
          )}

          <button
            type="button"
            onClick={() => router.push(PROTECTED_ROUTES.community)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Users className="h-3.5 w-3.5" /> Kontribusi ke Komunitas
          </button>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider text-rose-600 uppercase">
              {record.type} Investigation Report
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(record.createdAt).toLocaleString("id-ID")}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">{record.scamCategory}</h2>
          <p className="font-mono text-xs break-all text-rose-500 select-all">
            {record.defangedTarget || record.target}
          </p>
        </div>

        <ThreatScoreGauge
          score={record.riskScore}
          riskLevel={record.riskLevel}
          defangedTarget={record.defangedTarget || record.target}
          scamCategory={record.scamCategory}
        />
      </div>

      {/* Mode View: Human vs Geek View */}
      {mode === "human" ? (
        <div className="space-y-4">
          <KedokCard
            score={threatResult.riskScore}
            scamCategory={threatResult.scamCategory}
            humanFriendlySummary={threatResult.humanFriendlySummary}
            deceptionTricks={threatResult.deceptionTricks}
          />
          <EmergencyActionPlan
            ifNotClicked={threatResult.emergencyActionPlan.ifNotClicked}
            ifAlreadyInstalledOrFilled={threatResult.emergencyActionPlan.ifAlreadyInstalledOrFilled}
          />
        </div>
      ) : (
        <GeekViewPanel result={threatResult} />
      )}
    </div>
  );
}
