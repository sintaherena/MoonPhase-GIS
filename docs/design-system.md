# MoonPhase GIS — Design System

Visual direction, design tokens, and layout architecture for **Tailwind CSS** and **Figma**. Primary theme: **Space Dark Aesthetic** — a dark observatory-style interface with lunar highlights and cyber data accents.

---

## 1. Design Principles

| Principle | Description |
|-----------|-------------|
| **Immersive Map First** | The map is the hero; secondary UI must not obscure the viewport. |
| **Clarity in Darkness** | Sufficient contrast for text and numeric data without overpowering the map. |
| **Scientific Precision** | Coordinates, phases, and times use monospace typography. |
| **Calm Motion** | Subtle animations (fade, slide) — avoid distracting map exploration. |

---

## 2. Design Tokens

### 2.1 Colors (Hex)

| Token | Hex | Usage |
|-------|-----|-------|
| `space.deep` | `#0B0E14` | Main app background & area outside map |
| `space.surface` | `#12161F` | Sidebar panel, cards, light overlays |
| `space.elevated` | `#1A2030` | Tooltips, coordinate badges, elevated elements |
| `space.border` | `#2A3348` | Panel borders & dividers |
| `moonlight.DEFAULT` | `#E8ECF4` | Primary text, headings |
| `moonlight.muted` | `#9AA4B8` | Secondary text, placeholders |
| `moonlight.subtle` | `#6B7289` | Labels, metadata |
| `cyber.cyan` | `#22D3EE` | Interactive accents, active data highlights |
| `cyber.glow` | `#06B6D4` | Hover, focus ring, links |
| `lunar.silver` | `#C4CAD6` | Moon phase icons, secondary charts |
| `alert.amber` | `#FBBF24` | Warnings (weather, low visibility) |
| `success.emerald` | `#34D399` | Success / validated data status |
| `danger.rose` | `#FB7185` | Errors, invalid coordinates |

**Atmospheric gradient (optional, Figma):** radial from `#0B0E14` to `#151B28` at viewport corners for depth.

### 2.2 Typography

| Token | Font | Weight | Size (px) | Line height | Usage |
|-------|------|--------|-----------|-------------|-------|
| `display.lg` | Inter | 600 | 32 | 40 | App title (rare) |
| `heading.md` | Inter | 600 | 18 | 28 | Sidebar panel headings |
| `body.md` | Inter | 400 | 14 | 22 | Paragraphs, descriptions |
| `body.sm` | Inter | 400 | 12 | 18 | Captions, hints |
| `data.lg` | JetBrains Mono | 500 | 16 | 24 | Primary coordinates |
| `data.sm` | JetBrains Mono | 400 | 12 | 18 | Lat/Lng, timestamps |

**Font loading (Next.js):** Inter (`--font-inter`), JetBrains Mono (`--font-jetbrains-mono`).

### 2.3 Spacing Scale

4px grid aligned with Tailwind defaults.

| Token | Value | Tailwind |
|-------|-------|----------|
| `space.4` | 16px | `4` |
| `space.6` | 24px | `6` |
| `space.8` | 32px | `8` |
| `space.88` | 352px | `88` (max sidebar width) |

**Sidebar padding:** 24px desktop, 16px mobile.

### 2.4 Radius, Shadow, Border

| Token | Value |
|-------|-------|
| `radius.md` | 12px (`rounded-xl` panels) |
| `shadow.panel` | `0 8px 32px rgba(0,0,0,0.45)` |
| `border.subtle` | `1px solid rgba(255,255,255,0.08)` |

### 2.5 Z-Index Layers

| Layer | z-index | Elements |
|-------|---------|----------|
| Map base | 0 | Leaflet tiles |
| Map controls | 400 | Zoom controls |
| Coordinate overlay | 10 | Lat/lng badge |
| Floating sidebar | 20 | Astronomy panel |
| Modal / tour | 2000–3000 | Export modal, onboarding |

---

## 3. Layout Architecture

Full-viewport map with floating right panel:

```
┌─────────────────────────────────────────────────────────────┐
│  [Optional: thin top bar — logo, date, settings]              │
├──────────────────────────────────────────┬──────────────────┤
│                                          │                  │
│         MAP VIEWPORT (100% height)       │  Floating        │
│         Leaflet + Dark Matter tiles      │  Sidebar Panel   │
│         Click → capture Lat/Lng          │  (max ~352px)    │
│                                          │                  │
│                                          │  - Moon phase    │
│                                          │  - Illumination  │
│                                          │  - Rise/set      │
│                                          │  - Coordinates   │
│  [Coordinate badge bottom-left]          │                  │
└──────────────────────────────────────────┴──────────────────┘
```

### Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| `< 640px` | Panel full-width overlay; map behind |
| `≥ 640px` | Floating right panel, fixed width |
| `≥ 1024px` | Extra space for phase graphics |

---

## 4. UI Components

| Component | Status | Notes |
|-----------|--------|-------|
| `PanelShell` | Implemented | Sidebar container |
| `MoonMap` | Implemented | Map + click coordinates |
| `DateSelector` | Implemented | Date navigation |
| `Visualizer` | Implemented | SVG moon phase |
| `Timeline` | Implemented | Moonrise/moonset bar |
| `ComparisonPanel` | Implemented | Multi-pin comparison |
| `SearchBar` | Implemented | Location geocoding |
| `ExportModal` | Implemented | JSON export & share link |
| `OnboardingTour` | Implemented | First-visit guide |

---

## 5. Accessibility

- Text contrast `moonlight` on `space.surface`: minimum **4.5:1** for body text.
- Panels: descriptive `aria-label` attributes.
- Selected coordinates: `aria-live="polite"` on sidebar.
- Focus visible: `cyber.glow` 2px offset ring.
- Skip-to-content link in layout.

---

## 6. Tailwind Mapping

Tokens in `tailwind.config.ts`:

- `bg-space-deep`, `bg-space-surface`, `bg-space-elevated`
- `text-moonlight`, `text-moonlight-muted`
- `text-cyber-cyan`
- `font-sans` → Inter, `font-mono` → JetBrains Mono

---

## 7. Visual References

- Palette: night observatory, light HUD accents — not excessive neon.
- Mood references: NASA Eyes, Stellarium web, dark GIS dashboards.
- Avoid: generic purple-pink gradients, decorative display fonts on numeric data.

---

*Document version: 2.0 — English, all phases implemented*
