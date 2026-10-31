"use client";

import { Download, Globe, Lock, Monitor, RefreshCw, Shield, Smartphone } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PUBLIC_ROUTES } from "@/lib/routes";
import { InotifyQuarantineModal } from "./inotify-quarantine-modal";
import { SandboxTimerBar } from "./sandbox-timer-bar";

export function WebSandboxView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTarget =
    searchParams.get("target") || "https://klikbca-verifikasi-otp.top/login.php";

  const [currentUrl, setCurrentUrl] = useState(initialTarget);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [isDestroying, setIsDestroying] = useState(false);
  const [quarantineApk, setQuarantineApk] = useState<string | null>(null);

  // Initialize sandbox session
  useEffect(() => {
    let mounted = true;
    async function initSession() {
      try {
        const res = await fetch("/api/sandbox/session/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "web", target: initialTarget }),
        });
        if (res.ok && mounted) {
          const data = await res.json();
          setSessionId(data.sessionId);
        }
      } catch (err) {
        console.error("Failed to start session:", err);
      }
    }
    initSession();
    return () => {
      mounted = false;
    };
  }, [initialTarget]);

  const handleDestroy = async () => {
    setIsDestroying(true);
    if (sessionId) {
      try {
        await fetch("/api/sandbox/session/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
      } catch (err) {
        console.error("Error stopping session:", err);
      }
    }
    setIsDestroying(false);
    setIsDestroyed(true);
  };

  const triggerMockInotifyDownload = () => {
    setQuarantineApk("Surat_Undangan_Nikah_Digital.apk");
  };

  if (isDestroyed) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
          <Shield className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Sesi Sandbox Telah Dihancurkan</h2>
        <p className="mx-auto max-w-md text-sm text-slate-600">
          Lingkungan browser cloud terisolasi telah dimatikan dan seluruh cache/file sementara telah
          dibersihkan demi keamananmu.
        </p>
        <button
          type="button"
          onClick={() => router.push(PUBLIC_ROUTES.home)}
          className="mt-4 cursor-pointer rounded-full bg-rose-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-colors hover:bg-rose-700"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timer Bar */}
      <SandboxTimerBar
        initialSeconds={180}
        onExpire={handleDestroy}
        onDestroy={handleDestroy}
        isDestroying={isDestroying}
      />

      {/* Browser Chrome Container */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md transition-all">
        {/* Browser Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs font-semibold text-slate-500">
              Cloud Chromium Isolation (KasmVNC Sandbox)
            </span>
          </div>

          {/* Viewport Toggles & Inotify Simulation Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerMockInotifyDownload}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-100"
              title="Simulasikan trigger inotify download watcher saat malware mencoba mengunduh APK"
            >
              <Download className="h-3.5 w-3.5 text-amber-600" />
              Simulasi Unduh APK
            </button>

            <div className="inline-flex rounded-xl bg-slate-200/70 p-1 text-slate-600">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewport === "desktop"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" /> Desktop
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  viewport === "mobile"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "hover:text-slate-900"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </button>
            </div>
          </div>
        </div>

        {/* Browser Address Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200/80 bg-slate-100/70 px-4 py-2.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <button
              type="button"
              onClick={() => {}}
              className="cursor-pointer rounded p-1 hover:bg-slate-200"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-2xs">
            <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <input
              type="text"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              className="w-full bg-transparent font-mono text-xs text-slate-800 outline-none"
              placeholder="https://..."
            />
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-600">
            <Shield className="h-3 w-3" /> Sandboxed Environment
          </span>
        </div>

        {/* Viewport Render Area */}
        <div className="flex min-h-[520px] justify-center bg-slate-900/5 p-4">
          <div
            className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ${
              viewport === "mobile" ? "h-[640px] w-[390px]" : "h-[520px] w-full"
            }`}
          >
            {/* Sandboxed Simulation Screen */}
            <div className="flex flex-1 flex-col items-center justify-center space-y-4 bg-slate-50 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl border border-rose-200 bg-rose-50 text-rose-600">
                <Globe className="h-7 w-7" />
              </div>

              <div>
                <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
                  Isolated Cloud Browser Stream
                </span>
                <h4 className="mt-1 text-base font-bold text-slate-900">
                  Membuka Tautan Phishing Secara Aman
                </h4>
                <p className="mt-1.5 max-w-sm font-mono text-xs leading-relaxed text-slate-500">
                  {currentUrl}
                </p>
              </div>

              <div className="max-w-md space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-left text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Shield className="h-4 w-4 text-emerald-600" /> Status Perlindungan:
                </div>
                <ul className="list-inside list-disc space-y-1 text-slate-500">
                  <li>Zero Local Infection: Eksekusi script berjalan di kontainer terisolasi</li>
                  <li>Inotify Watcher aktif memantau unduhan APK</li>
                  <li>Sesi otomatis dihancurkan saat waktu habis</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={triggerMockInotifyDownload}
                className="cursor-pointer text-xs font-medium text-rose-600 underline hover:text-rose-700"
              >
                Uji Coba Deteksi Unduhan APK Otomatis &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inotify Quarantine Modal */}
      <InotifyQuarantineModal
        isOpen={quarantineApk !== null}
        fileName={quarantineApk || ""}
        onDismiss={() => setQuarantineApk(null)}
      />
    </div>
  );
}
