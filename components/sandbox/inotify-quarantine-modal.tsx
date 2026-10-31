"use client";

import { AlertOctagon, CheckCircle2, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PUBLIC_ROUTES } from "@/lib/routes";

interface InotifyQuarantineModalProps {
  isOpen: boolean;
  fileName: string;
  onDismiss: () => void;
}

export function InotifyQuarantineModal({
  isOpen,
  fileName,
  onDismiss,
}: InotifyQuarantineModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleInspectWithApkXray = () => {
    onDismiss();
    router.push(PUBLIC_ROUTES.homeWithTab("apk"));
  };

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm duration-200">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
            <AlertOctagon className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-rose-600 uppercase">
              Inotify Download Watcher
            </span>
            <h3 className="text-lg font-bold text-slate-900">File APK Terdeteksi di Sandbox!</h3>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          Situs yang kamu buka baru saja memicu unduhan file installer Android otomatis. Di
          perangkat aslimu, ini adalah modus trojan pencuri SMS/OTP!
        </p>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="mr-2 truncate">
            <div className="text-xs font-medium text-slate-400">Nama File Unduhan</div>
            <div className="truncate font-mono text-xs font-bold text-slate-800">{fileName}</div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
            <ShieldCheck className="h-3.5 w-3.5" /> Terkarantina
          </span>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-rose-100 bg-rose-50/70 p-3 text-xs text-rose-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
          <span>
            File ini diisolasi aman di dalam Sandbox Cloud dan{" "}
            <strong>tidak masuk ke penyimpanan HP/laptop aslimu</strong>.
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            <Trash2 className="h-3.5 w-3.5 text-slate-400" />
            Hapus File
          </button>
          <button
            type="button"
            onClick={handleInspectWithApkXray}
            className="cursor-pointer rounded-full bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-colors hover:bg-rose-700"
          >
            Bedah dengan APK X-Ray &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
