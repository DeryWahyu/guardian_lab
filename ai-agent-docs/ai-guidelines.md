# Standar Pengembangan AI & Panduan UI/UX — Guardian Lab

> **Dokumen:** `ai-agent-docs/ai-guidelines.md`  
> **Fokus Utama:** Standarisasi Kursor, Larangan Alert Native, Skeleton Loading, Dual-Mode UI, dan Deep-Linking URL  
> **Audience:** AI Coding Agent & Pengembang Frontend

---

## 1. Standarisasi Kursor Pointer (Cursor Pointer Standards)

Semua elemen antarmuka yang dapat diklik atau memiliki interaksi pengguna wajib menampilkan kursor pointer (`cursor: pointer`).

### Aturan Komponen Primitif

Setiap komponen UI interaktif wajib menyertakan kelas utility `cursor-pointer`:

- **Button (`components/ui/button.tsx`)**: Varian dasar wajib menyertakan `cursor-pointer`.
- **Accordion (`components/ui/accordion.tsx`)**: `AccordionTrigger` wajib menyertakan `cursor-pointer`.
- **Tabs (`components/ui/tabs.tsx`)**: `TabsTrigger` wajib menyertakan `cursor-pointer`.
- **Select (`components/ui/select.tsx`)**: `SelectTrigger` dan `SelectItem` wajib memiliki kelas `cursor-pointer`.
- **Upload Dropzone**: Area drag-and-drop file APK dan gambar QR wajib memiliki kelas `cursor-pointer`.
- **Badge / Chips**: Badge yang interaktif (memiliki event `onClick` atau link) wajib diberi `cursor-pointer`.

### Aturan Global CSS (`app/globals.css`)

Sebagai pengaman (_safety net_), aturan CSS global diterapkan di layer base untuk memastikan seluruh elemen interaktif bawaan HTML dan ARIA role button merespons interaksi kursor dengan benar:

```css
button:not(:disabled),
[role="button"]:not([aria-disabled="true"]):not([data-disabled]),
[type="button"]:not(:disabled),
[type="reset"]:not(:disabled),
[type="submit"]:not(:disabled),
summary,
a[href],
select:not(:disabled) {
  cursor: pointer;
}
```

---

## 2. Larangan Dialog Native Browser (Custom Confirmation Modals)

Dilarang keras menggunakan fungsi bawaan browser `window.confirm()` atau `window.alert()`.

### Aksi Destruktif & Konfirmasi

Semua aksi kritis (seperti menghentikan sesi sandbox, mereset analisis, membatalkan proses reverse engineering) wajib menggunakan komponen modal konfirmasi kustom:

- Gunakan `<ConfirmDialog>` di `@/components/shared/confirm-dialog`.
- Sifat modal:
  - Menyediakan judul (`title`) dan deskripsi (`description`) yang jelas mengenai dampak tindakan.
  - Memiliki tombol konfirmasi berlabel eksplisit (misal: `"Hentikan Sesi"`, `"Reset Analisis"`).
  - Mengelola status asinkron (`pending` / spinner loading).
  - Mendukung penutupan via tombol Batal (`cancelLabel="Batal"`), klik backdrop, atau tombol Esc.

### Notifikasi & Penanganan Error

- Gunakan notifikasi toast dari package `sonner` (`toast.error()`, `toast.success()`, `toast.info()`) untuk pesan status dan respons operasi.
- Dilarang memunculkan alert pemblokir thread UI.

---

## 3. Desain Skeleton Loading (Skeleton Loading UI)

Setiap komponen atau halaman yang memuat data secara asinkron (_scanning URL_, _dekompilasi APK jadx_, _menghubungkan stream sandbox_) wajib menyediakan tampilan state pemuatan berbasis Skeleton UI:

- Menggunakan komponen primitif `Skeleton` dari `@/components/ui/skeleton`.
- Desain skeleton harus mencerminkan struktur tata letak asli dari kartu hasil analisis (_Card_), tabel izin (_Permissions_), atau panel _Geek View_, bukan sekadar spinner teks atau ruang kosong.
- **Route-level Suspense**: Setiap rute dengan muatan data dinamis harus memiliki `loading.tsx` yang sesuai (misal: `app/sandbox/web/loading.tsx`).

---

## 4. Konsistensi Bahasa & Lokalisasi (Language & Localization)

Antarmuka web Guardian Lab mengutamakan Bahasa Indonesia yang ramah, komunikatif, dan mudah dipahami oleh generasi muda serta orang awam, namun tetap presisi pada Mode Teknis (_Geek View_).

### Dual-Mode Penjelasan:

- **Mode Bahasa Manusia (Default):** Menggunakan bahasa ramah, analogi sederhana, dan visual kartu bahaya (misal: _"Aplikasi ini bisa membaca SMS OTP m-banking kamu secara diam-diam"_).
- **Mode Teknis (Geek View):** Menampilkan istilah teknis apa adanya (`android.permission.RECEIVE_SMS`, dekompilasi `jadx`, webhook token bot).

### Istilah Keamanan Siber yang Dipertahankan:

