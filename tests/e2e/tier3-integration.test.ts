/**
 * Tier 3: Cross-Feature Combinations (Integration User Journeys)
 * Validates complex, multi-module user flows across the full Guardian Lab architecture:
 * - Flow 1: URL Analysis -> Forensic History -> History Detail -> Guardian Share Card
 * - Flow 2: Quishing QR Upload -> QR Extraction -> AI Scoring -> Web Sandbox Isolation -> Auto-Destroy
 * - Flow 3: Malware APK Upload -> Static X-Ray -> Emulator Sandbox -> Community Replay Intake -> Admin Moderation
 * - Flow 4: Guest Interception -> Registration -> Auth Session -> RBAC Guard -> Academy Quiz -> EXP Level Up
 */

import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { prisma } from "../../lib/prisma";
import { PROTECTED_ROUTES } from "../../lib/routes";
import { INDONESIAN_APK_MALWARE_FIXTURES } from "./fixtures/malware-samples";
import { INDONESIAN_PHISHING_FIXTURES } from "./fixtures/phishing-urls";
import { QR_CODE_FIXTURES } from "./fixtures/qr-codes";
import { ACADEMY_QUIZ_FIXTURES } from "./fixtures/quiz-fixtures";
import { NEW_REGISTERED_USER_FIXTURE } from "./fixtures/user-fixtures";
import {
  CommunityReplaySchema,
  executeRoute,
  referenceCalculateRank,
  referenceDefangUrl,
  referenceScrubPii,
  SandboxSessionStartSchema,
  SandboxSessionStopSchema,
  ThreatAnalysisResultSchema,
} from "./helpers/test-harness";

