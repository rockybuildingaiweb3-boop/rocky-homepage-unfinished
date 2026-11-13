import { VISUAL_CONSTANTS } from '../../constants/visual';

export interface HeroParallaxMetrics {
  safeScrollY: number;
  bgParallaxY: number;
  nebulaParallaxY: number;
  nebulaOffsetY: number;
  textParallaxY: number;
  dayToNightProgress: number;
  heroOpacity: number;
  heroScale: number;
  heroBlurPx: number;
  bgSaturate: number;
  bgBrightness: number;
  bottomGradientOpacity: number;
  sectionBackgroundColor: '#06040f' | '#ebe8e1';
}

/**
 * Pure calculation for Hero day-to-night multi-tier parallax transforms.
 * Keeps React free of per-frame scroll state updates.
 */
export function computeHeroParallaxMetrics(
  scrollY: number,
  viewportHeight: number
): HeroParallaxMetrics {
  const safeScrollY =
    typeof scrollY === 'number' && Number.isFinite(scrollY) ? Math.max(0, scrollY) : 0;
  const windowH =
    typeof viewportHeight === 'number' && Number.isFinite(viewportHeight) && viewportHeight > 0
      ? viewportHeight
      : 900;

  const bgParallaxY = safeScrollY * VISUAL_CONSTANTS.PARALLAX.BACKGROUND;
  const nebulaParallaxY = safeScrollY * VISUAL_CONSTANTS.PARALLAX.NEBULA;
  const textParallaxY = safeScrollY * VISUAL_CONSTANTS.PARALLAX.TEXT;

  const divisor = windowH * 0.85;
  const rawProgress = divisor > 0 ? safeScrollY / divisor : 0;
  const dayToNightProgress = Number.isFinite(rawProgress)
    ? Math.min(1, Math.max(0, rawProgress))
    : 0;

  return {
    safeScrollY,
    bgParallaxY,
    nebulaParallaxY,
    nebulaOffsetY: nebulaParallaxY - dayToNightProgress * 60,
    textParallaxY,
    dayToNightProgress,
    heroOpacity: Math.max(0, 1 - dayToNightProgress * 1.35),
    heroScale: Math.max(0.94, 1 - dayToNightProgress * 0.08),
    heroBlurPx: dayToNightProgress * 5,
    bgSaturate: Math.max(0.08, 1 - dayToNightProgress * 0.92),
    bgBrightness: Math.max(0.18, 1 - dayToNightProgress * 0.76),
    bottomGradientOpacity: Math.max(0.4, dayToNightProgress),
    sectionBackgroundColor: dayToNightProgress > 0.45 ? '#06040f' : '#ebe8e1',
  };
}

export interface SectionObservationSnapshot {
  id: string;
  isIntersecting: boolean;
  intersectionRatio: number;
  top: number;
  bottom: number;
}

export interface ActiveSectionResolveInput {
  sectionIds: readonly string[];
  snapshots: readonly SectionObservationSnapshot[];
  scrollY: number;
  viewportHeight: number;
  documentHeight: number;
  offsetRatio?: number;
}

/**
 * Pure active-section resolver used with IntersectionObserver snapshots and boundary checks.
 */
export function resolveActiveSection({
  sectionIds,
  snapshots,
  scrollY,
  viewportHeight,
  documentHeight,
  offsetRatio = 0.25,
}: ActiveSectionResolveInput): string {
  const fallback = sectionIds[0] || 'home';
  if (sectionIds.length === 0) return fallback;

  const safeScrollY = Number.isFinite(scrollY) ? Math.max(0, scrollY) : 0;
  const safeViewportH =
    Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : 900;

  if (safeScrollY <= 8) {
    return sectionIds[0];
  }

  if (
    Number.isFinite(documentHeight) &&
    documentHeight > safeViewportH &&
    safeScrollY + safeViewportH >= documentHeight - 24
  ) {
    return sectionIds[sectionIds.length - 1];
  }

  const intersecting = snapshots.filter((s) => s.isIntersecting && s.intersectionRatio > 0);
  if (intersecting.length > 0) {
    // Prefer the section covering the activation threshold, else highest intersection ratio
    const activationLine = safeViewportH * offsetRatio;
    const spanningLine = intersecting.filter(
      (s) => s.top <= activationLine && s.bottom >= activationLine
    );
    if (spanningLine.length > 0) {
      spanningLine.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      return spanningLine[0].id;
    }

    const sorted = [...intersecting].sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    return sorted[0].id;
  }

  // Fallback using observed bounding rect tops
  const activationLine = safeViewportH * offsetRatio;
  const byId = new Map(snapshots.map((s) => [s.id, s]));
  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const snap = byId.get(sectionIds[i]);
    if (snap && snap.top <= activationLine) {
      return snap.id;
    }
  }

  return fallback;
}