Istilah keamanan siber internasional tetap dipertahankan dalam Bahasa Inggris tanpa terjemahan paksaan yang janggal:

- `Phishing`, `Quishing`, `Sandbox`, `Reverse Engineering`, `Payload`, `Decompiled`, `Permissions`, `APK`, `Token`, `User-Agent`, `C2 Endpoint`.

---

## 5. Sinkronisasi State Antarmuka ke URL Parameters (Shareable Deep-Linking)

Seluruh komponen interaktif yang mengubah tampilan data antarmuka pengguna **WAJIB** merefleksikan state-nya ke dalam URL search parameters (`query string`).

### Mengapa Aturan Ini Wajib?

- **Shareable State & Kolaborasi:** Memungkinkan pengguna menyalin URL hasil analisis dan membagikannya ke orang lain; penerima link langsung melihat hasil temuan yang sama persis (mode aktif yang sama, tab yang sama).
- **History & Back/Forward:** Memungkinkan navigasi tombol back/forward browser bekerja tanpa mereset tampilan hasil analisis.

### Pola & Konvensi URL Parameter:

1. **Navigasi Tab:** Gunakan parameter `?tab=` (contoh: `?tab=url`, `?tab=qr`, `?tab=apk`).
2. **Mode Tampilan:** Gunakan `?mode=human` atau `?mode=geek` untuk beralih antara Mode Bahasa Manusia dan Geek View.
3. **Target URL Analisis:** Gunakan parameter `?target=` pada sandbox (contoh: `/sandbox/web?target=https%3A%2F%2Fcontoh.com`).

---

## 6. Penanganan 4 Kondisi Antarmuka (The 4 UI States Rule)

Setiap halaman dan komponen hasil analisis data **WAJIB** menangani 4 kondisi state secara eksplisit:

### 1. Loading State (Wajib Skeleton UI)

- Tampilkan `Skeleton` yang meniru tata letak kartu hasil analisis risiko dan daftar _Red Flags_. Dilarang membiarkan layar kosong atau hanya menampilkan spinner teks biasa.

### 2. Empty State (Kondisi Belum Ada Input / Data Kosong)

- Tampilkan visual yang ramah dan instruktif:
  1. Ikon relevan (`ShieldCheck`, `FileSearch`, atau `UploadCloud` dari `lucide-react`).
  2. Judul yang jelas (misal: `"Belum Ada File APK yang Dianalisis"`).
  3. Deskripsi instruksi (misal: `"Tarik file .apk ke area di atas atau klik untuk memilih file."`).

### 3. Error State (Kondisi Kegagalan Server / Analisis)

- Tampilkan kartu error informatif di area terkait beserta tombol **"Coba Lagi" (_Retry_)**.
- Sampaikan notifikasi toast via `sonner` jika terjadi kegagalan jaringan atau parsing.

### 4. Large Dataset / Detailed Report State

- Pada laporan dekompilasi APK yang memuat puluhan _permissions_ atau ratusan _strings_ hasil `jadx`, sediakan fitur pencarian/filter cepat dan tampilan terpaginasi atau _virtualized scrolling_.

---

## 7. Standarisasi Input Form, Placeholder, & Indikator Wajib/Opsional

### 1. Placeholder Informatif & Kontekstual

- Setiap field input teks **WAJIB** memiliki atribut `placeholder` dengan contoh nilai nyata yang valid:
  - ✅ **Contoh Baik**:
    - `placeholder="https://contoh-link-mencurigakan.xyz/klaim-dana"` (Input URL)
    - `placeholder="Cari permission atau nama file di sini..."` (Search Filter Geek View)

### 2. Indikator Field Wajib (_Required_): Bintang Merah

- Label field wajib menyertakan tanda bintang merah:
  ```tsx
  <Label htmlFor="targetUrl">
    URL Target <span className="font-semibold text-red-500">*</span>
  </Label>
  ```

### 3. Indikator Field Opsional (_Optional_): Keterangan Eksplisit

- Label field opsional wajib mencantumkan keterangan `(Opsional)` secara eksplisit:
  ```tsx
  <Label htmlFor="notes">
    Catatan Tambahan <span className="text-xs font-normal text-slate-500">(Opsional)</span>
  </Label>
  ```

---

## 8. Integritas Pengetesan & UI Testing Protocols

- **Co-location Test:** Setiap komponen kritis dan halaman rute (`page.tsx`) dianjurkan memiliki file pengujian UI pendamping (`*.test.tsx` / `*.test.ts`) di folder yang sama.
- **Runner Native `bun test`:** Pengujian dijalankan menggunakan runner native `bun test`.
- **Aspek Pengujian:**
  1. Validitas rendering komponen (tidak crash saat props kosong/loading).
  2. Kepatuhan Zero Hardcoded Routes (mengimpor dari [routes-and-navigation.md](./routes-and-navigation.md)).
  3. Penanganan 4 UI states (loading skeleton, empty, error, content).
  4. Form input hygiene (placeholder, bintang merah required).
  5. Keberadaan modal konfirmasi kustom pengganti `window.confirm`.