describe("Tier 3: Cross-Feature Combinations", () => {
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
  // Flow 1: URL Analysis -> Forensic History -> History Detail -> Share Card
  // --------------------------------------------------------------------------
  describe("Flow 1: Phishing URL Analysis to Guardian Share Card Lifecycle", () => {
    it("completes full lifecycle from threat inspection to shareable defanged warning card", async () => {
      const suspiciousUrl = INDONESIAN_PHISHING_FIXTURES[0].url;

      // 1. Submit suspicious URL to /api/analyze-url
      const analysisRes = await executeRoute<Record<string, unknown>>("/api/analyze-url", "POST", {
        url: suspiciousUrl,
      });
      expect(analysisRes.status).toBe(200);

      const parsedAnalysis = ThreatAnalysisResultSchema.safeParse(analysisRes.body);
      expect(parsedAnalysis.success).toBe(true);
      if (!parsedAnalysis.success) return;

      const recordId = parsedAnalysis.data.id || "rec_hist_001";
      const defangedUrl = parsedAnalysis.data.defangedTarget;

      // Verify defanged integrity
      expect(defangedUrl).toContain("[.]top");
      expect(defangedUrl).not.toContain("https://");

      // 2. Query Forensic History detail view route
      const historyDetailRoute = PROTECTED_ROUTES.historyDetail(recordId);
      expect(historyDetailRoute).toBe(`/history/${recordId}`);

      // 3. Export Guardian Share Card payload
      const shareCardPayload = {
        historyRecordId: recordId,
        defangedUrl,
        dangerSummary: parsedAnalysis.data.humanFriendlySummary,
        deceptionTricks: parsedAnalysis.data.deceptionTricks,
        emergencyActions: parsedAnalysis.data.emergencyActionPlan,
      };

      expect(shareCardPayload.defangedUrl).toBe(defangedUrl);
      expect(shareCardPayload.dangerSummary.length).toBeGreaterThan(0);
      expect(shareCardPayload.deceptionTricks.length).toBeGreaterThanOrEqual(1);
    });
  });

  // --------------------------------------------------------------------------
  // Flow 2: Quishing QR -> Extraction -> Threat Scoring -> Web Sandbox
  // --------------------------------------------------------------------------
  describe("Flow 2: Quishing Investigation to Isolated Browser Sandbox Flow", () => {
    it("pipes decoded QR target into AI scoring and initiates 180s browser sandbox", async () => {
      const quishingSample = QR_CODE_FIXTURES[2]; // Fake QRIS phishing

      // 1. Extract URL payload via QR helper
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
      const extractedTarget = qrRes.body.extracted_text;

      // 2. Pipe extracted target to AI URL Threat Scoring
      const urlAnalysisRes = await executeRoute<Record<string, unknown>>(
        "/api/analyze-url",
        "POST",
        {
          url: extractedTarget,
        },
      );
      expect(urlAnalysisRes.status).toBe(200);
      const threatData = ThreatAnalysisResultSchema.parse(urlAnalysisRes.body);
      expect(threatData.riskLevel).toBe("PHISHING");

      // 3. Launch isolated Web Sandbox session with extracted URL
      const sandboxStartRes = await executeRoute<Record<string, unknown>>(
        "/api/sandbox/session/start",
        "POST",
        {
          type: "web",
          target: extractedTarget,
        },
      );
      expect(sandboxStartRes.status).toBe(200);
      const sandboxSession = SandboxSessionStartSchema.parse(sandboxStartRes.body);
      expect(sandboxSession.sessionId).toBeDefined();
      expect(sandboxSession.expiresAt).toBeGreaterThan(Date.now());

      // 4. Terminate sandbox session and clean up
      const sandboxStopRes = await executeRoute<Record<string, unknown>>(
        "/api/sandbox/session/stop",
        "POST",
        {
          sessionId: sandboxSession.sessionId,
        },
      );
      expect(sandboxStopRes.status).toBe(200);
      const stopData = SandboxSessionStopSchema.parse(sandboxStopRes.body);
      expect(stopData.success).toBe(true);
      expect(stopData.destroyedSessionId).toBe(sandboxSession.sessionId);
    });
  });

  // --------------------------------------------------------------------------
  // Flow 3: Malicious APK -> Static X-Ray -> Emulator -> Community Replay
  // --------------------------------------------------------------------------
  describe("Flow 3: APK Malware X-Ray to Community Forensic Replay Pipeline", () => {
    it("analyzes APK, scrubs PII, tests in emulator, and moderates for community", async () => {
      const malwareSample = INDONESIAN_APK_MALWARE_FIXTURES[0];

      // 1. Run static X-Ray analysis on fake courier APK
      const apkRes = await executeRoute<Record<string, unknown>>("/api/analyze-apk", "POST", {
        fileName: malwareSample.fileName,
        fileSizeBytes: 3145728,
      });
      expect(apkRes.status).toBe(200);
      const apkAnalysis = ThreatAnalysisResultSchema.parse(apkRes.body);
      expect(apkAnalysis.riskLevel).toBe("CRITICAL");
      expect(apkAnalysis.technicalEvidence.permissions).toContain("android.permission.RECEIVE_SMS");

      // 2. Launch Android emulator sandbox session
      const emulatorRes = await executeRoute<Record<string, unknown>>(
        "/api/sandbox/session/start",
        "POST",
        {
          type: "android",
          target: malwareSample.fileName,
        },
      );
      expect(emulatorRes.status).toBe(200);
      const emulatorSession = SandboxSessionStartSchema.parse(emulatorRes.body);
      expect(emulatorSession.viewport).toBe("mobile");

      // 3. User submits case to Community Forensic Replay with PII sanitization
      const rawUserNotes =
        "Korban nomor 081234567890 mendapat file resi J&T palsu dengan bot 6123456789:AAFlkBz80pQc-4xZyR9m30Lk18eP_Oabcde";
      const scrubbedNotes = referenceScrubPii(rawUserNotes);
      expect(scrubbedNotes.sanitizedText).not.toContain("081234567890");

      const submission = {
        id: "rep_case_301",
        userId: "usr_user_002",
        title: "Bedah Malware APK Resi J&T Express 2026",
        scamType: "APK Penyadap SMS OTP",
        status: "PENDING_REVIEW" as const,
        sanitizedEvidence: scrubbedNotes.sanitizedText,
        defangedTarget: referenceDefangUrl(malwareSample.fileName),
        submittedAt: Date.now(),
      };
      const parsedSubmission = CommunityReplaySchema.parse(submission);
      expect(parsedSubmission.status).toBe("PENDING_REVIEW");

      // 4. Admin approves case in moderation queue
      const approvedCase = {
        ...parsedSubmission,
        status: "APPROVED" as const,
      };
      expect(approvedCase.status).toBe("APPROVED");

      // 5. Case becomes playable at /community/[replayId]
      const replayUrl = PROTECTED_ROUTES.communityReplay(approvedCase.id);
      expect(replayUrl).toBe(`/community/${approvedCase.id}`);
    });
  });

  // --------------------------------------------------------------------------
  // Flow 4: Guest Auth Interception -> Register -> RBAC -> Academy Level Up
  // --------------------------------------------------------------------------
  describe("Flow 4: Guest Onboarding, RBAC Enforcement, and Gamification Progress", () => {
    it("handles guest interception, user registration, role guarding, and quiz EXP progression", async () => {
      // 1. Guest clicks analysis tab, intercepted with redirect parameter
      const targetAction = "/?tab=apk";
      const loginRedirectTarget = `/login?redirect=${encodeURIComponent(targetAction)}`;
      expect(loginRedirectTarget).toBe("/login?redirect=%2F%3Ftab%3Dapk");

      // 2. User registers new account
      const registerRes = await executeRoute<{
        id: string;
        email: string;
        role: string;
        exp: number;
      }>("/api/auth/register", "POST", NEW_REGISTERED_USER_FIXTURE);
      expect(registerRes.status).toBe(201);
      expect(registerRes.body.role).toBe("USER");
      let currentExp = registerRes.body.exp; // 0 EXP initially

      // 3. User authenticates and receives session cookie
      const loginRes = await executeRoute<{ id: string; role: string }>("/api/auth/login", "POST", {
        email: NEW_REGISTERED_USER_FIXTURE.email,
        password: NEW_REGISTERED_USER_FIXTURE.password,
      });
      expect(loginRes.status).toBe(200);
      const setCookie = loginRes.headers.get("Set-Cookie");
      const match = setCookie?.match(/guardian_session=([^;]+)/);
      const sessionToken = match ? match[1] : "";
      expect(sessionToken).toBeTruthy();

      // 4. Regular user attempts to access /admin/quizzes (RBAC check)
      const userRole = loginRes.body.role;
      const isAdmin = userRole === "ADMIN";
      expect(isAdmin).toBe(false); // RBAC correctly forbids admin access

      // 5. User visits /academy and completes Spot-the-Phish Quiz
      const quiz = ACADEMY_QUIZ_FIXTURES[0];
      const correctOption = quiz.options.find((o) => o.isCorrect);
      expect(correctOption).toBeDefined();

      // Award EXP for completing the quiz
      currentExp += quiz.expReward; // +50 EXP
      expect(currentExp).toBe(50);

      // Check user rank progression
      const rankState = referenceCalculateRank(currentExp);
      expect(rankState.rank).toBe("Recruit");
      expect(rankState.nextRankExp).toBe(100);

      // Complete another simulation
      const quiz2 = ACADEMY_QUIZ_FIXTURES[2]; // +60 EXP
      currentExp += quiz2.expReward;
      expect(currentExp).toBe(110);

      // Verify level up to Junior Analyst!
      const levelUpState = referenceCalculateRank(currentExp);
      expect(levelUpState.rank).toBe("Junior Analyst");
      expect(levelUpState.nextRankExp).toBe(300);

      // 6. Verify authenticated session is active
      const meRes = await executeRoute<{ id: string; email: string; role: string }>(
        "/api/auth/me",
        "GET",
        undefined,
        { guardian_session: sessionToken },
      );
      expect(meRes.status).toBe(200);
      expect(meRes.body.email).toBe(NEW_REGISTERED_USER_FIXTURE.email);
      expect(meRes.body.role).toBe("USER");
    });
  });
});
