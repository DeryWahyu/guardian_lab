import { ShieldCheck } from "lucide-react";

export function GuardianSecurityBadge() {
  return (
    <div className="my-5 flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/70 p-3.5 text-left">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
        <ShieldCheck className="size-4" />
      </div>
      <div>
        <h4 className="text-xs font-bold text-amber-900">Zero Real PII &bull; Data Terproteksi</h4>
        <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800/80">
          Guardian Lab secara otomatis menyensor nomor telepon, NIK, dan token bot sebelum analisis
          diproses.
        </p>
      </div>
    </div>
  );
}
