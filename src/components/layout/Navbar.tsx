import React, { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import { useBackgroundMusic } from '../../features/audio';
import {
  computeNavbarBackdropState,
  computePageScrollProgress,
  computeSlidingIndicatorMetrics,
  resolveNavbarSectionTheme,
  shouldShowStudioActiveDot,
  type SlidingIndicatorTransform,
} from './navbarLogic';

interface NavbarProps {
  onNavigate: (targetId: string) => void;
  activeSection?: string;
  visible?: boolean;
}

const NAV_ITEMS = [
  { id: 'home', label: 'HOME' },
  { id: 'studio', label: 'STUDIO' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'contact', label: 'CONTACT' },
] as const;

type NavItemId = (typeof NAV_ITEMS)[number]['id'];

export const Navbar: React.FC<NavbarProps> = memo(({ onNavigate, activeSection = 'home', visible = true }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [hoveredNavId, setHoveredNavId] = useState<NavItemId | null>(null);
  const [logoSweepCount, setLogoSweepCount] = useState(0);
  const [isLogoConverging, setIsLogoConverging] = useState(false);

  const [activeIndicator, setActiveIndicator] = useState<SlidingIndicatorTransform>({ x: 0, width: 0 });
  const [hoverIndicator, setHoverIndicator] = useState<SlidingIndicatorTransform>({ x: 0, width: 0 });

  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();
  const { isMuted, toggleMute } = useBackgroundMusic();

  const [backdropState, setBackdropState] = useState(() =>
    computeNavbarBackdropState({
      activeSection,
      scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 900,
    })
  );

  // Refs for accessible menu & focus management
  const menuToggleBtnRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const firstMobileNavRef = useRef<HTMLButtonElement>(null);
  const wasMobileMenuOpenRef = useRef<boolean>(false);
  const skipFocusRestoreRef = useRef<boolean>(false);
  const logoConvergeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for top 1.5px smooth scroll progress filament (zero React per-frame state)
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressCometRef = useRef<HTMLDivElement>(null);

  // Refs for measuring nav buttons cleanly
  const navClusterRef = useRef<HTMLDivElement>(null);
  const navButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const normalizedActiveNavId: NavItemId =
    activeSection === 'footer' || activeSection === 'contact'
      ? 'contact'
      : activeSection === 'studio'
      ? 'studio'
      : activeSection === 'skills'
      ? 'skills'
      : 'home';

  // Synchronously bind light-ink state to activeSection === 'home' so dark sections never lag for even 1 frame
  const useLightInk =
    activeSection === 'home' && backdropState.isLightHeroBackdrop && !mobileMenuActive;
  const isScrolled = backdropState.isScrolled || activeSection !== 'home';
  const sectionTheme = resolveNavbarSectionTheme(activeSection, useLightInk);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (logoConvergeTimerRef.current) clearTimeout(logoConvergeTimerRef.current);
    };
  }, []);

  // Sync backdrop state cleanly on threshold transitions
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId: number | null = null;

    const updateBackdrop = () => {
      const next = computeNavbarBackdropState({
        activeSection,
        scrollY: window.scrollY || document.documentElement.scrollTop || 0,
        viewportHeight: window.innerHeight || 900,
      });
      setBackdropState((prev) =>
        prev.isLightHeroBackdrop === next.isLightHeroBackdrop &&
        prev.isScrolled === next.isScrolled
          ? prev
          : next
      );
    };

    const scheduleCheck = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateBackdrop();
      });
    };

    updateBackdrop();
    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [activeSection]);

  // Smooth inertia-driven 1.5px top progress filament synced cleanly across the page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let rafId: number | null = null;
    let targetProgress = computePageScrollProgress({
      scrollY: window.scrollY || document.documentElement.scrollTop || 0,
      scrollHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight || 900,
    });
    let currentProgress = targetProgress;

    const paintProgress = (p: number) => {
      const clamped = Math.min(1, Math.max(0, p));
      if (progressContainerRef.current) {
        progressContainerRef.current.setAttribute('data-progress', clamped.toFixed(3));
      }
      if (progressFillRef.current) {
        progressFillRef.current.style.transform = `scaleX(${clamped})`;
      }
      if (progressCometRef.current) {
        progressCometRef.current.style.transform = `translate3d(${clamped * 100}vw, 0, 0)`;
        progressCometRef.current.style.opacity =
          clamped > 0.01 && clamped < 0.995 ? '1' : '0';
      }
    };

    const step = () => {
      rafId = null;
      const diff = targetProgress - currentProgress;
      if (prefersReducedMotion || Math.abs(diff) < 0.0008) {
        currentProgress = targetProgress;
        paintProgress(currentProgress);
        return;
      }
      currentProgress += diff * 0.16;
      paintProgress(currentProgress);
      rafId = requestAnimationFrame(step);
    };

    const scheduleProgressUpdate = () => {
      targetProgress = computePageScrollProgress({
        scrollY: window.scrollY || document.documentElement.scrollTop || 0,
        scrollHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight || 900,
      });
      if (prefersReducedMotion) {
        currentProgress = targetProgress;
        paintProgress(currentProgress);
        return;
      }
      if (rafId === null) {
        rafId = requestAnimationFrame(step);
      }
    };

    paintProgress(currentProgress);
    window.addEventListener('scroll', scheduleProgressUpdate, { passive: true });
    window.addEventListener('resize', scheduleProgressUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleProgressUpdate);
      window.removeEventListener('resize', scheduleProgressUpdate);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [prefersReducedMotion]);

  // Measure and sync shared sliding active indicator and hover preview bar
  const syncSlidingIndicators = useCallback(() => {
    const activeBtn = navButtonRefs.current[normalizedActiveNavId];
    if (activeBtn) {
      const metrics = computeSlidingIndicatorMetrics({
        offsetLeft: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        insetPx: 4,
      });
      setActiveIndicator((prev) =>
        prev.x === metrics.x && prev.width === metrics.width ? prev : metrics
      );
    }

    if (hoveredNavId && hoveredNavId !== normalizedActiveNavId) {
      const hoverBtn = navButtonRefs.current[hoveredNavId];
      if (hoverBtn) {
        const metrics = computeSlidingIndicatorMetrics({
          offsetLeft: hoverBtn.offsetLeft,
          width: hoverBtn.offsetWidth,
          insetPx: 6,
        });
        setHoverIndicator((prev) =>
          prev.x === metrics.x && prev.width === metrics.width ? prev : metrics
        );
        return;
      }
    }
    setHoverIndicator((prev) => (prev.width === 0 ? prev : { x: prev.x, width: 0 }));
  }, [hoveredNavId, normalizedActiveNavId]);

  useLayoutEffect(() => {
    syncSlidingIndicators();
  }, [syncSlidingIndicators, useLightInk, isMobile]);

  useEffect(() => {
    const cluster = navClusterRef.current;
    if (!cluster || typeof window === 'undefined') return;

    const handleResize = () => syncSlidingIndicators();
    window.addEventListener('resize', handleResize, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(handleResize);
      ro.observe(cluster);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(handleResize).catch(() => undefined);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      ro?.disconnect();
    };
  }, [syncSlidingIndicators]);

  // Close mobile drawer cleanly when transitioning to desktop width
  useEffect(() => {
    if (!isMobile && mobileMenuActive) {
      skipFocusRestoreRef.current = true;
      setMobileMenuActive(false);
    }
  }, [isMobile, mobileMenuActive]);

  // Manage inert attribute, Escape-to-close, body scroll lock, and focus restoration
  useEffect(() => {
    const drawer = mobileDrawerRef.current;
    if (drawer) {
      drawer.inert = !mobileMenuActive;
    }

    if (mobileMenuActive) {
      wasMobileMenuOpenRef.current = true;
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const focusRaf = requestAnimationFrame(() => {
        firstMobileNavRef.current?.focus({ preventScroll: true });
      });

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          skipFocusRestoreRef.current = false;
          setMobileMenuActive(false);
          return;
        }

        if (e.key === 'Tab' && drawer) {
          const drawerFocusable = Array.from(
            drawer.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          );
          const focusables: HTMLElement[] = menuToggleBtnRef.current
            ? [menuToggleBtnRef.current, ...drawerFocusable]
            : drawerFocusable;
          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];
          const activeEl = document.activeElement as HTMLElement | null;

          if (e.shiftKey) {
            if (!activeEl || activeEl === firstEl || !focusables.includes(activeEl)) {
              e.preventDefault();
              lastEl.focus({ preventScroll: true });
            }
          } else if (!activeEl || activeEl === lastEl || !focusables.includes(activeEl)) {
            e.preventDefault();
            firstEl.focus({ preventScroll: true });
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        cancelAnimationFrame(focusRaf);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
      };
    }

    if (wasMobileMenuOpenRef.current) {
      wasMobileMenuOpenRef.current = false;
      if (!skipFocusRestoreRef.current) {
        menuToggleBtnRef.current?.focus({ preventScroll: true });
      }
      skipFocusRestoreRef.current = false;
    }
  }, [mobileMenuActive]);

  const handleNavClick = useCallback(
    (targetId: string) => {
      skipFocusRestoreRef.current = true;
      setMobileMenuActive(false);
      onNavigate(targetId);
    },
    [onNavigate]
  );

  const handleLogoHover = useCallback(() => {
    if (!prefersReducedMotion) {
      setLogoSweepCount((c) => c + 1);
    }
  }, [prefersReducedMotion]);

  const handleLogoClick = useCallback(() => {
    if (!prefersReducedMotion) {
      if (logoConvergeTimerRef.current) clearTimeout(logoConvergeTimerRef.current);
      setIsLogoConverging(true);
      logoConvergeTimerRef.current = setTimeout(() => {
        setIsLogoConverging(false);
      }, 390);
    }
    handleNavClick('home');
  }, [handleNavClick, prefersReducedMotion]);

  const navSurfaceClass = mobileMenuActive
    ? 'bg-transparent'
    : useLightInk
    ? 'bg-gradient-to-b from-[#ebe8e1]/45 via-[#ebe8e1]/15 to-transparent'
    : isScrolled
    ? 'bg-[#030014]/82 backdrop-blur-md border-b border-white/[0.06]'
    : 'bg-transparent';

  const showHoverPreview =
    Boolean(hoveredNavId && hoveredNavId !== normalizedActiveNavId && hoverIndicator.width > 0);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        data-active-section={sectionTheme.id}
        className={`fixed top-0 left-0 w-full z-[110] px-5 sm:px-8 md:px-8 lg:px-14 py-3.5 sm:py-4 lg:py-5 flex flex-row justify-between items-center box-border pointer-events-none transition-[opacity,transform,background-color] duration-150 ease-out ${navSurfaceClass} ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Top 1.5px Living Page Progress Filament (no percentage numbers) */}
        <div
          ref={progressContainerRef}
          data-testid="navbar-progress-line"
          data-progress="0.000"
          aria-hidden="true"
          className={`pointer-events-none fixed top-0 left-0 right-0 h-[1.5px] z-[112] overflow-hidden ${
            useLightInk ? 'bg-violet-950/[0.08]' : 'bg-purple-300/[0.08]'
          }`}
        >
          <div
            ref={progressFillRef}
            className="h-full w-full origin-left will-change-transform transition-[background] duration-500 ease-out"
            style={{
              transform: 'scaleX(0)',
              background: sectionTheme.accentGradient,
            }}
          />
          <div
            ref={progressCometRef}
            className="pointer-events-none absolute top-0 left-0 -ml-4 w-5 h-[2px] rounded-full will-change-transform transition-opacity duration-300"
            style={{
              transform: 'translate3d(0vw, 0, 0)',
              opacity: 0,
              background: `radial-gradient(circle at 80% 50%, ${sectionTheme.cometColor} 0%, transparent 100%)`,
              boxShadow: `0 0 8px 1px ${sectionTheme.cometColor}`,
            }}
          />
        </div>

        {/* Left Zone: Brand RB Emblem Choreography + Quiet Unboxed Section Index */}
        <div className="flex items-center gap-4 shrink-0 pointer-events-auto">
          <div className="h-7 sm:h-8 lg:h-9 w-14 sm:w-16 lg:w-20 shrink-0 flex items-center justify-start">
            <button
              type="button"
              onClick={handleLogoClick}
              onMouseEnter={handleLogoHover}
              data-logo-state={isLogoConverging ? 'converging' : 'idle'}
              className="group relative overflow-hidden border-none bg-transparent cursor-pointer p-0 m-0 w-full h-full flex items-center justify-start clickable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.045]"
              aria-label="Scroll to home"
            >
              <img
                src="/assets/imgs/logo-rb-cyber.svg"
                alt="Rocky Babcock RB Logo"
                width={106}
                height={49}
                draggable="false"
                className={`h-full w-auto object-contain transition-[filter] duration-300 group-hover:drop-shadow-[0_0_8px_rgba(216,180,254,0.45)] ${
                  isLogoConverging ? 'rb-logo-converge' : ''
                }`}
              />
              {logoSweepCount > 0 && !prefersReducedMotion && (
                <span
                  key={logoSweepCount}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    WebkitMaskImage: 'url(/assets/imgs/logo-rb-cyber.svg)',
                    maskImage: 'url(/assets/imgs/logo-rb-cyber.svg)',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'left center',
                    maskPosition: 'left center',
                  }}
                >
                  <span
                    className="rb-logo-sweep-beam block h-full w-1/2"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.88) 50%, transparent 100%)',
                    }}
                  />
                </span>
              )}
            </button>
          </div>

          {/* Unboxed Micro Section Index (desktop only to keep tablet bar spacious) */}
          <div
            data-testid="navbar-section-index"
            className={`hidden lg:inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase tabular-nums whitespace-nowrap select-none transition-colors duration-150 ${
              useLightInk ? 'text-[#1c1630]/65' : 'text-white/60'
            }`}
          >
            <span
              aria-hidden="true"
              className={`w-3 h-[1px] ${useLightInk ? 'bg-[#1c1630]/25' : 'bg-white/25'}`}
            />
            <span>{sectionTheme.formattedBadge}</span>
          </div>
        </div>

        {/* Right Zone: Desktop Links with Shared Sliding Indicator + Actions */}
        <div className="flex items-center shrink-0 pointer-events-auto">
          <div className="hidden md:flex items-center md:gap-4 lg:gap-7 xl:gap-8">
            <div
              ref={navClusterRef}
              onMouseLeave={() => setHoveredNavId(null)}
              className="relative flex items-center md:gap-4 lg:gap-7 xl:gap-8 pb-1"
            >
              {NAV_ITEMS.map((item) => {
                const active = item.id === normalizedActiveNavId;
                const showStudioDot = shouldShowStudioActiveDot(item.id, activeSection);

                const linkColorClass = useLightInk
                  ? active
                    ? 'text-[#120e1f] font-semibold drop-shadow-[0_1px_8px_rgba(255,255,255,0.75)]'
                    : 'text-[#1c1630]/75 hover:text-[#0f0b1c] drop-shadow-[0_1px_6px_rgba(255,255,255,0.65)]'
                  : active
                  ? 'text-white font-semibold drop-shadow-[0_0_12px_rgba(216,180,254,0.85)]'
                  : 'text-white/75 hover:text-white';

                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      navButtonRefs.current[item.id] = el;
                    }}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    onMouseEnter={() => setHoveredNavId(item.id)}
                    aria-current={active ? 'location' : undefined}
                    className={`font-mono uppercase text-[11px] lg:text-xs tracking-[0.14em] lg:tracking-[0.2em] whitespace-nowrap shrink-0 border-none bg-transparent cursor-pointer clickable transition-colors duration-150 relative py-1 px-1 lg:px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${linkColorClass}`}
                  >
                    {showStudioDot ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            useLightInk ? 'bg-violet-600' : 'bg-purple-400'
                          }`}
                        />
                        {item.label}
                      </span>
                    ) : (
                      item.label
                    )}
                  </button>
                );
              })}

              {/* Weaker shared hover preview track */}
              <span
                data-testid="navbar-hover-preview"
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-0 left-0 w-[100px] h-[1px] origin-left rounded-full transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  useLightInk ? 'bg-violet-700/65' : 'bg-purple-200/75'
                }`}
                style={{
                  opacity: showHoverPreview ? 0.5 : 0,
                  transform: `translate3d(${hoverIndicator.x}px, 0, 0) scaleX(${
                    (showHoverPreview ? hoverIndicator.width : activeIndicator.width) / 100
                  })`,
                }}
              />

              {/* Primary shared sliding active indicator with delicate flowing shimmer */}
              <span
                data-testid="navbar-active-indicator"
                aria-hidden="true"
                className="living-nav-shimmer pointer-events-none absolute bottom-0 left-0 w-[100px] h-[1.5px] origin-left rounded-full transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  opacity: activeIndicator.width > 0 ? 1 : 0,
                  transform: `translate3d(${activeIndicator.x}px, 0, 0) scaleX(${
                    activeIndicator.width / 100
                  })`,
                  backgroundImage: useLightInk
                    ? 'linear-gradient(90deg, rgba(109,40,217,0.7) 0%, rgba(139,92,246,1) 50%, rgba(109,40,217,0.7) 100%)'
                    : 'linear-gradient(90deg, rgba(192,132,252,0.75) 0%, rgba(255,255,255,0.98) 50%, rgba(192,132,252,0.75) 100%)',
                  boxShadow: useLightInk
                    ? '0 0 8px rgba(109,40,217,0.35)'
                    : '0 0 12px 1px rgba(216,180,254,0.85)',
                }}
              />
            </div>

            <a
              href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished"
              target="_blank"
              rel="noreferrer"
              className={`font-mono uppercase text-[11px] lg:text-xs tracking-[0.14em] lg:tracking-[0.2em] whitespace-nowrap shrink-0 no-underline clickable transition-colors py-1 px-1 lg:px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
                useLightInk
                  ? 'text-[#1c1630]/75 hover:text-[#0f0b1c] drop-shadow-[0_1px_6px_rgba(255,255,255,0.65)]'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              GITHUB
            </a>

            <div
              className={`font-mono uppercase text-[11px] lg:text-xs tracking-[0.14em] lg:tracking-[0.2em] inline-flex items-center pl-2 lg:pl-2.5 border-l whitespace-nowrap shrink-0 ${
                useLightInk ? 'border-[#1c1630]/15' : 'border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={toggleMute}
                data-cursor="pointer"
                aria-label={isMuted ? 'Play background music (Clair de lune)' : 'Mute background music (Clair de lune)'}
                title={isMuted ? 'Sound: Muted (Click to play)' : 'Sound: Playing (Click to mute)'}
                className={`group border-none bg-transparent tracking-inherit cursor-pointer clickable transition-colors duration-150 relative py-1 px-1.5 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
                  useLightInk
                    ? 'text-[#1c1630]/75 hover:text-[#0f0b1c]'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <div className="flex items-end gap-[2.5px] h-3 w-3.5 mb-[1px]" aria-hidden="true">
                  {isMuted ? (
                    <span className={`w-3.5 h-3.5 ${useLightInk ? 'text-[#1c1630]/50' : 'text-white/40'}`}>×</span>
                  ) : (
                    <>
                      <span className={`w-[2px] h-1.5 rounded-full ${useLightInk ? 'bg-violet-600' : 'bg-purple-300'}`} />
                      <span className={`w-[2px] h-3 rounded-full ${useLightInk ? 'bg-violet-700' : 'bg-purple-200'}`} />
                      <span className={`w-[2px] h-1.5 rounded-full ${useLightInk ? 'bg-fuchsia-600' : 'bg-fuchsia-300'}`} />
                    </>
                  )}
                </div>
                <span
                  className={`font-mono text-[10px] transition-colors tracking-widest ${
                    useLightInk
                      ? 'text-[#1c1630]/65 group-hover:text-[#0f0b1c]'
                      : 'text-white/55 group-hover:text-white/90'
                  }`}
                >
                  {isMuted ? 'MUTED' : 'AUDIO'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Play background music' : 'Mute background music'}
              title={isMuted ? 'Sound: Muted' : 'Sound: Playing'}
              className={`rounded-full p-2 flex items-center justify-center clickable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 transition-colors ${
                useLightInk
                  ? 'border border-[#1c1630]/20 bg-white/55 backdrop-blur-md text-[#1c1630]/85'
                  : 'border border-white/15 bg-black/40 backdrop-blur-md text-white/80'
              }`}
            >
              {isMuted ? (
                <span className={`text-xs ${useLightInk ? 'text-[#1c1630]/65' : 'text-white/50'}`}>×</span>
              ) : (
                <div className="flex items-end gap-[2px] h-3 w-3" aria-hidden="true">
                  <span className={`w-[2px] h-1.5 rounded-full ${useLightInk ? 'bg-violet-600' : 'bg-purple-300'}`} />
                  <span className={`w-[2px] h-3 rounded-full ${useLightInk ? 'bg-violet-700' : 'bg-purple-200'}`} />
                  <span className={`w-[2px] h-1.5 rounded-full ${useLightInk ? 'bg-fuchsia-600' : 'bg-fuchsia-300'}`} />
                </div>
              )}
            </button>

            <button
              ref={menuToggleBtnRef}
              type="button"
              onClick={() => {
                skipFocusRestoreRef.current = false;
                setMobileMenuActive((prev) => !prev);
              }}
              className="border-none bg-transparent cursor-pointer p-2 z-[115] relative clickable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
              aria-label={mobileMenuActive ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuActive}
              aria-controls="mobile-navigation-drawer"
            >
              <div className="flex flex-col justify-center w-[24px] h-[18px] gap-[5px] transition-all duration-300">
                <span
                  className={`block h-[2px] transition-all duration-300 ${
                    useLightInk ? 'bg-[#171324]' : 'bg-white'
                  } ${mobileMenuActive ? 'translate-y-[7px] rotate-[-45deg] w-full' : 'w-full'}`}
                />
                <span
                  className={`block h-[2px] transition-all duration-300 ${
                    useLightInk ? 'bg-[#171324]' : 'bg-white'
                  } ${mobileMenuActive ? 'opacity-0 w-0' : 'w-full'}`}
                />
                <span
                  className={`block h-[2px] transition-all duration-300 ${
                    useLightInk ? 'bg-[#171324]' : 'bg-white'
                  } ${mobileMenuActive ? '-translate-y-[7px] rotate-[45deg] w-full' : 'w-full'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* 4-Layer Choreographed Mobile Navigation Mode (GPU transform + opacity, no clip-path/heavy-blur stall) */}
      <div
        id="mobile-navigation-drawer"
        ref={mobileDrawerRef}
        role="dialog"
        aria-modal={mobileMenuActive || undefined}
        aria-hidden={!mobileMenuActive}
        aria-label="Mobile navigation menu"
        data-nav-mode={mobileMenuActive ? 'open' : 'closed'}
        className={`fixed inset-0 h-screen w-screen bg-[#050311]/[0.97] backdrop-blur-md z-[105] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform overflow-hidden flex flex-col justify-between px-8 sm:px-12 pt-24 pb-12 ${
          mobileMenuActive
            ? 'pointer-events-auto opacity-100 translate-x-0'
            : 'pointer-events-none opacity-0 translate-x-full'
        }`}
      >
        {/* Subtle radial atmospheric depth inside Navigation Mode */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 72%)',
          }}
        />

        {/* Layer 1 Header Caption */}
        <div
          style={{
            transitionDelay: mobileMenuActive ? '40ms' : '0ms',
          }}
          className={`relative w-full flex justify-between items-center border-b border-white/10 pb-4 transition-[transform,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}
        >
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/55">
            navigation mode
          </span>
          <span className="font-mono text-[11px] tracking-[0.25em] uppercase text-purple-300/80 tabular-nums">
            {sectionTheme.formattedBadge}
          </span>
        </div>

        {/* Layer 2 & Layer 3: Staggered 4 Section Destinations with Active Marker */}
        <ul className="relative list-none flex flex-col justify-center w-full my-auto p-0 space-y-5">
          {NAV_ITEMS.map((item, index) => {
            const active = item.id === normalizedActiveNavId;
            const showStudioDot = shouldShowStudioActiveDot(item.id, activeSection);

            return (
              <li
                key={item.id}
                style={{
                  transitionDelay: mobileMenuActive ? `${60 + index * 40}ms` : `${(3 - index) * 20}ms`,
                }}
                className={`border-b border-white/[0.08] pb-4 transition-[transform,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mobileMenuActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                }`}
              >
                <button
                  ref={index === 0 ? firstMobileNavRef : undefined}
                  type="button"
                  tabIndex={mobileMenuActive ? 0 : -1}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={active ? 'location' : undefined}
                  className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer py-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded relative"
                >
                  <div className="flex items-center gap-4">
                    {/* Layer 3: Vertical luminous active bar */}
                    <span
                      aria-hidden="true"
                      className={`w-[2px] h-6 rounded-full transition-all duration-200 ${
                        active
                          ? 'bg-purple-300 shadow-[0_0_12px_rgba(216,180,254,0.9)] opacity-100 scale-y-100'
                          : 'bg-white/20 opacity-0 scale-y-50 group-hover:opacity-60 group-hover:scale-y-75'
                      }`}
                    />
                    <span className="font-mono text-xs tracking-widest text-purple-300/65 font-light tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-mono text-2xl uppercase tracking-[0.18em] transition-all duration-200 flex items-center gap-2.5 ${
                        active
                          ? 'text-white font-medium translate-x-1'
                          : 'text-white/55 group-hover:text-white group-hover:translate-x-1'
                      }`}
                    >
                      {showStudioDot && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      )}
                      {item.label.toLowerCase()}
                    </span>
                  </div>
                  {active && (
                    <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-purple-300">
                      active
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Layer 4: Bottom Dock with GitHub, Audio Toggle & Contact */}
        <div
          style={{
            transitionDelay: mobileMenuActive ? '200ms' : '0ms',
          }}
          className={`relative pt-5 border-t border-white/10 flex flex-col gap-4 transition-[transform,opacity] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <a
              href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished"
              target="_blank"
              rel="noreferrer"
              tabIndex={mobileMenuActive ? 0 : -1}
              className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.18em] uppercase text-white/75 hover:text-white no-underline py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
            >
              <span>github</span>
              <span aria-hidden="true" className="text-purple-300/80">&#8599;</span>
            </a>

            <button
              type="button"
              tabIndex={mobileMenuActive ? 0 : -1}
              onClick={toggleMute}
              className="inline-flex items-center gap-2 bg-transparent border-none cursor-pointer font-mono text-xs tracking-[0.18em] uppercase text-white/75 hover:text-white py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
            >
              <span className="text-purple-300">{isMuted ? 'audio: muted' : 'audio: playing'}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 pt-2 border-t border-white/[0.06]">
            <a
              href="mailto:rockybuilding.aiweb3@gmail.com"
              tabIndex={mobileMenuActive ? 0 : -1}
              className="font-mono text-xs tracking-wide text-white/65 hover:text-white no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded py-1"
            >
              rockybuilding.aiweb3@gmail.com &rarr;
            </a>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
              creative technologist
            </span>
          </div>
        </div>
      </div>
    </>
  );
});

Navbar.displayName = 'Navbar';
