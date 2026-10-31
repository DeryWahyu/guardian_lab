import type { ReplayStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status, adminNotes } = body as {
      status: "APPROVED" | "REJECTED";
      adminNotes?: string;
    };

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Status must be APPROVED or REJECTED" }, { status: 400 });
    }

    const updated = await prisma.communityReplay.update({
      where: { id },
      data: {
        status: status as ReplayStatus,
        adminNotes,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Admin review action error:", error);
    return NextResponse.json({ error: "Failed to update community case review" }, { status: 500 });
  }
}
