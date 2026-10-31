"use client";

import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { defangUrl } from "@/lib/security/defang";
import { ShareCardActions } from "./share-card-actions";
import { ShareCardCanvas } from "./share-card-canvas";

export function ActPageView() {
  const searchParams = useSearchParams();
  const cardRef = useRef<HTMLDivElement | null>(null);

  const rawTarget = searchParams.get("target") || "https://klikbca-verifikasi-otp.top/login.php";
  const defangedTarget = defangUrl(rawTarget);

  const threatBullets = [
    "Situs palsu meniru tampilan m-banking Bank BCA",
    "Mencuri nomor kartu ATM, PIN, dan kode OTP SMS",
    "Jangan pernah mengisi data pribadi pada link ini",
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-4">
      <ShareCardCanvas
        cardRef={cardRef}
        target={rawTarget}
        defangedUrl={defangedTarget}
        threatBullets={threatBullets}
        riskLevel="CRITICAL PHISHING"
        scamCategory="Pencurian Kredensial m-Banking BCA via WhatsApp"
      />

      <ShareCardActions
        cardRef={cardRef}
        defangedUrl={defangedTarget}
        threatBullets={threatBullets}
        scamCategory="Pencurian Kredensial m-Banking BCA via WhatsApp"
      />
    </div>
  );
}
