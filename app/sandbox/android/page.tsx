import { Suspense } from "react";
import { AndroidEmulatorView } from "@/components/sandbox/android-emulator-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export default function AndroidEmulatorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <div>
          <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
            Pilar Protect — Modul 4
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Android Emulator Sandbox (Redroid)
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Lingkungan virtual HP Android terisolasi untuk menguji dan membedah aplikasi malware
            tanpa risiko infeksi perangkat fisik.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm text-slate-400">
              Menyiapkan container Redroid virtual...
            </div>
          }
        >
          <AndroidEmulatorView />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
