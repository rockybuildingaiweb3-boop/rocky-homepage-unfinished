import React, { memo, useEffect, useRef, useState } from 'react';
import { NebulaBackground } from './NebulaBackground';
import { computeHeroParallaxMetrics } from '../../features/scroll/heroParallax';

interface HomeSectionProps {
  onNavigate?: (targetId: string) => void;
  isAwake?: boolean;
}

export const HomeSection: React.FC<HomeSectionProps> = memo(({
  onNavigate,
  isAwake = true,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const bottomGradientRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const signatureRef = useRef<HTMLImageElement>(null);
  const occRef = useRef<HTMLParagraphElement>(null);
  const mottoRef = useRef<HTMLDivElement>(null);
  const scrollCtaRef = useRef<HTMLDivElement>(null);

  const [imageLoaded, setImageLoaded] = useState<boolean>(true);
  const [nebulaReady, setNebulaReady] = useState<boolean>(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
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
        signatureRef.current.style.transform = 'none';
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
      return;
    }

    const words = [word1Ref.current, word2Ref.current];
    words.forEach((el) => {
      if (!el) return;
      el.style.transform = 'translate3d(0, 130%, 0) rotate(7deg)';
      el.style.opacity = '0';
      el.style.transition =
        'transform 1.25s cubic-bezier(0.165, 0.84, 0.44, 1), opacity 0.85s ease';
    });

    if (signatureRef.current) {
      signatureRef.current.style.opacity = '0';
      signatureRef.current.style.transform = 'translate3d(0, 16px, 0) scale(0.96) rotate(-4deg)';
      signatureRef.current.style.transition =
        'opacity 1.2s ease 0.45s, transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.45s';
    }

    if (occRef.current) {
      occRef.current.style.opacity = '0';
      occRef.current.style.transform = 'translate3d(0, 20px, 0)';
      occRef.current.style.transition =
        'opacity 0.9s ease 0.65s, transform 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) 0.65s';
    }

    if (mottoRef.current) {
      mottoRef.current.style.opacity = '0';
      mottoRef.current.style.transform = 'translate3d(0, 16px, 0)';
      mottoRef.current.style.transition =
        'opacity 0.9s ease 0.75s, transform 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) 0.75s';
    }

    if (scrollCtaRef.current) {
      scrollCtaRef.current.style.opacity = '0';
      scrollCtaRef.current.style.transform = 'translate3d(0, 20px, 0)';
      scrollCtaRef.current.style.transition =
        'opacity 0.9s ease 0.85s, transform 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) 0.85s';
    }

    // Wait until ceremony opens the world
    if (!isAwake) {
      return;
    }

    const timeouts: (ReturnType<typeof setTimeout>)[] = [];
    const schedule = (fn: () => void, delay: number) => {
      timeouts.push(setTimeout(fn, delay));
    };

    const startAwakening = () => {
      setNebulaReady(true);

      if (word1Ref.current) {
        schedule(() => {
          if (word1Ref.current) {
            word1Ref.current.style.transform = 'translate3d(0, 0%, 0) rotate(0deg)';
            word1Ref.current.style.opacity = '1';
          }
        }, 140);
      }

      if (word2Ref.current) {
        schedule(() => {
          if (word2Ref.current) {
            word2Ref.current.style.transform = 'translate3d(0, 0%, 0) rotate(0deg)';
            word2Ref.current.style.opacity = '1';
          }
        }, 280);
      }

      if (signatureRef.current) {
        schedule(() => {
          if (signatureRef.current) {
            signatureRef.current.style.opacity = '1';
            signatureRef.current.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(-4deg)';
          }
        }, 420);
      }

      if (occRef.current) {
        schedule(() => {
          if (occRef.current) {
            occRef.current.style.opacity = '1';
            occRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
        }, 600);
      }

      if (mottoRef.current) {
        schedule(() => {
          if (mottoRef.current) {
            mottoRef.current.style.opacity = '1';
            mottoRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
        }, 700);
      }

      if (scrollCtaRef.current) {
        schedule(() => {
          if (scrollCtaRef.current) {
            scrollCtaRef.current.style.opacity = '1';
            scrollCtaRef.current.style.transform = 'translate3d(0, 0, 0)';
          }
        }, 820);
      }
    };

    schedule(startAwakening, imageLoaded ? 80 : 300);

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [imageLoaded, isAwake]);

  // Independent, zero-React-render Hero parallax & day-to-night loop
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isIntersecting = true;
    let rafId: number | null = null;
    let lastAppliedScroll = -1;
    let lastAppliedHeight = -1;

    const applyHeroParallax = (force = false) => {
      const currentScroll = prefersReducedMotion
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
        if (isIntersecting || wasIntersecting) {
          // Ensure final clamped state is applied cleanly when leaving or entering
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
  }, []);

  const handleScrollCueClick = () => {
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
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden box-border select-none flex items-center justify-center transition-colors duration-500"
      style={{
        backgroundColor: '#ebe8e1',
      }}
      aria-label="Hero section — Rocky Babcock"
    >
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

      <NebulaBackground nebulaReady={nebulaReady} />

      <div
        ref={foregroundRef}
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none box-border pt-10 sm:pt-14 pb-8 sm:pb-12 will-change-transform bg-transparent"
        style={{
          transform: 'translate3d(0, 0px, 0) scale(1)',
          opacity: 1,
          filter: 'blur(0px)',
          willChange: 'transform, opacity, filter',
        }}
      >
        <div className="relative flex flex-col items-center pointer-events-auto bg-transparent">
          <div className="absolute -top-[46px] sm:-top-[58px] md:-top-[68px] lg:-top-[78px] left-[4%] sm:-left-[160px] md:-left-[220px] lg:-left-[280px] pointer-events-none z-20">
            <img
              ref={signatureRef}
              src="/assets/imgs/signature.svg"
              alt="Rocky Babcock handwritten signature"
              width={1150}
              height={360}
              loading="eager"
              decoding="async"
              draggable={false}
              className="signature-illuminated w-[50vw] sm:w-[40vw] md:w-[32vw] lg:w-[28vw] max-w-[420px] min-w-[190px] h-auto object-contain select-none will-change-transform rotate-[-3deg]"
            />
          </div>

          <div className="relative px-2 py-1 bg-transparent">
            <h1
              className="hero-title-illuminated flex flex-col items-center m-0 p-0 font-normal select-none bg-transparent"
              style={{
                fontFamily: 'var(--title-font)',
              }}
            >
              <div className="overflow-hidden inline-flex pb-1">
                <span
                  ref={word1Ref}
                  className="inline-block text-white lowercase will-change-transform"
                  style={{
                    fontSize: 'clamp(4.2rem, 11vw, 9.4rem)',
                    lineHeight: 0.86,
                    letterSpacing: '-0.035em',
                    fontFamily: 'var(--title-font)',
                  }}
                >
                  rocky
                </span>
              </div>

              <div className="overflow-hidden inline-flex pb-1">
                <span
                  ref={word2Ref}
                  className="inline-block text-white lowercase will-change-transform"
                  style={{
                    fontSize: 'clamp(4.2rem, 11vw, 9.4rem)',
                    lineHeight: 0.86,
                    letterSpacing: '-0.035em',
                    fontFamily: 'var(--title-font)',
                  }}
                >
                  babcock
                </span>
              </div>
            </h1>
          </div>

          <div className="overflow-hidden mt-4 sm:mt-5 md:mt-6">
            <p
              ref={occRef}
              className="m-0 font-mono text-[11px] sm:text-xs md:text-[13px] text-white/90 tracking-[0.24em] font-light uppercase text-center will-change-transform"
              style={{
                filter:
                  'drop-shadow(0 0 10px rgba(168, 85, 247, 0.35)) drop-shadow(0 2px 10px rgba(0, 0, 0, 0.80))',
              }}
            >
              creative technologist &amp; frontend developer
            </p>
          </div>

          <div ref={mottoRef} className="overflow-hidden mt-3 sm:mt-4 max-w-xl text-center will-change-transform px-4">
            <p className="m-0 motto-illuminated text-xs sm:text-sm md:text-[15px] font-normal tracking-[0.18em] text-white/95 leading-relaxed">
              写有呼吸的代码，造看得见光的界面。
            </p>
            <p className="mt-1.5 text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-white/55 uppercase font-light">
              code with breath &bull; interfaces that see light
            </p>
          </div>

          <div
            ref={scrollCtaRef}
            className="overflow-hidden mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-3.5 sm:gap-5 will-change-transform"
          >
            <button
              type="button"
              onClick={() => onNavigate?.('studio')}
              className="group relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full font-mono text-xs sm:text-[13px] tracking-[0.22em] uppercase text-white/95 hover:text-white bg-black/40 hover:bg-white/[0.08] border border-white/25 hover:border-white/70 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_24px_rgba(216,180,254,0.35)] backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white clickable"
              aria-label="Enter the Studio"
            >
              <span className="text-purple-300 font-light text-sm select-none">&bull;</span>
              <span>enter the studio</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 font-light text-sm text-white/70">
                &rarr;
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate?.('contact')}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-mono text-[11px] sm:text-xs tracking-[0.2em] text-white/80 hover:text-white bg-black/25 hover:bg-black/45 border border-white/15 hover:border-white/35 backdrop-blur-md cursor-pointer transition-all duration-300 hover:scale-[1.01] clickable"
              aria-label="Available for collaboration"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </span>
              <span className="lowercase">available for 2026</span>
            </button>
          </div>

          <div className="mt-4 opacity-50 hover:opacity-90 transition-opacity">
            <button
              type="button"
              onClick={handleScrollCueClick}
              className="group flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-white/60 hover:text-white bg-transparent border-none cursor-pointer p-1 clickable"
              aria-label="Scroll down to explore Studio"
            >
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-0.5">&darr;</span>
              <span>scroll to explore</span>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={bottomGradientRef}
        className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 pointer-events-none z-[4] transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(3, 0, 20, 0.4) 50%, rgba(3, 0, 20, 0.95) 100%)',
          opacity: 0.4,
        }}
        aria-hidden="true"
      />
    </section>
  );
});

HomeSection.displayName = 'HomeSection';
