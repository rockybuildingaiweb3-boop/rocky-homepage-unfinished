export interface NavbarBackdropInput {
  activeSection: string;
  scrollY: number;
  viewportHeight: number;
}

export interface NavbarBackdropState {
  isLightHeroBackdrop: boolean;
  isScrolled: boolean;
}

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
