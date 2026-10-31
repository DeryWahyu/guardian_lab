# Spesifikasi Detail Modul Aplikasi — Guardian Lab

> **Dokumen:** `ai-agent-docs/modules-specification.md`  
> **Fokus Utama:** Spesifikasi Lengkap Modul Fitur, RBAC (Admin & User), Proteksi Riwayat Forensik, Gamifikasi Kuis Edukasi (Duolingo Style), dan Community Forensic Replay  
> **Audience:** AI Coding Agent & Pengembang Fullstack Next.js

---

> [!IMPORTANT]
> **Aturan Redundansi & Siklus Hidup Dokumen Spesifikasi:**
> Begitu suatu fitur atau sub-modul di bawah ini telah selesai diimplementasikan ke dalam kode (lengkap dengan UI, logika, skema Zod, dan pengujian `bun test`-nya), **HAPUS entri fitur tersebut dari dokumen ini**.
> Hal ini bertujuan agar kode repositori menjadi _single source of truth_, mencegah redundansi, dan menjaga dokumen ini tetap fokus sebagai _backlog_ fitur yang belum diimplementasikan.

---

## 1. Modul 1: Landing Dashboard & Public Gateway (`/`)

- **Tujuan:** Gerbang utama interaksi pengguna, pengenalan platform, dan edukasi publik sebelum masuk ke area investigasi aman.
- **Akses Pengguna:** **Publik (Tamu)** dapat melihat overview, leaderboard publik, dan contoh edukasi. Namun saat pengguna menekan tombol analisis atau mengirimkan input, sistem mewajibkan login/register agar seluruh riwayat analisis tersimpan secara detail ke akun pengguna.
- **Fitur Utama:**
  1. **3 Tab Input Analisis (Auth-Gated):**
     - **Cek URL / Domain Mencurigakan:** Input teks langsung untuk tautan phishing.
     - **Scan / Upload Gambar QR Code:** Helper utilitas yang mengekstrak teks/URL dari gambar kode QR secara otomatis (`jsqr` / `@zxing/library`).
     - **Bongkar File `.apk` (Manual Upload):** Area drag-and-drop / file picker untuk mengunggah file installer Android yang mencurigakan.
  2. **Intersepsi Autentikasi Pengguna:**
     - Jika pengguna belum login, aksi klik "Mulai Analisis" memunculkan dialog/redirect ke halaman Login dengan parameter `?redirect=/` sehingga setelah login pengguna langsung melanjutkan analisis.
  3. **Privacy & Security Control:**
     - Toggle **Client-Side PII Masking** aktif secara default.
     - Badge transparansi: _"Powered by Custom AI + DeepSeek API (Data Anonim)"_.

---

## 2. Modul 2: Deteksi AI URL & QR Decoder Helper (`/api/analyze-url` & `/api/analyze-qr`)

- **Tujuan:** Melakukan inspeksi leksikal tautan serta membantu mengekstrak string/URL dari gambar kode QR secara instan.
- **Akses Pengguna:** **Khusus User Terautentikasi (`USER` & `ADMIN`)**.
- **Fitur Utama:**
  1. **Model AI Deteksi Phishing URL:**
     - Ekstraksi fitur leksikal: panjang URL, rasio karakter khusus, Shannon entropy, TLD berisiko tinggi (`.xyz`, `.top`, `.click`, `.buzz`), dan kemiripan nama bank/brand Indonesia (_typosquatting_ seperti `bca-klik[.]xyz`).
     - Output skor risiko (0–100) dan _Explainable Red Flags_.
  2. **QR Image Decoder Helper:**
     - Menggunakan modul decoder kode QR berbasis library JavaScript/TypeScript mature (`jsqr` / `@zxing/library`) untuk mendeteksi dan membaca _payload_ gambar QR secara instan.
  3. **Penyimpanan Otomatis ke Riwayat:**
     - Hasil analisis URL/QR otomatis disimpan ke modul **Riwayat Detail Forensik** pengguna.

---

## 3. Modul 3: Browser-in-Browser Sandbox (`/sandbox/web`)

- **Tujuan:** **Proteksi Perangkat Pengguna.** Menyediakan lingkungan browser cloud terisolasi agar pengguna dapat membuka situs phishing tanpa khawatir perangkat lokal terinfeksi malware.
- **Akses Pengguna:** **Khusus User Terautentikasi (`USER` & `ADMIN`)**.
- **Fitur Utama:**
  1. **Isolated Streaming Session:**
     - Menampilkan stream Chromium Kiosk terisolasi via WebRTC / KasmVNC di dalam iframe.
     - Sesi dibatasi waktu (_session timeout_ 180 detik) dan otomatis dihancurkan (_auto-destroy_).
  2. **Kontrol Tampilan Mobile:**
     - Switch Desktop / Mobile Viewport (_Mobile User-Agent Spoofing_) untuk membuka trik phishing mobile.
  3. **Inotify Download Watcher (Auto-Intercept APK):**
     - Memonitor direktori `/downloads` kontainer browser sandbox. Jika mendeteksi unduhan file `.apk`, modal interaktif karantina otomatis muncul dengan tautan ke Modul 4.
  4. **Perekaman Sesi Investigasi:**
     - URL target, tangkapan layar thumbnail, dan status sesi dicatat ke riwayat pengguna.

