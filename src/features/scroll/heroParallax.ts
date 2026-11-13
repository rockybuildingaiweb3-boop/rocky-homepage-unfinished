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

export interface HeroMouseParallaxInput {
  pointerX: number;
  pointerY: number;
  viewportWidth: number;
  viewportHeight: number;
  prefersReducedMotion?: boolean;
}

export interface HeroMouseParallaxOffsets {
  bgX: number;
  bgY: number;
  nebulaX: number;
  nebulaY: number;
  titleX: number;
  titleY: number;
  signatureX: number;
  signatureY: number;
  foregroundX: number;
  foregroundY: number;
}

const clampUnit = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * Computes restrained multi-plane optical parallax offsets (in px) from pointer position
 * so the sky halo, watercolor tulips, title monogram, and sunlit pollen motes breathe
 * with cohesive depth while staying subtle.
 */
export function computeHeroMouseParallax({
  pointerX,
  pointerY,
  viewportWidth,
  viewportHeight,
  prefersReducedMotion = false,
}: HeroMouseParallaxInput): HeroMouseParallaxOffsets {
  if (
    prefersReducedMotion ||
    !Number.isFinite(pointerX) ||
    !Number.isFinite(pointerY) ||
    viewportWidth <= 0 ||
    viewportHeight <= 0
  ) {
    return {
      bgX: 0,
      bgY: 0,
      nebulaX: 0,
      nebulaY: 0,
      titleX: 0,
      titleY: 0,
      signatureX: 0,
      signatureY: 0,
      foregroundX: 0,
      foregroundY: 0,
    };
  }

  const nx = clampUnit((pointerX / viewportWidth) * 2 - 1);
  const ny = clampUnit((pointerY / viewportHeight) * 2 - 1);

  return {
    bgX: Number((-nx * 6.5).toFixed(2)),
    bgY: Number((-ny * 4.5).toFixed(2)),
    nebulaX: Number((nx * 11).toFixed(2)),
    nebulaY: Number((ny * 7.5).toFixed(2)),
    titleX: Number((nx * 4.2).toFixed(2)),
    titleY: Number((ny * 2.8).toFixed(2)),
    signatureX: Number((nx * 7.4).toFixed(2)),
    signatureY: Number((ny * 4.8).toFixed(2)),
    foregroundX: Number((-nx * 12).toFixed(2)),
    foregroundY: Number((-ny * 8).toFixed(2)),
  };
}

export interface MagneticCtaInput {
  pointerX: number;
  pointerY: number;
  rectLeft: number;
  rectTop: number;
  rectWidth: number;
  rectHeight: number;
  prefersReducedMotion?: boolean;
  proximityPx?: number;
  maxPullX?: number;
  maxPullY?: number;
}

export interface MagneticCtaState {
  isNear: boolean;
  translateX: number;
  translateY: number;
  innerX: number;
  innerY: number;
  spotXPercent: number;
  spotYPercent: number;
}

/**
 * Computes bounded magnetic pull & internal light spot coordinates when the pointer
 * approaches the primary Enter the Studio CTA.
 */
export function computeMagneticCtaOffset({
  pointerX,
  pointerY,
  rectLeft,
  rectTop,
  rectWidth,
  rectHeight,
  prefersReducedMotion = false,
  proximityPx = 56,
  maxPullX = 9,
  maxPullY = 6,
}: MagneticCtaInput): MagneticCtaState {
  if (
    prefersReducedMotion ||
    rectWidth <= 0 ||
    rectHeight <= 0 ||
    !Number.isFinite(pointerX) ||
    !Number.isFinite(pointerY)
  ) {
    return {
      isNear: false,
      translateX: 0,
      translateY: 0,
      innerX: 0,
      innerY: 0,
      spotXPercent: 50,
      spotYPercent: 50,
    };
  }

  const cx = rectLeft + rectWidth / 2;
  const cy = rectTop + rectHeight / 2;
  const dx = pointerX - cx;
  const dy = pointerY - cy;

  const halfW = rectWidth / 2 + proximityPx;
  const halfH = rectHeight / 2 + proximityPx;

  if (Math.abs(dx) > halfW || Math.abs(dy) > halfH) {
    return {
      isNear: false,
      translateX: 0,
      translateY: 0,
      innerX: 0,
      innerY: 0,
      spotXPercent: 50,
      spotYPercent: 50,
    };
  }

  const nx = clampUnit(dx / halfW);
  const ny = clampUnit(dy / halfH);
  const radialDistance = Math.min(1, Math.hypot(dx / halfW, dy / halfH));
  const falloff = 1 - radialDistance * 0.35;

  const translateX = Number((nx * maxPullX * falloff).toFixed(2));
  const translateY = Number((ny * maxPullY * falloff).toFixed(2));

  const spotXPercent = Number(
    Math.max(0, Math.min(100, ((pointerX - rectLeft) / rectWidth) * 100)).toFixed(1)
  );
  const spotYPercent = Number(
    Math.max(0, Math.min(100, ((pointerY - rectTop) / rectHeight) * 100)).toFixed(1)
  );

  return {
    isNear: true,
    translateX,
    translateY,
    innerX: Number((translateX * 0.32).toFixed(2)),
    innerY: Number((translateY * 0.32).toFixed(2)),
    spotXPercent,
    spotYPercent,
  };
}
