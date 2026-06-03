# MoonPhase GIS — Design System

Dokumen ini merangkum arah visual, token desain, dan arsitektur layout untuk implementasi di **Tailwind CSS** dan **Figma**. Tema utama: **Space Dark Aesthetic** — antarmuka gelap seperti observatorium digital dengan aksen cahaya bulan dan sinyal data siber.

---

## 1. Prinsip Desain

| Prinsip | Deskripsi |
|--------|-----------|
| **Immersive Map First** | Peta adalah hero; UI sekunder tidak menutupi viewport. |
| **Clarity in Darkness** | Kontras cukup untuk teks dan data numerik tanpa mengganggu peta. |
| **Scientific Precision** | Koordinat, fase, dan waktu ditampilkan dengan tipografi monospace. |
| **Calm Motion** | Animasi halus (fade, slide) — hindari distraksi pada eksplorasi peta. |

---

## 2. Design Tokens

### 2.1 Warna (Hex)

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `space.deep` | `#0B0E14` | Background utama aplikasi & area di luar peta |
| `space.surface` | `#12161F` | Sidebar panel, card, overlay ringan |
| `space.elevated` | `#1A2030` | Tooltip, badge koordinat, elevasi kedua |
| `space.border` | `#2A3348` | Border panel & divider |
| `moonlight.DEFAULT` | `#E8ECF4` | Teks primer, heading |
| `moonlight.muted` | `#9AA4B8` | Teks sekunder, placeholder |
| `moonlight.subtle` | `#6B7289` | Label, metadata |
| `cyber.cyan` | `#22D3EE` | Aksen interaktif, highlight data aktif |
| `cyber.glow` | `#06B6D4` | Hover, focus ring, link |
| `lunar.silver` | `#C4CAD6` | Ikon fase bulan, grafik sekunder |
| `alert.amber` | `#FBBF24` | Peringatan (cuaca, visibilitas rendah) |
| `success.emerald` | `#34D399` | Status sukses / data tervalidasi |
| `danger.rose` | `#FB7185` | Error, koordinat tidak valid |

**Gradasi atmosfer (opsional, Figma):** radial dari `#0B0E14` ke `#151B28` di sudut viewport untuk kedalaman.

### 2.2 Tipografi

| Token | Font | Weight | Size (px) | Line height | Penggunaan |
|-------|------|--------|-----------|-------------|------------|
| `display.lg` | Inter | 600 | 32 | 40 | Judul aplikasi (jarang) |
| `heading.md` | Inter | 600 | 18 | 28 | Judul panel sidebar |
| `body.md` | Inter | 400 | 14 | 22 | Paragraf, deskripsi |
| `body.sm` | Inter | 400 | 12 | 18 | Caption, hint |
| `data.lg` | JetBrains Mono | 500 | 16 | 24 | Koordinat utama |
| `data.sm` | JetBrains Mono | 400 | 12 | 18 | Lat/Lng, timestamp |

**Loading font (Next.js):** Inter (`--font-inter`), JetBrains Mono (`--font-jetbrains-mono`).

### 2.3 Spacing Scale

Skala berbasis **4px grid** — selaras dengan Tailwind default + ekstensi proyek.

| Token | Nilai | Tailwind |
|-------|-------|----------|
| `space.0` | 0 | `0` |
| `space.1` | 4px | `1` |
| `space.2` | 8px | `2` |
| `space.3` | 12px | `3` |
| `space.4` | 16px | `4` |
| `space.5` | 20px | `5` |
| `space.6` | 24px | `6` |
| `space.8` | 32px | `8` |
| `space.10` | 40px | `10` |
| `space.12` | 48px | `12` |
| `space.18` | 72px | `18` (custom) |
| `space.88` | 352px | `88` (lebar sidebar max) |

**Padding panel sidebar:** `space.6` (24px) desktop, `space.4` (16px) mobile.

### 2.4 Radius, Shadow, Border

| Token | Nilai |
|-------|-------|
| `radius.sm` | 6px |
| `radius.md` | 12px (`rounded-xl` panel) |
| `radius.lg` | 16px (peta) |
| `shadow.panel` | `0 8px 32px rgba(0,0,0,0.45)` |
| `border.subtle` | `1px solid rgba(255,255,255,0.08)` |

