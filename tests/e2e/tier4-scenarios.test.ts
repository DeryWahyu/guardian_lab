/**
 * Tier 4: Real-World Scenarios
 * Concrete end-to-end simulation of prevalent Indonesian cybercrime campaigns (2025–2026):
 * - Scenario 1: Modus Kurir Ekspedisi Paket & Undangan Pernikahan (Fake APK SMS stealer)
 * - Scenario 2: Typosquatting Perbankan Nasional (Bank BCA Phishing Campaign)
 * - Scenario 3: Modus Quishing (QRIS Palsu & Parking Ticket QR Code Phishing)
 * - Scenario 4: Investigasi Komunitas Rekening Penampung & Pinjol Ilegal (OJK/IASC Replay)
 */

import { describe, expect, it } from "bun:test";
import { INDONESIAN_APK_MALWARE_FIXTURES } from "./fixtures/malware-samples";
import { INDONESIAN_PHISHING_FIXTURES } from "./fixtures/phishing-urls";
import { QR_CODE_FIXTURES } from "./fixtures/qr-codes";
import {
  executeRoute,
  referenceCalculateEntropy,
  referenceCalculateRank,
  referenceDefangUrl,
  referenceLevenshteinDistance,
  referenceScrubPii,
  ThreatAnalysisResultSchema,
} from "./helpers/test-harness";

