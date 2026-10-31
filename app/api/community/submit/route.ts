import { ReplayStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { defangUrl } from "@/lib/security/defang";
import { scrubPii } from "@/lib/security/pii-scrubber";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    let userId = user?.id;
    if (!userId) {
      const defaultUser = await prisma.user.findFirst({ select: { id: true } });
      userId = defaultUser?.id || "usr_guest";
    }

    const body = await request.json().catch(() => ({}));
    const { title, description, scamType, rawEvidence, target } = body;

    if (!title || !scamType) {
      return NextResponse.json({ error: "title and scamType are required" }, { status: 400 });
    }

    const textToSanitize = rawEvidence || description || "Studi kasus ancaman siber";
    const scrubbed = scrubPii(textToSanitize);
    const defangedTarget = defangUrl(target || "https://suspicious-target.xyz");

    const replay = await prisma.communityReplay.create({
      data: {
        userId,
        title,
        description: scrubbed.sanitizedText,
        scamType,
        sanitizedData: {
          sanitizedEvidence: scrubbed.sanitizedText,
          defangedTarget,
          redactedCounts: scrubbed.redactedCounts,
        },
        status: ReplayStatus.PENDING_REVIEW,
      },
    });

    return NextResponse.json(
      {
        id: replay.id,
        userId: replay.userId,
        title: replay.title,
        scamType: replay.scamType,
        status: "PENDING_REVIEW",
        sanitizedEvidence: scrubbed.sanitizedText,
        defangedTarget,
        submittedAt: replay.createdAt.getTime(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Community case submission error:", error);
    return NextResponse.json({ error: "Failed to submit community case" }, { status: 500 });
  }
}
