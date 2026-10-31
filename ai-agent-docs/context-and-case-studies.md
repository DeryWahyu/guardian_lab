# Konteks Studi Kasus & Landasan Fakta — Guardian Lab

> **Dokumen:** `ai-agent-docs/context-and-case-studies.md`  
> **Fokus Utama:** Kepatuhan Juknis MIT-Week 2026, Tiga Pilar Sistem, dan Data Statistik Kasus Nyata Indonesia (OJK, IASC, Quishing, APK)  
> **Audience:** AI Coding Agent, UI/UX Designer, & Content Writer

---

## 1. Konteks Studi Kasus & Kepatuhan Juknis Kompetisi

**Tema Kompetisi:** _MIT-Week 2026: Guardians of the Digital Space – Empowering Today's Generation Toward a Safer Cyber Ecosystem_

Aplikasi memberdayakan masyarakat menjadi **Digital Guardian** melalui penggabungan tiga pilar utama (**Recognize**, **Protect/Sandbox**, dan **Act**) dengan fokus mendalam pada rantai serangan **Phishing modern, Quishing (QR Code Phishing), dan Malware File `.apk`**.

### Tabel Kepatuhan Kriteria Penilaian

| Kriteria Penilaian Juknis                   | Implementasi Konkret dalam Sistem "Guardian Lab"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Live Deployment Tanpa Error**             | Sistem menerima input langsung dari pengguna: Input URL, Scan/Upload gambar QR (sebagai helper konversi otomatis ke teks/URL), dan Upload manual file `.apk`. Arsitektur menggunakan _Pre-warmed Docker Container Pool_ agar penjelajahan di sandbox berjalan lancar tanpa _timeout_. Sampel file malware untuk keperluan pengujian demo/juri disediakan secara terpisah oleh tim.                                                                                                                                                                                                                                                                          |
| **Pilar 1: Recognize (Mengenali)**          | Memadukan **Model AI Kustom (Deteksi URL/Domain & Visual Phishing)**, **QR Image Decoder Helper** (untuk membaca URL/teks dari kode QR secara instan), dan **Reverse Engineering Otomatis (`jadx`/`apktool`) + DeepSeek LLM** untuk membedah tanda bahaya (_Red Flags_) file `.apk` dalam bahasa manusia yang mudah dipahami.                                                                                                                                                                                                                                                                                                                               |
| **Pilar 2: Protect / Sandbox (Melindungi)** | Menyediakan **Browser-in-Browser Sandbox** (Mode Desktop & Mobile Android) dan **Emulator Android Interaktif** terisolasi. Tujuannya murni memberikan rasa aman bagi pengguna untuk membuka dan melihat isi tautan/aplikasi berbahaya secara langsung tanpa rasa khawatir perangkat lokal mereka terinfeksi _malware_.                                                                                                                                                                                                                                                                                                                                      |
| **Pilar 3: Act (Bertindak)**                | Menghasilkan **Guardian Share Card** (poster peringatan otomatis berisi tangkapan layar dari dalam Sandbox yang sudah diberi _watermark_ aman + 3 poin bahaya utama) untuk langsung disebarkan sebagai peringatan dini ke grup WhatsApp keluarga atau komunitas.                                                                                                                                                                                                                                                                                                                                                                                            |
| **Batasan Keamanan & Privasi**              | 1. **Zero Real PII:** Dilarang meminta atau menyimpan kredensial asli pengguna; sensor data pribadi sebelum dikirim ke LLM.<br>2. **Transparansi Pihak Ketiga:** Menampilkan pemberitahuan eksplisit bahwa analisis kode/teks dikirim secara anonim ke layanan AI pihak ketiga (DeepSeek API).<br>3. **Disclaimer Akurasi:** Menyatakan secara jujur bahwa skor risiko adalah indikator kewaspadaan awal, bukan jaminan mutlak suatu tautan/file 100% aman.<br>4. **Isolasi Konten Berbahaya:** Semua interaksi web phishing/APK berjalan di dalam kontainer terisolasi (_sandboxed stream_) yang otomatis terhapus (_auto-destroy_) setelah sesi berakhir. |

---

