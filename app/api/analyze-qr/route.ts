/**
 * Route Handler: POST /api/analyze-qr
 * QR Code Image Decoder Helper Endpoint
 */

import { NextResponse } from "next/server";
import { decodeQrImage } from "@/lib/analysis/qr";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let imageBuffer: Buffer | null = null;
    let base64Hint: string | undefined;

    if (contentType.includes("application/json")) {
      let body: { imageBase64?: unknown; mimeType?: unknown };
      try {
        body = await request.json();
      } catch {
        return NextResponse.json({ error: "QR image payload is required" }, { status: 400 });
      }

      if (
        !body?.imageBase64 ||
        typeof body.imageBase64 !== "string" ||
        body.imageBase64.trim() === ""
      ) {
        return NextResponse.json({ error: "QR image payload is required" }, { status: 400 });
      }

      if (body.mimeType && body.mimeType === "application/x-msdownload") {
        return NextResponse.json({ error: "Unsupported image MIME type" }, { status: 415 });
      }

      base64Hint = body.imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      try {
        imageBuffer = Buffer.from(base64Hint, "base64");
      } catch {
        return NextResponse.json({ error: "Invalid base64 payload" }, { status: 400 });
      }
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = (formData.get("file") || formData.get("image")) as File | null;
      if (!file) {
        return NextResponse.json({ error: "QR image payload is required" }, { status: 400 });
      }
      const arrayBuffer = await file.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json({ error: "Unsupported Content-Type header" }, { status: 400 });
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      return NextResponse.json({ error: "QR image payload is required" }, { status: 400 });
    }

    const decodeResult = await decodeQrImage(imageBuffer, base64Hint);

    if (!decodeResult.success) {
      return NextResponse.json(
        { error: decodeResult.error || "No QR code detected in image" },
        { status: 422 },
      );
    }

    return NextResponse.json(
      {
        extracted_text: decodeResult.extracted_text,
        is_url: decodeResult.is_url,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[AnalyzeQrAPI] Unexpected error:", err);
    return NextResponse.json({ error: "Failed to decode QR code image" }, { status: 500 });
  }
}
