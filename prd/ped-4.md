# Product Requirements Document (PRD) - MoonPhase GIS

## 🗓️ Fase 4: Fitur Lanjutan & GIS Features

**Versi:** 1.0  
**Status:** Fase 4 (Fitur Lanjutan & GIS Features)  
**Durasi:** Minggu 6–7  
**Peran Kunci:** Engineer & Designer  
**Target Utama:** Mengembangkan fitur komparasi multi-lokasi, visualisasi overlay canggih pada peta, integrasi mesin pencari lokasi (*Geocoding*), mekanisme berbagi (*share state*), dan mendukung fungsionalitas aplikasi mandiri (PWA) yang dapat diakses secara luring (*offline*).

---

## 🛠️ Spesifikasi Teknis (Engineer)

### 1. Multi-Pin Analytics Mode
*   **Multi-Location Tracking:** Memodifikasi arsitektur peta agar mendukung penitikan lebih dari satu lokasi (*multi-pin mode*).
*   **Comparison Engine:** Menyediakan struktur data untuk membandingkan matriks astronomi (seperti perbedaan waktu terbit bulan atau persentase visibilitas) antara 2 atau lebih lokasi aktif secara bersamaan.

### 2. Advanced GIS Layer & Geocoding
*   **Heatmap Iluminasi Overlay:** Mengembangkan lapisan visual tambahan (*overlay layer*) di atas peta yang berfungsi seperti *heatmap* untuk menggambarkan zona cakupan intensitas cahaya bulan (*lunar illumination coverage*) secara global.
*   **Geocoding Integration:** Mengintegrasikan API pencarian lokasi pihak ketiga (seperti Nominatim OpenStreetMap atau Mapbox Geocoding) dengan fitur pengisian otomatis (*autocomplete*) untuk memudahkan pencarian kota atau koordinat secara langsung.

### 3. Data Export & Full State Sharing
*   **Canvas Snapshot Tool:** Membuat fungsi ekspor untuk menangkap tampilan kanvas peta aktif beserta panel datanya menjadi satu berkas gambar (`.png`) atau mengekspor matriks datanya menjadi berkas mentah (`.json`).
*   **Encoded URL State:** Menyusun mekanisme kompresi *state* aplikasi (daftar pin, tanggal aktif, layer yang terbuka) ke dalam bentuk *string* URL terenkripsi base64 agar pengguna bisa membagikan tautan kondisi persis dashboard ke pengguna lain.

### 4. Progressive Web App (PWA) Foundation
*   **Service Worker Setup:** Mengonfigurasi `next-pwa` atau service worker kustom untuk menyimpan aset penting aplikasi, data kalkulator astronomi, dan *tile map cache* dasar di memori lokal browser.
*   **Offline Functionality:** Memastikan aplikasi tetap dapat terbuka dan menjalankan fungsi perhitungan fase bulan lokal walaupun perangkat kehilangan koneksi internet (*offline mode*).

---

## 🎨 Spesifikasi Kreatif (Designer)

### 1. Multi-Pin Comparison UI
*   Mendesain antarmuka perbandingan data spasial yang efisien tanpa membuat layar terlihat penuh (*cluttered*). 
*   Memberikan kode warna khusus (*color-coded*) pada setiap *marker* pin di peta yang berkorelasi langsung dengan baris kolom data di panel perbandingan.

### 2. Heatmap Overlay & Legend Design
*   Merancang palet warna gradien *heatmap* iluminasi bulan yang kontras dengan tema gelap peta, namun tidak mengaburkan garis batas peta utama.
*   Membuat komponen legenda peta (*map legend*) di sudut layar untuk menjelaskan arti tingkatan warna intensitas cahaya.

### 3. Search Bar Autocomplete & Modals
*   **Search UX:** Mendesain bilah pencarian melayang (*floating search bar*) minimalis lengkap dengan status visual memuat data (*loading*), hasil kosong (*empty state*), dan penyorotan teks otomatis.
*   **Onboarding Tour:** Merancang tampilan *onboarding overlay* sederhana (panduan langkah demi langkah) untuk pengguna yang baru pertama kali mengunjungi situs guna memperkenalkan fitur GIS utama.
*   **Export/Share Dialog:** Mendesain jendela pop-up (*modal*) untuk opsi ekspor gambar/data dan penyalinan tautan dengan animasi transisi yang mulus.

---

## 🎯 Kriteria Keberhasilan (Acceptance Criteria) Fase 4
1.  **Independent Multi-Pins:** Pengguna dapat menambah, menghapus, dan menggeser masing-masing pin secara independen tanpa merusak kalkulasi pin lainnya.
2.  **Robust Geocoding:** Hasil pencarian lokasi harus merespons dalam waktu <500ms setelah pengguna selesai mengetik dan otomatis mengarahkan kamera peta (*flyTo/panTo*) ke lokasi target.
3.  **Flawless State Recovery:** Ketika tautan berkode (*encoded share link*) dibuka di browser baru, aplikasi harus 100% mengembalikan posisi peta, jumlah pin, dan data kalender persis seperti saat tautan dibuat.
4.  **Installable PWA:** Aplikasi harus lolos audit Lighthouse untuk kriteria PWA dan menampilkan *prompt install* ("Add to Home Screen") di perangkat mobile maupun desktop.

---

## 📦 Komponen Baru yang Ditambahkan
```text
src/
├── components/
│   ├── Map/
│   │   ├── HeatmapLayer.tsx       # Komponen overlay visualisasi cahaya
│   │   └── SearchBar.tsx          # Bilah pencarian dengan autocomplete UI
│   ├── Sidebar/
│   │   └── ComparisonPanel.tsx    # Panel khusus komparasi data multi-lokasi
│   └── UI/
│       ├── ExportModal.tsx        # Dialog opsi share & download JSON/PNG
│       └── OnboardingTour.tsx     # Overlay panduan pengguna baru