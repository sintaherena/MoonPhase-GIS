# Product Requirements Document (PRD) — MoonPhase GIS

**Version:** 1.0  
**Status:** Phase 1 (Foundation & Project Setup)  
**Primary Goal:** Build a scalable technical foundation, enforce code quality standards, and establish the space-dark visual direction.

---

## Project Overview

MoonPhase GIS is an interactive web application combining GIS technology with precise astronomical calculations. Users explore a world map and receive detailed lunar data for any coordinate.

---

## Development Roadmap (5 Phases)

| Phase | Focus | Duration | Key Roles | Status |
|-------|-------|----------|-----------|--------|
| **Phase 1** | **Foundation & Project Setup** | **Weeks 1–2** | **Engineer & Designer** | **Complete** |
| Phase 2 | Core Engine & Map Integration | Weeks 3–4 | Backend Engineer | Complete |
| Phase 3 | UI High-Fidelity & GIS Visualization | Weeks 5–6 | Frontend & UI/UX | Complete |
| Phase 4 | Advanced Features & PWA | Weeks 7–8 | Full-stack Engineer | Complete |
| Phase 5 | Optimization, Security & Deployment | Weeks 9–10 | DevOps & QA | In Progress |

---

## Phase 1: Foundation & Project Setup

### A. Primary Objectives

Build scalable infrastructure, enforce code quality, and define the visual design system for consistency from day one.

### B. Technical Specifications (Engineer)

- **Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Code Quality:** ESLint and Prettier for automated formatting
- **Git Standards:** Commitlint for Conventional Commits (`feat:`, `fix:`, `chore:`)
- **GIS Infrastructure:** Leaflet.js via Next.js dynamic import with `ssr: false` to prevent hydration errors
- **CI/CD:** GitHub Actions workflow for linting and building on every pull request

### C. Creative Specifications (Designer)

- **Competitive Research:** Analyze ArcGIS and Google Maps UI for navigation standards
- **Design Tokens:** Space Dark color palette, Inter + JetBrains Mono typography, spacing scale
- **Wireframing:** Full-viewport map with floating sidebar panel
- **Figma Setup:** Base component library for high-fidelity transition

---

## Acceptance Criteria — Phase 1

1. **Zero Hydration Error:** Leaflet renders in the browser without SSR integration errors
2. **Lint-Clean:** No warnings or errors from `npm run lint`
3. **Standardized Commits:** All commits follow Conventional Commits format
4. **Responsive Layout Base:** Map fills maximum space; control panel adapts on desktop and mobile

---

## Target Folder Structure

```text
/
├── .github/workflows/ci.yml
├── docs/design-system.md
├── public/
├── src/
│   ├── app/
│   ├── components/Map/
│   ├── components/UI/
│   ├── lib/
│   ├── hooks/
│   └── types/
├── .commitlintrc.js
├── .prettierrc
└── tailwind.config.ts
```
