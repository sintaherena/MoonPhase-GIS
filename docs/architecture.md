# Architecture

## Overview

MoonPhase GIS is a client-rendered Next.js application. All astronomical calculations run in the browser using the `suncalc3` library. No backend API is required.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
├─────────────────────────────────────────────────────────────┤
│  page.tsx (HomePageContent)                                  │
│    ├── useMapSync        → URL params, shared state          │
│    ├── useMoonData       → moonCalc for selected coordinate  │
│    ├── useMultiPin       → comparison pins management        │
│    └── MoonMap (dynamic, ssr: false)                         │
│          ├── MapContainer (react-leaflet)                    │
│          │     ├── TileLayer (CartoDB dark)                  │
│          │     ├── HeatmapLayer                              │
│          │     ├── CustomMarker(s)                           │
│          │     └── MapController (flyTo)                     │
│          ├── SearchBar (Nominatim geocoding)                 │
│          └── Sidebar (MoonInfo, Visualizer, Timeline)        │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### SSR-Safe Map Loading

Leaflet requires `window` and cannot render on the server. The app uses two strategies:

1. **`next/dynamic` with `ssr: false`** for `MoonMap`, `CustomMarker`, and `HeatmapLayer`.
2. **Mount gate** in `page.tsx` — server and client both render an identical placeholder until `useEffect` sets `isMounted = true`.

### React-Leaflet Context

Components using `useMap()`, `Marker`, or `useMapEvents()` must be descendants of `<MapContainer>`. Markers are rendered as children of `MoonMap`, not as CSS overlays outside the map.

### State Management

| State | Storage | Hook |
|-------|---------|------|
| Selected coordinate | URL params (`?lat=&lng=`) | `useMapSync` |
| Shared dashboard state | URL param (`?state=`) | `useMapSync` + `stateCodec` |
| Selected date | React state | `page.tsx` |
| Multi-pin data | React state | `useMultiPin` |
| Onboarding seen | localStorage | `OnboardingTour` |

### Data Flow

```
User clicks map
  → MapClickHandler captures lat/lng
  → useMapSync updates coordinate + URL
  → useMoonData(coordinate, date) recalculates via moonCalc
  → Sidebar renders MoonInfo, Visualizer, Timeline
```

## Module Reference

| Module | Responsibility |
|--------|----------------|
| `lib/moonCalc.ts` | SunCalc wrapper: phase, illumination, rise/set |
| `lib/stateCodec.ts` | Base64 encode/decode for share URLs |
| `hooks/useMapSync.ts` | URL sync, deep linking, shared state |
| `hooks/useMoonData.ts` | Memoized moon data with loading/error |
| `hooks/useMultiPin.ts` | Pin CRUD, color assignment, moon data per pin |
| `components/Map/MoonMap.tsx` | Leaflet container, click/hover handlers |
| `components/Map/HeatmapLayer.tsx` | Canvas-based illumination overlay |
| `components/Map/SearchBar.tsx` | Nominatim autocomplete search |

## PWA

- `public/sw.js` — service worker for asset caching
- `public/manifest.json` — installable app manifest
- `public/offline.html` — fallback page when offline
