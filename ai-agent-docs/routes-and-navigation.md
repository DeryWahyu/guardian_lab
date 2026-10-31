# Panduan Rute & Navigasi Terpusat — Guardian Lab

> **Dokumen:** `ai-agent-docs/routes-and-navigation.md`  
> **Fokus Utama:** Sentralisasi Rute `lib/routes.ts` (Zero Hardcoded Routes), Parameter Builders, dan Penggunaan Tautan  
> **Audience:** AI Coding Agent & Pengembang Frontend/Backend

---

## 1. Filosofi Sentralisasi Rute (Zero Hardcoded Routes)

Menuliskan path URL sebagai string manual (_hardcoded string literal_) seperti `"/sandbox/web"` atau `"/api/analyze-url"` di berbagai komponen dilarang keras karena:

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
```

---

## 3. Pedoman & Contoh Penggunaan

### A. Tautan Navigasi (Next.js `<Link>`)

```tsx
import Link from "next/link";
import { PUBLIC_ROUTES } from "@/lib/routes";

// ❌ DILARANG: String hardcoded
<Link href="/sandbox/web">Buka Sandbox</Link>

// ✅ BENAR: Mengimpor konstanta
<Link href={PUBLIC_ROUTES.sandboxWeb}>Buka Sandbox</Link>
<Link href={PUBLIC_ROUTES.sandboxWebWithTarget("https://phishing.xyz")}>
  Buka Link di Sandbox
</Link>
```

### B. Pengalihan Rute (`redirect()`)

```typescript
import { redirect } from "next/navigation";
import { PUBLIC_ROUTES } from "@/lib/routes";

// ❌ DILARANG
redirect("/");

// ✅ BENAR
redirect(PUBLIC_ROUTES.home);
```

### C. Pemanggilan API Frontend (`fetch()`)

```typescript
import { API_ROUTES } from "@/lib/routes";

// ❌ DILARANG
const res = await fetch("/api/analyze-url", { ... });

// ✅ BENAR
const res = await fetch(API_ROUTES.analyzeUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url }),
});
```

---

## 4. Aturan Penambahan Rute Baru

Jika Anda membuat halaman atau endpoint API baru:

1. Buka file `lib/routes.ts`.
2. Daftarkan rute ke grup `PUBLIC_ROUTES` atau `API_ROUTES`.
3. Gunakan fungsi builder jika rute memerlukan parameter dinamis.
4. Jalankan `bunx tsc --noEmit` untuk memastikan integritas tipe rute.
