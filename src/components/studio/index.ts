/**
 * Homepage Work Teaser Slider Components & Hooks
 * 
 * NOTE ON ARCHITECTURAL RESPONSIBILITY:
 * The modules in this directory (`StudioCard`, `StudioProgressBar`, `StudioProjectDetails`,
 * and `useStudioSliderPhysics`) power the cinematic Work teaser slider on the Exhibition Homepage (`/`).
 * 
 * They are presentation and physics components for the homepage spatial preview.
 * The authoritative, independent Studio destination routes and full-page layouts
 * belong exclusively to `src/pages/studio/`.
 */

export * from './components';
export * from './hooks';
export * from './types';
