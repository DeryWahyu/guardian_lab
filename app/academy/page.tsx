import { Suspense } from "react";
import { AcademyPageView } from "@/components/academy/academy-page-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export default function AcademyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
            Pilar Act & Edukasi — Modul 8
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Guardian Academy Gamifikasi
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Latih ketajaman mendeteksi kejahatan digital melalui kuis interaktif, kumpulkan EXP, dan
            raih gelar Forensic Master!
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-400">
              Menyiapkan arena latihan...
            </div>
          }
        >
          <AcademyPageView />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
