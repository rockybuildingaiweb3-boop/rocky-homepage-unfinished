# Rocky Babcock — Personal Portfolio

A personal portfolio and creative development showcase for Rocky Babcock. The project combines editorial typography, botanical imagery, atmospheric particle systems, interactive project presentation, and a technology-focused skills experience.

## Overview

The site is organized as a single-page portfolio with four primary areas:

- **Home** — a cinematic opening sequence, botanical hero artwork, personal identity, and section navigation.
- **Studio** — an interactive horizontal project gallery with project details and supporting visual presentation.
- **Skills** — a categorized living-orbit visualization of the technologies and tools used across the work.
- **Contact** — social links, contact information, availability metadata, and a return-to-top interaction.

Global presentation systems include the custom cursor, ambient starfield, film-grain texture, navigation state, and optional background audio.

## Technology Stack

| Area | Technology |
| --- | --- |
| UI | React 19, TypeScript |
| Build tooling | Vite 6 |
| Styling | Tailwind CSS 4, project-specific CSS |
| 3D / rendering | Three.js, React Three Fiber |
| Motion | Motion |
| Device capability detection | detect-gpu |
| Technology marks | tech-stack-icons, simple-icons, local SVG assets |
| Package manager | Bun 1.4.4 |

## Getting Started

### Requirements

- [Bun](https://bun.sh/) **1.4.4** (the version declared by `package.json`).
- A modern browser with WebGL support for the full visual experience. The application also contains a 2D starfield fallback.

### Install

```bash
bun install --frozen-lockfile
```

### Run locally

```bash
bun run dev
```

Vite serves the application on `http://localhost:3000`.

### Build and preview

```bash
bun run build
bun run preview
```

The production build runs the Skills data validation script before invoking Vite.

## Project Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the Vite development server on port 3000. |
| `bun run test` | Run Skills validation, icon validation, and the Node test suites. |
| `bun run lint` | Run the TypeScript compiler with `--noEmit`. |
| `bun run build` | Validate Skills data, then create the production build. |
| `bun run preview` | Preview the production build locally. |
| `bun run clean` | Remove generated build output and the configured generated server file. |
| `bun run validate:skills` | Run the Skills dataset and layout validation. |
| `bun run validate:icons` | Validate icon resolution and local SVG assets. |
| `bun run optimize:flower` | Run the flower-image processing utility. |

`bun run test` currently includes:

1. `scripts/validateSkills.ts`
2. `scripts/validateIcons.ts`
3. `src/features/skills/livingOrbitEngine.test.ts`
4. `src/features/scroll/performanceOptimization.test.ts`

The validation scripts check the Skills and icon registries in addition to the unit tests. Keep these checks in the default test command when changing the project configuration.

## Repository Structure

```text
.
├── public/
│   └── assets/                 # Images, audio, icons, and other static assets
├── scripts/                    # Build-time validation and asset utilities
├── src/
│   ├── components/
│   │   ├── ceremony/           # Opening ceremony visual components
│   │   ├── layout/             # Global shell, navbar, footer, loader
│   │   ├── sections/           # Home and Skills section composition
│   │   ├── skills/             # Skills visualization and logo presentation
│   │   ├── studio/             # Project gallery and its rendering systems
│   │   └── ui/                 # Shared visual systems, including the starfield
│   ├── data/                   # Site metadata, Skills data, Studio projects
│   ├── features/               # Domain logic and reusable feature behavior
│   │   ├── audio/
│   │   ├── cursor/
│   │   ├── device/
│   │   ├── scroll/
│   │   └── skills/
│   ├── hooks/                  # React hooks for application-level behavior
│   ├── pages/                  # Page composition
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── bun.lock
├── tsconfig.json
└── vite.config.ts
```

### Application composition

- `src/main.tsx` mounts the React application.
- `src/App.tsx` coordinates device capabilities, asset preloading, and the application shell.
- `src/components/layout/GlobalShell.tsx` hosts persistent visual systems and the opening loader.
- `src/pages/HomePage.tsx` composes the Navbar, Home, Studio, Skills, and Footer areas.
- `src/data/` contains editable project, Skills, and site metadata.
- `src/features/` contains reusable feature logic that should remain independent of presentation where practical.

## Assets

Static assets are served from `public/` and referenced by URL paths such as `/assets/imgs/...` and `/videos/...`. Before replacing or removing an asset, inspect both direct references and dynamic lookup paths. Keep image fallbacks and theme-specific icon variants when they are still used by the UI.

## Development Notes

- Preserve the existing visual identity and interaction language. This is an established portfolio, not a blank starter template.
- Prefer small, reversible changes over broad rewrites.
- Keep pure algorithms and deterministic calculations in framework-independent feature modules when practical.
- Treat animation loops, observers, media listeners, timers, and event handlers as resources that require explicit cleanup.
- Respect `prefers-reduced-motion`, page visibility, and device capabilities in animation-heavy systems.
- Verify the main views—Home, Studio, Skills, and Footer—after changes that affect shared layout, rendering, or motion.

See [`AGENT.md`](./AGENT.md) for repository-specific instructions for AI coding agents and contributors.