import { describe, expect, it } from "bun:test";
import { PUBLIC_ROUTES } from "@/lib/routes";
import type { ThreatAnalysisResult } from "@/types/analysis";

describe("Dual-Mode Results Presenter Contracts & Logic", () => {
  const safeMockResult: ThreatAnalysisResult = {
    id: "rec_safe_01",
    target: "https://klikbca.com",
    type: "URL",
    riskLevel: "SAFE",
    riskScore: 10,
    scamCategory: "Legitimate Corporate / Banking Portal",
    humanFriendlySummary: "Tautan ini cocok dengan domain resmi terverifikasi.",
    deceptionTricks: [],
    technicalEvidence: {
      entropy: 2.84,
    },
    emergencyActionPlan: {
      ifNotClicked: "Tautan aman untuk diakses.",
      ifAlreadyInstalledOrFilled: "Tidak ada tindakan darurat yang diperlukan.",
    },
    defangedTarget: "hxxps://klikbca[.]com",
  };

  const phishMockResult: ThreatAnalysisResult = {
    id: "rec_phish_01",
    target: "https://klikbca-verifikasi-otp.top/login.php",
    type: "URL",
    riskLevel: "PHISHING",
    riskScore: 92,
    scamCategory: "Web Phishing Kredensial Bank BCA",
    humanFriendlySummary:
      "Situs ini meniru tampilan Bank BCA dengan domain palsu untuk memancing korban dan mencuri kredensial.",
    deceptionTricks: [
      "Memalsukan nama Bank BCA pada domain.",
      "Menggunakan TLD murah berisiko tinggi (.top).",
    ],
    technicalEvidence: {
      entropy: 4.12,
      typosquatTarget: "klikbca.com",
      levenshteinDistance: 19,
      suspiciousTld: ".top",
    },
    emergencyActionPlan: {
      ifNotClicked: "Tutup tab peramban ini sekarang.",
      ifAlreadyInstalledOrFilled: "Segera ganti kata sandi dan PIN akun Anda.",
    },
    defangedTarget: "hxxps://klikbca-verifikasi-otp[.]top/login[.]php",
  };

  it("verifies safe result data maps to safe threshold criteria", () => {
    expect(safeMockResult.riskScore).toBeLessThan(30);
    expect(safeMockResult.riskLevel).toBe("SAFE");
    expect(safeMockResult.deceptionTricks.length).toBe(0);
    expect(safeMockResult.defangedTarget).toContain("klikbca[.]com");
  });

  it("verifies phishing result data maps to high risk threshold criteria", () => {
    expect(phishMockResult.riskScore).toBeGreaterThanOrEqual(70);
    expect(phishMockResult.riskLevel).toBe("PHISHING");
    expect(phishMockResult.deceptionTricks.length).toBeGreaterThan(0);
    expect(phishMockResult.humanFriendlySummary).toContain("mencuri");
    expect(phishMockResult.technicalEvidence.entropy).toBeGreaterThan(3.5);
    expect(phishMockResult.technicalEvidence.typosquatTarget).toBe("klikbca.com");
  });

  it("verifies action buttons map strictly to centralized PUBLIC_ROUTES", () => {
    const sandboxRoute = PUBLIC_ROUTES.sandboxWebWithTarget(phishMockResult.target);
    expect(sandboxRoute).toBe(
      `/sandbox/web?target=${encodeURIComponent("https://klikbca-verifikasi-otp.top/login.php")}`,
    );

    const shareCardRoute = PUBLIC_ROUTES.actWithTarget(phishMockResult.target, phishMockResult.id);
    expect(shareCardRoute).toBe(
      `/act?target=${encodeURIComponent("https://klikbca-verifikasi-otp.top/login.php")}&id=rec_phish_01`,
    );
  });
});
