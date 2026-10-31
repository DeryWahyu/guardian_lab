# Panduan Rute & Navigasi Terpusat — Guardian Lab

> **Dokumen:** `ai-agent-docs/routes-and-navigation.md`  
> **Fokus Utama:** Sentralisasi Rute `lib/routes.ts` (Zero Hardcoded Routes), Rute Auth, Protected, Admin, API, dan Parameter Builders  
> **Audience:** AI Coding Agent & Pengembang Fullstack Next.js

---

## 1. Filosofi Sentralisasi Rute (Zero Hardcoded Routes)

Menuliskan path URL sebagai string manual (_hardcoded string literal_) seperti `"/sandbox/web"` atau `"/admin/quizzes"` di berbagai komponen dilarang keras karena:

1. **Rentan Typo:** Kesalahan penulisan rute tidak terdeteksi saat _compile time_.
2. **Refactoring Rapuh:** Perubahan rute atau parameter URL akan merusak navigasi di banyak file tanpa peringatan compiler.

Seluruh rute internal aplikasi didaftarkan secara terpusat pada `lib/routes.ts`. **Setiap link (`<Link href="...">`), tombol navigasi, pemanggilan API (`fetch`), dan pengalihan (`redirect()`) WAJIB mengimpor konstanta dari file ini.**

---

## 2. Struktur Pengelompokan Rute (`lib/routes.ts`)

```typescript
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
```

---

## 3. Pedoman & Contoh Penggunaan

### A. Tautan Navigasi (Next.js `<Link>`)

```tsx
import Link from "next/link";
import { PUBLIC_ROUTES, PROTECTED_ROUTES, ADMIN_ROUTES } from "@/lib/routes";

// ❌ DILARANG: String hardcoded
<Link href="/sandbox/web">Buka Sandbox</Link>

// ✅ BENAR: Mengimpor konstanta
<Link href={PUBLIC_ROUTES.sandboxWeb}>Buka Sandbox</Link>
<Link href={PROTECTED_ROUTES.academy}>Masuk Guardian Academy</Link>
<Link href={ADMIN_ROUTES.quizzes}>Kelola Bank Soal</Link>
```

### B. Pengalihan Rute (`redirect()`)

```tsx
import { redirect } from "next/navigation";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "@/lib/routes";

if (!session) {
  redirect(AUTH_ROUTES.login);
}
```

### C. Pemanggilan Endpoint Internal API (`fetch()`)

```tsx
import { API_ROUTES } from "@/lib/routes";

const response = await fetch(API_ROUTES.analyzeUrl, {
  method: "POST",
  body: JSON.stringify({ url: targetUrl }),
});
```