describe("Tier 4: Real-World Scenarios (Indonesian Cybercrime Defense)", () => {
  // --------------------------------------------------------------------------
  // Scenario 1: Modus Kurir J&T / Undangan Nikah (Fake APK SMS Stealer)
  // --------------------------------------------------------------------------
  describe("Scenario 1: Modus Kurir Ekspedisi Paket & Undangan Nikah APK", () => {
    it("dissects SMS-stealing APK, unmasks Telegram bot C2, and issues emergency action plan", async () => {
      const malwareSample = INDONESIAN_APK_MALWARE_FIXTURES[0]; // J&T fake tracking

      // 1. Submit APK to Static X-Ray engine
      const res = await executeRoute<Record<string, unknown>>("/api/analyze-apk", "POST", {
        fileName: malwareSample.fileName,
        fileSizeBytes: 2048576,
      });

      expect(res.status).toBe(200);
      const parsed = ThreatAnalysisResultSchema.parse(res.body);

      // 2. Verify threat scoring and category
      expect(parsed.riskLevel).toBe("CRITICAL");
      expect(parsed.riskScore).toBeGreaterThanOrEqual(90);
      expect(parsed.scamCategory).toContain("APK Penyadap SMS OTP");

      // 3. Verify dangerous permissions extraction
      expect(parsed.technicalEvidence.permissions).toContain("android.permission.RECEIVE_SMS");
      expect(parsed.technicalEvidence.permissions).toContain("android.permission.READ_SMS");

      // 4. Verify Telegram bot token extraction & scrubbing
      expect(parsed.technicalEvidence.botTokens?.length).toBeGreaterThan(0);
      const rawBotEndpoint = `https://api.telegram.org/bot${malwareSample.telegramBotTokens[0]}/sendMessage`;
      const scrubbedEndpoint = referenceScrubPii(rawBotEndpoint);
      expect(scrubbedEndpoint.sanitizedText).toContain("[EXTRACTED_BOT_TOKEN_REDACTED]");
      expect(scrubbedEndpoint.sanitizedText).not.toContain(malwareSample.telegramBotTokens[0]);

      // 5. Verify Emergency Action Plan (Indonesian context)
      expect(parsed.emergencyActionPlan.ifAlreadyInstalledOrFilled).toContain("mode pesawat");
      expect(parsed.emergencyActionPlan.ifAlreadyInstalledOrFilled).toContain("bank");
    });
  });

  // --------------------------------------------------------------------------
  // Scenario 2: Typosquatting Perbankan Nasional (Bank BCA Phishing)
  // --------------------------------------------------------------------------
  describe("Scenario 2: Typosquatting Perbankan Nasional (Bank BCA Phishing Attack)", () => {
    it("unmasks fake BCA phishing domain, computes entropy, and produces Dual-Mode breakdown", async () => {
      const bcaPhish = INDONESIAN_PHISHING_FIXTURES[0]; // https://klikbca-verifikasi-otp.top/login.php

      // 1. Submit to /api/analyze-url
      const res = await executeRoute<Record<string, unknown>>("/api/analyze-url", "POST", {
        url: bcaPhish.url,
      });

      expect(res.status).toBe(200);
      const result = ThreatAnalysisResultSchema.parse(res.body);

      // 2. Verify risk scoring and brand identification
      expect(result.riskLevel).toBe("PHISHING");
      expect(result.riskScore).toBeGreaterThanOrEqual(85);
      expect(result.defangedTarget).toContain("klikbca-verifikasi-otp[.]top");

      // 3. Verify Shannon entropy and Typosquatting target
      const entropy = referenceCalculateEntropy(bcaPhish.url);
      expect(entropy).toBeGreaterThan(3.5);
      const editDistance = referenceLevenshteinDistance(
        "klikbca.com",
        "klikbca-verifikasi-otp.top",
      );
      expect(editDistance).toBeGreaterThan(5);

      // 4. Verify Dual-Mode output:
      // Mode Manusia (Kedok Penipu Terbongkar)
      expect(result.humanFriendlySummary).toContain("mencuri");
      expect(result.deceptionTricks.length).toBeGreaterThanOrEqual(1);

      // Mode Teknis (Geek View)
      expect(result.technicalEvidence.entropy).toBeDefined();

      // 5. Verify PII scrubbing on victim data entered into phishing form
      const victimFormData =
        "Korban NIK 3171012345670001 dengan nomor HP 081234567890 memasukkan data ke bca phish.";
      const scrubbed = referenceScrubPii(victimFormData);
      expect(scrubbed.sanitizedText).not.toContain("3171012345670001");
      expect(scrubbed.sanitizedText).not.toContain("081234567890");
      expect(scrubbed.redactedCounts.nik).toBe(1);
      expect(scrubbed.redactedCounts.phone).toBe(1);
    });
  });

  // --------------------------------------------------------------------------
  // Scenario 3: Modus Quishing QRIS Palsu / Parking Fine Ticket
  // --------------------------------------------------------------------------
  describe("Scenario 3: Modus Quishing (QRIS Palsu & Tiket Denda QR)", () => {
    it("decodes fake QRIS image, flags deceptive donation, and generates Share Card", async () => {
      const quishingSample = QR_CODE_FIXTURES[2]; // Fake QRIS donation

      // 1. Decode QR code via /api/analyze-qr
      const qrRes = await executeRoute<{ extracted_text: string; is_url: boolean }>(
        "/api/analyze-qr",
        "POST",
        {
          imageBase64: quishingSample.simulatedBase64Image,
          mimeType: quishingSample.mimeType,
        },
      );
      expect(qrRes.status).toBe(200);
      expect(qrRes.body.is_url).toBe(true);
      const decodedUrl = qrRes.body.extracted_text;

      // 2. Analyze decoded URL
      const analyzeRes = await executeRoute<Record<string, unknown>>("/api/analyze-url", "POST", {
        url: decodedUrl,
      });
      expect(analyzeRes.status).toBe(200);
      const threatResult = ThreatAnalysisResultSchema.parse(analyzeRes.body);
      expect(threatResult.riskLevel).toBe("PHISHING");

      // 3. Generate Guardian Share Card payload
      const defangedUrl = referenceDefangUrl(decodedUrl);
      expect(defangedUrl).toContain("qris-dana-kaget-pemberdayaan[.]xyz");

      const shareCard = {
        title: "AWAS MODUS PENIPUAN QRIS PALSU!",
        watermark: "Guardian Lab 2026 - Digital Defense",
        defangedUrl,
        dangerSummary: threatResult.humanFriendlySummary,
        advice: "Periksa selalu nama merchant resmi pada aplikasi pembayaran sebelum bayar.",
      };

      expect(shareCard.defangedUrl).not.toContain("https://");
      expect(shareCard.title).toContain("QRIS PALSU");
    });
  });

  // --------------------------------------------------------------------------
  // Scenario 4: Rekening Penampung & Pinjol Ilegal (OJK/IASC Replay)
  // --------------------------------------------------------------------------
  describe("Scenario 4: Investigasi Komunitas Rekening Penampung (OJK/IASC Replay)", () => {
    it("simulates community investigation with PII protection and forensic EXP reward", () => {
      // 1. Case evidence representing multi-layer account fraud (Data IASC OJK 2026)
      const rawCaseReport = `
        Kasus Penipuan Rekening Berlapis:
        Korban NIK 3201019988770002 mentransfer dana ke rekening penampung 1122334455667788
        setelah menerima pesan WhatsApp dari nomor 081399887766 mengatasnamakan undian berhadiah.
      `;

      // 2. Automatic PII Scrubbing
      const scrubbed = referenceScrubPii(rawCaseReport);
      expect(scrubbed.sanitizedText).not.toContain("3201019988770002");
      expect(scrubbed.sanitizedText).not.toContain("1122334455667788");
      expect(scrubbed.sanitizedText).not.toContain("081399887766");
      expect(scrubbed.redactedCounts.nik).toBe(2); // NIK + 16-digit rekening
      expect(scrubbed.redactedCounts.phone).toBe(1);

      // 3. Community Player investigates puzzle and completes forensic replay
      const initialPlayerExp = 250;
      const communityReplayExpReward = 100;
      const newExp = initialPlayerExp + communityReplayExpReward; // 350 EXP

      // 4. Verify rank progression from Junior Analyst to Cyber Sentinel
      const priorRank = referenceCalculateRank(initialPlayerExp);
      expect(priorRank.rank).toBe("Junior Analyst");

      const newRank = referenceCalculateRank(newExp);
      expect(newRank.rank).toBe("Cyber Sentinel");
      expect(newRank.nextRankExp).toBe(600);
    });
  });
});
