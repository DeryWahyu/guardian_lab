/**
 * Guardian Lab — Forensic Record Auto-Logger
 * Persists structured analysis outcomes to the MySQL database via Prisma.
 */

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ThreatAnalysisResult } from "@/types/analysis";

export async function logForensicRecord(params: {
  userId?: string | null;
  target: string;
  type: "URL" | "QR" | "APK";
  threatResult: ThreatAnalysisResult;
}): Promise<string> {
  const { userId, target, type, threatResult } = params;

  // Persist if authenticated user session is active
  if (userId) {
    try {
      const record = await prisma.forensicRecord.create({
        data: {
          userId,
          target,
          type,
          riskLevel: threatResult.riskLevel,
          riskScore: threatResult.riskScore,
          scamCategory: threatResult.scamCategory,
          summary: threatResult.humanFriendlySummary,
          deceptionTricks: threatResult.deceptionTricks,
          technicalEvidence: threatResult.technicalEvidence as unknown as Prisma.InputJsonValue,
          defangedTarget: threatResult.defangedTarget,
        },
      });
      return record.id;
    } catch (err) {
      console.error("[ForensicLogger] Database insert error:", err);
      return `forensic_${Date.now()}`;
    }
  }

  // Ephemeral ID for unauthenticated / guest / automated test execution
  return `forensic_guest_${Date.now()}`;
}
