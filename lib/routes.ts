export const PUBLIC_ROUTES = {
  home: "/",
  sandboxWeb: "/sandbox/web",
  sandboxAndroid: "/sandbox/android",
  act: "/act",

  // Parameter Builders
  homeWithTab: (tab: "url" | "qr" | "apk") => `/?tab=${tab}`,
  sandboxWebWithTarget: (target: string) => `/sandbox/web?target=${encodeURIComponent(target)}`,
} as const;

export const API_ROUTES = {
  analyzeUrl: "/api/analyze-url",
  analyzeQr: "/api/analyze-qr",
  analyzeApk: "/api/analyze-apk",
  sandboxSessionStart: "/api/sandbox/session/start",
  sandboxSessionStop: "/api/sandbox/session/stop",
} as const;

export const ROUTES = {
  public: PUBLIC_ROUTES,
  api: API_ROUTES,
} as const;

export default ROUTES;
