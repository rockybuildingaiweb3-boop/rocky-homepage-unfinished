# Agent Guide

This document defines the working rules for AI coding agents and contributors modifying this repository.

## 1. Project Context

This repository contains Rocky Babcock's React/TypeScript single-page portfolio. It is a visually expressive production project with established artwork, animation systems, section interactions, and custom rendering code. Do not treat it as a generic starter template or rebuild it from scratch.

### Stack and toolchain

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4 and project-specific CSS
- Three.js + React Three Fiber
- Motion
- Bun 1.4.4, declared in `package.json`

Use Bun as the package manager and run the commands documented in `README.md`.

**Lockfile note:** `bun.lock` is the intended lockfile. The current GitHub `main` tree also contains a tracked `package-lock.json`, despite the project being configured for Bun. Do not update, regenerate, or delete that file as part of an unrelated task. Treat lockfile reconciliation as a separate, explicit repository-cleanup change.

## 2. Non-Negotiable Working Principles

1. **Inspect before editing.** Read the relevant files, their imports, their consumers, and the current repository state before proposing or changing code.
2. **Preserve existing behavior.** Do not remove features, animation states, keyboard interactions, fallbacks, assets, or public exports merely because they look redundant.
3. **Keep scope narrow.** Implement only the requested task. Do not combine an unrelated redesign, dependency update, file deletion, or architecture rewrite with a focused fix.
4. **Refactor by responsibility.** Split code when it establishes a clearer boundary or improves independent testing—not merely to reduce line count.
5. **Prefer incremental changes.** Make one coherent change at a time, keep diffs reviewable, and preserve a clear rollback path.
6. **Verify claims.** Never report tests, builds, browser behavior, or visual checks as passing unless they were actually executed.
7. **Do not invent project facts.** Confirm current scripts, versions, paths, and public interfaces from the repository before using them in code or documentation.

## 3. Architecture Map

```text
src/
├── App.tsx                     # Application-level composition
├── main.tsx                    # React entry point
├── pages/
│   └── HomePage.tsx            # Main page composition and section navigation
├── components/
│   ├── ceremony/               # Opening sequence components and geometry
│   ├── layout/                 # GlobalShell, Loader, Navbar, Footer, BackToTop
│   ├── sections/               # Home and Skills section components
│   ├── skills/                 # Living Orbit, skills atmosphere, technology logos
│   ├── studio/                 # Project gallery, WebGL renderer, shaders, details
│   └── ui/                     # Shared UI systems, including ParticleBackground
├── data/
│   ├── site/                   # Canonical site metadata
│   ├── skills.ts               # Skills dataset
│   └── studioProjects.ts       # Studio project dataset
├── features/
│   ├── audio/                  # Background-audio behavior
│   ├── cursor/                 # Custom cursor behavior
│   ├── device/                 # Framework-independent device calculations
│   ├── scroll/                 # Scroll behavior and pure scroll calculations
│   └── skills/                 # Skills algorithms, relationships, validation
└── hooks/                      # React hooks and browser integration
```

### Intended responsibility boundaries

- **Pages** compose sections and coordinate navigation; they should not become repositories for unrelated rendering algorithms.
- **Components** own presentation, DOM integration, and component lifecycle.
- **Features** should hold reusable domain behavior and pure calculations where possible.
- **Data** should contain canonical content/configuration rather than duplicate component state.
- **Scripts** own Node-side validation and asset processing. Browser components must not import Node-only tooling.
- **Tests** should exercise pure feature modules directly instead of importing large React/WebGL view components just to reach helper functions.

Keep dependencies flowing toward reusable logic. A pure feature module must not import a component to access a calculation.

## 4. Current Project-Specific Constraints

### Visual identity

Preserve the established design language unless the task explicitly requests a redesign:

- The botanical/tulip-inspired Home hero and its editorial typography.
- The cinematic opening ceremony, flower reveal, and handwritten signature treatment.
- The atmospheric starfield and its depth/parallax behavior.
- The interactive Studio project gallery and project-details presentation.
- The Skills Living Orbit visual, authentic technology marks, and category behavior.
- The existing Navbar, Footer, and BackToTop interactions.

Do not substitute generated placeholder imagery, generic icon circles, unrelated gradients, or a new design system for existing project assets and visual treatments.

### Skills and icon data

- The Skills section is backed by `src/data/skills.ts` and the icon resolution path in `src/components/skills/`.
- The repository validation scripts are part of the quality gate; do not bypass them to make a change pass.
- Confirm dynamic icon references and light/dark variants before deleting any SVG asset.
- Keep public asset URLs and fallback images valid.

### Scroll and section behavior

- `src/features/scroll/index.ts` is a real import path used by `src/pages/HomePage.tsx`; do not classify it as dead code.
- Keep section navigation, scroll-spy state, keyboard behavior, and reduced-motion behavior consistent.
- Do not introduce a complex global scroll-event bus unless a measured problem justifies it.

