import { describe, expect, it } from "bun:test";
import { API_ROUTES, PUBLIC_ROUTES, ROUTES } from "./routes";

describe("routes constants", () => {
  it("defines public routes correctly", () => {
    expect(PUBLIC_ROUTES.home).toBe("/");
    expect(PUBLIC_ROUTES.sandboxWeb).toBe("/sandbox/web");
    expect(PUBLIC_ROUTES.sandboxAndroid).toBe("/sandbox/android");
    expect(PUBLIC_ROUTES.act).toBe("/act");
  });

  it("builds parameterized routes properly", () => {
    expect(PUBLIC_ROUTES.homeWithTab("qr")).toBe("/?tab=qr");
    expect(PUBLIC_ROUTES.sandboxWebWithTarget("https://evil.com/phish?id=123")).toBe(
      "/sandbox/web?target=https%3A%2F%2Fevil.com%2Fphish%3Fid%3D123",
    );
  });

  it("defines API routes correctly", () => {
    expect(API_ROUTES.analyzeUrl).toBe("/api/analyze-url");
    expect(API_ROUTES.analyzeQr).toBe("/api/analyze-qr");
    expect(API_ROUTES.analyzeApk).toBe("/api/analyze-apk");
    expect(API_ROUTES.sandboxSessionStart).toBe("/api/sandbox/session/start");
    expect(API_ROUTES.sandboxSessionStop).toBe("/api/sandbox/session/stop");
  });

  it("exports combined default ROUTES object", () => {
    expect(ROUTES.public).toEqual(PUBLIC_ROUTES);
    expect(ROUTES.api).toEqual(API_ROUTES);
  });
});
