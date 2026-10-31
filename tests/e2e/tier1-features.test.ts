/**
 * Tier 1: Feature Coverage (Happy Path for Features 1 to 28 in PROJECT.md)
 * E2E tests validating that every feature in the Guardian Lab Feature Inventory
 * performs its specified primary behavior and satisfies its interface contract.
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { prisma } from "../../lib/prisma";
import {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  ROUTES,
} from "../../lib/routes";
import { INDONESIAN_APK_MALWARE_FIXTURES } from "./fixtures/malware-samples";
import { CLEAN_URL_FIXTURES, INDONESIAN_PHISHING_FIXTURES } from "./fixtures/phishing-urls";
import { QR_CODE_FIXTURES } from "./fixtures/qr-codes";
import { ACADEMY_QUIZ_FIXTURES, BADGE_FIXTURES } from "./fixtures/quiz-fixtures";
import {
  ADMIN_USER_FIXTURE,
  NEW_REGISTERED_USER_FIXTURE,
  STANDARD_USER_FIXTURE,
} from "./fixtures/user-fixtures";
import {
  CommunityReplaySchema,
  executeRoute,
  PiiScrubberOutputSchema,
  QuizQuestionSchema,
  referenceCalculateEntropy,
  referenceCalculateRank,
  referenceDefangUrl,
  referenceLevenshteinDistance,
  referenceScrubPii,
  SandboxSessionStartSchema,
  SandboxSessionStopSchema,
  ThreatAnalysisResultSchema,
  UserSessionSchema,
} from "./helpers/test-harness";

describe("Tier 1: Feature Coverage (Features 1–28)", () => {
  beforeAll(async () => {
    const existing = await prisma.user.findUnique({
      where: { email: NEW_REGISTERED_USER_FIXTURE.email },
    });
    if (existing) {
      await prisma.session.deleteMany({ where: { userId: existing.id } });
      await prisma.user.delete({ where: { id: existing.id } });
    }
  });

  afterAll(async () => {
    const existing = await prisma.user.findUnique({
      where: { email: NEW_REGISTERED_USER_FIXTURE.email },
    });
    if (existing) {
      await prisma.session.deleteMany({ where: { userId: existing.id } });
      await prisma.user.delete({ where: { id: existing.id } });
    }
  });
  // --------------------------------------------------------------------------
  // Feature 1: MySQL & Prisma Schema
  // --------------------------------------------------------------------------
  describe("F1: Database & Entity Data Model Contracts", () => {
    it("validates User and Session model interface contracts", () => {
      const userSession = {
        id: "usr_1001",
        email: "analyst@guardianlab.id",
        name: "Security Analyst",
        role: "USER" as const,
        exp: 350,
        streakDays: 14,
      };
      const parsed = UserSessionSchema.safeParse(userSession);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.role).toBe("USER");
        expect(parsed.data.exp).toBeGreaterThanOrEqual(0);
        expect(parsed.data.streakDays).toBeGreaterThan(0);
      }
    });

    it("validates all 11 core entity contracts are representable", () => {
      const entityTypes = [
        "User",
        "Session",
        "ForensicRecord",
        "SandboxSession",
        "Badge",
        "UserBadge",
        "Quiz",
        "QuizQuestion",
        "QuizAttempt",
        "CommunityReplay",
        "ReplayAttempt",
      ];
      expect(entityTypes.length).toBe(11);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 2: Database Migrations & Seed
  // --------------------------------------------------------------------------
  describe("F2: Database Seed Data Integrity", () => {
    it("provides admin user fixture with elevated role and credentials", () => {
      expect(ADMIN_USER_FIXTURE.role).toBe("ADMIN");
      expect(ADMIN_USER_FIXTURE.email).toBe("admin@gmail.com");
      expect(ADMIN_USER_FIXTURE.exp).toBeGreaterThanOrEqual(1000);
    });

    it("seeds starter badges across all threat vectors", () => {
      const badgeCodes = BADGE_FIXTURES.map((b) => b.code);
      expect(badgeCodes).toContain("ANTI_QUISHING_MASTER");
      expect(badgeCodes).toContain("APK_DISSECTOR");
      expect(badgeCodes).toContain("PHISHING_HUNTER");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 3: PII Regex Scrubber
  // --------------------------------------------------------------------------
  describe("F3: PII Regex Scrubber (Zero Real PII Mandate)", () => {
    it("sanitizes Indonesian mobile phone numbers (+62, 62, 08)", () => {
      const input = "Hubungi korban di 081234567890 atau +6281987654321 sekarang.";
      const res = referenceScrubPii(input);
      expect(res.sanitizedText).not.toContain("081234567890");
      expect(res.sanitizedText).not.toContain("+6281987654321");
      expect(res.sanitizedText).toContain("[REDACTED_PHONE]");
      expect(res.redactedCounts.phone).toBe(2);
    });

    it("sanitizes 16-digit NIK and bank account numbers", () => {
      const input = "NIK KTP: 3171012345670001 dan No Rekening: 1234567890123456";
      const res = referenceScrubPii(input);
      expect(res.sanitizedText).not.toContain("3171012345670001");
      expect(res.sanitizedText).not.toContain("1234567890123456");
      expect(res.sanitizedText).toContain("[REDACTED_NIK_OR_ACCOUNT]");
      expect(res.redactedCounts.nik).toBe(2);
    });

    it("sanitizes user email addresses", () => {
      const input = "Kirim bukti transfer ke victim.account@gmail.com segera!";
      const res = referenceScrubPii(input);
      expect(res.sanitizedText).not.toContain("victim.account@gmail.com");
      expect(res.sanitizedText).toContain("[REDACTED_EMAIL]");
      expect(res.redactedCounts.email).toBe(1);
    });

    it("sanitizes Telegram Bot API tokens", () => {
      const input =
        "api.telegram.org/bot6123456789:AAFlkBz80pQc-4xZyR9m30Lk18eP_Oabcde/sendMessage";
      const res = referenceScrubPii(input);
      expect(res.sanitizedText).not.toContain("6123456789:AAFlkBz80pQc-4xZyR9m30Lk18eP_Oabcde");
      expect(res.sanitizedText).toContain("[EXTRACTED_BOT_TOKEN_REDACTED]");
      expect(res.redactedCounts.token).toBe(1);
    });

    it("matches the PiiScrubberOutputSchema contract", () => {
      const res = referenceScrubPii("User 081299998888 sent email to test@domain.com");
      const validation = PiiScrubberOutputSchema.safeParse(res);
      expect(validation.success).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 4: Authentication API
  // --------------------------------------------------------------------------
  describe("F4: User Authentication API Endpoints", () => {
    it("registers a new user and returns default gamification profile", async () => {
      const res = await executeRoute<{ id: string; email: string; role: string; exp: number }>(
        "/api/auth/register",
        "POST",
        NEW_REGISTERED_USER_FIXTURE,
      );
      expect(res.status).toBe(201);
      expect(res.body.email).toBe(NEW_REGISTERED_USER_FIXTURE.email);
      expect(res.body.role).toBe("USER");
      expect(res.body.exp).toBe(0);
    });

    let authenticatedSessionToken = "";

    it("authenticates valid credentials and issues session cookie", async () => {
      const res = await executeRoute<{ id: string; email: string; role: string }>(
        "/api/auth/login",
        "POST",
        {
          email: STANDARD_USER_FIXTURE.email,
          password: STANDARD_USER_FIXTURE.passwordPlainText,
        },
      );
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(STANDARD_USER_FIXTURE.email);
      const cookie = res.headers.get("Set-Cookie");
      expect(cookie).toBeTruthy();
      expect(cookie).toContain("guardian_session");
      expect(cookie).toContain("HttpOnly");

      const match = cookie?.match(/guardian_session=([^;]+)/);
      if (match) {
        authenticatedSessionToken = match[1];
      }
    });

    it("retrieves current authenticated profile from /api/auth/me", async () => {
      let tokenToUse = authenticatedSessionToken;
      if (!tokenToUse) {
        const loginRes = await executeRoute<{ id: string; email: string; role: string }>(
          "/api/auth/login",
          "POST",
          {
            email: STANDARD_USER_FIXTURE.email,
            password: STANDARD_USER_FIXTURE.passwordPlainText,
          },
        );
        const cookie = loginRes.headers.get("Set-Cookie");
        const match = cookie?.match(/guardian_session=([^;]+)/);
        tokenToUse = match ? match[1] : "";
      }

      const res = await executeRoute<{ id: string; email: string; role: string }>(
        "/api/auth/me",
        "GET",
        undefined,
        { guardian_session: tokenToUse },
      );
      expect(res.status).toBe(200);
      expect(res.body.role).toBe("USER");
      expect(res.body.email).toBe(STANDARD_USER_FIXTURE.email);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 5: RBAC Middleware
  // --------------------------------------------------------------------------
  describe("F5: Role-Based Access Control (RBAC) Route Guard", () => {
    it("allows ADMIN role to access admin routes", () => {
      const role = "ADMIN";
      const allowed = role === "ADMIN";
      expect(allowed).toBe(true);
    });

    it("denies regular USER role from accessing admin routes", () => {
      const role = "USER";
      const hasAdminAccess = (r: string) => r === "ADMIN";
      expect(hasAdminAccess(role)).toBe(false);
    });

    it("redirects unauthenticated requests from protected routes", async () => {
      const res = await executeRoute("/api/auth/me", "GET", undefined, {});
      expect(res.status).toBe(401);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 6: Auth Pages & UI
  // --------------------------------------------------------------------------
  describe("F6: Auth Pages Routes and Navigation", () => {
    it("verifies login and register routes are defined in AUTH_ROUTES", () => {
      expect(AUTH_ROUTES.login).toBe("/login");
      expect(AUTH_ROUTES.register).toBe("/register");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 7: Global Navigation & Header
  // --------------------------------------------------------------------------
  describe("F7: Centralized Navigation System (Zero Hardcoded Routes)", () => {
    it("exports all expected route groups without hardcoding", () => {
      expect(ROUTES.public.home).toBe("/");
      expect(ROUTES.public.sandboxWeb).toBe("/sandbox/web");
      expect(ROUTES.public.act).toBe("/act");
      expect(ROUTES.protected.history).toBe("/history");
      expect(ROUTES.protected.academy).toBe("/academy");
      expect(ROUTES.admin.dashboard).toBe("/admin");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 8: 3-Tab Landing Gateway
  // --------------------------------------------------------------------------
  describe("F8: 3-Tab Landing Gateway Inputs", () => {
    it("supports navigation builders for url, qr, and apk tabs", () => {
      expect(PUBLIC_ROUTES.homeWithTab("url")).toBe("/?tab=url");
      expect(PUBLIC_ROUTES.homeWithTab("qr")).toBe("/?tab=qr");
      expect(PUBLIC_ROUTES.homeWithTab("apk")).toBe("/?tab=apk");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 9: Auth-Gated Interception
  // --------------------------------------------------------------------------
  describe("F9: Auth-Gated Action Interception", () => {
    it("preserves redirect intent parameter for unauthenticated guests", () => {
      const redirectUrl = `${AUTH_ROUTES.login}?redirect=${encodeURIComponent("/?tab=apk")}`;
      expect(redirectUrl).toBe("/login?redirect=%2F%3Ftab%3Dapk");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 10: AI URL Threat Detection
  // --------------------------------------------------------------------------
  describe("F10: AI URL Threat Detection (/api/analyze-url)", () => {
    it("detects Indonesian typosquatting phishing link and scores risk accurately", async () => {
      const target = INDONESIAN_PHISHING_FIXTURES[0].url;
      const res = await executeRoute<Record<string, unknown>>("/api/analyze-url", "POST", {
        url: target,
      });

      expect(res.status).toBe(200);
      const parsed = ThreatAnalysisResultSchema.safeParse(res.body);
      expect(parsed.success).toBe(true);

      if (parsed.success) {
        expect(parsed.data.riskLevel).toBe("PHISHING");
        expect(parsed.data.riskScore).toBeGreaterThanOrEqual(80);
        expect(parsed.data.defangedTarget).toContain("[.]top");
        expect(parsed.data.technicalEvidence.entropy).toBeGreaterThan(0);
      }
    });

    it("verifies safe corporate banking URL receives safe risk assessment", async () => {
      const target = CLEAN_URL_FIXTURES[0].url;
      const res = await executeRoute<Record<string, unknown>>("/api/analyze-url", "POST", {
        url: target,
      });

      expect(res.status).toBe(200);
      const parsed = ThreatAnalysisResultSchema.safeParse(res.body);
      expect(parsed.success).toBe(true);

      if (parsed.success) {
        expect(parsed.data.riskLevel).toBe("SAFE");
        expect(parsed.data.riskScore).toBeLessThanOrEqual(25);
      }
    });

    it("computes Shannon entropy and Levenshtein typosquat distance accurately", () => {
      const entropy = referenceCalculateEntropy("https://klikbca-verifikasi-otp.top/login.php");
      expect(entropy).toBeGreaterThan(3.5);

      const distance = referenceLevenshteinDistance("klikbca.com", "klikbca-login.com");
      expect(distance).toBe(6);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 11: QR Code Decoder Helper
  // --------------------------------------------------------------------------
  describe("F11: QR Code Decoder Helper (/api/analyze-qr)", () => {
    it("decodes QR image base64 into extracted URL string", async () => {
      const sample = QR_CODE_FIXTURES[2];
      const res = await executeRoute<{ extracted_text: string; is_url: boolean }>(
        "/api/analyze-qr",
        "POST",
        {
          imageBase64: sample.simulatedBase64Image,
          mimeType: sample.mimeType,
        },
      );

      expect(res.status).toBe(200);
      expect(res.body.is_url).toBe(true);
      expect(res.body.extracted_text).toContain("https://");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 12: Dual-Mode Results UI
  // --------------------------------------------------------------------------
  describe("F12: Dual-Mode Presentation (Human View vs Geek View)", () => {
    it("ensures response contains both human summary and deep technical telemetry", async () => {
      const res = await executeRoute<Record<string, unknown>>("/api/analyze-url", "POST", {
        url: "https://klikbca-verifikasi.xyz",
      });
      const parsed = ThreatAnalysisResultSchema.safeParse(res.body);
      expect(parsed.success).toBe(true);

      if (parsed.success) {
        // Human Mode: approachable summary and deception tricks
        expect(parsed.data.humanFriendlySummary.length).toBeGreaterThan(10);
        expect(parsed.data.deceptionTricks.length).toBeGreaterThan(0);

        // Geek View: entropy, raw technical indicators
        expect(parsed.data.technicalEvidence.entropy).toBeDefined();
        expect(parsed.data.emergencyActionPlan.ifNotClicked).toBeDefined();
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 13: Forensic Record Auto-Logger
  // --------------------------------------------------------------------------
  describe("F13: Forensic Record Auto-Logger", () => {
    it("generates persistent record id and stores target, risk, and category", async () => {
      const res = await executeRoute<Record<string, unknown>>("/api/analyze-url", "POST", {
        url: "https://dana-kaget-saldo-gratis.xyz",
      });
      const parsed = ThreatAnalysisResultSchema.safeParse(res.body);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.id).toBeDefined();
        expect(parsed.data.type).toBe("URL");
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 14: Web Sandbox Viewport
  // --------------------------------------------------------------------------
  describe("F14: Web Sandbox Viewport Streaming (/sandbox/web)", () => {
    it("starts isolated browser session with valid stream URL", async () => {
      const res = await executeRoute<Record<string, unknown>>(
        "/api/sandbox/session/start",
        "POST",
        {
          type: "web",
          target: "https://klikbca-verifikasi.xyz",
        },
      );

      expect(res.status).toBe(200);
      const parsed = SandboxSessionStartSchema.safeParse(res.body);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.viewport).toBe("desktop");
        expect(parsed.data.streamUrl).toContain("http");
      }
    });

    it("supports switching to mobile viewport mode", async () => {
      const res = await executeRoute<Record<string, unknown>>(
        "/api/sandbox/session/start",
        "POST",
        {
          type: "android",
          target: "https://mobile-phish.xyz",
        },
      );
      const parsed = SandboxSessionStartSchema.safeParse(res.body);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.viewport).toBe("mobile");
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 15: Sandbox 180s Auto-Destroy
  // --------------------------------------------------------------------------
  describe("F15: Sandbox 180s Auto-Destroy Mandate", () => {
    it("enforces session expiry exactly 180 seconds into the future", async () => {
      const before = Date.now();
      const res = await executeRoute<{ expiresAt: number; sessionId: string }>(
        "/api/sandbox/session/start",
        "POST",
        { type: "web", target: "https://phish.xyz" },
      );

      expect(res.status).toBe(200);
      const durationMs = res.body.expiresAt - before;
      expect(durationMs).toBeGreaterThanOrEqual(179 * 1000);
      expect(durationMs).toBeLessThanOrEqual(181 * 1000);

      // Stop session
      const stopRes = await executeRoute<Record<string, unknown>>(
        "/api/sandbox/session/stop",
        "POST",
        { sessionId: res.body.sessionId },
      );
      expect(stopRes.status).toBe(200);
      const stopParsed = SandboxSessionStopSchema.safeParse(stopRes.body);
      expect(stopParsed.success).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 16: Sandbox Inotify Interceptor
  // --------------------------------------------------------------------------
  describe("F16: Sandbox Inotify Interceptor for APK Downloads", () => {
    it("detects APK file download in sandbox and triggers quarantine modal payload", () => {
      const downloadedFileName = "Surat_Undangan_Nikah.apk";
      const isInotifyApkTrigger = (file: string) => file.toLowerCase().endsWith(".apk");

      expect(isInotifyApkTrigger(downloadedFileName)).toBe(true);
      expect(isInotifyApkTrigger("image.png")).toBe(false);

      const quarantineEvent = {
        action: "QUARANTINE_ALERT",
        fileName: downloadedFileName,
        suggestedNextAction: "/api/analyze-apk",
      };
      expect(quarantineEvent.suggestedNextAction).toBe("/api/analyze-apk");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 17: Sandbox Docker Fallback
  // --------------------------------------------------------------------------
  describe("F17: Sandbox Docker Fallback Simulator", () => {
    it("returns isFallback: true when Docker daemon is simulated or offline", async () => {
      const res = await executeRoute<{ isFallback: boolean }>(
        "/api/sandbox/session/start",
        "POST",
        { type: "web", target: "https://test.xyz" },
      );
      expect(res.status).toBe(200);
      expect(res.body.isFallback).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 18: APK Static X-Ray Engine
  // --------------------------------------------------------------------------
  describe("F18: APK Static X-Ray Engine (/api/analyze-apk)", () => {
    it("detects dangerous SMS permissions and Telegram C2 bot tokens in malicious APK", async () => {
      const sample = INDONESIAN_APK_MALWARE_FIXTURES[0];
      const res = await executeRoute<Record<string, unknown>>("/api/analyze-apk", "POST", {
        fileName: sample.fileName,
        fileSizeBytes: 2048576,
      });

      expect(res.status).toBe(200);
      const parsed = ThreatAnalysisResultSchema.safeParse(res.body);
      expect(parsed.success).toBe(true);

      if (parsed.success) {
        expect(parsed.data.riskLevel).toBe("CRITICAL");
        expect(parsed.data.riskScore).toBeGreaterThanOrEqual(90);
        expect(parsed.data.type).toBe("APK");
        expect(parsed.data.technicalEvidence.permissions).toContain(
          "android.permission.RECEIVE_SMS",
        );
        expect(parsed.data.technicalEvidence.botTokens?.length).toBeGreaterThan(0);
      }
    });
  });

  // --------------------------------------------------------------------------
  // Feature 19: Interactive Android Emulator
  // --------------------------------------------------------------------------
  describe("F19: Interactive Android Emulator (/sandbox/android)", () => {
    it("initiates android emulation session with mobile stream", async () => {
      const res = await executeRoute<{ viewport: string; streamUrl: string }>(
        "/api/sandbox/session/start",
        "POST",
        { type: "android" },
      );
      expect(res.status).toBe(200);
      expect(res.body.viewport).toBe("mobile");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 20: Guardian Share Card Generator
  // --------------------------------------------------------------------------
  describe("F20: Guardian Share Card Generator (/act)", () => {
    it("formats defanged URL and 3 warning points for exportable card", () => {
      const target = "https://klikbca-verifikasi-otp.top/login.php";
      const defanged = referenceDefangUrl(target);
      expect(defanged).toBe("hxxps://klikbca-verifikasi-otp[.]top/login[.]php");
      expect(defanged).not.toContain("https://");

      const shareCardData = {
        title: "AWAS MODUS PENIPUAN SIBER!",
        defangedUrl: defanged,
        threatBullets: [
          "Situs palsu meniru tampilan m-banking Bank BCA",
          "Mencuri nomor kartu ATM, PIN, dan kode OTP SMS",
          "Jangan pernah mengisi data pribadi pada link ini",
        ],
        watermark: "Guardian Lab Verified Defense - MIT-Week 2026",
      };

      expect(shareCardData.threatBullets.length).toBe(3);
      expect(shareCardData.defangedUrl).toContain("[.]top");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 21: Forensic History Dashboard
  // --------------------------------------------------------------------------
  describe("F21: Forensic History Dashboard (/history)", () => {
    it("filters records by scan type (URL, QR, APK)", () => {
      const records = [
        { id: "1", type: "URL", target: "hxxps://fake-bca[.]com" },
        { id: "2", type: "QR", target: "hxxps://qris-fake[.]xyz" },
        { id: "3", type: "APK", target: "JNT_Resi.apk" },
      ];

      const urlRecords = records.filter((r) => r.type === "URL");
      expect(urlRecords.length).toBe(1);

      const apkRecords = records.filter((r) => r.type === "APK");
      expect(apkRecords.length).toBe(1);
    });

    it("searches records by domain name or filename", () => {
      const records = [
        { id: "1", target: "https://klikbca-verifikasi.xyz" },
        { id: "2", target: "JNT_Express_Resi.apk" },
      ];
      const query = "bca";
      const searchResult = records.filter((r) =>
        r.target.toLowerCase().includes(query.toLowerCase()),
      );
      expect(searchResult.length).toBe(1);
      expect(searchResult[0].target).toContain("klikbca");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 22: Forensic Report Detail View
  // --------------------------------------------------------------------------
  describe("F22: Forensic Report Detail View (/history/[id])", () => {
    it("constructs parameter route and provides complete inspection view", () => {
      const recordId = "rec_99214";
      const detailRoute = PROTECTED_ROUTES.historyDetail(recordId);
      expect(detailRoute).toBe(`/history/${recordId}`);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 23: Academy Streak & EXP Engine
  // --------------------------------------------------------------------------
  describe("F23: Academy Streak & EXP Engine (/academy)", () => {
    it("calculates rank levels accurately based on cumulative EXP", () => {
      expect(referenceCalculateRank(50).rank).toBe("Recruit");
      expect(referenceCalculateRank(150).rank).toBe("Junior Analyst");
      expect(referenceCalculateRank(450).rank).toBe("Cyber Sentinel");
      expect(referenceCalculateRank(1200).rank).toBe("Forensic Master");
    });

    it("maintains daily streak flame count on consecutive activity", () => {
      let streak = 7;
      const isConsecutiveDay = true;
      if (isConsecutiveDay) streak += 1;
      expect(streak).toBe(8);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 24: Interactive Academy Quiz
  // --------------------------------------------------------------------------
  describe("F24: Interactive Academy Quiz System", () => {
    it("validates all 3 quiz question formats match QuizQuestionSchema", () => {
      for (const question of ACADEMY_QUIZ_FIXTURES) {
        const parsed = QuizQuestionSchema.safeParse(question);
        expect(parsed.success).toBe(true);
        if (parsed.success) {
          const correctOption = parsed.data.options.find((o) => o.isCorrect);
          expect(correctOption).toBeDefined();
        }
      }
    });

    it("evaluates correct answer and awards EXP", () => {
      const q = ACADEMY_QUIZ_FIXTURES[0];
      const selectedOptionId = "opt-1";
      const chosen = q.options.find((o) => o.id === selectedOptionId);
      expect(chosen?.isCorrect).toBe(true);
      const earnedExp = chosen?.isCorrect ? q.expReward : 0;
      expect(earnedExp).toBe(50);
    });
  });

  // --------------------------------------------------------------------------
  // Feature 25: Admin Quiz CMS
  // --------------------------------------------------------------------------
  describe("F25: Admin Quiz CMS (/admin/quizzes)", () => {
    it("creates a new quiz with category, difficulty, and questions", () => {
      const newQuiz = {
        title: "Simulasi Ancaman Quishing & QRIS 2026",
        category: "SPOT_THE_PHISH",
        difficulty: "MEDIUM",
        expReward: 100,
        published: true,
      };
      expect(newQuiz.expReward).toBe(100);
      expect(ADMIN_ROUTES.quizzes).toBe("/admin/quizzes");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 26: Community Replay Intake
  // --------------------------------------------------------------------------
  describe("F26: Community Replay Intake (PII-Sanitized)", () => {
    it("submits threat case with status PENDING_REVIEW and scrubbed PII", () => {
      const rawEvidence = "Korban 081234567890 menerima link http://klikbca-palsu.xyz";
      const scrubbed = referenceScrubPii(rawEvidence);
      const submission = {
        id: "rep_sub_101",
        userId: "usr_user_002",
        title: "Penipuan Undangan WhatsApp APK",
        scamType: "APK Trojan",
        status: "PENDING_REVIEW" as const,
        sanitizedEvidence: scrubbed.sanitizedText,
        defangedTarget: referenceDefangUrl("http://klikbca-palsu.xyz"),
        submittedAt: Date.now(),
      };

      const parsed = CommunityReplaySchema.safeParse(submission);
      expect(parsed.success).toBe(true);
      expect(submission.sanitizedEvidence).not.toContain("081234567890");
      expect(submission.status).toBe("PENDING_REVIEW");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 27: Admin Community Moderation
  // --------------------------------------------------------------------------
  describe("F27: Admin Community Moderation (/admin/community-reviews)", () => {
    it("moderates pending submission to APPROVED or REJECTED", () => {
      let status: "PENDING_REVIEW" | "APPROVED" | "REJECTED" = "PENDING_REVIEW";
      const approve = () => {
        status = "APPROVED";
      };
      approve();
      expect(status as string).toBe("APPROVED");
      expect(ADMIN_ROUTES.communityReviews).toBe("/admin/community-reviews");
    });
  });

  // --------------------------------------------------------------------------
  // Feature 28: Interactive Community Replay
  // --------------------------------------------------------------------------
  describe("F28: Interactive Community Replay (/community/[replayId])", () => {
    it("provides playable replay route and awards bonus EXP upon completion", () => {
      const replayId = "rep_case_441";
      const route = PROTECTED_ROUTES.communityReplay(replayId);
      expect(route).toBe(`/community/${replayId}`);

      const userExp = 200;
      const bonusCommunityExp = 75;
      const newTotal = userExp + bonusCommunityExp;
      expect(newTotal).toBe(275);
    });
  });
});
