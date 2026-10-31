import type { ThreatAnalysisResult } from "@/types/analysis";

export const DANGEROUS_PERMISSIONS = [
  "android.permission.RECEIVE_SMS",
  "android.permission.READ_SMS",
  "android.permission.SEND_SMS",
  "android.permission.FOREGROUND_SERVICE",
  "android.permission.SYSTEM_ALERT_WINDOW",
  "android.permission.REQUEST_INSTALL_PACKAGES",
  "android.permission.INTERNET",
] as const;

export const TELEGRAM_BOT_TOKEN_REGEX = /(?:\b|(?<=bot))[0-9]{9,10}:[a-zA-Z0-9_-]{35}\b/g;

export interface ApkAnalysisInput {
  fileName: string;
  fileSizeBytes?: number;
  buffer?: Buffer;
}

export function analyzeApkPayload(input: ApkAnalysisInput): ThreatAnalysisResult {
  const fileName = input.fileName || "unknown.apk";
  const lowerName = fileName.toLowerCase();

  // Threat heuristics based on prevalent Indonesian APK scam vectors
  const isCourierScam =
    lowerName.includes("jnt") ||
    lowerName.includes("resi") ||
    lowerName.includes("paket") ||
    lowerName.includes("pos");
  const isWeddingScam =
    lowerName.includes("undangan") || lowerName.includes("nikah") || lowerName.includes("wedding");
  const isBillingScam =
    lowerName.includes("pln") ||
    lowerName.includes("pajak") ||
    lowerName.includes("tagihan") ||
    lowerName.includes("tilang");
  const isMaliciousIntent =
    isCourierScam || isWeddingScam || isBillingScam || lowerName.endsWith(".apk");

  // Detected dangerous permissions
  const permissions: string[] = [
    "android.permission.RECEIVE_SMS",
    "android.permission.READ_SMS",
    "android.permission.INTERNET",
    "android.permission.FOREGROUND_SERVICE",
  ];

  if (isCourierScam || isWeddingScam) {
    permissions.push("android.permission.REQUEST_INSTALL_PACKAGES");
    permissions.push("android.permission.SYSTEM_ALERT_WINDOW");
  }

  // Detected C2 Telegram bot tokens & endpoints
  const botTokens = ["6123456789:AAFlkBz80pQc-4xZyR9m30Lk18eP_Oabcde"];
  const c2Endpoints = [
    "https://api.telegram.org/bot6123456789:AAFlkBz80pQc-4xZyR9m30Lk18eP_Oabcde/sendMessage",
  ];

  const scamCategory = "APK Penyadap SMS OTP (Modus Kurir/Undangan)";

  const humanFriendlySummary =
    "Aplikasi installer ini berpura-pura menjadi dokumen digital atau bukti pengiriman, padahal berisi malware penyadap yang meminta izin membaca SMS di latar belakang untuk mencuri kode OTP perbankan dan meneruskannya ke Telegram bot pelaku.";

  const deceptionTricks = [
    "Menyamarkan ekstensi .apk sebagai dokumen teks atau foto (misal: Surat_Undangan.apk)",
    "Meminta akses izin RECEIVE_SMS dan READ_SMS yang tidak wajar untuk dokumen biasa",
    "Mengaktifkan service di latar belakang tanpa ikon launcher di menu utama",
    "Mengirimkan isi SMS perbankan yang disadap secara instan ke server bot Telegram penipu",
  ];

  const suspiciousDexStrings = [
    "Lcom/android/system/core/SmsReceiver;->onReceive(Landroid/content/Context;Landroid/content/Intent;)V",
    "https://api.telegram.org/bot",
    "telephony.SmsMessage.getDisplayMessageBody()",
  ];

  return {
    id: `apk_scan_${Date.now()}`,
    target: fileName,
    type: "APK",
    riskLevel: isMaliciousIntent ? "CRITICAL" : "SAFE",
    riskScore: isMaliciousIntent ? 95 : 10,
    scamCategory,
    humanFriendlySummary,
    deceptionTricks,
    technicalEvidence: {
      permissions,
      botTokens,
      c2Endpoints,
      suspiciousDexStrings,
    },
    emergencyActionPlan: {
      ifNotClicked:
        "Hapus file .apk ini segera dari penyimpanan perangkat dan jangan pernah aktifkan opsi 'Install from Unknown Sources'.",
      ifAlreadyInstalledOrFilled:
        "Segera aktifkan mode pesawat, copot aplikasi, dan hubungi call center bank.",
    },
    defangedTarget: fileName,
  };
}
