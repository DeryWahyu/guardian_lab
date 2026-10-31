# Spesifikasi Detail Modul Aplikasi — Guardian Lab

> **Dokumen:** `ai-agent-docs/modules-specification.md`  
> **Fokus Utama:** Spesifikasi Implementasi Fitur 5 Modul: Landing Dashboard, AI URL & QR Helper, Web Sandbox, APK X-Ray, & Guardian Card  
> **Audience:** AI Coding Agent & Pengembang Frontend/Backend

---

## 1. Modul 1: Landing Dashboard (`/`)

- **Tujuan:** Menjadi gerbang utama interaksi pengguna dan menyediakan opsi input langsung multi-format yang bersih dan mudah digunakan.
- **Fitur Utama:**
  1. **3 Tab Input Utama:**
     - **Cek URL / Domain Mencurigakan:** Input teks langsung untuk memasukkan link yang ingin dianalisis.
     - **Scan / Upload Gambar QR Code:** Helper utilitas yang membaca dan mengekstrak teks/URL dari gambar kode QR secara otomatis (sehingga pengguna tidak perlu repot memindai dengan kamera HP lain lalu mengetik/paste manual).
     - **Bongkar File `.apk` (Manual Upload):** Area drag-and-drop / file picker untuk mengunggah file installer Android yang mencurigakan.
  2. **Pengujian Sampel Demo:**
     - Pengguna/juri menguji sistem dengan mengunggah link, gambar QR, atau file `.apk` asli/simulasi secara manual.
     - Sampel file `.apk` pengujian untuk keperluan demo juri disediakan dan dikirimkan oleh tim secara terpisah (eksternal), bukan berupa tombol preset shortcut di dalam antarmuka website.
  3. **Privacy & Security Control:**
     - Toggle **Client-Side PII Masking** aktif secara default.
     - Badge transparansi: _"Powered by Custom AI + DeepSeek API (Data Anonim)"_.

---

## 2. Modul 2: Deteksi AI URL & QR Decoder Helper (`/api/analyze-url` & `/api/analyze-qr`)

- **Tujuan:** Melakukan inspeksi leksikal & visual terhadap tautan, serta membantu mengekstrak string/URL dari gambar kode QR secara instan.
- **Fitur Utama:**
  1. **Model AI Deteksi Phishing URL:**
     - Ekstraksi fitur leksikal: panjang URL, rasio karakter khusus, Shannon entropy, TLD berisiko tinggi (`.xyz`, `.top`, `.click`, `.buzz`), dan kemiripan nama bank/brand Indonesia (_typosquatting_ seperti `bca-klik[.]xyz`).
     - Output skor risiko (0–100) dan _Explainable Red Flags_.
  2. **QR Image Decoder Helper:**
     - Menggunakan modul decoder kode QR berbasis library JavaScript/TypeScript mature (seperti `jsqr` / `@zxing/library`) untuk mendeteksi dan membaca _payload_ dari gambar kode QR yang diunggah pengguna.
     - **Fungsi Murni:** Sebagai _convenience tool_ agar pengguna tidak perlu mengubah gambar QR menjadi teks secara manual.
     - Jika teks hasil ekstraksi berupa URL web, sistem langsung meneruskannya ke pipeline deteksi URL phishing.

---

## 3. Modul 3: Browser-in-Browser Sandbox (`/sandbox/web`)

- **Tujuan:** **Proteksi Perangkat Pengguna.** Menyediakan lingkungan browser cloud terisolasi agar pengguna dapat membuka dan melihat situs web yang terindikasi phishing/berbahaya tanpa perlu khawatir perangkat lokal mereka terinfeksi _malware_ atau terkena serangan _drive-by download_.
- **Fitur Utama:**
  1. **Isolated Streaming Session:**
     - Menampilkan stream Chromium Kiosk terisolasi via WebRTC / KasmVNC di dalam iframe.
     - Sesi dibatasi waktu (_session timeout_ 180 detik) dan otomatis dihancurkan (_auto-destroy_) untuk menjaga performa server.
  2. **Kontrol Tampilan Mobile:**
     - **Switch Desktop / Mobile Viewport:** Mengubah User-Agent dan resolusi ke tampilan HP Android untuk melihat halaman phishing yang sengaja disembunyikan pembuatnya jika dibuka dari browser komputer.
  3. **Inotify Download Watcher (Auto-Intercept APK):**
     - Memonitor direktori `/downloads` kontainer browser sandbox.
     - Jika situs phishing memicu pengunduhan file `.apk`, modal interaktif langsung muncul: _"🚨 Unduhan APK Berbahaya Dikarantina!"_ dengan tombol pintas untuk langsung membedah APK di Modul 4.

---

## 4. Modul 4: APK X-Ray Reverse Engineering & Emulator (`/api/analyze-apk` & `/sandbox/android`)

- **Tujuan:** Membedah file `.apk` yang diunggah pengguna secara statis dan menyediakan HP virtual interaktif untuk pengujian dinamis.
- **Fitur Utama:**
  1. **Jalur Cepat (Static X-Ray via DeepSeek LLM):**
     - Server Handler Next.js mengekstrak `AndroidManifest.xml` dan strings via CLI `jadx` / `apktool`.
     - Regex Scanner mencari hardcoded Telegram Bot Token (`api.telegram.org/bot...`), chat ID, URL C2, dan nomor WhatsApp pelaku.
     - Mengirimkan metadata tersanitasi ke DeepSeek API dengan structured JSON output (lihat [api-and-prompts.md](./api-and-prompts.md)).
     - UI menampilkan **Mode Bahasa Manusia** (sorotan bahaya sederhana) dan **Mode Teknis (Geek View)**.
  2. **Jalur Interaktif (Android Emulator Sandbox):**
     - Menjalankan kontainer `Redroid` / `docker-android` yang di-stream via noVNC / WebSocket.
     - Pengguna dapat melihat langsung aplikasi berjalan di layar HP virtual yang aman tanpa risiko terhadap perangkat pribadi.
     - Auto-destroy sesi dan pembersihan instalasi (`adb uninstall`).

---

## 5. Modul 5: Pilar Act — Guardian Share Card (`/act`)

- **Tujuan:** Memberdayakan pengguna untuk bertindak melindungi keluarga dan komunitas dengan menyebarkan peringatan visual yang mudah dipahami.
- **Fitur Utama:**
  1. **Guardian Share Card Generator:**
     - Menggabungkan tangkapan layar dari Sandbox/Emulator yang telah diberi _watermark_ besar peringatan bahaya (_"AWAS MODUS PENIPUAN"_).
     - URL target otomatis di-_defang_ (misal: `dana-kaget[.]xyz`) agar tidak dapat diklik secara tidak sengaja oleh penerima pesan.
     - Memuat 3 poin ringkasan bahaya utama hasil analisis AI.
     - 1-klik unduh gambar format PNG yang siap dibagikan ke grup WhatsApp keluarga atau media sosial.
