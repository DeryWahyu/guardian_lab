import { Suspense } from "react";
import { HistoryDashboardView } from "@/components/history/history-dashboard-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
            Pilar Recognize & Protect — Modul 7
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Riwayat Detail Forensik
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Rekam jejak investigasi ancaman siber, bukti telemetri, dan snapshot analisis yang
            tersimpan aman di database.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-80 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm text-slate-400">
              Memuat riwayat forensik...
            </div>
          }
        >
          <HistoryDashboardView />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
