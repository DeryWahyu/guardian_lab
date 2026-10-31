"use client";

import { FileCode2, Globe, Info, Loader2, QrCode, Search, ShieldCheck, Upload } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { UserSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import type { ThreatAnalysisResult } from "@/types/analysis";
import { AuthGateModal } from "./auth-gate-modal";

export interface AnalysisGatewayProps {
  currentUser?: UserSession | null;
  defaultTab?: "url" | "qr" | "apk";
  onAnalysisStart?: () => void;
  onAnalysisSuccess?: (result: ThreatAnalysisResult) => void;
  onAnalysisError?: (error: string) => void;
  className?: string;
}

function AnalysisGatewayInner({
  currentUser,
  defaultTab = "url",
  onAnalysisStart,
  onAnalysisSuccess,
  onAnalysisError,
  className,
}: AnalysisGatewayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const initialTab: "url" | "qr" | "apk" =
    tabParam === "qr" || tabParam === "apk" ? tabParam : defaultTab;

  const [activeTab, setActiveTab] = useState<"url" | "qr" | "apk">(initialTab);
  const [urlInput, setUrlInput] = useState("");
  const [piiMasking, setPiiMasking] = useState(true);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<string>("");
  const [isLoading, startTransition] = useTransition();

  // Keep active tab in sync with URL ?tab
  useEffect(() => {
    if (tabParam === "url" || tabParam === "qr" || tabParam === "apk") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Restore pending analysis from sessionStorage or query param ?target= if present
  useEffect(() => {
    const targetParam = searchParams.get("target");
    if (targetParam && !urlInput) {
      setUrlInput(targetParam);
    } else {
      const stored = sessionStorage.getItem("guardian_pending_analysis");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.tab) setActiveTab(parsed.tab);
          if (parsed.url) setUrlInput(parsed.url);
          sessionStorage.removeItem("guardian_pending_analysis");
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [searchParams, urlInput]);

  const handleTabChange = useCallback(
    (tab: "url" | "qr" | "apk") => {
      setActiveTab(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const interceptGuest = (target: string) => {
    sessionStorage.setItem(
      "guardian_pending_analysis",
      JSON.stringify({ tab: activeTab, url: target, piiMasking }),
    );
    setPendingTarget(target);
    setAuthGateOpen(true);
  };

  const handleAnalyzeUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      toast.error("Silakan masukkan tautan yang ingin diperiksa.");
      return;
    }

    if (!currentUser) {
      interceptGuest(trimmed);
      return;
    }

    onAnalysisStart?.();
    startTransition(async () => {
      try {
        const res = await fetch("/api/analyze-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: trimmed }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error || "Gagal memproses analisis tautan.";
          toast.error(errMsg);
          onAnalysisError?.(errMsg);
          return;
        }

        const data: ThreatAnalysisResult = await res.json();
        toast.success("Analisis selesai diproses!");
        onAnalysisSuccess?.(data);
      } catch {
        const errMsg = "Terjadi gangguan jaringan saat menganalisis tautan.";
        toast.error(errMsg);
        onAnalysisError?.(errMsg);
      }
    });
  };

  const handleQrUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar (PNG, JPG, WebP) yang didukung untuk QR code.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file gambar QR maksimal 5MB.");
      return;
    }

    setQrFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setQrPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScanQr = () => {
    if (!qrFile || !qrPreview) {
      toast.error("Silakan pilih file gambar QR terlebih dahulu.");
      return;
    }

    if (!currentUser) {
      interceptGuest(`[File QR] ${qrFile.name}`);
      return;
    }

    onAnalysisStart?.();
    startTransition(async () => {
      try {
        const res = await fetch("/api/analyze-qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: qrPreview,
            mimeType: qrFile.type,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errMsg = errData.error || "Gagal membaca kode QR. Pastikan gambar jelas.";
          toast.error(errMsg);
          onAnalysisError?.(errMsg);
          return;
        }

        const data = await res.json();
        const extracted = data.extracted_text;

        if (data.is_url) {
          toast.success("Kode QR berhasil diekstrak! Menganalisis tautan...");
          setUrlInput(extracted);
          // Automatically pipe to URL analysis
          const analyzeRes = await fetch("/api/analyze-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: extracted }),
          });
          if (analyzeRes.ok) {
            const threatResult: ThreatAnalysisResult = await analyzeRes.json();
            onAnalysisSuccess?.(threatResult);
          } else {
            toast.info(`URL berhasil diekstrak: ${extracted}`);
          }
        } else {
          toast.info(`Isi teks QR: ${extracted}`);
        }
      } catch {
        const errMsg = "Terjadi gangguan jaringan saat memproses QR.";
        toast.error(errMsg);
        onAnalysisError?.(errMsg);
      }
    });
  };

  const handleApkUpload = (file: File) => {
    if (!file.name.endsWith(".apk") && file.type !== "application/vnd.android.package-archive") {
      toast.error("Hanya file berekstensi .apk yang didukung.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Ukuran file APK melebihi batas 50MB.");
      return;
    }
    setApkFile(file);
  };

  const handleAnalyzeApk = () => {
    if (!apkFile) {
      toast.error("Silakan pilih file APK terlebih dahulu.");
      return;
    }

    if (!currentUser) {
      interceptGuest(apkFile.name);
      return;
    }

    toast.info("Mengalihkan ke modul APK X-Ray...");
    router.push(`/?tab=apk&file=${encodeURIComponent(apkFile.name)}`);
  };

  return (
    <>
      <div
        className={cn(
          "mx-auto w-full max-w-3xl rounded-3xl border border-stone-200/90 bg-white/95 p-5 shadow-xl shadow-stone-200/50 backdrop-blur-md transition-all sm:p-7",
          className,
        )}
      >
        {/* 3 Tabs Header */}
        <div
          role="tablist"
          aria-label="Instrumen Analisis Ancaman"
          className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl border border-stone-200/60 bg-stone-100/80 p-1.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "url"}
            onClick={() => handleTabChange("url")}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm",
              activeTab === "url"
                ? "bg-white font-bold text-rose-600 shadow-xs"
                : "text-stone-600 hover:text-slate-900",
            )}
          >
            <Globe className="size-4 shrink-0 text-rose-500" />
            <span>Cek URL</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "qr"}
            onClick={() => handleTabChange("qr")}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm",
              activeTab === "qr"
                ? "bg-white font-bold text-rose-600 shadow-xs"
                : "text-stone-600 hover:text-slate-900",
            )}
          >
            <QrCode className="size-4 shrink-0 text-amber-500" />
            <span>Scan QR</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "apk"}
            onClick={() => handleTabChange("apk")}
            className={cn(
              "flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm",
              activeTab === "apk"
                ? "bg-white font-bold text-rose-600 shadow-xs"
                : "text-stone-600 hover:text-slate-900",
            )}
          >
            <FileCode2 className="size-4 shrink-0 text-purple-500" />
            <span>Bongkar APK</span>
          </button>
        </div>

        {/* Tab 1: URL Input Form */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="url-target-input"
                className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase"
              >
                Tautan Mencurigakan <span className="font-semibold text-rose-600">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  id="url-target-input"
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAnalyzeUrl();
                  }}
                  placeholder="https://contoh-link-mencurigakan.xyz/klaim-dana-kaget"
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-3.5 pr-11 pl-4 text-sm text-slate-800 placeholder-stone-400 transition-all focus:border-rose-500 focus:ring-2 focus:ring-rose-500/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAnalyzeUrl}
                  disabled={isLoading}
                  className="absolute right-2.5 cursor-pointer rounded-xl bg-rose-600 p-2 text-white transition-all hover:bg-rose-700 disabled:opacity-50"
                  title="Periksa Tautan"
                  aria-label="Periksa Tautan"
                >
                  {isLoading ? (
                    <Loader2 className="size-4.5 animate-spin" />
                  ) : (
                    <Search className="size-4.5" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-500">
              Mendeteksi leksikal typosquatting bank/e-wallet Indonesia, Shannon entropy, serta
              kategori penipuan secara aman.
            </p>
          </div>
        )}

        {/* Tab 2: QR Upload Helper Form */}
        {activeTab === "qr" && (
          <div className="space-y-4">
            <div className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
              Upload Gambar Kode QR <span className="font-semibold text-rose-600">*</span>
            </div>

            {!qrPreview ? (
              <label
                htmlFor="qr-file-input"
                className="block flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 p-6 text-center transition-all hover:border-rose-400 hover:bg-rose-50/20"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Upload className="size-5" />
                </div>
                <div className="text-xs font-semibold text-slate-800 sm:text-sm">
                  Klik untuk pilih atau drag gambar QR di sini
                </div>
                <div className="text-[11px] text-stone-400">
                  Mendukung screenshot struk parkir, stiker QRIS, tiket denda (PNG, JPG, WebP &bull;
                  maks 5MB)
                </div>
                <input
                  id="qr-file-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleQrUpload(e.target.files[0]);
                  }}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
                <div className="flex items-center gap-3">
                  <Image
                    src={qrPreview}
                    alt="Preview QR"
                    width={48}
                    height={48}
                    unoptimized
                    className="size-12 rounded-xl border border-stone-200 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="max-w-[200px] truncate text-xs font-bold text-slate-800">
                      {qrFile?.name || "qr-image.png"}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {qrFile ? `${(qrFile.size / 1024).toFixed(1)} KB` : ""}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQrFile(null);
                    setQrPreview(null);
                  }}
                  className="cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                >
                  Ganti Gambar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: APK Drag-and-Drop Zone */}
        {activeTab === "apk" && (
          <div className="space-y-4">
            <div className="mb-1.5 block text-xs font-bold tracking-wider text-slate-700 uppercase">
              File Paket Aplikasi Android (.apk){" "}
              <span className="font-semibold text-rose-600">*</span>
            </div>

            {!apkFile ? (
              <label
                htmlFor="apk-file-input"
                className="block flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-stone-300 p-6 text-center transition-all hover:border-purple-400 hover:bg-purple-50/20"
              >
                <div className="flex size-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <FileCode2 className="size-5" />
                </div>
                <div className="text-xs font-semibold text-slate-800 sm:text-sm">
                  Taruh berkas installer APK kurir / undangan di sini
                </div>
                <div className="text-[11px] text-stone-400">
                  File berekstensi .apk &bull; maksimal 50MB &bull; Dekompilasi static aman
                </div>
                <input
                  id="apk-file-input"
                  type="file"
                  accept=".apk,application/vnd.android.package-archive"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleApkUpload(e.target.files[0]);
                  }}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                    <FileCode2 className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="max-w-[200px] truncate text-xs font-bold text-slate-800">
                      {apkFile.name}
                    </span>
                    <span className="text-[10px] text-stone-500">
                      {(apkFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Siap dibedah
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setApkFile(null)}
                  className="cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700"
                >
                  Ganti File
                </button>
              </div>
            )}
          </div>
        )}

        {/* PII Masking Toggle & Action Row */}
        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-stone-100 pt-5 sm:flex-row sm:items-center">
          {/* PII Masking Switch */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={piiMasking}
              onClick={() => setPiiMasking(!piiMasking)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-rose-500 focus:outline-none",
                piiMasking ? "bg-rose-600" : "bg-stone-300",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                  piiMasking ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800">Client-side PII Masking</span>
                <span
                  className="cursor-pointer text-stone-400 hover:text-stone-600"
                  title="Nomor HP (08xx), NIK 16 digit, email korban, dan token bot disamarkan sebelum data diproses."
                >
                  <Info className="size-3" />
                </span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <ShieldCheck className="size-3" />
                <span>{piiMasking ? "Aktif: Otomatis Disensor" : "Non-aktif (Hati-hati)"}</span>
              </span>
            </div>
          </div>

          {/* Action Trigger Button */}
          {activeTab === "url" && (
            <button
              type="button"
              onClick={handleAnalyzeUrl}
              disabled={isLoading || !urlInput.trim()}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-rose-200 transition-all hover:bg-rose-700 disabled:opacity-50 sm:w-auto sm:text-sm"
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              <span>Periksa URL</span>
            </button>
          )}

          {activeTab === "qr" && (
            <button
              type="button"
              onClick={handleScanQr}
              disabled={isLoading || !qrFile}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-amber-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-amber-200 transition-all hover:bg-amber-700 disabled:opacity-50 sm:w-auto sm:text-sm"
            >
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              <span>Scan & Ekstrak URL</span>
            </button>
          )}

          {activeTab === "apk" && (
            <button
              type="button"
              onClick={handleAnalyzeApk}
              disabled={!apkFile}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-200 transition-all hover:bg-purple-700 disabled:opacity-50 sm:w-auto sm:text-sm"
            >
              <span>Bongkar APK di X-Ray</span>
            </button>
          )}
        </div>
      </div>

      {/* Auth-Gated Interception Modal */}
      <AuthGateModal
        isOpen={authGateOpen}
        onClose={() => setAuthGateOpen(false)}
        pendingType={activeTab}
        pendingTarget={pendingTarget}
      />
    </>
  );
}

export function AnalysisGateway(props: AnalysisGatewayProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto h-72 w-full max-w-3xl animate-pulse rounded-3xl border border-stone-200 bg-stone-100/80" />
      }
    >
      <AnalysisGatewayInner {...props} />
    </Suspense>
  );
}
