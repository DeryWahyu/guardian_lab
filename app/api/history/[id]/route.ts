import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { safeConnection } from "@/lib/security/connection";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await safeConnection();
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Active session required" }, { status: 401 });
    }

    const { id } = await params;
    const record = await prisma.forensicRecord.findUnique({
      where: { id },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Forensic record not found" }, { status: 404 });
    }

    // Ownership or admin check
    if (user.role !== "ADMIN" && record.userId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden: Access denied to this forensic record" },
        { status: 403 },
      );
    }

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_")) {
      throw error;
    }
    console.error("Forensic record detail query error:", error);
    return NextResponse.json({ error: "Failed to fetch forensic record detail" }, { status: 500 });
  }
}
