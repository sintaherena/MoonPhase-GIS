# Product Requirements Document (PRD) - MoonPhase GIS

**Versi:** 1.0  
**Status:** Fase 1 (Fondasi & Setup Proyek)  
**Target Utama:** Membangun platform pemetaan interaktif yang menyajikan data astronomi bulan berbasis lokasi secara real-time dengan estetika *space-dark*.

---

## 🗺️ Gambaran Umum Proyek
MoonPhase GIS adalah aplikasi web interaktif yang menggabungkan teknologi GIS (Geographic Information System) dengan kalkulasi astronomi presisi. Pengguna dapat mengeksplorasi peta bumi dan mendapatkan data mendalam mengenai kondisi bulan di titik koordinat tertentu.

---

## 🗓️ Peta Jalan Pengembangan (5 Fase)

| Fase | Fokus Utama | Durasi | Peran Kunci | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Fase 1** | **Fondasi & Setup Proyek** | **Minggu 1-2** | **Engineer & Designer** | **In Progress** |
| **Fase 2** | Core Engine & Integrasi Database | Minggu 3-4 | Backend Engineer | Terjadwal |
| **Fase 3** | UI High-Fidelity & GIS Visualization | Minggu 5-6 | Frontend & UI/UX | Terjadwal |
| **Fase 4** | Fitur Otonom & Persistent Memory | Minggu 7-8 | AI Agent Engineer | Terjadwal |
| **Fase 5** | Optimasi, Security, & Deployment | Minggu 9-10 | DevOps & QA | Terjadwal |

---

## 🛠️ Fase 1: Fondasi & Setup Proyek (Detail)

### A. Tujuan Utama
Membangun infrastruktur teknis yang *scalable*, menerapkan standar kualitas kode, serta menentukan arah visual (*design system*) proyek agar konsisten sejak awal.

### B. Spesifikasi Teknis (Engineer)
*   **Tech Stack Utama:** Next.js 14 (App Router), TypeScript, dan Tailwind CSS.
*   **Kualitas Kode (Code Quality):** Konfigurasi ESLint dan Prettier untuk otomatisasi pemformatan kode.
*   **Git Standarisasi:** Integrasi Husky dan Commitlint untuk memastikan seluruh riwayat komit mematuhi standar *Conventional Commits* (seperti `feat:`, `fix:`, `chore:`).
*   **Infrastruktur GIS:** Integrasi Leaflet.js menggunakan *Dynamic Import* Next.js dengan opsi `ssr: false` guna menghindari kendala *hydration error* di sisi server.
*   **CI/CD Pipeline:** Setup workflow GitHub Actions dasar untuk otomatis menjalankan proses *linting* dan *building* pada setiap *Pull Request* ke branch utama.

### C. Spesifikasi Kreatif (Designer)
*   **Riset Kompetitif:** Menganalisis antarmuka pengguna (UI) dari platform GIS besar seperti ArcGIS dan Google Maps untuk menentukan standar kenyamanan navigasi peta.
*   **Definisi Design Tokens:** Menyusun variabel warna (*Space Dark Aesthetic*), tipografi (kombinasi font sans-serif modern dan monospace untuk data angka), serta skala jarak (*spacing*).
*   **Wireframing:** Membuat tata letak *low-fidelity* (Map viewport penuh dengan *floating* atau *fixed* Sidebar Panel di sisi kanan/kiri).
*   **Figma Setup:** Menyusun pustaka komponen (*Component Library*) dasar di Figma untuk mempermudah transisi ke desain *high-fidelity*.

---

## 🎯 Kriteria Keberhasilan (Acceptance Criteria) Fase 1
1. **Zero Hydration Error:** Peta Leaflet harus ter-render dengan sempurna di browser tanpa menghasilkan error integrasi SSR pada konsol.
2. **Lint-Clean:** Tidak ada peringatan atau error yang tersisa saat menjalankan perintah `npm run lint`.
3. **Standardized Commits:** Setiap proses *commit* lokal wajib divalidasi oleh Husky; komit akan ditolak jika tidak mengikuti format konvensional.
4. **Responsive Layout Base:** Kerangka layout dasar harus memastikan area peta menempati ruang maksimal dengan panel kontrol yang adaptif di desktop maupun mobile.

---

## 📦 Target Struktur Folder
```text
/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   └── design-system.md
├── public/
│   └── assets/
├── src/
│   ├── app/           # Routing dan layout utama
│   ├── components/
│   │   ├── Map/       # Logika dan pembungkus Leaflet
│   │   └── UI/        # Komponen UI umum (Button, Card, Panel)
│   ├── lib/           # Logika matematika kalkulasi fase bulan
│   ├── hooks/         # Custom hooks fungsionalitas GIS
│   └── types/         # Global TypeScript interfaces & Zod schemas
├── .commitlintrc.js
├── .prettierrc
└── tailwind.config.ts