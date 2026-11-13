import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useBackgroundMusic } from '../../features/audio';
import {
  computeNavbarBackdropState,
  shouldShowStudioActiveDot,
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

export const Navbar: React.FC<NavbarProps> = memo(({ onNavigate, activeSection = 'home', visible = true }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const isMobile = useIsMobile(768);
  const { isMuted, toggleMute } = useBackgroundMusic();

  const [backdropState, setBackdropState] = useState(() =>
    computeNavbarBackdropState({
      activeSection,
      scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
      viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 900,
    })
  );

  const menuToggleBtnRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const firstMobileNavRef = useRef<HTMLButtonElement>(null);
  const wasMobileMenuOpenRef = useRef<boolean>(false);
  const skipFocusRestoreRef = useRef<boolean>(false);

  // Sync backdrop state cleanly only on threshold transitions (never per-frame)
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

  const isContactActive = activeSection === 'footer' || activeSection === 'contact';
  const isActive = (id: string) => {
    if (id === 'contact') return isContactActive;
    return activeSection === id;
  };

  const { isLightHeroBackdrop, isScrolled } = backdropState;
  const useLightInk = isLightHeroBackdrop && !mobileMenuActive;

  const navSurfaceClass = mobileMenuActive
    ? 'bg-transparent'
    : useLightInk
    ? 'bg-gradient-to-b from-[#ebe8e1]/45 via-[#ebe8e1]/15 to-transparent'
    : isScrolled
    ? 'bg-[#030014]/70 backdrop-blur-md border-b border-white/[0.06]'
    : 'bg-transparent';

  return (
    <nav
      aria-label="Primary navigation"
      className={`fixed top-0 left-0 w-full z-[100] px-6 sm:px-10 md:px-14 py-3.5 sm:py-5 flex flex-row justify-between items-center box-border pointer-events-none transition-all duration-500 ease-out ${navSurfaceClass} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div className="h-8 sm:h-9 w-16 sm:w-20 cursor-pointer pointer-events-auto transition-transform duration-300 hover:scale-105 flex items-center justify-start">
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="border-none bg-transparent cursor-pointer p-0 m-0 w-full h-full flex items-center justify-start clickable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg group"
          aria-label="Scroll to home"
        >
          <img
            src="/assets/imgs/logo-rb-cyber.svg"
            alt="Rocky Babcock RB Logo"
            width={106}
            height={49}
            draggable="false"
            className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </button>
      </div>

      <div className="flex items-center pointer-events-auto">
        <ul className="hidden md:flex list-none overflow-hidden m-0 p-0 items-center gap-6 lg:gap-8">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.id);
            const showStudioDot = shouldShowStudioActiveDot(item.id, activeSection);

            const linkColorClass = useLightInk
              ? active
                ? 'text-[#120e1f] font-semibold drop-shadow-[0_1px_8px_rgba(255,255,255,0.75)]'
                : 'text-[#1c1630]/75 hover:text-[#0f0b1c] drop-shadow-[0_1px_6px_rgba(255,255,255,0.65)]'
              : active
              ? 'text-white font-semibold drop-shadow-[0_0_12px_rgba(216,180,254,0.9)]'
              : 'text-white/75 hover:text-white';

            const underlineColorClass = useLightInk
              ? active
                ? 'bg-violet-700 opacity-100 scale-x-100 shadow-[0_0_10px_rgba(109,40,217,0.4)]'
                : 'bg-violet-600/75 opacity-0 scale-x-50 group-hover:opacity-100 group-hover:scale-x-100'
              : active
              ? 'bg-purple-200 opacity-100 scale-x-100 shadow-[0_0_12px_2px_rgba(216,180,254,0.95),_0_0_24px_4px_rgba(168,85,247,0.6)]'
              : 'bg-purple-300/80 opacity-0 scale-x-50 group-hover:opacity-100 group-hover:scale-x-100 shadow-[0_0_10px_1px_rgba(216,180,254,0.85)]';

            return (
              <li key={item.id} className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={active ? 'location' : undefined}
                  className={`group border-none bg-transparent uppercase tracking-inherit cursor-pointer clickable transition-all duration-300 relative py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${linkColorClass}`}
                >
                  {showStudioDot ? (
                    <span className="flex items-center gap-1.5">
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
                  <span
                    className={`absolute bottom-0 left-1 right-1 h-[1.5px] rounded-full transition-all duration-300 pointer-events-none ${underlineColorClass}`}
                  />
                </button>
              </li>
            );
          })}

          <li className="font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center">
            <a
              href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished"
              target="_blank"
              rel="noreferrer"
              className={`uppercase tracking-inherit no-underline clickable transition-colors py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
                useLightInk
                  ? 'text-[#1c1630]/75 hover:text-[#0f0b1c] drop-shadow-[0_1px_6px_rgba(255,255,255,0.65)]'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              GITHUB
            </a>
          </li>

          <li
            className={`font-mono uppercase text-xs tracking-[0.2em] inline-flex items-center pl-2 border-l ${
              useLightInk ? 'border-[#1c1630]/15' : 'border-white/10'
            }`}
          >
            <button
              type="button"
              onClick={toggleMute}
              data-cursor="pointer"
              aria-label={isMuted ? 'Play background music (Clair de lune)' : 'Mute background music (Clair de lune)'}
              title={isMuted ? 'Sound: Muted (Click to play)' : 'Sound: Playing (Click to mute)'}
              className={`group border-none bg-transparent tracking-inherit cursor-pointer clickable transition-all duration-300 relative py-1 px-1.5 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded ${
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
                    : 'text-white/50 group-hover:text-white/90'
                }`}
              >
                {isMuted ? 'MUTED' : 'AUDIO'}
              </span>
            </button>
          </li>
        </ul>

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
            className="border-none bg-transparent cursor-pointer p-2 z-[110] relative clickable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
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

      <div
        id="mobile-navigation-drawer"
        ref={mobileDrawerRef}
        role="dialog"
        aria-modal={mobileMenuActive || undefined}
        aria-hidden={!mobileMenuActive}
        aria-label="Mobile navigation menu"
        className={`fixed top-0 right-0 h-screen bg-[#05030d]/98 backdrop-blur-2xl z-[105] transition-[width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden flex flex-col justify-between px-8 sm:px-12 py-16 ${
          mobileMenuActive
            ? 'w-screen left-0 visible pointer-events-auto opacity-100'
            : 'w-0 invisible pointer-events-none opacity-0'
        }`}
      >
        <div className="w-full flex justify-between items-center border-b border-white/10 pb-6 mt-4">
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-white/50">
            [ navigation &bull; index ]
          </span>
          <span className="font-mono text-xs tracking-[0.25em] uppercase text-purple-300/70">2026</span>
        </div>

        <ul className="list-none flex flex-col justify-center w-full my-auto space-y-4">
          {NAV_ITEMS.map((item, index) => {
            const active = isActive(item.id);
            const showStudioDot = shouldShowStudioActiveDot(item.id, activeSection);

            return (
              <li key={item.id} className="border-b border-white/[0.07] pb-3">
                <button
                  ref={index === 0 ? firstMobileNavRef : undefined}
                  type="button"
                  tabIndex={mobileMenuActive ? 0 : -1}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer py-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs tracking-widest text-purple-300/60 font-light">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-mono text-xl sm:text-2xl uppercase tracking-[0.18em] transition-all duration-300 flex items-center gap-2.5 ${
                        active ? 'text-white font-medium pl-1' : 'text-white/60 group-hover:text-white'
                      }`}
                    >
                      {showStudioDot && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      )}
                      {item.id === 'studio' ? 'studio' : item.label.toLowerCase()}
                    </span>
                  </div>
                  {active && (
                    <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-purple-300 px-2 py-0.5 rounded border border-purple-400/30 bg-purple-500/10">
                      current
                    </span>
                  )}
                </button>
              </li>
            );
          })}
          <li className="border-b border-white/[0.07] pb-3">
            <a
              href="https://github.com/rockybuildingaiweb3-boop/rocky-homepage-unfinished"
              target="_blank"
              rel="noreferrer"
              tabIndex={mobileMenuActive ? 0 : -1}
              className="w-full flex items-center justify-between no-underline py-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-widest text-purple-300/60 font-light">05</span>
                <span className="font-mono text-xl sm:text-2xl uppercase tracking-[0.18em] text-white/60 group-hover:text-white transition-colors">
                  github ↗
                </span>
              </div>
            </a>
          </li>
          <li className="border-b border-white/[0.07] pb-3">
            <button
              type="button"
              tabIndex={mobileMenuActive ? 0 : -1}
              onClick={toggleMute}
              className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer py-2 group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs tracking-widest text-purple-300/60 font-light">06</span>
                <span className="font-mono text-xl sm:text-2xl uppercase tracking-[0.18em] text-white/60 group-hover:text-white transition-colors">
                  {isMuted ? 'AUDIO: OFF' : 'AUDIO: ON'}
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-purple-300 px-2.5 py-0.5 rounded border border-purple-400/30 bg-purple-500/10">
                {isMuted ? 'TAP TO PLAY' : 'ON'}
              </span>
            </button>
          </li>
        </ul>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <a
            href="mailto:rockybuilding.aiweb3@gmail.com"
            tabIndex={mobileMenuActive ? 0 : -1}
            className="font-mono text-xs tracking-wide text-white/60 hover:text-white no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
          >
            rockybuilding.aiweb3@gmail.com
          </a>
          <span className="font-mono text-[11px] tracking-widest text-white/40 uppercase">creative technologist</span>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';
