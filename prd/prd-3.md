# Product Requirements Document (PRD) - MoonPhase GIS

## 🗓️ Fase 3: Panel Lunar Data & Visualisasi

**Versi:** 1.0  
**Status:** Fase 3 (Panel Lunar Data & Visualisasi)  
**Durasi:** Minggu 4–6  
**Peran Kunci:** Engineer & Designer  
**Target Utama:** Membangun panel informasi (Sidebar), mengimplementasikan kalkulasi data astronomi di sisi klien, membuat animasi visualisasi bulan berbasis SVG/Canvas, serta mengintegrasikan penjelajahan waktu (*date picker*) dengan optimasi manajemen data (*caching*).

---

## 🛠️ Spesifikasi Teknis (Engineer)

### 1. Client-Side Astronomy Engine & API Integration
*   **Local Calculation:** Mengintegrasikan pustaka matematika astronomi (seperti `SunCalc`) untuk melakukan kalkulasi posisi, sudut, dan fase bulan secara instan di sisi klien berdasarkan parameter koordinat dan waktu.
*   **Fallback API:** Menyiapkan integrasi eksternal API Astronomy sebagai penyedia data sekunder untuk validasi tingkat akurasi akurasi data lokal.

### 2. Sidebar Panel Component & Time Travel
*   **MoonInfo Component:** Membangun komponen penampung data di *sidebar* yang menampilkan persentase iluminasi, jarak bulan dalam kilometer, sudut azimuth/elevasi, serta estimasi waktu *moonrise* dan *moonset*.
*   **Date Picker Integration:** Menambahkan kontrol kalender (*date picker*) yang memungkinkan pengguna melompat ke tanggal berapa pun di masa lalu atau masa depan guna memantau perubahan siklus bulan pada koordinat terpilih.

### 3. Dynamic Visualizer & Performance
*   **Real-Time Lunar Animation:** Memprogram mesin visualisasi bulan yang responsif menggunakan SVG dinamis atau HTML5 Canvas untuk merender bentuk bayangan bulan (dari *new moon* hingga *full moon*) secara mulus.
*   **Resilience & Stability:** Menerapkan *Loading Skeleton* transparan untuk mencegah efek *layout shift* saat memproses kalkulasi, serta memasang *Error Boundary* terisolasi agar kegagalan render panel data tidak meruntuhkan komponen peta utama.

### 4. Data Fetching & Caching Strategy
*   **State Optimization:** Menggunakan React Query atau SWR untuk mengelola manajemen data dan melakukan *caching* otomatis pada hasil kalkulasi koordinat/tanggal yang sama guna menghemat konsumsi daya CPU.

---

## 🎨 Spesifikasi Kreatif (Designer)

### 1. Infographic Sidebar Design
*   Merancang tata letak *sidebar* data teknis yang bersih dengan pendekatan infografis premium. Mengatur hierarki visual agar informasi penting (seperti % Iluminasi dan Nama Fase) menjadi pusat perhatian utama (*Focal Point*).

### 2. Progress Arc & Timeline Visualizer
*   **Illumination Arc:** Mendesain elemen pengukur berbentuk busur melingkar (*Progress Arc*) neon minimalis untuk merepresentasikan persentase cahaya bulan.
*   **Sun/Moon Timeline:** Membuat visualisasi garis waktu (*timeline tracker*) linier yang menggambarkan pergerakan bulan terbit, titik kulminasi, hingga tenggelam secara intuitif.

### 3. Smooth Lunar Illustrations
*   Membuat aset dan panduan keyframe animasi transisi perubahan bayangan bulan (*crescent* ➔ *gibbous* ➔ *full moon* ➔ *waning*) yang presisi secara matematis namun tetap estetis.

### 4. Responsive Layout (Desktop-First with Tablet Support)
*   Memastikan fleksibilitas *layout* dengan pendekatan *Desktop-First* (Sidebar kokoh di sisi kanan/kiri dengan lebar tetap), serta menyediakan adaptasi *Tablet/Mobile support* di mana panel dapat digeser ke bawah (*Bottom Sheet Panel*).

---

## 🎯 Kriteria Keberhasilan (Acceptance Criteria) Fase 3
1.  **Astronomical Accuracy:** Hasil kalkulasi fase dan waktu terbit/tenggelam bulan dari mesin lokal (`SunCalc`) harus memiliki deviasi minimal jika dicocokkan dengan data resmi.
2.  **Fluid Animation:** Animasi visualisasi bayangan bulan pada SVG/Canvas harus bergeser secara halus tanpa ada patahan visual (*glitch*) saat pengguna menggeser atau mengubah tanggal.
3.  **No Layout Shift:** Penggunaan *loading skeleton* harus mempertahankan struktur dimensi *sidebar* agar elemen UI di sekitarnya tidak melompat saat data selesai dimuat.
4.  **Isolated Failures:** Jika terjadi kegagalan kalkulasi tanggal ekstrem pada *sidebar*, komponen peta interaktif di latar belakang harus tetap dapat digeser dan diklik secara normal.

---

## 📦 Komponen Baru yang Ditambahkan
```text
src/
├── components/
│   ├── Sidebar/
│   │   ├── MoonInfo.tsx          # Panel utama informasi data lunar
│   │   ├── Visualizer.tsx        # Render komponen animasi SVG/Canvas bulan
│   │   └── Timeline.tsx          # Garis waktu visualisasi moonrise/moonset
│   └── UI/
│       ├── SkeletonSidebar.tsx   # Loading placeholder untuk panel data
│       └── DateSelector.tsx      # Komponen kontrol kalender/waktu