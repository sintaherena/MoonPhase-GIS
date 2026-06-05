# Product Requirements Document (PRD) — MoonPhase GIS

## Phase 3: Lunar Data Panel & Visualization

**Version:** 1.0  
**Status:** Phase 3 — Complete  
**Duration:** Weeks 4–6  
**Key Roles:** Engineer & Designer  
**Primary Goal:** Build the information sidebar, implement client-side astronomical calculations, create SVG/Canvas moon visualizations, and integrate date navigation with data caching.

---

## Technical Specifications (Engineer)

### 1. Client-Side Astronomy Engine

- **Local Calculation:** SunCalc library for instant position, angle, and phase calculations
- **Fallback API:** Optional external astronomy API for accuracy validation

### 2. Sidebar Panel & Time Travel

- **MoonInfo Component:** Illumination %, distance, azimuth/elevation, moonrise/moonset
- **Date Picker:** Navigate to any past or future date to observe lunar cycle changes

### 3. Dynamic Visualizer & Performance

- **Real-Time Lunar Animation:** SVG or Canvas moon shadow rendering (new moon → full moon)
- **Resilience:** Loading skeleton prevents layout shift; error boundary isolates sidebar failures from the map

### 4. Data Fetching & Caching

- Memoized calculations via `useMemo` in `useMoonData` to avoid redundant CPU usage

---

## Creative Specifications (Designer)

### 1. Infographic Sidebar Design

Clean technical sidebar with premium infographic layout. Illumination % and phase name as focal points.

### 2. Progress Arc & Timeline Visualizer

- **Illumination Arc:** Circular neon progress arc for illumination percentage
- **Sun/Moon Timeline:** Linear timeline showing moonrise, transit, and moonset

### 3. Smooth Lunar Illustrations

Keyframe animation guide for shadow transitions (crescent → gibbous → full → waning).

### 4. Responsive Layout

Desktop-first with floating right sidebar; tablet/mobile bottom-sheet adaptation.

---

## Acceptance Criteria — Phase 3

1. **Astronomical Accuracy:** Local SunCalc results match official reference data within minimal deviation
2. **Fluid Animation:** Moon shadow transitions smoothly without visual glitches on date change
3. **No Layout Shift:** Loading skeleton maintains sidebar dimensions during data load
4. **Isolated Failures:** Sidebar calculation errors do not break map interactivity

---

## New Components

```text
src/components/Sidebar/
├── MoonInfo.tsx
├── Visualizer.tsx
└── Timeline.tsx
src/components/UI/
├── SkeletonSidebar.tsx
└── DateSelector.tsx
```
