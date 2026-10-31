"use client";

import { History, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Mascot } from "@/components/shared/mascot";
import { PUBLIC_ROUTES } from "@/lib/routes";
import { HistoryCard, type HistoryRecordItem } from "./history-card";
import { HistoryFilters } from "./history-filters";

export function HistoryDashboardView() {
  const [records, setRecords] = useState<HistoryRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("ALL");
  const [risk, setRisk] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    async function fetchHistory() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (type !== "ALL") queryParams.set("type", type);
        if (risk !== "ALL") queryParams.set("risk", risk);
        if (search) queryParams.set("search", search);

        const res = await fetch(`/api/history?${queryParams.toString()}`);
        if (res.ok && mounted) {
          const data = await res.json();
          setRecords(data);
        }
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchHistory();
    return () => {
      mounted = false;
    };
  }, [type, risk, search]);

  const totalScans = records.length;
  const criticalThreats = records.filter((r) =>
    ["CRITICAL", "HIGH", "DANGEROUS", "PHISHING", "MALWARE"].includes(r.riskLevel),
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 font-bold text-rose-600">
            <History className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalScans}</div>
            <div className="text-xs font-medium text-slate-500">Total Pemindaian Forensik</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 font-bold text-amber-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{criticalThreats}</div>
            <div className="text-xs font-medium text-slate-500">Ancaman Kritis Dicegah</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 font-bold text-emerald-600">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">100%</div>
            <div className="text-xs font-medium text-slate-500">Tersanitasi Zero PII</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <HistoryFilters
        type={type}
        onTypeChange={setType}
        risk={risk}
        onRiskChange={setRisk}
        search={search}
        onSearchChange={setSearch}
      />

      {/* Content Grid / Loading / Empty */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={`skel-${i}`}
              className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      ) : records.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <HistoryCard key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
          <Mascot size={120} showPills={false} className="mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Belum Ada Riwayat Pemindaian</h3>
          <p className="text-xs leading-relaxed text-slate-500">
            Mulai periksa tautan mencurigakan, gambar QR, atau unggah file APK di halaman utama
            untuk melihat rekam jejak forensikmu di sini.
          </p>
          <Link
            href={PUBLIC_ROUTES.home}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700"
          >
            Mulai Pemindaian Pertama &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
