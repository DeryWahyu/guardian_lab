export const PUBLIC_ROUTES = {
  home: "/",
  sandboxWeb: "/sandbox/web",
  sandboxAndroid: "/sandbox/android",
  act: "/act",

  // Parameter Builders
  homeWithTab: (tab: "url" | "qr" | "apk") => `/?tab=${tab}`,
  sandboxWebWithTarget: (target: string) => `/sandbox/web?target=${encodeURIComponent(target)}`,
} as const;

export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
} as const;

export const PROTECTED_ROUTES = {
  history: "/history",
  historyDetail: (id: string) => `/history/${encodeURIComponent(id)}`,
  academy: "/academy",
  academyLesson: (id: string) => `/academy/${encodeURIComponent(id)}`,
  community: "/community",
  communityReplay: (id: string) => `/community/${encodeURIComponent(id)}`,
} as const;

export const ADMIN_ROUTES = {
  dashboard: "/admin",
  quizzes: "/admin/quizzes",
  communityReviews: "/admin/community-reviews",
  users: "/admin/users",
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
  auth: AUTH_ROUTES,
  protected: PROTECTED_ROUTES,
  admin: ADMIN_ROUTES,
  api: API_ROUTES,
} as const;

export default ROUTES;
