import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { NebulaBackground } from './NebulaBackground';
import {
  computeHeroMouseParallax,
  computeHeroParallaxMetrics,
  computeMagneticCtaOffset,
} from '../../features/scroll/heroParallax';
import {
  getReducedMotionPreference,
  useDeviceCapabilities,
} from '../../hooks/useDeviceCapabilities';

interface HomeSectionProps {
  onNavigate?: (targetId: string) => void;
  isAwake?: boolean;
}

interface BotanicalMote {
  id: number;
  left: string;
  top: string;
  sizePx: number;
  color: string;
  duration: string;
  delay: string;
  blurPx: number;
}

// Sparse, organic dew & sunlit pollen motes anchored gently near tulip blooms
const BOTANICAL_MOTES: readonly BotanicalMote[] = [
  { id: 1, left: '16%', top: '62%', sizePx: 5, color: 'rgba(255, 248, 220, 0.72)', duration: '15s', delay: '0s', blurPx: 1 },
  { id: 2, left: '24%', top: '44%', sizePx: 4, color: 'rgba(243, 232, 255, 0.65)', duration: '18s', delay: '-4s', blurPx: 1 },
  { id: 3, left: '34%', top: '74%', sizePx: 6, color: 'rgba(254, 240, 199, 0.58)', duration: '21s', delay: '-8s', blurPx: 1.5 },
  { id: 4, left: '43%', top: '34%', sizePx: 3.5, color: 'rgba(255, 255, 255, 0.75)', duration: '16s', delay: '-2s', blurPx: 0.5 },
  { id: 5, left: '59%', top: '36%', sizePx: 4, color: 'rgba(233, 213, 255, 0.65)', duration: '19s', delay: '-11s', blurPx: 1 },
  { id: 6, left: '68%', top: '66%', sizePx: 6.5, color: 'rgba(254, 243, 199, 0.52)', duration: '22s', delay: '-5s', blurPx: 1.5 },
  { id: 7, left: '78%', top: '51%', sizePx: 4.5, color: 'rgba(252, 231, 243, 0.68)', duration: '17s', delay: '-13s', blurPx: 1 },
  { id: 8, left: '86%', top: '72%', sizePx: 5, color: 'rgba(255, 251, 235, 0.6)', duration: '20s', delay: '-7s', blurPx: 1.5 },
  { id: 9, left: '51%', top: '81%', sizePx: 4, color: 'rgba(245, 208, 254, 0.55)', duration: '16s', delay: '-9s', blurPx: 1 },
];

