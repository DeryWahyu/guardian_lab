<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Guardian Lab — AI Agent Workspace Context & Guidelines

> **Project Name:** Guardian Lab (`guardian-lab`)  
> **Event / Context:** _MIT-Week 2026: Guardians of the Digital Space – Empowering Today's Generation Toward a Safer Cyber Ecosystem_  
> **Core Mission:** Platform Sandbox Anti-Phishing & Bedah APK yang mengintegrasikan tiga pilar: **Recognize (Mengenali)**, **Protect/Sandbox (Melindungi)**, dan **Act (Bertindak)**.

---

## 🧭 Documentation Routing for AI Agents

Dokumentasi sistem proyek telah dipecah secara modular di dalam folder [ai-agent-docs/](ai-agent-docs/). **Sebelum menulis atau memodifikasi kode**, AI Agent WAJIB membaca file dokumentasi yang relevan sesuai lingkup tugasnya:

| Lingkup Tugas yang Dikerjakan                                             | File Dokumentasi yang Wajib Dirujuk                                                    |
| :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------- |
| **Checklist Alur Kerja & Eksekusi AI Agent**                              | [ai-agent-docs/agent-workflow.md](ai-agent-docs/agent-workflow.md)                     |
| **Standar UI/UX, Loading Skeleton, & Bahasa**                             | [ai-agent-docs/ai-guidelines.md](ai-agent-docs/ai-guidelines.md)                       |
| **Standar Kualitas Kode, Anti-Fat Files, & Biome**                        | [ai-agent-docs/code-quality.md](ai-agent-docs/code-quality.md)                         |
| **Arsitektur Deployment Docker (Multi-Container)**                        | [ai-agent-docs/deployment.md](ai-agent-docs/deployment.md)                             |
| **Sentralisasi Rute `lib/routes.ts`**                                     | [ai-agent-docs/routes-and-navigation.md](ai-agent-docs/routes-and-navigation.md)       |
| **Peta Dokumen & Ringkasan Umum**                                         | [ai-agent-docs/index.md](ai-agent-docs/index.md)                                       |
| **UI Copywriting, Tooltip, Edukasi, Kasus Viral Indonesia, Juknis**       | [ai-agent-docs/context-and-case-studies.md](ai-agent-docs/context-and-case-studies.md) |
| **Arsitektur Sistem, Docker Sandbox (Chromium/Redroid), & Anti-Loophole** | [ai-agent-docs/system-architecture.md](ai-agent-docs/system-architecture.md)           |
| **Prompt DeepSeek API, Kontrak JSON Schema, & PII Regex Scrubber**        | [ai-agent-docs/api-and-prompts.md](ai-agent-docs/api-and-prompts.md)                   |
| **Implementasi Fitur Modul (Input URL/QR Helper, Web Sandbox, APK, Act)** | [ai-agent-docs/modules-specification.md](ai-agent-docs/modules-specification.md)       |

---

## 🛡️ Core Rules & Guardrails untuk AI Coding Agent

1. **Zero Real PII (Data Pribadi Korban):**
   - Dilarang keras meminta, menyimpan, atau mengirimkan kredensial asli pengguna.
   - Selalu lewatkan teks analisis ke modul _PII Scrubber_ sebelum dikirim ke DeepSeek API.
2. **Dual-Mode UI/UX (Mode Manusia vs Geek View):**
   - Output analisis (baik URL maupun file APK) harus selalu memiliki toggle:
     - **Mode Bahasa Manusia (Default):** Penjelasan ramah anak muda, analogi sederhana, dan kartu _"Kedok Penipu Terbongkar"_.
     - **Mode Teknis (Geek View):** Rincian izin Android, potongan kode decompiled `jadx`, dan endpoint C2 bot Telegram.
3. **Upload & Input Pengguna (Tanpa Tombol Shortcut / Preset di Web):**
   - Website menerima input langsung: input URL, Upload/Scan gambar QR (sebagai helper konversi gambar QR menjadi teks/URL agar user tidak repot scan dan copy-paste manual), serta Upload file `.apk` secara manual oleh pengguna (drag-and-drop / file picker).
   - **Tidak ada tombol shortcut preset uji cepat di website.** Sampel file malware untuk pengujian demo/juri akan disiapkan dan dikirimkan oleh tim secara terpisah/eksternal untuk diunggah manual ke website.
4. **Fungsi Web Sandbox (Bukan untuk Belajar, Tapi Proteksi Perangkat):**
   - _Browser-in-Browser Sandbox_ (Chromium terisolasi) digunakan murni agar pengguna dapat membuka tautan yang terindikasi phishing/berbahaya tanpa rasa khawatir perangkat lokal mereka terinfeksi malware.
   - Eksekusi berjalan di kontainer terisolasi (Chromium KasmVNC / Redroid) dengan masa aktif terbatasi (180 detik) dan pembersihan otomatis (_auto-destroy_).
5. **Cakupan Pilar Act (Tanpa Pelaporan Portal Pemerintah):**
   - Pilar _Act_ berfokus pada **Guardian Share Card** (generator gambar peringatan otomatis yang siap dibagikan ke WhatsApp grup keluarga/teman).
   - **Tidak perlu ada fitur panduan darurat atau generator draf laporan ke portal resmi pemerintah.**
6. **Standar Kode & Tooling:**
   - **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS v4). Gunakan `biome` (`bun run lint`) dan Prettier (`bun run format`) untuk menjaga kebersihan dan kerapian kode.
   - Patuhi aturan dokumentasi Next.js pada `node_modules/next/dist/docs/`.
7. **Pemanfaatan Mature Library (Anti-Reinventing the Wheel):**
   - Jika ingin membangun suatu fitur dan telah tersedia library _mature_ yang teruji, aman, dan kompatibel di ekosistem, **utamakan langsung menggunakan library tersebut** daripada membuat implementasi kompleks dari nol.
