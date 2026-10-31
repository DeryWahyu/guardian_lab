"use client";

import { AlertTriangle, Battery, Shield, ShieldAlert, Smartphone, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PUBLIC_ROUTES } from "@/lib/routes";
import { SandboxTimerBar } from "./sandbox-timer-bar";

export function AndroidEmulatorView() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [isDestroying, setIsDestroying] = useState(false);
  const [permissionBlocked, setPermissionBlocked] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function initSession() {
      try {
        const res = await fetch("/api/sandbox/session/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "android" }),
        });
        if (res.ok && mounted) {
          const data = await res.json();
          setSessionId(data.sessionId);
        }
      } catch (err) {
        console.error("Failed to start emulator session:", err);
      }
    }
    initSession();
    return () => {
      mounted = false;
    };
  }, []);

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

  if (isDestroyed) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
          <Smartphone className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Emulator Android Dihancurkan</h2>
        <p className="mx-auto max-w-md text-sm text-slate-600">
          Kontainer Redroid virtual telah dihentikan dan seluruh state emulator telah dibersihkan
          secara total.
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

      {/* Emulator Frame */}
      <div className="flex flex-col items-center justify-center gap-8 py-4 lg:flex-row">
        {/* Smartphone Shell */}
        <div className="relative flex h-[660px] w-[340px] flex-col overflow-hidden rounded-[48px] border-4 border-slate-700 bg-slate-900 p-4 shadow-2xl">
          {/* Top Notch / Speaker */}
          <div className="z-20 mx-auto mb-2 flex h-5 w-32 items-center justify-center gap-2 rounded-b-2xl bg-slate-800">
            <div className="h-1 w-10 rounded-full bg-slate-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
          </div>

          {/* Status Bar */}
          <div className="z-20 flex items-center justify-between px-4 py-1 text-[11px] text-white/80">
            <span className="font-mono font-semibold">12:30</span>
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3" />
              <Battery className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Virtual Screen Content */}
          <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-[32px] bg-gradient-to-b from-slate-100 to-slate-200 p-4">
            {/* Top Indicator */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-2.5 text-center">
              <span className="flex items-center justify-center gap-1 text-[10px] font-bold tracking-wider text-rose-600 uppercase">
                <Shield className="h-3 w-3" /> Redroid Virtual Isolation
              </span>
            </div>

            {/* Permission Prompt Simulation */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex items-center gap-2 text-rose-600">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span className="text-xs font-bold">Peringatan Izin Berbahaya!</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Aplikasi <strong>"Surat_Undangan_Nikah.apk"</strong> meminta izin untuk:
              </p>
              <div className="space-y-1 rounded-xl bg-rose-50/70 p-2 font-mono text-[10px] text-rose-700">
                <div>• android.permission.RECEIVE_SMS</div>
                <div>• android.permission.READ_SMS</div>
              </div>

              {permissionBlocked ? (
                <div className="rounded-xl bg-emerald-50 p-2 text-center text-xs font-semibold text-emerald-700">
                  ✓ Akses Izin Ditolak Oleh Guardian Shield
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPermissionBlocked(true)}
                    className="cursor-pointer rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700"
                  >
                    Tolak Izin
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermissionBlocked(true)}
                    className="cursor-pointer rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    Blokir Aplikasi
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Virtual Nav Bar */}
            <div className="flex items-center justify-around py-1">
              <div className="h-3 w-3 rotate-45 rounded-xs border-2 border-slate-400" />
              <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-400" />
              <div className="h-3 w-3 rounded-xs border-2 border-slate-400" />
            </div>
          </div>
        </div>

        {/* Telemetry & Controls Panel */}
        <div className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">
                Android Sandbox
              </span>
              <h3 className="text-lg font-bold text-slate-900">Uji Interaktif APK Trojan</h3>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-slate-600">
            Lingkungan virtual ini memungkinkan analis mengeksekusi file APK mencurigakan secara
            dinamis untuk mengamati perilaku panggilan sistem, percobaan penyadapan SMS, dan lalu
            lintas bot C2.
          </p>

          <div className="space-y-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
            <div className="flex items-center gap-1.5 font-semibold text-amber-900">
              <AlertTriangle className="h-4 w-4 text-amber-600" /> Deteksi Perilaku Malware:
            </div>
            <p>
              Saat diluncurkan, malware mencoba mendaftarkan <code>BroadcastReceiver</code> untuk
              menyadap kode OTP dari SMS perbankan yang masuk ke HP korban.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push(PUBLIC_ROUTES.homeWithTab("apk"))}
              className="w-full cursor-pointer rounded-full bg-rose-600 py-2.5 text-center text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-colors hover:bg-rose-700"
            >
              Buka Analisis Statis APK X-Ray &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