export const HomeSection: React.FC<HomeSectionProps> = memo(({
  onNavigate,
  isAwake = true,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const bgPictureRef = useRef<HTMLDivElement>(null);
  const motesLayerRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const bottomGradientRef = useRef<HTMLDivElement>(null);
  const titlePlaneRef = useRef<HTMLDivElement>(null);
  const signaturePlaneRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const signatureRef = useRef<HTMLImageElement>(null);
  const occRef = useRef<HTMLParagraphElement>(null);
  const mottoRef = useRef<HTMLDivElement>(null);
  const scrollCtaRef = useRef<HTMLDivElement>(null);
  const studioCtaRef = useRef<HTMLButtonElement>(null);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { hasCoarsePointer, prefersReducedMotion } = useDeviceCapabilities();

  const [imageLoaded, setImageLoaded] = useState<boolean>(true);
  const [nebulaReady, setNebulaReady] = useState<boolean>(false);
  const [titleAwakened, setTitleAwakened] = useState<boolean>(false);
  const [isCtaHovered, setIsCtaHovered] = useState<boolean>(false);
  const [isCtaPressed, setIsCtaPressed] = useState<boolean>(false);
  const [isTransitioningToStudio, setIsTransitioningToStudio] = useState<boolean>(false);
  const [isHeroInView, setIsHeroInView] = useState<boolean>(true);

  useEffect(() => {
    const reduced = prefersReducedMotion || getReducedMotionPreference();

    if (reduced) {
      if (word1Ref.current) {
        word1Ref.current.style.transform = 'none';
        word1Ref.current.style.opacity = '1';
      }
      if (word2Ref.current) {
        word2Ref.current.style.transform = 'none';
        word2Ref.current.style.opacity = '1';
      }
      if (signatureRef.current) {
        signatureRef.current.style.opacity = '1';
        signatureRef.current.style.transform = 'rotate(-3deg)';
      }
      if (occRef.current) {
        occRef.current.style.opacity = '1';
        occRef.current.style.transform = 'none';
      }
      if (mottoRef.current) {
        mottoRef.current.style.opacity = '1';
        mottoRef.current.style.transform = 'none';
      }
      if (scrollCtaRef.current) {
        scrollCtaRef.current.style.opacity = '1';
        scrollCtaRef.current.style.transform = 'none';
      }
      setNebulaReady(true);
      setTitleAwakened(true);
      return;
    }

    const words = [word1Ref.current, word2Ref.current];
    words.forEach((el) => {
      if (!el) return;
      el.style.transform = 'translate3d(0, 128%, 0) rotate(5deg)';
      el.style.opacity = '0';
      el.style.transition =
        'transform 1.25s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.85s ease';
    });

    if (signatureRef.current) {
      signatureRef.current.style.opacity = '0';
      signatureRef.current.style.transform = 'translate3d(0, 16px, 0) scale(0.96) rotate(-3deg)';
      signatureRef.current.style.transition =
        'opacity 1.2s ease 0.42s, transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.42s';
    }

    if (occRef.current) {
      occRef.current.style.opacity = '0';
      occRef.current.style.transform = 'translate3d(0, 18px, 0)';
      occRef.current.style.transition =
        'opacity 0.9s ease 0.62s, transform 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) 0.62s';
    }

    if (mottoRef.current) {
      mottoRef.current.style.opacity = '0';
      mottoRef.current.style.transform = 'translate3d(0, 16px, 0)';
      mottoRef.current.style.transition =
        'opacity 0.9s ease 0.72s, transform 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) 0.72s';
    }

    if (scrollCtaRef.current) {
      scrollCtaRef.current.style.opacity = '0';
      scrollCtaRef.current.style.transform = 'translate3d(0, 18px, 0)';
      scrollCtaRef.current.style.transition =
        'opacity 0.9s ease 0.82s, transform 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) 0.82s';
    }

    if (!isAwake) {
      return;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      timeouts.push(setTimeout(fn, delay));
    };

    const startAwakening = () => {
      setNebulaReady(true);
      setTitleAwakened(true);

      if (word1Ref.current) {
        schedule(() => {
          if (word1Ref.current) {
            word1Ref.current.style.transform = 'translate3d(0, 0%, 0) rotate(0deg)';
            word1Ref.current.style.opacity = '1';
          }
        }, 120);
      }

      if (word2Ref.current) {
        schedule(() => {
          if (word2Ref.current) {
            word2Ref.current.style.transform = 'translate3d(0, 0%, 0) rotate(0deg)';
            word2Ref.current.style.opacity = '1';
          }
        }, 260);
      }

      if (signatureRef.current) {
        schedule(() => {
          if (signatureRef.current) {
            signatureRef.current.style.opacity = '1';
            signatureRef.current.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(-3deg)';
          }
        }, 390);
      }

      if (occRef.current) {
        schedule(() => {
          if (occRef.current) {
            occRef.current.style.opacity = '1';
            occRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
        }, 560);
      }

      if (mottoRef.current) {
        schedule(() => {
          if (mottoRef.current) {
            mottoRef.current.style.opacity = '1';
            mottoRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
        }, 680);
      }

      if (scrollCtaRef.current) {
        schedule(() => {
          if (scrollCtaRef.current) {
            scrollCtaRef.current.style.opacity = '1';
            scrollCtaRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
        }, 780);
      }
    };

    schedule(startAwakening, imageLoaded ? 70 : 280);

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [imageLoaded, isAwake, prefersReducedMotion]);

  // Independent, zero-React-render Hero scroll parallax & visibility pausing
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || typeof window === 'undefined') return;

    const reduced = prefersReducedMotion || getReducedMotionPreference();
    let isIntersecting = true;
    let rafId: number | null = null;
    let lastAppliedScroll = -1;
    let lastAppliedHeight = -1;

    const applyHeroParallax = (force = false) => {
      const currentScroll = reduced
        ? 0
        : window.scrollY || document.documentElement.scrollTop || 0;
      const viewportH = window.innerHeight || 900;

      if (!force && currentScroll === lastAppliedScroll && viewportH === lastAppliedHeight) {
        return;
      }
      lastAppliedScroll = currentScroll;
      lastAppliedHeight = viewportH;

      const m = computeHeroParallaxMetrics(currentScroll, viewportH);

      sectionEl.style.backgroundColor = m.sectionBackgroundColor;
      sectionEl.style.setProperty('--nebula-parallax-y', `${m.nebulaOffsetY}px`);

      if (bgLayerRef.current) {
        bgLayerRef.current.style.transform = `translate3d(0, ${m.bgParallaxY}px, 0)`;
        bgLayerRef.current.style.filter = `saturate(${m.bgSaturate}) brightness(${m.bgBrightness})`;
      }

      if (foregroundRef.current) {
        foregroundRef.current.style.transform = `translate3d(0, ${m.textParallaxY}px, 0) scale(${m.heroScale})`;
        foregroundRef.current.style.opacity = String(m.heroOpacity);
        foregroundRef.current.style.filter = `blur(${m.heroBlurPx}px)`;
      }

      if (bottomGradientRef.current) {
        bottomGradientRef.current.style.opacity = String(m.bottomGradientOpacity);
      }
    };

    const scheduleParallaxFrame = () => {
      if (!isIntersecting || document.visibilityState === 'hidden' || rafId !== null) {
        return;
      }
      rafId = requestAnimationFrame(() => {
        rafId = null;
        applyHeroParallax();
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasIntersecting = isIntersecting;
        isIntersecting = entry.isIntersecting;
        setIsHeroInView(entry.isIntersecting);
        if (isIntersecting || wasIntersecting) {
          applyHeroParallax(true);
        }
      },
      { threshold: 0, rootMargin: '40px 0px' }
    );
    observer.observe(sectionEl);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isIntersecting) {
        applyHeroParallax(true);
      } else if (document.visibilityState === 'hidden' && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const handleResize = () => {
      scheduleParallaxFrame();
    };

    applyHeroParallax(true);
    window.addEventListener('scroll', scheduleParallaxFrame, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleParallaxFrame);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [prefersReducedMotion]);

  // Subtle multi-plane pointer parallax & magnetic CTA interaction (fine pointer desktop/laptop only)
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || typeof window === 'undefined') return;
    if (prefersReducedMotion || hasCoarsePointer || !isHeroInView) {
      return;
    }

    let rafId: number | null = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentBgX = 0;
    let currentBgY = 0;
    let currentNebulaX = 0;
    let currentNebulaY = 0;
    let currentTitleX = 0;
    let currentTitleY = 0;
    let currentSigX = 0;
    let currentSigY = 0;
    let currentFgX = 0;
    let currentFgY = 0;
    let currentCtaX = 0;
    let currentCtaY = 0;
    let currentInnerX = 0;
    let currentInnerY = 0;
    let pointerActive = false;

    const resetMagneticStyles = () => {
      const btn = studioCtaRef.current;
      if (!btn) return;
      btn.style.setProperty('--cta-tx', '0px');
      btn.style.setProperty('--cta-ty', '0px');
      btn.style.setProperty('--cta-ix', '0px');
      btn.style.setProperty('--cta-iy', '0px');
      btn.style.setProperty('--cta-spot-x', '50%');
      btn.style.setProperty('--cta-spot-y', '50%');
    };

    const tick = () => {
      rafId = null;
      const vw = window.innerWidth || 1440;
      const vh = window.innerHeight || 900;

      const planeTargets = pointerActive
        ? computeHeroMouseParallax({
            pointerX: targetX,
            pointerY: targetY,
            viewportWidth: vw,
            viewportHeight: vh,
            prefersReducedMotion,
          })
        : {
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

      const lerpFactor = pointerActive ? 0.14 : 0.1;
      currentBgX += (planeTargets.bgX - currentBgX) * lerpFactor;
      currentBgY += (planeTargets.bgY - currentBgY) * lerpFactor;
      currentNebulaX += (planeTargets.nebulaX - currentNebulaX) * lerpFactor;
      currentNebulaY += (planeTargets.nebulaY - currentNebulaY) * lerpFactor;
      currentTitleX += (planeTargets.titleX - currentTitleX) * lerpFactor;
      currentTitleY += (planeTargets.titleY - currentTitleY) * lerpFactor;
      currentSigX += (planeTargets.signatureX - currentSigX) * lerpFactor;
      currentSigY += (planeTargets.signatureY - currentSigY) * lerpFactor;
      currentFgX += (planeTargets.foregroundX - currentFgX) * lerpFactor;
      currentFgY += (planeTargets.foregroundY - currentFgY) * lerpFactor;

      if (bgPictureRef.current) {
        bgPictureRef.current.style.transform = `translate3d(${currentBgX.toFixed(2)}px, ${currentBgY.toFixed(2)}px, 0) scale(1.025)`;
      }
      sectionEl.style.setProperty('--nebula-mx', `${currentNebulaX.toFixed(2)}px`);
      sectionEl.style.setProperty('--nebula-my', `${currentNebulaY.toFixed(2)}px`);
      if (titlePlaneRef.current) {
        titlePlaneRef.current.style.transform = `translate3d(${currentTitleX.toFixed(2)}px, ${currentTitleY.toFixed(2)}px, 0)`;
      }
      if (signaturePlaneRef.current) {
        signaturePlaneRef.current.style.transform = `translate3d(${currentSigX.toFixed(2)}px, ${currentSigY.toFixed(2)}px, 0)`;
      }
      if (motesLayerRef.current) {
        motesLayerRef.current.style.transform = `translate3d(${currentFgX.toFixed(2)}px, ${currentFgY.toFixed(2)}px, 0)`;
      }

      const btn = studioCtaRef.current;
      if (btn) {
        if (pointerActive) {
          const rect = btn.getBoundingClientRect();
          const mag = computeMagneticCtaOffset({
            pointerX: targetX,
            pointerY: targetY,
            rectLeft: rect.left,
            rectTop: rect.top,
            rectWidth: rect.width,
            rectHeight: rect.height,
            prefersReducedMotion,
          });
          const ctaLerp = mag.isNear ? 0.24 : 0.14;
          currentCtaX += (mag.translateX - currentCtaX) * ctaLerp;
          currentCtaY += (mag.translateY - currentCtaY) * ctaLerp;
          currentInnerX += (mag.innerX - currentInnerX) * ctaLerp;
          currentInnerY += (mag.innerY - currentInnerY) * ctaLerp;
          btn.style.setProperty('--cta-spot-x', `${mag.spotXPercent}%`);
          btn.style.setProperty('--cta-spot-y', `${mag.spotYPercent}%`);
        } else {
          currentCtaX *= 0.85;
          currentCtaY *= 0.85;
          currentInnerX *= 0.85;
          currentInnerY *= 0.85;
        }
        btn.style.setProperty('--cta-tx', `${currentCtaX.toFixed(2)}px`);
        btn.style.setProperty('--cta-ty', `${currentCtaY.toFixed(2)}px`);
        btn.style.setProperty('--cta-ix', `${currentInnerX.toFixed(2)}px`);
        btn.style.setProperty('--cta-iy', `${currentInnerY.toFixed(2)}px`);
      }

      const stillSettling =
        Math.abs(planeTargets.nebulaX - currentNebulaX) > 0.08 ||
        Math.abs(planeTargets.nebulaY - currentNebulaY) > 0.08 ||
        Math.abs(currentCtaX) > 0.08 ||
        Math.abs(currentCtaY) > 0.08;

      if (pointerActive || stillSettling) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const scheduleTick = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointerActive = true;
      targetX = e.clientX;
      targetY = e.clientY;
      scheduleTick();
    };

    const handlePointerLeave = () => {
      pointerActive = false;
      scheduleTick();
    };

    sectionEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    sectionEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      sectionEl.removeEventListener('pointermove', handlePointerMove);
      sectionEl.removeEventListener('pointerleave', handlePointerLeave);
      resetMagneticStyles();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [hasCoarsePointer, isHeroInView, prefersReducedMotion]);

  // Clean up transition timers on unmount
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (resetTransitionTimerRef.current) clearTimeout(resetTransitionTimerRef.current);
    };
  }, []);

  const navigateToStudioWithCeremony = useCallback(() => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    if (resetTransitionTimerRef.current) clearTimeout(resetTransitionTimerRef.current);

    if (prefersReducedMotion || getReducedMotionPreference()) {
      if (onNavigate) {
        onNavigate('studio');
      } else {
        document.getElementById('studio')?.scrollIntoView({ behavior: 'auto' });
      }
      return;
    }

    setIsTransitioningToStudio(true);

    transitionTimerRef.current = setTimeout(() => {
      if (onNavigate) {
        onNavigate('studio');
      } else {
        const studioEl = document.getElementById('studio');
        if (studioEl) {
          const offset10vh = window.innerHeight * 0.1;
          const targetY = Math.max(0, studioEl.offsetTop - offset10vh);
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    }, 220);

    resetTransitionTimerRef.current = setTimeout(() => {
      setIsTransitioningToStudio(false);
    }, 950);
  }, [onNavigate, prefersReducedMotion]);

  const handleScrollCueClick = useCallback(() => {
    if (onNavigate) {
      onNavigate('studio');
      return;
    }
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      const offset10vh = window.innerHeight * 0.1;
      const targetY = Math.max(0, studioEl.offsetTop - offset10vh);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  }, [onNavigate]);

  return (
    <section
      id="home"
      ref={sectionRef}
      data-transitioning={isTransitioningToStudio ? 'studio' : 'idle'}
      className={`relative w-full h-screen min-h-[600px] overflow-hidden box-border select-none flex items-center justify-center transition-colors duration-500 ${
        !isHeroInView ? 'hero-offscreen-paused' : ''
      }`}
      style={{
        backgroundColor: '#ebe8e1',
      }}
      aria-label="Hero section — Rocky Babcock"
    >
      {/* Distant Layer: Original Watercolor Tulip Garden Artwork + Subtle Pointer Depth */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-[1] overflow-hidden"
        style={{
          transform: 'translate3d(0, 0px, 0)',
          filter: 'saturate(1) brightness(1)',
          willChange: 'transform, filter',
          transition: 'filter 0.1s ease-out',
        }}
        aria-hidden="true"
      >
        <div
          ref={bgPictureRef}
          className="w-full h-full will-change-transform"
          style={{ transform: 'translate3d(0px, 0px, 0) scale(1.025)' }}
        >
          <picture className="w-full h-full block">
            <source srcSet="/assets/imgs/home-back.webp" type="image/webp" />
            <img
              src="/assets/imgs/home-back.jpg"
              alt="Rocky Babcock watercolor tulip garden"
              width={1920}
              height={1306}
              fetchPriority="high"
              loading="eager"
              decoding="async"
              draggable={false}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover object-center select-none transition-opacity duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </picture>
        </div>
      </div>

      {/* Mid-Distant Layer: Botanical Natural Sunlight & Canopy Petal Shadow Drift */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-[2] overflow-hidden"
        data-botanical-atmosphere="true"
        aria-hidden="true"
      >
        <div
          className="absolute -top-[15%] -left-[10%] w-[75%] h-[65%] botanical-sunlight-shift mix-blend-soft-light"
          style={{
            background:
              'radial-gradient(ellipse 68% 60% at 38% 35%, rgba(255, 251, 235, 0.72) 0%, rgba(254, 243, 199, 0.28) 45%, transparent 78%)',
          }}
        />
        <div
          className="absolute -bottom-[10%] -left-[8%] w-[52%] h-[52%] botanical-petal-shadow mix-blend-multiply"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 32% 72%, rgba(49, 46, 129, 0.16) 0%, rgba(88, 28, 135, 0.08) 50%, transparent 78%)',
          }}
        />
      </div>

      {/* Celestial Sky Halo (Upper Sky Crown Layer) */}
      <NebulaBackground nebulaReady={nebulaReady} />

      {/* Mid-Near Layer: Restraint Botanical Pollen / Dew Motes near blooms (9 organic motes) */}
      <div
        ref={motesLayerRef}
        className="absolute inset-0 pointer-events-none select-none z-[5] overflow-hidden will-change-transform"
        aria-hidden="true"
      >
        {BOTANICAL_MOTES.map((mote) => (
          <span
            key={mote.id}
            className="absolute rounded-full botanical-mote-drift"
            style={{
              left: mote.left,
              top: mote.top,
              width: `${mote.sizePx}px`,
              height: `${mote.sizePx}px`,
              background: `radial-gradient(circle, ${mote.color} 0%, transparent 72%)`,
              filter: `blur(${mote.blurPx}px)`,
              ['--mote-duration' as string]: mote.duration,
              ['--mote-delay' as string]: mote.delay,
            }}
          />
        ))}
      </div>

      {/* Foreground Hero Exhibition Stage */}
      <div
        ref={foregroundRef}
        className={`relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none box-border pt-14 sm:pt-16 pb-6 sm:pb-10 will-change-transform bg-transparent transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isTransitioningToStudio ? '-translate-y-4 opacity-85 scale-[1.018]' : ''
        }`}
        style={{
          transform: isTransitioningToStudio
            ? 'translate3d(0, -18px, 0) scale(1.018)'
            : 'translate3d(0, 0px, 0) scale(1)',
          opacity: isTransitioningToStudio ? 0.72 : 1,
          filter: isTransitioningToStudio ? 'blur(1.5px)' : 'blur(0px)',
          willChange: 'transform, opacity, filter',
        }}
      >
        {/* Invisible-edge atmospheric dusk mist behind center typography & secondary action */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 w-[min(96vw,780px)] h-[min(78vh,560px)]"
          style={{
            background:
              'radial-gradient(ellipse 58% 50% at 50% 50%, rgba(14, 10, 32, 0.34) 0%, rgba(18, 13, 38, 0.16) 52%, transparent 80%)',
          }}
        />

        <div className="relative flex flex-col items-center pointer-events-auto bg-transparent max-w-4xl mx-auto">
          {/* Handwritten Author Signature anchored over the 'r' ascender crest */}
          <div
            ref={signaturePlaneRef}
            className="relative w-full flex justify-center sm:justify-start sm:pl-[8%] md:pl-[10%] -mb-4 sm:-mb-6 md:-mb-7 pointer-events-none z-20 will-change-transform"
          >
            <img
              ref={signatureRef}
              src="/assets/imgs/signature.svg"
              alt="Rocky Babcock handwritten signature"
              width={1150}
              height={360}
              loading="eager"
              decoding="async"
              draggable={false}
              className="signature-illuminated w-[42vw] sm:w-[30vw] md:w-[24vw] lg:w-[20vw] max-w-[310px] min-w-[160px] h-auto object-contain select-none will-change-transform -rotate-[3deg]"
            />
          </div>

          {/* Monogram Display Typography with Light Crest & Micro-Parallax */}
          <div
            ref={titlePlaneRef}
            className="relative px-2 py-1 bg-transparent will-change-transform"
          >
            <h1
              className={`hero-title-illuminated flex flex-col items-center m-0 p-0 font-normal select-none bg-transparent ${
                titleAwakened ? 'is-awakened' : ''
              }`}
              style={{
                fontFamily: 'var(--title-font)',
              }}
            >
              <div className="overflow-hidden inline-flex pb-1 sm:pr-[0.14em]">
                <span
                  ref={word1Ref}
                  className="inline-block text-white lowercase will-change-transform"
                  style={{
                    fontSize: 'clamp(3.35rem, min(10.2vw, 13.8vh), 8.6rem)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.03em',
                    fontFamily: 'var(--title-font)',
                  }}
                >
                  rocky
                </span>
              </div>

              <div className="overflow-hidden inline-flex pb-1 sm:pl-[0.1em]">
                <span
                  ref={word2Ref}
                  className="inline-block text-white lowercase will-change-transform"
                  style={{
                    fontSize: 'clamp(3.35rem, min(10.2vw, 13.8vh), 8.6rem)',
                    lineHeight: 0.88,
                    letterSpacing: '-0.036em',
                    fontFamily: 'var(--title-font)',
                  }}
                >
                  babcock
                </span>
              </div>
            </h1>
          </div>

          {/* Subtitle / Discipline Kicker */}
          <div className="overflow-hidden mt-3.5 sm:mt-4.5 md:mt-5">
            <p
              ref={occRef}
              className="m-0 font-mono text-[11px] sm:text-xs md:text-[13px] text-white tracking-[0.26em] font-light uppercase text-center will-change-transform"
              style={{
                filter:
                  'drop-shadow(0 1px 6px rgba(10, 6, 24, 0.9)) drop-shadow(0 0 12px rgba(168, 85, 247, 0.35))',
              }}
            >
              creative technologist &amp; frontend developer
            </p>
          </div>

          {/* Bilingual Garden Motto */}
          <div ref={mottoRef} className="overflow-hidden mt-2.5 sm:mt-3.5 max-w-xl text-center will-change-transform px-4">
            <p className="m-0 motto-illuminated text-xs sm:text-sm md:text-[15px] font-normal tracking-[0.18em] text-white/95 leading-relaxed">
              写有呼吸的代码，造看得见光的界面。
            </p>
            <p className="mt-1.5 text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-white/85 uppercase font-light drop-shadow-[0_1px_6px_rgba(10,6,24,0.92)]">
              code with breath &bull; interfaces that see light
            </p>
          </div>

          {/* Primary Magnetic CTA + Quiet Secondary Availability Action */}
          <div
            ref={scrollCtaRef}
            className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-7 will-change-transform py-1.5 px-3"
          >
            <button
              ref={studioCtaRef}
              type="button"
              onClick={navigateToStudioWithCeremony}
              onPointerEnter={() => setIsCtaHovered(true)}
              onPointerLeave={() => {
                setIsCtaHovered(false);
                setIsCtaPressed(false);
              }}
              onPointerDown={() => setIsCtaPressed(true)}
              onPointerUp={() => setIsCtaPressed(false)}
              data-cta-hovered={isCtaHovered ? 'true' : 'false'}
              data-cta-pressed={isCtaPressed ? 'true' : 'false'}
              style={{
                transform: isCtaPressed
                  ? 'translate3d(var(--cta-tx, 0px), var(--cta-ty, 0px), 0) scale(0.965)'
                  : isCtaHovered
                  ? 'translate3d(var(--cta-tx, 0px), var(--cta-ty, 0px), 0) scale(1.025)'
                  : 'translate3d(var(--cta-tx, 0px), var(--cta-ty, 0px), 0) scale(1)',
              }}
              className="group relative overflow-hidden inline-flex items-center gap-3 px-7 py-3 rounded-full font-mono text-xs sm:text-[13px] tracking-[0.22em] uppercase text-white bg-[#0d0a1a]/65 hover:bg-[#151029]/78 border border-white/35 hover:border-purple-200/80 shadow-[0_8px_28px_rgba(6,4,18,0.5)] hover:shadow-[0_12px_34px_rgba(192,132,252,0.34)] active:shadow-[inset_0_2px_10px_rgba(0,0,0,0.65),0_4px_14px_rgba(192,132,252,0.22)] backdrop-blur-md cursor-pointer transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 clickable"
              aria-label="Enter the Studio"
            >
              {/* Flowing conic border shimmer rim */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full p-[1px] opacity-65 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              >
                <span
                  className="hero-cta-border-sweep absolute left-1/2 top-1/2 w-[260px] h-[260px]"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.85) 38deg, rgba(216,180,254,0.65) 75deg, transparent 130deg, transparent 360deg)',
                  }}
                />
              </span>

              {/* Cursor-tracked radial hover luminance */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300 ${
                  isCtaHovered ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background:
                    'radial-gradient(110px circle at var(--cta-spot-x, 50%) var(--cta-spot-y, 50%), rgba(243, 232, 255, 0.28), transparent 70%)',
                }}
              />

              {/* Inner label cluster with subtle counter-pull */}
              <span
                className="relative z-10 inline-flex items-center gap-3 pointer-events-none will-change-transform"
                style={{
                  transform:
                    'translate3d(var(--cta-ix, 0px), var(--cta-iy, 0px), 0)',
                }}
              >
                <span className="text-purple-200 font-light text-sm">&bull;</span>
                <span>enter the studio</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 font-light text-sm text-white/80">
                  &rarr;
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.('contact')}
              className="group relative inline-flex items-center gap-2 py-2 px-1 font-mono text-[11px] sm:text-xs tracking-[0.2em] text-white/95 hover:text-white bg-transparent border-none cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 rounded clickable drop-shadow-[0_1px_8px_rgba(10,6,24,0.9)]"
              aria-label="Available for collaboration"
            >
              <span className="lowercase">available for 2026</span>
              <span
                aria-hidden="true"
                className="text-purple-200/90 group-hover:translate-x-0.5 transition-transform duration-200"
              >
                &#8599;
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-1 right-1 h-[1px] bg-white/45 group-hover:bg-white/90 transition-colors duration-200"
              />
            </button>
          </div>

          <div className="mt-2.5 sm:mt-3.5 opacity-65 hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleScrollCueClick}
              className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-white/85 hover:text-white bg-transparent border-none cursor-pointer p-1.5 drop-shadow-[0_1px_6px_rgba(10,6,24,0.88)] clickable focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded"
              aria-label="Scroll down to explore Studio"
            >
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">&darr;</span>
              <span>scroll to explore</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Seamless Veil into Deep Cosmos */}
      <div
        ref={bottomGradientRef}
        className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 pointer-events-none z-[4] transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, rgba(3, 0, 20, 0.4) 50%, rgba(3, 0, 20, 0.95) 100%)',
          opacity: 0.4,
        }}
        aria-hidden="true"
      />
    </section>
  );
});

HomeSection.displayName = 'HomeSection';
