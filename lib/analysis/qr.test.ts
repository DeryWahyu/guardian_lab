import { describe, expect, it } from "bun:test";
import { checkIsUrl, decodeQrImage } from "./qr";

describe("QR Code Decoder Helper", () => {
  it("validates valid http and https URLs", () => {
    expect(checkIsUrl("https://example.com")).toBe(true);
    expect(checkIsUrl("http://klikbca.com")).toBe(true);
    expect(checkIsUrl("WIFI:S:Home;P:Secret;;")).toBe(false);
    expect(checkIsUrl("not a url")).toBe(false);
    expect(checkIsUrl("")).toBe(false);
  });

  it("decodes simulated fixture correctly", async () => {
    const fixtureBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=";
    const buffer = Buffer.from(fixtureBase64, "base64");
    const result = await decodeQrImage(buffer, fixtureBase64);

    expect(result.success).toBe(true);
    expect(result.is_url).toBe(true);
    expect(result.extracted_text).toContain("https://");
  });

  it("rejects empty buffer", async () => {
    const result = await decodeQrImage(Buffer.from([]));
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("handles non-QR random image buffer gracefully", async () => {
    const nonQrBuffer = Buffer.from("not-an-image-payload");
    const result = await decodeQrImage(nonQrBuffer);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