---

## 4. Modul 4: APK X-Ray Reverse Engineering & Emulator (`/api/analyze-apk` & `/sandbox/android`)

- **Tujuan:** Membedah file `.apk` secara statis dan menyediakan HP virtual interaktif untuk pengujian dinamis.
- **Akses Pengguna:** **Khusus User Terautentikasi (`USER` & `ADMIN`)**.
- **Fitur Utama:**
  1. **Jalur Cepat (Static X-Ray via DeepSeek LLM):**
     - Server Handler Next.js mengekstrak `AndroidManifest.xml` dan strings via CLI `jadx` / `apktool`.
     - Regex Scanner mencari hardcoded Telegram Bot Token (`api.telegram.org/bot...`), chat ID, URL C2, dan nomor WhatsApp pelaku.
     - DeepSeek API menyajikan hasil dalam **Mode Bahasa Manusia** (analogi sederhana) dan **Mode Teknis (Geek View)**.
  2. **Jalur Interaktif (Android Emulator Sandbox):**
     - Menjalankan kontainer `Redroid` via noVNC / WebSocket untuk pengujian interaktif yang aman.
  3. **Penyimpanan Riwayat Dekompilasi Lengkap:**
     - Metadata manifest, daftar izin Android berbahaya, temuan bot Telegram, dan respon AI tersimpan di riwayat pengguna.

---

## 5. Modul 5: Pilar Act — Guardian Share Card (`/act`)

- **Tujuan:** Generator infografis peringatan WhatsApp 1-klik untuk perlindungan keluarga dan komunitas.
- **Akses Pengguna:** **Khusus User Terautentikasi (`USER` & `ADMIN`)**.
- **Fitur Utama:**
  1. **Guardian Share Card Generator:**
     - Menggabungkan tangkapan layar ber-watermark aman (_"AWAS MODUS PENIPUAN"_).
     - URL target otomatis di-_defang_ (misal: `dana-kaget[.]xyz`).
     - Memuat 3 poin ringkasan bahaya utama hasil analisis AI.
     - 1-klik unduh gambar format PNG via `html-to-image`.
  2. **Tombol Sumbang ke Komunitas:**
     - Opsi langsung menyumbangkan kartu analisis ini ke **Community Forensic Replay**.

---

## 6. Modul 6: Autentikasi Pengguna & Role-Based Access Control / RBAC (`/login`, `/register`)

- **Tujuan:** Mengelola identitas pengguna, sesi login aman, dan pembagian hak akses bertingkat.
- **Peran Pengguna (Roles):**
  1. **`ADMIN`:**
     - Mengatur dan mengelola seluruh konfigurasi website.
     - Mengelola CMS Kuis Interaktif (tambah, edit, hapus soal, tentukan kunci jawaban & bobot EXP).
     - Mengelola antrean moderasi temuan pengguna sebelum diterbitkan ke _Community Forensic Replay_.
     - Mengelola daftar pengguna dan audit log aktivitas sistem.
  2. **`USER`:**
     - Mengakses modul analisis (URL, QR, APK, Web Sandbox, Emulator, Share Card).
     - Menyimpan dan membuka kembali riwayat investigasi detail.
     - Mengikuti kuis interaktif gamifikasi (_Guardian Academy_) untuk mengumpulkan EXP, menaikkan level, menjaga streak harian, dan meraih lencana.
     - Mengakses dan memainkan studi kasus interaktif di _Community Forensic Replay_.
- **Fitur Utama:**
  1. Form Registrasi & Login dengan validasi Zod ketat.
  2. Session management aman berbasis cookie HTTP-Only.
  3. Next.js Middleware untuk proteksi rute (`/admin/*` hanya untuk role `ADMIN`, rute analisis & dashboard hanya untuk `USER` dan `ADMIN`).

---

## 7. Modul 7: Riwayat Detail Forensik Pengguna (`/history` & `/history/[id]`)

