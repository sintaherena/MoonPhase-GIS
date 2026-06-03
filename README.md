# MoonPhase GIS

Geospatial lunar phase explorer built with Next.js, React Leaflet, and a space-dark design system.

## Phase 1 — Foundation

This repository includes:

- Code quality: Prettier, Commitlint (Conventional Commits), GitHub Actions CI
- Anti-SSR map: `react-leaflet` via Next.js `dynamic` import
- Design tokens documented in [`docs/design-system.md`](docs/design-system.md)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click the map to capture coordinates in the sidebar panel.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (Next.js) |
| `npm run format` | Format with Prettier |

## Project Structure

```
src/
├── app/              # Next.js App Router pages & layout
├── components/
│   ├── Map/          # MoonMap + dynamic SSR-safe export
│   └── UI/           # Shared UI primitives
├── hooks/            # Client hooks (e.g. useGeoCoordinate)
├── lib/              # Constants & utilities
└── types/            # Global GIS & moon phase types
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/). Config: `commitlint.config.js`.

## License

Private — MoonPhase GIS project.