## 2. Landasan Fakta & Berita Kasus Viral Indonesia (2025–2026)

Gunakan data dan referensi berita terverifikasi berikut pada halaman informasi aplikasi, _tooltip_ edukasi, dan dokumentasi:

### A. Skala Nasional Penipuan Digital (Data OJK & IASC 2026)

- Sejak beroperasi pada November 2024 hingga 30 September 2026, **Indonesia Anti-Scam Centre (IASC) OJK** mencatat:
  - **702.342 laporan penipuan**
  - Memverifikasi **1.372.483 rekening**
  - Memblokir **702.833 rekening**
  - Total dana dibekukan mencapai **Rp825,2 miliar**, namun baru **Rp207,16 miliar (25,1%)** yang berhasil diselamatkan karena tingginya kecepatan pelaku memindahkan dana melalui rekening berlapis.
  - _Sumber Referensi:_ [Investor Daily](https://investor.id/finance/459705/ojk-blokir-702-ribu-rekening-terkait-penipuan); [Stabilitas.id](https://www.stabilitas.id/tindak-330-entitas-ilegal-satgas-pasti-dan-iasc-blokir-rekening-penipuan-rp8252-miliar/).

### B. Dominasi Phishing Personal Berbasis AI (2026)

- Phishing tetap menjadi kejahatan digital paling marak di tahun 2026.
- Pelaku memanfaatkan AI untuk mempelajari profil, relasi, dan kebiasaan korban di media sosial, lalu mengirimkan tautan palsu yang sangat personal dan meyakinkan via pesan WhatsApp atau DM.
- _Sumber Referensi:_ [Eraspace](https://eraspace.com/artikel/post/kejahatan-di-dunia-digital-01); [Vinotek](https://vinotek.id/article/18-penipuan-digital-yang-paling-banyak-memakan-korban-sepanjang-2025).

### C. Bahaya Modus Quishing (QR Code Phishing) & Kebutuhan QR Decoder

- Modus **Quishing**: Pelaku menempelkan atau mengirimkan gambar QR Code yang menyembunyikan URL situs phishing pencuri kredensial atau tautan pengunduh _malware_. Korban tidak dapat melihat URL tujuan sebelum memindainya.
- Banyak pengguna kesulitan atau malas memindai QR lewat kamera ponsel lain lalu mengetikkan ulang URL panjang ke komputer. Fitur **Upload/Scan QR** hadir sebagai utilitas pembantu (_helper_) untuk mengekstrak string/URL dari gambar QR secara otomatis agar langsung dapat dianalisis sistem.
- _Sumber Referensi:_ [Verihubs](https://verihubs.com/blog/penipuan-qris); [Bank Mandiri](https://www.bankmandiri.co.id/hati-hati-modus-phishing-berkedok-qris-cara-mencegah-penipuan-digital).

### D. Modus File `.apk` Pencuri SMS OTP (Kurir Paket, Tagihan, Undangan Nikah)

- Pelaku menyebarkan file `.apk` berbahaya berkedok dokumen resi ekspedisi (J&T, SiCepat), undangan pernikahan digital, surat tilang ETLE, atau tagihan PLN/BPJS melalui WhatsApp.
- Saat diinstal, aplikasi meminta izin berbahaya:
  - `android.permission.RECEIVE_SMS`
  - `android.permission.READ_SMS`
  - `android.permission.FOREGROUND_SERVICE`
- Izin tersebut digunakan untuk menyadap dan mencegat kode OTP perbankan (_mobile banking_) dan mengirimkannya ke bot Telegram / server C2 pelaku secara instan.
- _Sumber Referensi:_ [Bank Indonesia - Edukasi APK](https://www.bi.go.id/id/publikasi/ruang-media/cerita-bi/Pages/telanjur-klik-apk-penipuan.aspx); [CSIRT UNY](https://csirt.uny.ac.id/peringatan/imbauan-keamanan-modus-penipuan-menggunakan-undangan-pernikahan-elektronik-apk); [DJPb Kemenkeu](https://djpb.kemenkeu.go.id/kppn/wates/id/data-publikasi/berita-terbaru/3069-phising-penipuan-undangan-apk-paket.html).
