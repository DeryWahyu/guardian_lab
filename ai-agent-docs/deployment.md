# Panduan Deployment & Arsitektur Docker — Guardian Lab

> **Dokumen:** `ai-agent-docs/deployment.md`  
> **Fokus Utama:** Arsitektur Deployment Multi-Container (Fullstack Next.js, Web Sandbox Chromium, Android Redroid)  
> **Audience:** AI Coding Agent & DevOps / System Engineer

---

## 1. Arsitektur Multi-Container Sandbox

Guardian Lab dibangun di atas arsitektur kontainer terisolasi untuk memisahkan aplikasi utama (Fullstack Next.js) dan lingkungan eksekusi sandbox berbahaya:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Host VPS / Cloud Server (Ubuntu 22.04+ / Debian 12)                    │
│                                                                        │
│   ┌─────────────────────┐                                              │
│   │ Reverse Proxy       │ (Nginx / Caddy / SSL Certbot)                │
│   │ Ports 80, 443       │                                              │
│   └──────────┬──────────┘                                              │
│              │ Proxy http://127.0.0.1:3000                             │
│   ┌──────────▼─────────────────────────────────────────────────────┐   │
│   │ Container: guardian_app (Fullstack Next.js 16 / Bun)           │   │
│   │   ├── Port 3000 (UI Web Application & API Route Handlers)      │   │
│   │   ├── Tools: jadx, apktool, openjdk-jre                        │   │
│   │   ├── Docker Socket Access: /var/run/docker.sock               │   │
│   │   └── Integrasi DeepSeek API & QR Decoder                      │   │
│   └──────────┬─────────────────────────────┬───────────────────────┘   │
│              │ Mount /downloads            │ ADB / WebSocket           │
│   ┌──────────▼────────────────────────┐ ┌──▼───────────────────────┐   │
│   │ Container Pool: Web Sandbox       │ │ Container: Android Redroid   │   │
│   │ Chromium KasmVNC / WebRTC         │ │ redroid:12.0.0 (HP Virtual)  │   │
│   │ (Isolasi Link Phishing Berbahaya) │ │ (Eksekusi APK Terisolasi)    │   │
│   └───────────────────────────────────┘ └──────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### Karakteristik Utama

1. **Isolasi Mutlak (_Total Sandbox Isolation_):** Tautan berbahaya dan malware APK tidak pernah dieksekusi di browser atau mesin lokal pengguna. Seluruh eksekusi berjalan di kontainer terpisah.
2. **Auto-Destroy & Session Timeout:** Kontainer sandbox dibatasi waktu aktif maksimal 180 detik per sesi, dan otomatis dibersihkan (_container wipe_ / `adb uninstall`) saat sesi berakhir.
3. **Inotify Download Mount:** Direktori `/downloads` pada kontainer Chromium dipetakan ke volume bersama sehingga setiap file `.apk` yang diunduh otomatis terdeteksi dan dikarantina oleh aplikasi.

---

## 2. Struktur Folder `docker/`

```text
docker/
├── docker-compose.yml        # Orkestrasi Fullstack App & Sandboxes
├── app/
│   └── Dockerfile            # Multi-stage Next.js production build (Bun runtime + OpenJDK)
└── sandbox/
    └── chromium.env          # Konfigurasi resolusi & security flags Chromium Kiosk
```

---

## 3. Variabel Lingkungan (_Environment Variables_)

Salin berkas `.env.example` menjadi `.env` sebelum menjalankan aplikasi:

```bash
cp .env.example .env
```

Daftar variabel penting:

- `DEEPSEEK_API_KEY`: Kunci API untuk analisis LLM terstruktur.
- `NEXT_PUBLIC_APP_URL`: URL publik aplikasi web Guardian Lab (default: `http://localhost:3000`).
- `SANDBOX_SESSION_TIMEOUT`: Durasi sesi sandbox dalam detik (default: `180`).

---

## 4. Cara Menjalankan Aplikasi via Docker Compose

```bash
# Menggunakan Bun script (direkomendasikan)
bun run docker:build
bun run docker:up
bun run docker:down

# Atau menggunakan perintah Docker compose langsung
docker compose -f docker/docker-compose.yml up -d --build

# Periksa status container
docker compose -f docker/docker-compose.yml ps

# Periksa log aplikasi
docker compose -f docker/docker-compose.yml logs -f app
```

# Hentikan seluruh service

docker compose -f docker/docker-compose.yml down

```

---

## 5. Protokol Sinkronisasi Deployment untuk Pengembang & AI Agent

Setiap kali melakukan perubahan kode yang berdampak pada arsitektur atau infrastruktur:

1. **Penambahan Dependensi Binary OS:** Jika backend membutuhkan alat reverse engineering baru, wajib memperbarui `docker/backend/Dockerfile`.
2. **Penambahan Port / Volume:** Jika ada folder penyimpanan sementara baru (misal folder karantina APK), daftarkan di `docker/docker-compose.yml`.
3. **Penambahan Environment Variables:** Selalu perbarui `.env.example` dan dokumentasikan fungsinya.
```
