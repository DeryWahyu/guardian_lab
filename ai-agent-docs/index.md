# Dokumentasi Sistem — Guardian Lab

> **Dokumen:** `ai-agent-docs/index.md`  
> **Fokus Utama:** Master Index, Peta Navigasi Dokumentasi, dan Tiga Pilar Inti Sistem  
> **Audience:** AI Coding Agent & Pengembang Fullstack

---

Selamat datang di repositori dokumentasi teknis **Guardian Lab** (_Platform Sandbox Anti-Phishing & Bedah APK_), dibangun untuk kompetisi **MIT-Week 2026: Guardians of the Digital Space – Empowering Today's Generation Toward a Safer Cyber Ecosystem**.

Dokumentasi ini dirancang khusus secara modular sebagai _Master Context & System Specification_ bagi AI Coding Agent dan pengembang untuk membangun sistem secara bertahap, terisolasi, dan presisi.

---

## 🧭 Peta Navigasi Dokumentasi

Dokumentasi dikelompokkan ke dalam tiga kategori utama:

### 1. Standar Rekayasa & Alur Kerja AI (Engineering & Workflows)

| Dokumen                                                    | Topik & Cakupan Utama                                                                                        | Kapan Harus Dirujuk?                                                                     |
| :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| **[agent-workflow.md](./agent-workflow.md)**               | Checklist 11 langkah eksekusi tugas AI, branching git, audit test, Biome check, dan pembersihan _dead code_. | Wajib dijalankan setiap kali memulai atau mengakhiri pengerjaan fitur/bugfix.            |
| **[ai-guidelines.md](./ai-guidelines.md)**                 | Standar UI/UX, cursor pointer, larangan alert/confirm, skeleton loading, dual-mode UI, dan URL deep-linking. | Saat mengimplementasikan komponen visual, form, dan tata letak halaman.                  |
| **[code-quality.md](./code-quality.md)**                   | 19 Prinsip kualitas kode (Anti-Fat Files <250 baris, zero-any, Zod validation, RSC/RCC boundaries, Biome).   | Saat menyusun arsitektur kode, custom hooks, dan validasi data.                          |
| **[routes-and-navigation.md](./routes-and-navigation.md)** | Sentralisasi rute `lib/routes.ts` (Zero Hardcoded Routes), konstanta rute publik, dan endpoint API.          | Saat membuat rute baru, link navigasi `<Link>`, pengalihan `redirect()`, atau `fetch()`. |
| **[deployment.md](./deployment.md)**                       | Arsitektur deployment multi-container Docker (Fullstack Next.js, Chromium Sandbox, Redroid Emulator).        | Saat memodifikasi infrastruktur Docker, port, volume, atau variabel lingkungan.          |

### 2. Spesifikasi Sistem & Modul Fitur (System & Modules)

| Dokumen                                                    | Topik & Cakupan Utama                                                                                                                                            | Kapan Harus Dirujuk?                                                                       |
| :--------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| **[system-architecture.md](./system-architecture.md)**     | Alur pengguna _end-to-end_ (Tahap 1–5), arsitektur fullstack, dan pengaman teknis (_Anti-Loophole Safeguards_).                                                  | Saat merancang alur sistem terpadu (Next.js Fullstack $\leftrightarrow$ Docker Sandboxes). |
| **[modules-specification.md](./modules-specification.md)** | Rincian implementasi 9 modul fitur: Landing, AI URL/QR, Web Sandbox, APK X-Ray, Share Card, RBAC Auth, Forensic History, Gamifikasi Academy, & Community Replay. | Saat menulis kode logika dan antarmuka untuk modul fitur tertentu.                         |
| **[api-and-prompts.md](./api-and-prompts.md)**             | Kontrak JSON DeepSeek API, system prompt, aturan redundansi prompt, regex _PII Scrubber_, dan endpoint API.                                                      | Saat mengintegrasikan LLM DeepSeek dan membangun endpoint API Route Handlers.              |

### 3. Konteks Domain & Kasus Nyata (Domain Knowledge)

| Dokumen                                                          | Topik & Cakupan Utama                                                                                             | Kapan Harus Dirujuk?                                                                     |
| :--------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| **[context-and-case-studies.md](./context-and-case-studies.md)** | Kepatuhan juknis MIT-Week 2026, data statistik resmi OJK/IASC 2026, kasus viral Quishing & modus APK pencuri OTP. | Bahan referensi _copywriting_ antarmuka, _tooltip_ edukasi, dan dokumentasi `README.md`. |

---

## 🛡️ Tiga Pilar Inti Sistem

1. **Recognize (Mengenali):**
   - Deteksi garis depan menggunakan model AI kustom untuk analisis leksikal dan visual URL.
   - Modul dekoder QR (_helper_) untuk membaca string/URL dari gambar QR secara instan tanpa perlu repot scan di ponsel dan ketik/paste manual.
   - _Reverse engineering_ otomatis file `.apk` yang diunggah (`jadx`, `apktool`) + DeepSeek LLM untuk membedah _permissions_ dan kode jahat (seperti bot Telegram penampung data curian).
2. **Protect / Sandbox (Melindungi):**
   - _Browser-in-Browser Sandbox_ (Mode Desktop & Layar HP Android) terisolasi di sisi server (Chromium Kiosk via KasmVNC/WebRTC).
   - Berfungsi murni agar pengguna dapat membuka tautan yang terindikasi phishing/berbahaya secara langsung tanpa rasa khawatir perangkat lokal mereka terinfeksi malware.
   - _Interactive Android Emulator_ (`Redroid`) untuk menguji aplikasi `.apk` secara visual di lingkungan aman.
3. **Act (Bertindak):**
   - _Guardian Share Card_: Generator infografis 1-klik berisi tangkapan layar ber-watermark aman dan rangkuman 3 poin bahaya utama untuk disebarkan sebagai peringatan dini ke grup WhatsApp keluarga atau komunitas.

---

## 🔒 Kebijakan Keamanan & Privasi Mutlak

- **Zero Real PII:** Dilarang keras meminta atau menyimpan kredensial asli pengguna. Sensor data pribadi sebelum dikirim ke LLM.
- **Transparansi AI:** Tampilkan _badge_ transparansi analisis (Model AI Kustom + DeepSeek API).
- **Isolated Destruction:** Semua sesi kontainer sandbox dibatasi waktu (_session timeout_ 180 detik) dan otomatis dibersihkan (_auto-destroy_).