### 2.5 Z-Index Layer

| Layer | z-index | Elemen |
|-------|---------|--------|
| Map base | 0 | Leaflet tiles |
| Map controls | 400 | Zoom (Leaflet default) |
| Coordinate overlay | 10 | Badge lat/lng di peta |
| Floating sidebar | 20 | Panel astronomi |
| Modal / drawer | 50 | Fase mendatang |

---

## 3. Layout Architecture (Low-Fidelity)

Struktur halaman utama mengikuti pola **full-viewport map + floating panel kanan**.

```
┌─────────────────────────────────────────────────────────────┐
│  [Optional: thin top bar — logo, date, settings]  (Fase 2+) │
├──────────────────────────────────────────┬──────────────────┤
│                                          │                  │
│                                          │  Floating        │
│         MAP VIEWPORT (100% height)       │  Sidebar Panel   │
│         Leaflet + Dark Matter tiles      │  (max ~352px)    │
│         Click → capture Lat/Lng          │                  │
│                                          │  - Moon phase    │
│                                          │  - Illumination  │
│                                          │  - Rise/set      │
│                                          │  - Coordinates   │
│                                          │                  │
│  [Coordinate badge bottom-left]          │                  │
│                                          │                  │
└──────────────────────────────────────────┴──────────────────┘
```

### 3.1 Map Viewport

- Mengisi **seluruh tinggi layar** (`h-screen`).
- `position: relative` pada wrapper; peta `absolute inset-0`.
- Tile: CartoDB Dark Matter (gratis, atribusi OSM + CARTO).
- Interaksi primer: **klik** untuk memilih titik observasi.

### 3.2 Floating Sidebar Panel (Kanan)

- `position: absolute`; `right: 0`; `top: 0`; `height: 100%`.
- Lebar: `100%` pada mobile dengan `max-width: 22rem` (352px) pada desktop.
- Background: `space.surface` dengan **backdrop-blur** dan border `white/10`.
- Konten scroll vertikal jika data astronomi panjang.
- Tidak menutupi pusat peta — margin/padding `16–24px` dari tepi.

### 3.3 Responsif

| Breakpoint | Perilaku |
|------------|----------|
| `< 640px` | Panel full-width overlay; peta tetap di belakang |
| `≥ 640px` | Panel mengambang kanan, lebar tetap |
| `≥ 1024px` | Ruang tambahan untuk grafik fase (Fase 2+) |

---

## 4. Komponen UI (Roadmap Figma)

| Komponen | Status Fase 1 | Catatan |
|----------|---------------|---------|
| `PanelShell` | Implementasi awal | Container sidebar |
| `MoonMap` | Implementasi awal | Peta + klik koordinat |
| `PhaseIndicator` | Figma only | Visual fase 8-state |
| `CoordinateDisplay` | Partial (mono di panel) | |
| `Button / IconButton` | Figma | Cyber cyan primary |

---

## 5. Aksesibilitas

- Kontras teks `moonlight` pada `space.surface`: minimal **4.5:1** untuk body.
- Panel: `aria-label` deskriptif.
- Koordinat terpilih: `aria-live="polite"` pada badge peta.
- Focus visible: ring `cyber.glow` 2px offset.

---

## 6. Mapping ke Tailwind

Token di `tailwind.config.ts` sudah memetakan subset inti:

- `bg-space-deep`, `bg-space-surface`, `bg-space-elevated`
- `text-moonlight`, `text-moonlight-muted`
- `text-cyber-cyan`
- `font-sans` → Inter, `font-mono` → JetBrains Mono

Perluasan warna (`alert`, `lunar`, dll.) ditambahkan pada fase implementasi UI berikutnya.

---

## 7. Referensi Visual

- Palet: observatorium malam, HUD ringan, bukan neon berlebihan.
- Referensi mood: NASA Eyes, Stellarium web, dark GIS dashboards.
- Hindari: gradient ungu-pink generik, font display dekoratif pada data numerik.

---

*Versi dokumen: 1.0 — Fase 1 (Minggu 1–2)*
