# Spesifikasi API, Kontrak JSON DeepSeek, & PII Scrubbing — Guardian Lab

> **Dokumen:** `ai-agent-docs/api-and-prompts.md`  
> **Fokus Utama:** Kontrak Skema JSON DeepSeek API, System Prompt, Aturan Redundansi & Improvisasi, PII Scrubber Regex, dan Endpoint API Fullstack Next.js  
> **Audience:** AI Coding Agent, Fullstack Developer, & Security Analyst

---

## 1. Spesifikasi Kontrak JSON DeepSeek API

> [!IMPORTANT]
> **Aturan Redundansi & Fleksibilitas Prompt:**
>
> 1. **Aturan Redundansi:** Begitu _system prompt_ di bawah ini telah diimplementasikan ke dalam kode fitur (misalnya pada modul service/route handler Next.js), **hapus teks prompt dari dokumen ini** dan cukup cantumkan tautan ke file kodenya. Hal ini bertujuan agar kode menjadi _single source of truth_ dan mencegah redundansi serta perbedaan isi prompt (_prompt drift_).
> 2. **Kebebasan Berimprovisasi:** Kontrak dan prompt di bawah merupakan acuan dasar (_baseline_). Saat implementasi berlangsung, jika dirasa perlu penyesuaian (misalnya penyesuaian instruksi agar hasil LLM lebih presisi, penambahan atribut metadata deteksi baru, atau optimasi efisiensi token), **silakan berimprovisasi** dan sesuaikan dengan kebutuhan teknis riil pada kode.

Aplikasi mengirimkan hasil ekstraksi metadata halaman web atau hasil dekompilasi `.apk` (`AndroidManifest.xml` + _strings/URLs_ dari `jadx`) ke **DeepSeek API** (`deepseek-chat`).

### System Prompt untuk Analisis APK & Web Phishing:

```text
Anda adalah analis keamanan siber profesional untuk Guardian Lab. Analisis metadata berikut secara mendalam, objektif, dan terstruktur. Berikan penjelasan yang mudah dipahami anak muda/orang awam (Mode Manusia) sekaligus rincian teknis untuk Mode Geek. Pastikan output SELALU berupa JSON valid sesuai kontrak berikut tanpa tambahan markdown di luar blok JSON.
```

### Format Skema JSON Respons Wajib:

```json
{
  "risk_level": "CRITICAL | HIGH | MEDIUM | LOW",
  "risk_score_indicator": 92,
  "scam_category": "APK Penyadap SMS OTP (Modus Kurir/Undangan) | Web Phishing Kredensial | Quishing (QR Phishing)",
  "human_friendly_summary": "Aplikasi ini menyamar sebagai pengecek resi pengiriman, tetapi di balik layar meminta izin penuh untuk membaca dan meneruskan semua SMS masuk (termasuk kode OTP m-banking kamu) ke akun Telegram milik penipu.",
  "psychological_triggers": [
    {
      "type": "Urgency & Fear",
      "explanation": "Membuat korban panik bahwa paket tertahan atau salah alamat sehingga terburu-buru menginstal file tanpa memeriksa ekstensi .apk."
    }
  ],
  "red_flags": [
    {
      "title": "Meminta Izin Membaca & Menerima SMS (READ_SMS / RECEIVE_SMS)",
      "plain_explanation": "Aplikasi pelacak paket biasa hanya butuh internet, tidak pernah butuh akses membaca pesan SMS pribadi di HP kamu.",
      "technical_evidence": "android.permission.RECEIVE_SMS, android.permission.READ_SMS pada AndroidManifest.xml"
    },
    {
      "title": "Ditemukan Jalur Pengiriman Data ke Bot Telegram Penipu",
      "plain_explanation": "Kode di dalam aplikasi ini terbukti memiliki alamat rahasia untuk mengirim isi SMS kamu langsung ke grup Telegram pelaku.",
      "technical_evidence": "Hardcoded endpoint: https://api.telegram.org/bot[REDACTED_TOKEN]/sendMessage?chat_id=-100xxxx pada com.example.myapplicat.SendSMS"
    }
  ],
  "attacker_footprints": {
    "detected_c2_or_bot": "Telegram Bot API (chat_id: -100xxxx)",
    "impersonated_brand": "J&T Express / Ekspedisi Kurir",
    "suspicious_permissions": ["RECEIVE_SMS", "READ_SMS", "READ_CONTACTS", "FOREGROUND_SERVICE"]
  },
  "emergency_action_plan": {
    "if_not_clicked_yet": [
      "Hapus file atau pesan tersebut sekarang dan jangan pernah menginstalnya.",
      "Unduh Guardian Share Card di bawah untuk memperingatkan teman atau keluarga di grup WhatsApp."
    ],
    "if_already_installed_or_filled": [
      "SEGERA matikan koneksi internet (Wi-Fi dan Data Seluler) atau aktifkan Mode Pesawat agar aplikasi penipu gagal mengirim SMS OTP keluar.",
      "Buka Pengaturan HP > Aplikasi, cari aplikasi mencurigakan tersebut (sering kali muncul tanpa ikon atau bernama 'System Service'), lalu klik Copot Pemasangan (Uninstall).",
      "Hubungi Call Center resmi bank kamu untuk memblokir sementara layanan m-banking."
    ]
  },
  "limitation_disclaimer": "Analisis ini dihasilkan melalui pemeriksaan otomatis berbasis aturan, model AI internal, dan DeepSeek LLM. Skor rendah tidak menjamin suatu tautan atau aplikasi 100% aman. Jangan pernah memasukkan PIN, password, atau kode OTP di luar aplikasi resmi."
}
```

