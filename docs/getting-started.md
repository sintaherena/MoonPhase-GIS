# Getting Started

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
git clone <repository-url>
cd MoonPhase-GIS
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app uses a client-side mount gate to avoid SSR hydration issues with Leaflet. You will briefly see an "Initializing lunar map…" placeholder before the interactive map loads.

## Usage

### Select a Location

1. **Click the map** — places a pin and loads lunar data for that coordinate.
2. **Search** — type a city or place name in the search bar (minimum 3 characters).
3. **Share URL** — coordinates sync to the URL (`?lat=...&lng=...`) for deep linking.

### Explore Lunar Data

- Use the **date selector** in the sidebar to navigate days forward or backward.
- View phase name, illumination percentage, distance, azimuth, elevation, and moonrise/moonset.
- The **moon visualizer** shows an SVG representation of the current phase.
- The **timeline** displays moonrise, peak, and moonset on a 24-hour bar.

### Multi-Pin Comparison

1. Click **Enable** in the Multi-Pin Mode card.
2. Click the map to add up to 5 comparison pins.
3. Each pin shows phase, illumination, moonrise, and distance in a comparison table.

### Heatmap

Toggle the **Heatmap** button (top-left of map) to overlay lunar illumination intensity.

### Export & Share

1. Click **Export** (top-right of map).
2. **Export as JSON** — downloads pin and lunar data.
3. **Copy Share Link** — copies an encoded URL that restores pins, date, and map state.

## Production Build

```bash
npm run build
npm run start
```

## Environment

No environment variables are required. The app uses:

- **CartoDB** dark tiles (free, no API key)
- **Nominatim** geocoding (free, rate-limited)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Hydration error on load | Ensure you are on the latest code; map components use `ssr: false` |
| Map not loading | Check network access to `basemaps.cartocdn.com` |
| Search returns no results | Nominatim requires 3+ characters; respect rate limits |
| Marker context error | Markers must render inside `MapContainer` (as children of `MoonMap`) |
