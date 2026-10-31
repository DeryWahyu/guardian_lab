"use client";

import { toPng } from "html-to-image";
import { Check, Copy, Download, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { PROTECTED_ROUTES } from "@/lib/routes";

interface ShareCardActionsProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  defangedUrl: string;
  threatBullets: string[];
  scamCategory: string;
}

export function ShareCardActions({
  cardRef,
  defangedUrl,
  threatBullets,
  scamCategory,
}: ShareCardActionsProps) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `guardian-warning-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export card image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyWhatsAppText = async () => {
    const text = `🚨 *PERINGATAN SIBER: AWAS MODUS PENIPUAN!* 🚨\n\nKeluarga/teman tercinta, hati-hati jika menerima tautan berikut:\n❌ *Tautan:* ${defangedUrl}\n\n🔍 *Modus:* ${scamCategory}\n\n⚠️ *Bahaya Utama:*\n${threatBullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}\n\n🛡️ *Tindakan Aman:*\n• JANGAN buka tautan atau isi data pribadi.\n• JANGAN pernah berikan kode OTP/PIN SMS ke siapapun.\n\n_Diverifikasi oleh Guardian Lab Security Sandbox (MIT-Week 2026)_`;

    await navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full max-w-lg space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-3 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:bg-rose-700 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? "Menyimpan Gambar..." : "Unduh Gambar PNG (1-Klik)"}
        </button>

        <button
          type="button"
          onClick={handleCopyWhatsAppText}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700"
        >
          {copiedText ? (
            <>
              <Check className="h-4 w-4" /> Tersalin!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Salin Pesan WhatsApp
            </>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => router.push(PROTECTED_ROUTES.community)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50"
      >
        <Users className="h-4 w-4 text-rose-500" />
        Sumbangkan Kasus Ini ke Community Forensic Replay &rarr;
      </button>
    </div>
  );
}
