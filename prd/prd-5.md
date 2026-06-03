# Product Requirements Document (PRD) - MoonPhase GIS

## 🗓️ Fase 5: QA, Performa & Deployment

**Versi:** 1.0  
**Status:** Fase 5 (QA, Performa & Deployment)  
**Durasi:** Minggu 7–8  
**Peran Kunci:** Engineer & Designer  
**Target Utama:** Menjamin kualitas kode melalui pengujian sistematis, mengoptimalkan performa hingga mencapai standar tertinggi (Lighthouse 90+), memastikan aksesibilitas bagi semua pengguna, serta melakukan peluncuran (*deployment*) ke lingkungan produksi yang stabil.

---

## 🛠️ Spesifikasi Teknis (Engineer)

### 1. Automated Testing Suite
* **Unit Testing:** Mengimplementasikan pengujian unit menggunakan Jest dan React Testing Library untuk komponen logika kritis, terutama pada modul `moon-calculator.ts` dan *custom hooks*.
* **End-to-End (E2E) Testing:** Menyusun skenario pengujian alur utama (seperti: buka peta ➔ klik lokasi ➔ cek data sidebar ➔ ganti tanggal) menggunakan Playwright untuk memastikan integrasi antar komponen tidak pecah.

### 2. Performance Engineering & Optimization
* **Lighthouse Audit:** Melakukan audit berkala untuk memastikan skor minimal 90 pada kategori Performance, Accessibility, Best Practices, dan SEO.
* **Code Splitting:** Mengoptimalkan *bundle size* dengan teknik *dynamic import* pada setiap rute dan komponen besar (terutama pustaka GIS dan Charting) guna mempercepat *First Contentful Paint* (FCP).
* **Image Optimization:** Memastikan seluruh aset visual menggunakan format Next.js Image (`next/image`) dengan kompresi WebP/Avif.

### 3. Production Deployment & Monitoring
* **Vercel Deployment:** Konfigurasi *production-ready* pada platform Vercel, termasuk pengaturan *custom domain* dan sertifikat SSL.
* **Error Tracking & Analytics:** Integrasi Sentry untuk menangkap error pada sisi klien secara real-time dan Vercel Analytics untuk memantau performa *Web Vitals* dari pengguna asli.

---

## 🎨 Spesifikasi Kreatif (Designer)

### 1. Design QA & Pixel Perfection
* **Breakpoint Review:** Melakukan inspeksi visual mendalam pada seluruh *viewport* (Mobile, Tablet, Desktop, hingga Ultrawide) untuk memastikan konsistensi *padding, margin,* dan tata letak sesuai dengan desain High-Fidelity.
* **Visual Consistency:** Memastikan transisi warna, ketajaman ikon, dan *smoothness* animasi sudah memenuhi standar *premium feel*.

### 2. Accessibility (a11y) & Usability
* **WCAG 2.1 Compliance:** Audit kontras warna (minimal standar AA) dan memastikan seluruh elemen interaktif dapat diakses sepenuhnya melalui navigasi *keyboard* (Focus states).
* **Usability Testing:** Menyelenggarakan 2–3 sesi uji pakai internal untuk mendapatkan masukan mengenai kemudahan navigasi peta dan pemahaman data astronomi oleh pengguna awam.

### 3. Launch Assets & Documentation
* **Brand Assets:** Menyiapkan paket lengkap favicon (untuk berbagai perangkat) dan *OG Image* (Open Graph) yang dinamis untuk keperluan berbagi di media sosial.
* **Handoff Final:** Menyelesaikan dokumentasi komponen di Figma sebagai panduan referensi jika ada pengembangan lebih lanjut di masa depan.

---

## 🎯 Kriteria Keberhasilan (Acceptance Criteria) Fase 5
1.  **High-Performance Score:** Aplikasi harus mencapai skor Lighthouse ≥ 90 secara konsisten pada lingkungan produksi.
2.  **Zero Critical Bugs:** Tidak ada *bug* kategori kritis yang ditemukan pada alur utama pengujian E2E Playwright.
3.  **Keyboard Navigable:** Pengguna harus bisa mengoperasikan pencarian lokasi dan penggantian tanggal hanya menggunakan tombol Tab dan Enter.
4.  **Error-Free Launch:** Aplikasi berhasil dideploy dengan status SSL aktif dan sistem pemantauan (Sentry) terkonfigurasi dengan benar.

---

## 📦 Checklist Akhir Sebelum Launch
```text
[ ] Unit tests passed (Jest)
[ ] E2E flows verified (Playwright)
[ ] Lighthouse Audit 90+ across all metrics
[ ] Sentry & Vercel Analytics integrated
[ ] OG Images & Favicons generated
[ ] Accessibility (WCAG 2.1 AA) verified