# Product Requirements Document (PRD) - MoonPhase GIS

## 🗓️ Fase 2: Peta Interaktif & Koordinat

**Versi:** 1.0  
**Status:** Fase 2 (Peta Interaktif & Koordinat)  
**Durasi:** Minggu 2–4  
**Peran Kunci:** Engineer & Designer  
**Target Utama:** Mengimplementasikan peta interaktif *full-screen*, menangkap koordinat geografis dari interaksi pengguna, dan menyediakan *state management* berbasis URL serta kustomisasi *marker* fase bulan.

---

## 🛠️ Spesifikasi Teknis (Engineer)

### 1. Full-Screen Map Implementation
*   Mengembangkan komponen peta interaktif yang memenuhi *viewport* layar (100vh/100vw).
*   Integrasi *Tile Layer* manajemen menggunakan penyedia *dark-mode* gratis (seperti CartoDB DarkMatter) atau kustomisasi Mapbox Tiles untuk mempertahankan estetika *space-dark*.

### 2. Koordinat Capture & Geolocation
*   **Event Handler:** Mengimplementasikan fungsi `onClick` pada peta untuk menangkap data geografis presisi (*Latitude* dan *Longitude*).
*   **Geolocation API:** Menambahkan fitur deteksi lokasi awal otomatis menggunakan izin GPS browser pengguna saat aplikasi pertama kali dibuka.

### 3. State Management & URL Sync
*   **URL Params Sync:** Setiap kali pengguna mengklik peta atau mengganti lokasi, koordinat terbaru harus disinkronisasikan ke URL browser (contoh: `/?lat=-6.59&lng=106.79`).
*   **Deep Linking:** Memastikan bahwa jika URL tersebut disalin dan dibuka di tab baru, peta otomatis mengarah (*pan/zoom*) ke koordinat tersebut dan memicu kalkulasi data.

### 4. Custom Architecture (`useMoonData`)
*   Membuat *custom react hook* bernama `useMoonData(lat, lng, date)`. Hook ini bertugas menerima koordinat spasial dan parameter tanggal, lalu mengembalikan data iluminasi, jarak bulan, dan nama fase bulan saat ini.

---

## 🎨 Spesifikasi Kreatif (Designer)

### 1. High-Fidelity Dashboard Mockup
*   Mentransformasikan wireframe low-fidelity Fase 1 menjadi desain visual beresolusi tinggi di Figma yang menggabungkan peta gelap dengan kontras visual panel data.

### 2. Custom Lunar Marker & Micro-Animations
*   **Dynamic Marker:** Mendesain ikon *marker* peta unik yang berubah bentuk secara dinamis mengikuti fase bulan di titik koordinat tersebut (bukan pin peta standar).
*   **Micro-Interactions:** Merancang animasi halus saat pengguna melakukan klik di peta (*click-to-place animation*) dan transisi saat *marker* muncul.

### 3. Map Controls UX & Tooltips
*   **Map Controls:** Merancang ulang tombol navigasi bawaan peta (*zoom-in*, *zoom-out*, *compass*, *reset view*) agar menyatu dengan tema minimalis.
*   **Hover States:** Mendesain tampilan jendela informasi kecil (*tooltip*) yang muncul di dekat kursor saat menjelajahi peta sebelum melakukan klik.

---

## 🎯 Kriteria Keberhasilan (Acceptance Criteria) Fase 2
1.  **Seamless State Sync:** Perubahan URL params (`?lat=...&lng=...`) harus berjalan lancar tanpa memicu *hard-reload* pada halaman Next.js.
2.  **Dynamic Icon Rendering:** *Marker* di atas peta harus berhasil berubah visualnya (misal: bentuk sabit, cembung, atau purnama) secara akurat sesuai data koordinat lokal yang diklik.
3.  **Responsive Controls:** Kontrol navigasi peta harus mudah diakses dan fungsional baik pada perangkat layar sentuh (mobile) maupun desktop (mouse).
4.  **Graceful Degradation:** Jika pengguna menolak izin Geolocation API, aplikasi harus beralih menggunakan koordinat *fallback* bawaan (default) tanpa merusak fungsionalitas peta.

---

## 📦 Komponen Baru yang Ditambahkan
```text
src/
├── components/
│   └── Map/
│       ├── CustomMarker.tsx       # Komponen marker fase bulan dinamis
│       ├── MapControls.tsx        # UI tombol kontrol peta kustom
│       └── TooltipInfo.tsx        # Hover tooltip koordinat
├── hooks/
│   ├── useMapSync.ts             # Hook untuk sinkronisasi URL params
│   └── useMoonData.ts             # Core hook kalkulator astronomi lokal