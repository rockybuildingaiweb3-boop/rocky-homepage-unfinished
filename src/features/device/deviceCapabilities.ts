export type ViewportCategory = 'mobile' | 'tablet' | 'desktop';

export const VIEWPORT_BREAKPOINTS = {
  mobileMax: 767, // Tailwind `md:` starts at min-width: 768px
  tabletMax: 1023, // Tailwind `lg:` starts at min-width: 1024px
} as const;

export interface StudioWebGLEligibilityInput {
  tier: number;
  isMobile: boolean;
  fps?: number;
  prefersReducedMotion: boolean;
}

/**
 * Classifies viewport width using the exact CSS breakpoint boundaries:
 * - mobile: <= 767px (< md)
 * - tablet: 768px..1023px (md..lg-1)
 * - desktop: >= 1024px (lg+)
 */
export function classifyViewportWidth(width: number): ViewportCategory {
  if (!Number.isFinite(width) || width <= VIEWPORT_BREAKPOINTS.mobileMax) {
    return 'mobile';
  }
  if (width <= VIEWPORT_BREAKPOINTS.tabletMax) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Aligns JS mobile detection with CSS `md:` (min-width: 768px) so 768px is treated
 * consistently as tablet across both CSS media queries and JS state hooks.
 */
export function isMobileViewportWidth(
  width: number,
  cssMdMinWidth = 768
): boolean {
  if (!Number.isFinite(width)) return false;
  return width < cssMdMinWidth;
}

/**
 * Centralized high-fidelity WebGL gating policy for Studio effects.
 */
export function computeStudioWebGLEligibility({
  tier,
  isMobile,
  fps = 60,
  prefersReducedMotion,
}: StudioWebGLEligibilityInput): boolean {
  if (prefersReducedMotion || isMobile) return false;
  return tier >= 2 && fps >= 30;
}
