import { FileCode2, Globe, QrCode, ShieldAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";

export interface HistoryRecordItem {
  id: string;
  target: string;
  type: "URL" | "QR" | "APK";
  riskLevel: string;
  riskScore: number;
  scamCategory: string;
  summary: string;
  defangedTarget: string;
  createdAt: string;
}

export function HistoryCard({ record }: { record: HistoryRecordItem }) {
  const isHighRisk = ["CRITICAL", "HIGH", "DANGEROUS", "PHISHING", "MALWARE"].includes(
    record.riskLevel,
  );

  return (
    <div className="flex flex-col justify-between space-y-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-rose-200 hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center justify-center rounded-2xl p-2 ${
                record.type === "APK"
                  ? "bg-purple-50 text-purple-600"
                  : record.type === "QR"
                    ? "bg-sky-50 text-sky-600"
                    : "bg-rose-50 text-rose-600"
              }`}
            >
              {record.type === "APK" ? (
                <FileCode2 className="h-4 w-4" />
              ) : record.type === "QR" ? (
                <QrCode className="h-4 w-4" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
            </span>
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              {record.type} Scan
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
              isHighRisk ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {isHighRisk ? (
              <ShieldAlert className="h-3.5 w-3.5" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5" />
            )}
            Skor: {record.riskScore}/100
          </span>
        </div>

        <div>
          <h4 className="line-clamp-1 text-sm font-bold text-slate-900">
            {record.scamCategory || "Analisis Ancaman Digital"}
          </h4>
          <p className="mt-0.5 line-clamp-1 font-mono text-xs break-all text-rose-500 select-all">
            {record.defangedTarget || record.target}
          </p>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">{record.summary}</p>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
        <span>
          {new Date(record.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
        </span>
        <Link
          href={PROTECTED_ROUTES.historyDetail(record.id)}
          className="inline-flex cursor-pointer items-center gap-1 font-semibold text-rose-600 hover:text-rose-700"
        >
          Lihat Bukti &rarr;
        </Link>
      </div>
    </div>
  );
}
