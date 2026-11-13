export interface NavbarBackdropInput {
  activeSection: string;
  scrollY: number;
  viewportHeight: number;
}

export interface NavbarBackdropState {
  isLightHeroBackdrop: boolean;
  isScrolled: boolean;
}

export interface ScrollProgressInput {
  scrollY: number;
  scrollHeight: number;
  viewportHeight: number;
}

export interface NavbarSectionTheme {
  id: 'home' | 'studio' | 'skills' | 'contact';
  indexLabel: string;
  titleLabel: string;
  formattedBadge: string;
  accentGradient: string;
  cometColor: string;
}

const SECTION_THEMES: Record<NavbarSectionTheme['id'], Omit<NavbarSectionTheme, 'accentGradient' | 'cometColor'>> = {
  home: {
    id: 'home',
    indexLabel: '01',
    titleLabel: 'HOME',
    formattedBadge: '01 / HOME',
  },
  studio: {
    id: 'studio',
    indexLabel: '02',
    titleLabel: 'STUDIO',
    formattedBadge: '02 / STUDIO',
  },
  skills: {
    id: 'skills',
    indexLabel: '03',
    titleLabel: 'SKILLS',
    formattedBadge: '03 / SKILLS',
  },
  contact: {
    id: 'contact',
    indexLabel: '04',
    titleLabel: 'CONTACT',
    formattedBadge: '04 / CONTACT',
  },
};

/**
 * Coordinates Navbar ink & atmospheric backdrop contrast against
 * Hero's bright watercolor sky (#ebe8e1) vs dark cosmic sections (#030014).
 */
export function computeNavbarBackdropState({
  activeSection,
  scrollY,
  viewportHeight,
}: NavbarBackdropInput): NavbarBackdropState {
  const safeScroll = Number.isFinite(scrollY) ? Math.max(0, scrollY) : 0;
  const safeHeight =
    Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : 900;
  const heroProgress = safeScroll / (safeHeight * 0.85);

  const isScrolled = safeScroll > 32;
  const isLightHeroBackdrop = activeSection === 'home' && heroProgress < 0.36;

  return {
    isLightHeroBackdrop,
    isScrolled,
  };
}

/**
 * Studio pulsing indicator dot renders only when Studio is the active section.
 */
export function shouldShowStudioActiveDot(itemId: string, activeSection: string): boolean {
  return itemId === 'studio' && activeSection === 'studio';
}

/**
 * Computes normalized [0, 1] scroll progress across the full document,
 * reaching 1.0 cleanly when the reader arrives at the Footer.
 */
export function computePageScrollProgress({
  scrollY,
  scrollHeight,
  viewportHeight,
}: ScrollProgressInput): number {
  const safeScrollY = Number.isFinite(scrollY) ? Math.max(0, scrollY) : 0;
  const safeViewportH =
    Number.isFinite(viewportHeight) && viewportHeight > 0 ? viewportHeight : 900;
  const safeScrollH =
    Number.isFinite(scrollHeight) && scrollHeight > 0 ? scrollHeight : safeViewportH;

  const maxScroll = safeScrollH - safeViewportH;
  if (maxScroll <= 1) return 0;

  if (safeScrollY >= maxScroll - 2) {
    return 1;
  }

  const raw = Math.min(1, Math.max(0, safeScrollY / maxScroll));
  return raw === 0 ? 0 : raw;
}

/**
 * Maps activeSection + light/dark surface context to subtle progress filament palette & editorial section index.
 */
export function resolveNavbarSectionTheme(
  activeSection: string,
  useLightInk: boolean
): NavbarSectionTheme {
  const normalizedId: NavbarSectionTheme['id'] =
    activeSection === 'footer' || activeSection === 'contact'
      ? 'contact'
      : activeSection === 'studio'
      ? 'studio'
      : activeSection === 'skills'
      ? 'skills'
      : 'home';

  const base = SECTION_THEMES[normalizedId];

  if (useLightInk) {
    return {
      ...base,
      accentGradient: 'linear-gradient(90deg, rgba(109,40,217,0.32) 0%, rgba(124,58,237,0.78) 100%)',
      cometColor: 'rgba(109, 40, 217, 0.92)',
    };
  }

  switch (normalizedId) {
    case 'studio':
      return {
        ...base,
        accentGradient: 'linear-gradient(90deg, rgba(168,85,247,0.28) 0%, rgba(192,132,252,0.82) 55%, rgba(129,140,248,0.92) 100%)',
        cometColor: 'rgba(196, 181, 253, 0.98)',
      };
    case 'skills':
      return {
        ...base,
        accentGradient: 'linear-gradient(90deg, rgba(168,85,247,0.28) 0%, rgba(139,92,246,0.82) 55%, rgba(56,189,248,0.88) 100%)',
        cometColor: 'rgba(125, 211, 252, 0.96)',
      };
    case 'contact':
      return {
        ...base,
        accentGradient: 'linear-gradient(90deg, rgba(168,85,247,0.32) 0%, rgba(216,180,254,0.85) 60%, rgba(244,114,182,0.88) 100%)',
        cometColor: 'rgba(249, 168, 212, 0.98)',
      };
    case 'home':
    default:
      return {
        ...base,
        accentGradient: 'linear-gradient(90deg, rgba(168,85,247,0.25) 0%, rgba(216,180,254,0.78) 100%)',
        cometColor: 'rgba(233, 213, 255, 0.95)',
      };
  }
}

export interface SlidingIndicatorInput {
  offsetLeft: number;
  width: number;
  insetPx?: number;
}

export interface SlidingIndicatorTransform {
  x: number;
  width: number;
}

/**
 * Computes sanitized horizontal translation and width for shared sliding nav indicators.
 */
export function computeSlidingIndicatorMetrics({
  offsetLeft,
  width,
  insetPx = 4,
}: SlidingIndicatorInput): SlidingIndicatorTransform {
  const safeLeft = Number.isFinite(offsetLeft) ? Math.max(0, offsetLeft) : 0;
  const safeWidth = Number.isFinite(width) ? Math.max(0, width) : 0;
  const safeInset = Number.isFinite(insetPx) ? Math.max(0, insetPx) : 0;

  const adjustedWidth = Math.max(0, safeWidth - safeInset * 2);
  const adjustedX = adjustedWidth > 0 ? safeLeft + safeInset : safeLeft;

  return {
    x: Number(adjustedX.toFixed(2)),
    width: Number(adjustedWidth.toFixed(2)),
  };
}
