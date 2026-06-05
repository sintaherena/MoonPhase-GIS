# Testing

## Overview

MoonPhase GIS uses a two-layer testing strategy:

| Layer | Tool | Location |
|-------|------|----------|
| Unit | Jest + React Testing Library | `src/__tests__/` |
| E2E | Playwright | `e2e/` |

## Unit Tests

```bash
npm test                  # run all tests
npm run test:watch        # watch mode
npm run test:coverage     # with coverage report
```

### Test Suites

| Suite | Covers |
|-------|--------|
| `moonCalc.test.ts` | Phase names, labels, moon data calculations |
| `stateCodec.test.ts` | Share URL encode/decode round-trip |
| `useMultiPin.test.ts` | Pin add/remove/select, moon data attachment |
| `ComparisonPanel.test.tsx` | Multi-pin UI states and interactions |
| `OnboardingTour.test.tsx` | Tour steps, skip, localStorage persistence |

## End-to-End Tests

### Setup

```bash
npx playwright install chromium
```

### Run

```bash
npm run test:e2e          # headless
npm run test:e2e:ui       # interactive UI
```

Playwright starts the dev server automatically on port **3456** (`webServer` in `playwright.config.ts`) to avoid conflicts with a running `npm run dev` on port 3000.

### E2E Scenarios

| Test | Verifies |
|------|----------|
| Page loads | Title, map section, sidebar visible |
| Search bar | Input visible and focusable |
| Date selector | Previous/next day buttons work |
| Export modal | Opens on Export button click |
| Multi-pin mode | Enable button activates comparison UI |
| Heatmap toggle | Button activates cyan styling |
| Map click | Clicking map triggers sidebar data |
| Screenshots | Captures 4 docs screenshots |

### Screenshot Generation

Screenshots are saved to `docs/screenshots/`:

```bash
npm run test:e2e -- --grep "capture app screenshots"
```

Onboarding is suppressed via `localStorage` init script so screenshots are clean.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs lint, build, and tests on pull requests.

## Writing New Tests

- **Unit:** Place tests in `src/__tests__/` mirroring source structure.
- **E2E:** Add specs to `e2e/app.spec.ts` or new files in `e2e/`.
- Use English UI strings in selectors (the app language is English).
- Disable onboarding in E2E via `localStorage.setItem('moonphase-gis-onboarding-seen', 'true')`.
