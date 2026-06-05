# Product Requirements Document (PRD) — MoonPhase GIS

## Phase 2: Interactive Map & Coordinates

**Version:** 1.0  
**Status:** Phase 2 — Complete  
**Duration:** Weeks 2–4  
**Key Roles:** Engineer & Designer  
**Primary Goal:** Implement a full-screen interactive map, capture geographic coordinates from user interaction, provide URL-based state management, and customize lunar phase markers.

---

## Technical Specifications (Engineer)

### 1. Full-Screen Map Implementation

- Interactive map filling the viewport (100vh/100vw)
- Dark-mode tile layer (CartoDB Dark Matter) maintaining space-dark aesthetics

### 2. Coordinate Capture & Geolocation

- **Event Handler:** `onClick` on the map captures precise latitude and longitude
- **Geolocation API:** Optional automatic location detection via browser GPS permission

### 3. State Management & URL Sync

- **URL Params Sync:** Coordinates sync to browser URL (`/?lat=-6.59&lng=106.79`)
- **Deep Linking:** Opening a shared URL pans/zooms to coordinates and triggers calculations

### 4. Custom Architecture (`useMoonData`)

- Custom React hook `useMoonData(lat, lng, date)` returning illumination, distance, and phase name

---

## Creative Specifications (Designer)

### 1. High-Fidelity Dashboard Mockup

Transform Phase 1 wireframes into high-resolution Figma designs combining dark map with contrasting data panel.

### 2. Custom Lunar Marker & Micro-Animations

- **Dynamic Marker:** Map icon changes shape based on moon phase at the coordinate
- **Micro-Interactions:** Smooth click-to-place and marker appearance animations

### 3. Map Controls UX & Tooltips

- **Map Controls:** Redesigned zoom, compass, and reset view buttons matching minimal theme
- **Hover States:** Coordinate tooltip near cursor before clicking

---

## Acceptance Criteria — Phase 2

1. **Seamless State Sync:** URL param changes work without hard page reload
2. **Dynamic Icon Rendering:** Markers visually reflect phase (crescent, gibbous, full moon)
3. **Responsive Controls:** Map controls work on touch (mobile) and mouse (desktop)
4. **Graceful Degradation:** Denied geolocation falls back to default coordinates without breaking the map

---

## New Components

```text
src/components/Map/
├── CustomMarker.tsx
├── MapControls.tsx
└── TooltipInfo.tsx
src/hooks/
├── useMapSync.ts
└── useMoonData.ts
```