- **Tujuan:** Menyimpan seluruh rekam jejak investigasi pengguna secara detail sehingga dapat dibuka kembali kapan saja tanpa pemindaian ulang.
- **Akses Pengguna:** **Khusus User Terautentikasi (`USER` & `ADMIN`)**.
- **Fitur Utama:**
  1. **Daftar Riwayat Interaktif:**
     - Tabel/kartu riwayat dengan filter berdasarkan tipe (`URL`, `QR`, `APK`), tingkat risiko (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), dan rentang tanggal.
     - Pencarian cepat berdasarkan nama domain atau nama file APK.
  2. **Halaman Detail Riwayat (`/history/[id]`):**
     - Memuat snapshot hasil analisis lengkap: tanggal pemindaian, skor risiko, daftar Red Flags, ringkasan DeepSeek (Mode Manusia vs Geek View), dan daftar izin APK.
     - Tombol ekspor ulang _Guardian Share Card_ dari riwayat lama.
  3. **Opsi "Kontribusikan ke Komunitas":**
     - Tombol 1-klik untuk mendaftarkan investigasi ini ke antrean moderasi _Community Forensic Replay_.

---

## 8. Modul 8: Guardian Academy — Kuis Edukasi Gamifikasi Interaktif (`/academy` & `/admin/quizzes`)

- **Tujuan:** Melatih kepekaan dan insting deteksi ancaman siber pengguna melalui format gamifikasi interaktif ala "Duolingo".
- **Akses Pengguna:** `USER` (Pemain/Pelajar), `ADMIN` (Pengelola CMS Soal).
- **Fitur Pengalaman Pengguna (Gamifikasi Siswa / User):**
  1. **Sistem EXP & Leveling:**
     - Poin EXP diperoleh setiap kali berhasil menyelesaikan modul latihan atau kuis.
     - Jenjang Pangkat Guardian: _Recruit_ $\rightarrow$ _Junior Analyst_ $\rightarrow$ _Cyber Sentinel_ $\rightarrow$ _Forensic Master_.
  2. **Streak Harian (Daily Cyber Streak):**
     - Menghitung keaktifan pengguna menyelesaikan minimal 1 simulasi per hari dengan animasi api streak menyala.
  3. **Lencana Pencapaian (Badges & Achievements):**
     - Lencana khusus: _"Anti-Quishing Master"_ (selesaikan 5 simulasi QR), _"APK Dissector"_ (bedah izin malware), _"Phishing Hunter"_.
  4. **Tipe Soal Interaktif:**
     - **Tipe A (Spot the Phish):** Membandingkan dua tampilan URL/website dan memilih mana yang palsu.
     - **Tipe B (Social Engineering Breakdown):** Menganalisis tangkapan layar pesan WhatsApp/SMS dan menandai kata-kata manipulasi psikologis.
     - **Tipe C (Dangerous Permission Detective):** Menganalisis izin Android dan menebak tujuan jahat pembuat aplikasi.
  5. **Learning Path / Skill Tree:** Peta navigasi level materi yang terbuka secara bertahap saat level sebelumnya tuntas.
- **Fitur Manajemen Admin (`/admin/quizzes`):**
  1. **CMS Bank Soal:** Tambah, edit, arsip, dan hapus soal kuis.
  2. **Pengaturan Parameter:** Menentukan kategori ancaman, tingkat kesulitan, teks soal, opsi jawaban bergambar/teks, kunci jawaban, penjelasan edukasi mendalam, dan bobot perolehan EXP.

---

## 9. Modul 9: Community Forensic Replay (`/community` & `/admin/community-reviews`)

- **Tujuan:** Mengubah temuan ancaman nyata dari investigasi pengguna lain menjadi studi kasus interaktif yang dapat dimainkan dan dipelajari oleh seluruh komunitas.
- **Akses Pengguna:** `USER` (Pemain Investigasi Komunitas), `ADMIN` (Moderator Validasi).
- **Fitur Utama:**
  1. **Alur Pengajuan Kasus Komunitas:**
     - Pengguna yang menemukan link phishing atau APK berbahaya baru dapat menekan tombol _"Bagikan ke Komunitas"_.
     - **Sanitasi PII Otomatis:** Sistem membersihkan seluruh data pribadi korban menggunakan regex PII Scrubber sebelum masuk antrean.
  2. **Panel Moderasi Admin (`/admin/community-reviews`):**
     - Admin memeriksa keaslian bukti, memastikan data pribadi tersanitasi 100%, dan menyetujui (_Approve_) atau menolak (_Reject_) studi kasus.
  3. **Interactive Forensic Replay Mode (`/community/[replayId]`):**
     - Pengguna lain membuka studi kasus nyata yang dibagikan.
     - Pengguna bertindak sebagai "Penyidik Siber": meneliti bukti yang ditemukan, menjawab teka-teki forensik dari skenario tersebut langkah demi langkah, dan melihat bagaimana modus penipuan tersebut bekerja.
     - Menyelesaikan _Forensic Replay_ memberikan **Bonus EXP Tinggi** dan menaikkan peringkat di Leaderboard Komunitas.
