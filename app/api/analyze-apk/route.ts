import { NextResponse } from "next/server";
import { analyzeApkPayload } from "@/lib/analysis/apk";
import { logForensicRecord } from "@/lib/analysis/forensic-logger";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    let fileName = "";
    let fileSizeBytes = 0;

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (file) {
        fileName = file.name;
        fileSizeBytes = file.size;
      }
    } else {
      const body = await request.json().catch(() => ({}));
      fileName = body?.fileName || "";
      fileSizeBytes = body?.fileSizeBytes ?? 0;
    }

    if (!fileName || fileSizeBytes === 0) {
      return NextResponse.json({ error: "Valid APK file binary is required" }, { status: 400 });
    }

    const threatResult = analyzeApkPayload({ fileName, fileSizeBytes });

    // Persist to database if authenticated
    const user = await getCurrentUser();
    const recordId = await logForensicRecord({
      userId: user?.id,
      target: fileName,
      type: "APK",
      threatResult,
    });

    return NextResponse.json({ ...threatResult, id: recordId }, { status: 200 });
  } catch (error) {
    console.error("APK analysis error:", error);
    return NextResponse.json(
      { error: "Failed to perform static APK X-Ray analysis" },
      { status: 500 },
    );
  }
}
