import type { RiskLevel, ScanType } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { safeConnection } from "@/lib/security/connection";

export async function GET(request: Request) {
  await safeConnection();
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const typeParam = searchParams.get("type");
    const riskParam = searchParams.get("risk");
    const search = searchParams.get("search")?.toLowerCase().trim() || "";

    const whereClause: {
      userId?: string;
      type?: ScanType;
      riskLevel?: RiskLevel;
    } = {
      // Admin can view all or self, user views self
      ...(user.role !== "ADMIN" ? { userId: user.id } : {}),
    };

    if (typeParam && ["URL", "QR", "APK"].includes(typeParam.toUpperCase())) {
      whereClause.type = typeParam.toUpperCase() as ScanType;
    }

    if (
      riskParam &&
      [
        "CRITICAL",
        "HIGH",
        "MEDIUM",
        "LOW",
        "SAFE",
        "WARNING",
        "DANGEROUS",
        "PHISHING",
        "MALWARE",
      ].includes(riskParam.toUpperCase())
    ) {
      whereClause.riskLevel = riskParam.toUpperCase() as RiskLevel;
    }

    const records = await prisma.forensicRecord.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const filtered = search
      ? records.filter((r) => r.target.toLowerCase().includes(search))
      : records;

    return NextResponse.json(filtered, { status: 200 });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_")) {
      throw error;
    }
    console.error("Forensic history query error:", error);
    return NextResponse.json({ error: "Failed to fetch forensic history" }, { status: 500 });
  }
}
