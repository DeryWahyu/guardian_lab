/**
 * Route Handler: POST /api/analyze-url
 * AI URL Threat Detection Endpoint
 */

import { NextResponse } from "next/server";
import { analyzeThreatWithDeepSeek } from "@/lib/analysis/deepseek";
import { logForensicRecord } from "@/lib/analysis/forensic-logger";
import { analyzeLexicalUrl } from "@/lib/analysis/lexical";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    let body: { url?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "URL target is required and cannot be empty" },
        { status: 400 },
      );
    }

    if (!body?.url || typeof body.url !== "string" || body.url.trim() === "") {
      return NextResponse.json(
        { error: "URL target is required and cannot be empty" },
        { status: 400 },
      );
    }

    const trimmedUrl = body.url.trim();

    // Check maximum acceptable length
    if (trimmedUrl.length > 16384) {
      return NextResponse.json({ error: "URL exceeds maximum supported length" }, { status: 400 });
    }

    // 1. Check user session
    const user = await getCurrentUser();

    // 2. Lexical feature extraction
    const lexical = analyzeLexicalUrl(trimmedUrl);

    // 3. AI analysis with fallback
    const threatResult = await analyzeThreatWithDeepSeek(trimmedUrl, lexical);

    // 4. Auto-log to MySQL ForensicRecord
    const recordId = await logForensicRecord({
      userId: user?.id,
      target: trimmedUrl,
      type: "URL",
      threatResult,
    });

    threatResult.id = recordId;

    return NextResponse.json(threatResult, { status: 200 });
  } catch (err) {
    console.error("[AnalyzeUrlAPI] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during URL analysis" },
      { status: 500 },
    );
  }
}
