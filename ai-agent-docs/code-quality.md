# Standar Kualitas Kode & Arsitektur Modular — Guardian Lab

> **Dokumen:** `ai-agent-docs/code-quality.md`  
> **Fokus Utama:** Prinsip Kualitas Kode, Anti-Fat Files, Strict Type Safety, Formatter Prettier + Biome, dan Batasan Arsitektur  
> **Audience:** AI Coding Agent & Pengembang Fullstack

---

## Daftar Isi

1. [Larangan Fat Files (Anti-Fat Files Rule)](#1-larangan-fat-files-anti-fat-files-rule)
2. [Reusabilitas Kode (Reusable Components & Hooks)](#2-reusabilitas-kode-reusable-components--hooks)
3. [Pemisahan Logic dari UI (Separation of Concerns)](#3-pemisahan-logic-dari-ui-separation-of-concerns)
4. [Batas Ukuran File (LOC Threshold ~200–250 Baris)](#4-batas-ukuran-file-loc-threshold-200250-baris)
5. [Standarisasi Pola Co-location Direktori Fitur](#5-standarisasi-pola-co-location-direktori-fitur)
6. [Kebijakan Zero-any & Strict Type Safety](#6-kebijakan-zero-any--strict-type-safety)
7. [Sentralisasi Validasi Data (Zod Schema Isolation)](#7-sentralisasi-validasi-data-zod-schema-isolation)
8. [Clean Server-to-Client Boundary (RSC vs RCC)](#8-clean-server-to-client-boundary-rsc-vs-rcc)
9. [Standarisasi Penanganan Error & User Feedback](#9-standarisasi-penanganan-error--user-feedback)
10. [Disiplin Styling Tailwind & Formatter Prettier](#10-disiplin-styling-tailwind--formatter-prettier)
11. [Efisiensi State & Eliminasi Redundant useEffect](#11-efisiensi-state--eliminasi-redundant-useeffect)
12. [Konvensi Penamaan Terstandarisasi (Naming Conventions)](#12-konvensi-penamaan-terstandarisasi-naming-conventions)
13. [Sentralisasi Rute & Anti-Hardcoded Navigation](#13-sentralisasi-rute--anti-hardcoded-navigation)
14. [Sinkronisasi State ke URL Parameters](#14-sinkronisasi-state-ke-url-parameters)
15. [Standar Penanganan 4 UI States & Form Input Hygiene](#15-standar-penanganan-4-ui-states--form-input-hygiene)
16. [Integritas Pengetesan & Sinkronisasi Test Suite](#16-integritas-pengetesan--sinkronisasi-test-suite)
17. [Disiplin Git Branching Model](#17-disiplin-git-branching-model)
18. [Portabilitas Lingkungan (Larangan Hardcoded Absolute Path)](#18-portabilitas-lingkungan-larangan-hardcoded-absolute-path)
19. [Pemanfaatan Library yang Sudah Matang (Mature Libraries)](#19-pemanfaatan-library-yang-sudah-matang-mature-libraries--anti-reinventing-the-wheel)

---

## 1. Larangan Fat Files (Anti-Fat Files Rule)

### Prinsip

Dilarang menumpuk banyak tanggung jawab (sub-view, modal, tabs, form fields, logic kalkulasi) dalam satu file raksasa (_fat file / monolithic file_).

### Aturan

- Jika sebuah file mulai menangani lebih dari satu domain atau memiliki bagian UI yang berdiri sendiri (misal: panel analisis, tab APK, canvas share card), bagian tersebut **wajib diekstrak** menjadi file komponen terpisah.
- `page.tsx` pada Next.js App Router harus ramping: hanya bertugas merender layout utama dan mendelegasikan ke komponen presentasi fitur.

```tsx
// ❌ HINDARI: Menyatukan logika scan URL, upload APK, dekompilasi, dan share card dalam 1 file 400+ baris
export default function Page() {
  return <div>{/* Ratusan baris kode scanner, viewer, dan parser */}</div>;
}

// ✅ REKOMENDASI: Pecah masing-masing komponen ke folder terkait
// app/_components/url-scanner.tsx
// app/_components/qr-helper.tsx
// app/_components/apk-uploader.tsx
export default function Page() {
  return (
    <main>
      <UrlScanner />
      <QrHelper />
      <ApkUploader />
    </main>
  );
}
```

---

## 2. Reusabilitas Kode (Reusable Components & Hooks)

### Prinsip

Terapkan prinsip **DRY (Don't Repeat Yourself)** secara bijak. Komponen, hook, atau fungsi pembantu yang digunakan di lebih dari satu tempat harus dirancang modular.

### Aturan

- **Reusable Component:** Harus menerima `className` opsional yang digabungkan via `cn()`, mendukung `children`, dan menerima props varian yang fleksibel.
- **Custom Hook:** Logika perilaku interaktif berulang (misal: state upload file, timer sesi sandbox, toggle mode human/geek) harus diisolasi ke dalam custom hook di folder `_hooks/` atau `lib/hooks/`.
- **Shared Helpers:** Logika manipulasi data (defang URL, formatting ukuran byte, sanitasi regex) ditempatkan di `lib/utils.ts`.

---

## 3. Pemisahan Logic dari UI (Separation of Concerns)

### Prinsip

Komponen UI bertanggung jawab untuk **rendering visual dan styling** (JSX + Tailwind). Logika analisis, polling sesi sandbox, validasi, dan komunikasi API dipisahkan ke dalam **Custom Hook** atau **Service Layer**.

---

## 4. Batas Ukuran File (LOC Threshold ~200–250 Baris)

### Prinsip

File yang terlalu panjang sulit dibaca, memicu konflik merge, dan meningkatkan risiko regresi.

### Aturan

- **Batas Maksimal:** ~200–250 baris kode (LOC) untuk file komponen UI (`.tsx`).
- Jika file mendekati atau melebihi 250 baris, lakukan audit refaktor:
  1. Ekstrak kartu UI atau sub-view ke `_components/`.
  2. Ekstrak state/handler ke `_hooks/`.
  3. Ekstrak konstanta/schema ke `_utils/` atau `lib/validations/`.

---

## 5. Standarisasi Struktur Folder & Pola Co-location Komponen

Guardian Lab menerapkan arsitektur direktori hibrida yang memisahkan dependensi global dengan dependensi lokal fitur (_feature co-location_) secara tegas.

### A. Matriks Keputusan: Kapan Menempatkan Komponen?

Gunakan panduan keputusan berikut untuk menentukan lokasi file komponen baru:

| Lokasi Direktori           | Kategori Komponen            | Kriteria Penempatan                                                                                                                | Contoh Komponen                                                                  |
| :------------------------- | :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| **`components/ui/`**       | **Primitif UI (Atomic)**     | Komponen murni desain/primitif (shadcn UI). **Dilarang keras** memuat business logic, API call, atau domain spesifik Guardian Lab. | `button.tsx`, `dialog.tsx`, `input.tsx`, `skeleton.tsx`, `tabs.tsx`              |
| **`components/shared/`**   | **Global Reusable**          | Komponen bisnis/antarmuka yang digunakan oleh **$\ge 2$ rute atau halaman berbeda**.                                               | `confirm-dialog.tsx`, `navbar.tsx`, `risk-badge.tsx`, `user-avatar.tsx`          |
| **`app/.../_components/`** | **Lokal Fitur (Co-located)** | Komponen spesifik yang **HANYA digunakan oleh satu rute/halaman tersebut**.                                                        | `browser-frame.tsx` (hanya di Web Sandbox), `streak-card.tsx` (hanya di Academy) |

> [!TIP]
> **Aturan Promosi Komponen (_Component Promotion Rule_):**  
> Selalu mulai dengan menempatkan komponen baru di direktori lokal fitur (`app/<rute>/_components/`). Begitu komponen tersebut dibutuhkan oleh rute lain di kemudian hari, **promosikan** file tersebut ke `components/shared/` dan perbarui path import-nya.

### B. Mengapa Menggunakan Prefix Underscore (`_components`)?

Dalam Next.js App Router, folder dengan awalan tanda garis bawah (seperti `_components/`, `_hooks/`, atau `_utils/`) secara otomatis diperlakukan sebagai **Private Folders**. Next.js menjamin bahwa berkas di dalam folder ini **tidak akan pernah dianggap sebagai rute URL publik**, sehingga aman untuk pengelompokan logic internal.

### C. Gambaran Struktur Direktori Proyek

```text
guardian-lab/
├── app/                                 # Next.js App Router (Pages, Layouts, Route Handlers)
│   ├── layout.tsx                       # Root layout (Toaster, Fonts, Global Providers)
│   ├── page.tsx                         # Landing Dashboard (Modul 1)
│   ├── _components/                     # Komponen spesifik landing page (Tab URL, QR, APK)
│   ├── sandbox/
│   │   └── web/
│   │       ├── page.tsx                 # Rute Browser Sandbox (Modul 3)
│   │       ├── loading.tsx              # Skeleton loading rute
│   │       ├── _components/             # Komponen lokal: browser-frame.tsx, viewport-controls.tsx
│   │       └── _hooks/                  # Custom hooks lokal: use-sandbox-session.ts
│   ├── academy/
│   │       ├── page.tsx                 # Rute Guardian Academy Gamifikasi (Modul 8)
│   │       └── _components/             # Komponen lokal: quiz-card.tsx, exp-progress.tsx
│   └── api/                             # Internal Route Handlers (analyze-url, analyze-apk, session)
│
├── components/                          # Komponen Global Lintas Rute
│   ├── ui/                              # Primitif shadcn UI murni (button, dialog, tabs)
│   └── shared/                          # Komponen global aplikasi (confirm-dialog, navbar, footer)
│
├── lib/                                 # Fondasi & Utilitas Bisnis Terpusat
│   ├── routes.ts                        # Sentralisasi seluruh rute (Zero Hardcoded Routes)
│   ├── utils.ts                         # Helper styling cn() dan formatting string
│   └── validations/                     # Skema validasi Zod terpusat (url, apk, auth, quiz)
│
├── docker/                              # Infrastruktur Multi-Container Docker
│   ├── app/Dockerfile                   # Fullstack Next.js production runner
│   └── docker-compose.yml               # Orkestrasi container app & sandboxes
│
└── ai-agent-docs/                       # Dokumentasi resmi & panduan AI agent
```

---

## 6. Kebijakan Zero-any & Strict Type Safety

### Prinsip

TypeScript harus memberikan jaminan tipe data saat kompilasi. Penggunaan `any` menghilangkan jaminan tersebut dan menyembunyikan runtime bug.

### Aturan

- **Dilarang Keras** menggunakan tipe `any` (`// @ts-ignore` atau `as any`).
- Jika tipe data belum pasti (misal: parsing JSON hasil API LLM atau WebSocket payload), gunakan `unknown` lalu validasi menggunakan skema Zod (_type narrowing_).

---

## 7. Sentralisasi Validasi Data (Zod Schema Isolation)

### Prinsip

Validasi input tidak boleh dilakukan secara ad-hoc atau tersebar manual.

### Aturan

- Seluruh skema validasi wajib dipusatkan di dalam direktori `lib/validations/` (contoh: `lib/validations/url.ts`, `lib/validations/deepseek-response.ts`).
- Manfaatkan inferensi tipe otomatis:
  ```ts
  export const urlScanSchema = z.object({
    url: z.string().url("Format URL tidak valid"),
  });
  export type UrlScanInput = z.infer<typeof urlScanSchema>;
  ```

---

## 8. Clean Server-to-Client Boundary (RSC vs RCC)

- **Default ke Server Component:** Komponen adalah Server Component kecuali jika secara eksplisit membutuhkan interaktivitas pengguna (`useState`, `useEffect`, `onClick`, WebSocket/VNC stream).
- **Letak Direktif `"use client"`:** Tempatkan direktif `"use client"` sedalam mungkin di pohon komponen (_leaf components_), bukan di level halaman teratas jika tidak diperlukan.

---

## 9. Standarisasi Penanganan Error & User Feedback

- **Toast Feedback:** Setiap mutasi atau aksi (unggah file, salin tautan, unduh share card) wajib memberikan feedback interaktif via `toast.success("...")` atau `toast.error("...")` dari library Sonner.
- **Larangan Empty Catch:** Dilarang membuat blok `catch (error) {}` kosong yang menelan kesalahan tanpa notifikasi/logging.

---

## 10. Disiplin Styling Tailwind & Formatter Prettier

- **Class Merging via `cn(...)`:** Selalu gunakan fungsi `cn(...)` dari `lib/utils.ts` saat menggabungkan kelas Tailwind kondisional.
- **Formatter Prettier & Linter Biome:** Repositori menggunakan Prettier (`bun run format`) dengan plugin `prettier-plugin-tailwindcss` untuk merapikan kode dan mengurutkan utility classes Tailwind, serta Biome (`bun run lint`) untuk linting dan pengorganisasian import secara cepat.
- **Dilarang Inline Style:** Hindari atribut `style={{ ... }}` kecuali untuk properti dinamis tak terbatas (seperti persentase streaming viewport).

---

## 11. Efisiensi State & Eliminasi Redundant useEffect

- **Hitung Langsung (Derived State):** Jangan gunakan `useEffect` untuk memperbarui state saat prop/state lain berubah. Hitung langsung nilai tersebut di badan render fungsi atau gunakan `useMemo`.
- **Gunakan `useTransition`:** Manfaatkan React 19 `useTransition()` untuk mengelola status mutasi asinkron dan tombol loading (`pending`).

---

## 12. Konvensi Penamaan Terstandarisasi

| Kategori              | Konvensi                   | Contoh                                |
| :-------------------- | :------------------------- | :------------------------------------ |
| **File & Folder**     | `kebab-case`               | `browser-frame.tsx`, `use-sandbox.ts` |
| **Komponen React**    | `PascalCase`               | `BrowserFrame`, `GuardianCard`        |
| **Interface & Type**  | `PascalCase`               | `AnalysisResult`, `DeepSeekResponse`  |
| **Custom Hooks**      | `camelCase` (awalan `use`) | `useSandboxSession`, `useApkUpload`   |
| **Utility Functions** | `camelCase`                | `defangUrl`, `formatFileSize`         |
| **Konstanta & Enum**  | `UPPER_SNAKE_CASE`         | `APP_ROUTES`, `RISK_LEVEL`            |

---

## 13. Sentralisasi Rute & Anti-Hardcoded Navigation

Dilarang keras menulis path URL / rute secara manual (_hardcoded string literal_) pada link (`<Link href="...">`), tombol, atau pemanggilan `fetch()`. Seluruh rute wajib diimpor secara terpusat dari konstanta `lib/routes.ts`. Panduan lengkap dan contoh builder rute tersedia di [routes-and-navigation.md](./routes-and-navigation.md).

---

## 14. Sinkronisasi State ke URL Parameters

Seluruh state interaktif yang mengubah filter pencarian, navigasi tab, atau mode tampilan (`?tab=`, `?mode=human|geek`, `?target=`) wajib direfleksikan ke dalam URL query parameters (_deep-linking_). Pedoman dan implementasi detail tersedia di [ai-guidelines.md](./ai-guidelines.md#5-sinkronisasi-state-antarmuka-ke-url-parameters-shareable-deep-linking).

---

## 15. Standar Penanganan 4 UI States & Form Input Hygiene

Seluruh komponen data wajib menangani 4 kondisi antarmuka secara komprehensif (**Loading Skeleton**, **Empty State + CTA**, **Error State + Retry**, dan **Large Dataset**), serta menerapkan placeholder bernilai nyata kontekstual, tanda bintang merah (`*`) untuk field required, dan label `(Opsional)`. Rincian lengkap tersedia di [ai-guidelines.md](./ai-guidelines.md#6-penanganan-4-kondisi-antarmuka-the-4-ui-states-rule).

---

## 16. Integritas Pengetesan & Sinkronisasi Test Suite

Setiap penambahan fitur atau perbaikan bug wajib disertai dengan pengetesan otomatis menggunakan runner `bun test`. Pastikan seluruh unit test dan UI test lulus 100% sebelum kode dianggap selesai. Checklist pemetaan test tersedia di [agent-workflow.md](./agent-workflow.md#3-pemetaan--pembaruan-test-test-mapping--maintenance).

---

## 17. Disiplin Git Branching Model

Dilarang keras melakukan commit langsung ke branch `main`. Selalu buat branch fitur/bugfix baru dari `origin/main` (`feat/*`, `fix/*`), lakukan squash and merge melalui Pull Request ke `main`. Pedoman eksekusi git tersedia di [agent-workflow.md](./agent-workflow.md#1-git-branching-check-non-main-branch).

---

## 18. Portabilitas Lingkungan (Larangan Hardcoded Absolute Path)

Dilarang keras menyertakan URI atau path absolut mesin lokal (seperti `file:///home/...`, `C:\Users\...`, atau `/home/alfiang/...`) di dalam berkas kode sumber maupun dokumentasi yang di-commit ke repositori git. Selalu gunakan path relatif atau alias modul `@/...`.

---

## 19. Pemanfaatan Library yang Sudah Matang (Mature Libraries / Anti-Reinventing the Wheel)

### Prinsip

Hindari membuat ulang fungsionalitas kompleks dari nol (_don't reinvent the wheel_) jika di ekosistem open-source sudah tersedia library yang matang (_mature_), teruji, dan aktif dipelihara oleh komunitas.

### Aturan

- Sebelum menulis implementasi kustom (misal: pemindai/dekoder QR, parser, rendering HTML ke gambar/PNG, modal dialog, dsb.), pengembang dan AI Agent **wajib mengecek ketersediaan library mature**.
- Jika sudah ada library mature yang stabil, aman, dan kompatibel dengan stack proyek (Next.js 16, TypeScript, Bun), **silakan langsung gunakan library tersebut**.
- **Kriteria Pemilihan Library:**
  1. Populer, stabil, dan teruji di industri.
  2. Memiliki tipe TypeScript bawaan atau `@types/*`.
  3. Berlisensi permisif (MIT, Apache 2.0, BSD).
  4. Ukuran bundle proporsional dan ramah pohon dependensi.