### Starfield refactor status

`src/components/ui/ParticleBackground.tsx` currently owns substantial starfield logic alongside rendering and browser lifecycle behavior. The first Phase 05 refactoring batch has been approved to extract pure starfield calculations into `src/features/starfield/starfieldEngine.ts`.

Until that extraction is actually present in the checked-out branch:

- Do not assume `src/features/starfield/starfieldEngine.ts` already exists.
- Keep the existing component exports and import paths compatible.
- Move only pure deterministic calculations into the engine; keep R3F, Canvas, GLSL, observers, media queries, and browser lifecycle code in the view/integration layer.
- Update scripts and tests to import the pure engine directly once it exists.
- Compare old and new outputs and preserve the existing 5,500-star / 800-star modes, seeded distribution, masking, visibility, and trail behavior.

### Device and motion preferences

A shared device-capability layer already exists in `src/hooks/useDeviceCapabilities.ts` and `src/features/device/deviceCapabilities.ts`. Before adding another media-query or device-detection mechanism, inspect the existing API and determine whether it can be reused.

Animation-heavy code must:

- Respect `prefers-reduced-motion`.
- Pause unnecessary work when the document is hidden or a section is outside the viewport.
- Avoid continuous RAF loops when no animation is active.
- Clean up RAF handles, timers, observers, and event listeners on unmount.
- Avoid React state updates for high-frequency pointer movement when a ref or CSS transform is sufficient.
- Avoid layout reads inside per-frame animation loops unless they are cached or demonstrably necessary.

### Package and asset discipline

- Use Bun; do not run `npm install` or silently rewrite lockfiles.
- Do not add a dependency when the platform or an existing utility already provides the required capability.
- Before removing a dependency, inspect runtime imports, scripts, build tooling, and transitive requirements.
- Before removing an asset, search direct string references, dynamic resolvers, data-driven paths, CSS, and fallback usage.
- Keep `sharp` while `scripts/process-flower.cjs` depends on it.
- Do not commit generated `dist/` output unless the task explicitly requires it.

## 5. Implementation Workflow

Before making a change:

1. Read the target module and its direct dependencies.
2. Search for all imports, exports, call sites, dynamic references, and tests.
3. Identify the public API and behavior that must remain stable.
4. State the smallest implementation scope and the tests that will prove it.

While making a change:

- Keep TypeScript types explicit and avoid unnecessary `any`.
- Prefer pure functions for geometry, easing, sampling, state transitions, and other deterministic logic.
- Keep browser APIs behind component/hook or browser-adapter boundaries.
- Use stable cleanup functions for listeners and observers.
- Avoid changing timing constants, geometry, star counts, easing curves, or asset selection during structural refactors.
- Do not add responsive redesign work unless it is explicitly part of the task; preserve existing viewport behavior.

After making a change:

1. Review the full diff for accidental unrelated edits.
2. Run the narrowest relevant test first.
3. Run the complete verification commands below for meaningful source/configuration changes.
4. For visual or interaction changes, run the application in a browser and inspect the affected section.
5. Report exact files changed, behavior preserved, commands executed, results, and any checks not performed.

## 6. Required Verification

Run these commands from the repository root:

```bash
bun --version
bun install --frozen-lockfile
bun run test
bun run lint
bun run build
```

Expected toolchain version: `1.4.4`.

The default test command includes the Skills validator, icon validator, and Node test suites. Do not replace it with a partial test command in CI or claim full verification after running only one suite.

For UI, animation, asset, or rendering changes, also verify the relevant browser flows. The established visual review set is:

- Home / Hero and Navbar
- Studio gallery and project details
- Skills and starfield
- Footer and BackToTop

Use the existing 1440 × 900 baseline captures when available. Distinguish intentional visual changes from regressions and document any expected differences.

## 7. Change Management

- Keep one logical change per commit or reviewable batch.
- Do not bundle cleanup with feature work unless explicitly requested.
- Do not delete compatibility exports until all callers have been migrated and verified.
- Do not rewrite the application architecture or replace major modules wholesale.
- Do not claim a performance improvement based only on source-code appearance; measure bundle size, frame activity, or runtime behavior.
- Do not claim that extracting code reduced bundle size unless production output confirms it.

## 8. Definition of Done

A change is complete only when:

- Its scope matches the task.
- Existing public behavior and visual identity are preserved unless a change was requested.
- TypeScript and relevant tests pass.
- A production build succeeds for meaningful code/configuration changes.
- Browser behavior is checked when the change affects UI, rendering, animation, or navigation.
- No new console/page errors or resource failures are introduced.
- The final report is explicit about what changed, what was tested, and what remains unverified.