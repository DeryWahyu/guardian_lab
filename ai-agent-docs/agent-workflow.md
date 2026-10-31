# Alur Kerja AI Agent (Agent Workflow Checklist) — Guardian Lab

> **Dokumen:** `ai-agent-docs/agent-workflow.md`  
> **Fokus Utama:** Checklist 11 Langkah Eksekusi Tugas, Disiplin Branching, Standar UI, dan Pembersihan Dead Code  
> **Audience:** AI Coding Agent & Pengembang Fullstack

---

## Checklist Eksekusi Tugas

### [ ] 1. Git Branching Check (Non-Main Branch)

- Pastikan **TIDAK** berada langsung di branch `main` saat melakukan commit.
- Dicabangkan dari `origin/main`:
  ```bash
  git fetch origin
  git checkout -b <type>/<nama-fitur> origin/main
  ```
- Gunakan prefix standar: `feat/...`, `fix/...`, `refactor/...`, `docs/...`, atau `chore/...`.

### [ ] 2. Kode & Perubahan Utama Selesai

- Cek ketersediaan library matang (_mature libraries_) sebelum membangun fitur kompleks dari nol (utamakan penggunaan mature library yang teruji daripada _reinventing the wheel_).
- Fitur/perbaikan telah diimplementasikan sesuai kebutuhan pengguna dan spesifikasi sistem di [modules-specification.md](./modules-specification.md).
- Menjaga integritas komentar dan kode yang tidak terkait.

### [ ] 3. Pemetaan & Pembaruan Test (Test Mapping & Maintenance)

- Telah mencari file test terkait (`find . -name "*.test.*"` atau grep).
- Memperbarui skenario test yang ada jika kontrak logika/fungsi berubah.
- Menambahkan skenario test baru untuk bugfix (_regression test_) atau fitur baru.
- Menjalankan `bun test <file.test.ts>` dan memastikan 100% test lulus.

### [ ] 4. Kualitas Antarmuka (UI/UX Standards)

- Memverifikasi ekspor SEO metadata (`title`, `description`) pada halaman rute Next.js.
- Memverifikasi integritas rute menggunakan konstanta `lib/routes.ts` (Zero Hardcoded Routes). Lihat [routes-and-navigation.md](./routes-and-navigation.md).
- Memverifikasi penanganan 4 kondisi UI: Loading Skeleton, Empty State (ikon + pesan + CTA), Error State (kartu error + retry), dan Large Dataset / Detailed Report.
- Memverifikasi standarisasi form: Setiap input memiliki placeholder kontekstual, label required bertanda bintang merah (`*`), dan label optional bertuliskan `(Opsional)`.
- Memverifikasi sinkronisasi parameter URL (`?tab=`, `?q=`, `?mode=human|geek`).
- Memverifikasi pelarangan `window.confirm` / `window.alert` dan penggunaan modal `<ConfirmDialog>` serta notifikasi toast `sonner`.
- Memverifikasi kepatuhan mode tampilan: **Mode Bahasa Manusia** (default) vs **Mode Teknis (Geek View)**. Lihat [ai-guidelines.md](./ai-guidelines.md).

### [ ] 5. Kepatuhan Standar Kualitas Kode (Code Quality Audit)

- Mematuhi prinsip di [code-quality.md](./code-quality.md).
- Tidak ada file bengkak (_fat file_ >200–250 baris) yang belum diekstrak ke sub-komponen/hooks.
- Logika state/mutasi/stream telah dipisahkan dari tampilan UI (menggunakan custom hooks).
- Tidak ada penggunaan tipe `any` (kebijakan zero-any dipatuhi).
- Validasi data form/payload dipusatkan di `lib/validations/` menggunakan Zod.
- Seluruh link, tombol navigasi, redirect, dan pemanggilan API mengimpor konstanta dari `lib/routes.ts` (Zero Hardcoded Routes).
- Tidak ada URI/path absolut mesin lokal (`file:///...`, `/home/...`) di dalam file kode maupun dokumentasi git (Portability Check).

### [ ] 6. Pembersihan Kode & File Usang (Dead Code & Cleanup)

- File/folder lama yang digantikan telah dihapus.
- File scratch/temporer yang dibuat selama investigasi/pengujian telah dibersihkan.
- Import yang tidak lagi digunakan (_unused imports_) telah dihapus.

### [ ] 7. Sinkronisasi Dokumentasi Proyek (Docs Sync)

- Memeriksa folder `ai-agent-docs/` dan memperbarui dokumentasi terkait jika terjadi perubahan arsitektur, API, atau alur kerja.
- Jika prompt telah diimplementasikan ke kode fitur, pastikan prompt teks di [api-and-prompts.md](./api-and-prompts.md) dibersihkan untuk menghindari redundansi.

### [ ] 8. Keamanan & Environment Variables

- **Zero Real PII:** Pastikan tidak ada data kredensial asli yang diminta atau disimpan.
- Jika ada env var baru (misal: `DEEPSEEK_API_KEY`, `NEXT_PUBLIC_APP_URL`), tambahkan ke `.env.example` beserta deskripsi singkatnya.
- Tidak menimpa atau membocorkan isi kredensial di `.env`.

### [ ] 9. Sinkronisasi Deployment & Docker (Infrastructure Sync)

- Jika ada penambahan dependensi OS, port, atau volume persistensi (misal folder `/downloads` sandbox), perbarui berkas terkait di folder `docker/`.
- Perbarui dan sinkronkan panduan [deployment.md](./deployment.md).

### [ ] 10. Verifikasi Linter, Formatter & Typecheck (Wajib)

- Jalankan `bun run format` (Prettier + `prettier-plugin-tailwindcss`) untuk merapikan kode & Tailwind styling.
- Jalankan `bunx tsc --noEmit` untuk memastikan 0 error tipe TypeScript.
- Jalankan `bun run lint` (Biome check) untuk memastikan 0 error/warning linter.
- Jalankan `bun test` untuk memastikan 100% unit tests & UI tests lulus.

### [ ] 11. Pemeriksaan Integritas Git & PR Workflow

- Jalankan `git status` untuk meninjau status direktori kerja (tidak ada file sampah _untracked_).
- Lakukan commit pada branch kerja (BUKAN di `main`).
- Buka Pull Request (PR) ke `main`.
- Terapkan strategi **Squash and Merge** saat penggabungan.

---

## Protokol Pembersihan Berkas & Dead Code

Ketika melakukan refaktor, perampingan fitur, atau migrasi kode:

1. **Identifikasi Ketergantungan:** Cari seluruh referensi file/komponen yang akan dihapus menggunakan perintah `grep` atau file search.
2. **Hapus File Utama:** Hapus file komponen, rute, hook, atau utilitas yang sudah tidak digunakan.
3. **Bersihkan File Pendukung:** Hapus folder direktori kosong jika seluruh file di dalamnya sudah dihapus.
4. **Hapus File Uji Coba:** Hapus file scratch (misal `temp_test.js`, file output tes lokal) yang dibuat selama proses pengerjaan.