---

## 2. Modul PII Scrubber (Regex Masking)

Sebelum data teks hasil ekstraksi dikirimkan ke DeepSeek API, backend wajib melewatkan teks melalui fungsi sanitasi regex untuk menyamarkan informasi pribadi:

| Tipe Data Sensitif             | Pola Regex                                       | Hasil Penggantian                |
| :----------------------------- | :----------------------------------------------- | :------------------------------- |
| **Nomor HP Indonesia**         | `(\+62\|62\|0)8[1-9][0-9]{6,10}`                 | `[REDACTED_PHONE]`               |
| **Nomor Rekening / KTP (NIK)** | `\b\d{16}\b`                                     | `[REDACTED_NIK_OR_ACCOUNT]`      |
| **Email Pengguna**             | `[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+` | `[REDACTED_EMAIL]`               |
| **Telegram Bot Token**         | `\b[0-9]{9,10}:[a-zA-Z0-9_-]{35}\b`              | `[EXTRACTED_BOT_TOKEN_REDACTED]` |

---

## 3. Ringkasan Endpoint API Fullstack Next.js (Route Handlers)

Seluruh endpoint di bawah ini diimplementasikan sebagai Next.js App Router Route Handlers di dalam direktori `app/api/` dan konstanta jalurnya dipusatkan di `lib/routes.ts`:

| Endpoint                     | Method | Input                                              | File Lokasi Handler                      | Output Utama                                                                                                                              |
| :--------------------------- | :----- | :------------------------------------------------- | :--------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/analyze-url`           | `POST` | `{ "url": string }`                                | `app/api/analyze-url/route.ts`           | Skor risiko leksikal, Red Flags, flag status phishing, rekomendasi sandbox.                                                               |
| `/api/analyze-qr`            | `POST` | `multipart/form-data` (file gambar QR)             | `app/api/analyze-qr/route.ts`            | `{ "extracted_text": string, "is_url": boolean }` — Helper ekstraksi teks/URL dari gambar QR agar pengguna tidak perlu scan manual di HP. |
| `/api/analyze-apk`           | `POST` | `multipart/form-data` (file `.apk`)                | `app/api/analyze-apk/route.ts`           | Hasil reverse engineering (`jadx`), permissions, indikator bot C2, dan JSON terstruktur DeepSeek API.                                     |
| `/api/sandbox/session/start` | `POST` | `{ "type": "web" \| "android", "target": string }` | `app/api/sandbox/session/start/route.ts` | URL sesi WebRTC/VNC stream terisolasi, session ID, dan masa aktif (timer 180s).                                                           |
| `/api/sandbox/session/stop`  | `POST` | `{ "session_id": string }`                         | `app/api/sandbox/session/stop/route.ts`  | Status pembersihan kontainer (_auto-destroy_ dan cleanup file unduhan).                                                                   |
