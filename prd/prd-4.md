# Product Requirements Document (PRD) — MoonPhase GIS

## Phase 4: Advanced Features & GIS

**Version:** 1.0  
**Status:** Phase 4 — Complete  
**Duration:** Weeks 6–7  
**Key Roles:** Engineer & Designer  
**Primary Goal:** Multi-location comparison, advanced map overlays, geocoding search, share state mechanism, and PWA offline support.

---

## Technical Specifications (Engineer)

### 1. Multi-Pin Analytics Mode

- **Multi-Location Tracking:** Support multiple pins on the map simultaneously
- **Comparison Engine:** Compare astronomical metrics (moonrise time, illumination %) across 2+ locations

### 2. Advanced GIS Layer & Geocoding

- **Illumination Heatmap Overlay:** Visual heatmap layer showing lunar illumination coverage
- **Geocoding Integration:** Nominatim OpenStreetMap search with autocomplete

### 3. Data Export & Full State Sharing

- **JSON Export:** Download pin and lunar data as `.json`
- **Encoded URL State:** Base64-compressed application state (pins, date, layers) in shareable URLs

### 4. Progressive Web App (PWA)

- **Service Worker:** Cache essential assets and enable offline access
- **Offline Functionality:** App opens and runs local moon calculations without internet

---

## Creative Specifications (Designer)

### 1. Multi-Pin Comparison UI

Efficient spatial comparison interface without clutter. Color-coded markers correlating with comparison table rows.

### 2. Heatmap Overlay & Legend

Gradient illumination heatmap palette contrasting with dark map tiles. Corner legend explaining intensity levels.

### 3. Search Bar, Onboarding & Modals

- **Search UX:** Floating search bar with loading, empty state, and text highlighting
- **Onboarding Tour:** Step-by-step overlay for first-time visitors
- **Export/Share Dialog:** Modal for export options and link copying with smooth transitions

---

## Acceptance Criteria — Phase 4

1. **Independent Multi-Pins:** Add, remove, and select pins independently without breaking other calculations
2. **Robust Geocoding:** Search responds after typing stops; map flies to selected location
3. **Flawless State Recovery:** Encoded share links restore exact map position, pins, and calendar date
4. **Installable PWA:** Passes Lighthouse PWA audit; shows install prompt on mobile and desktop

---

## New Components

```text
src/components/Map/
├── HeatmapLayer.tsx
└── SearchBar.tsx
src/components/Sidebar/
└── ComparisonPanel.tsx
src/components/UI/
├── ExportModal.tsx
└── OnboardingTour.tsx
```
