import React, { useEffect, useRef, useState } from 'react';
import { NebulaBackground } from './NebulaBackground';
import { VISUAL_CONSTANTS } from '../../constants/visual';

interface HomeSectionProps {
  scrollY: number;
  onNavigate?: (targetId: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ scrollY, onNavigate }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const signatureRef = useRef<HTMLImageElement>(null);
  const occRef = useRef<HTMLParagraphElement>(null);
  const mottoRef = useRef<HTMLParagraphElement>(null);
  const scrollCtaRef = useRef<HTMLButtonElement>(null);

  const [imageLoaded, setImageLoaded] = useState<boolean>(true);
  const [nebulaReady, setNebulaReady] = useState<boolean>(false);

  // Trigger entrance animation once background image is ready or fallback timer fires
  useEffect(() => {
    // Check for user's reduced-motion preferences
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

    // Set initial hidden coordinates
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

    // Only start entrance stagger after artwork image is loaded or after brief safety delay
    let timeoutId: NodeJS.Timeout;

    const startAwakening = () => {
      setNebulaReady(true);

      if (word1Ref.current) {
        setTimeout(() => {
          word1Ref.current!.style.transform = 'translate3d(0, 0%, 0) rotate(0deg)';
          word1Ref.current!.style.opacity = '1';
        }, 160);
      }

      if (word2Ref.current) {
        setTimeout(() => {
          word2Ref.current!.style.transform = 'translate3d(0, 0%, 0) rotate(0deg)';
          word2Ref.current!.style.opacity = '1';
        }, 300);
      }

      if (signatureRef.current) {
        setTimeout(() => {
          signatureRef.current!.style.opacity = '1';
          signatureRef.current!.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(-4deg)';
        }, 440);
      }

      if (occRef.current) {
        setTimeout(() => {
          occRef.current!.style.opacity = '1';
          occRef.current!.style.transform = 'translate3d(0, 0, 0)';
        }, 620);
      }

      if (mottoRef.current) {
        setTimeout(() => {
          mottoRef.current!.style.opacity = '1';
          mottoRef.current!.style.transform = 'translate3d(0, 0, 0)';
        }, 720);
      }

      if (scrollCtaRef.current) {
        setTimeout(() => {
          scrollCtaRef.current!.style.opacity = '1';
          scrollCtaRef.current!.style.transform = 'translate3d(0, 0, 0)';
        }, 840);
      }
    };

    if (imageLoaded) {
      timeoutId = setTimeout(startAwakening, 120);
    } else {
      // Fallback in case image takes time or is already in cache
      timeoutId = setTimeout(startAwakening, 600);
    }

    return () => clearTimeout(timeoutId);
  }, [imageLoaded]);

  // Multi-tier parallax offsets for deep dimensional separation
  const bgParallaxY = scrollY * VISUAL_CONSTANTS.PARALLAX.BACKGROUND;
  const nebulaParallaxY = scrollY * VISUAL_CONSTANTS.PARALLAX.NEBULA;
  const textParallaxY = scrollY * VISUAL_CONSTANTS.PARALLAX.TEXT;

  const handleScrollCueClick = () => {
    if (onNavigate) {
      onNavigate('work');
    } else {
      const workEl = document.getElementById('work');
      if (workEl) {
        const offset10vh = window.innerHeight * 0.1;
        const targetY = Math.max(0, workEl.offsetTop - offset10vh);
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden box-border select-none flex items-center justify-center bg-[#ebe8e1]"
      aria-label="Hero section — Rocky Babcock"
    >
      {/* ─────────────────────────────────────────────────────────────
          LAYER 1: FULL-SCREEN BOTANICAL WATERCOLOR ARTWORK (home-back.jpg)
          The watercolor tulip garden and blue watercolor sky fill the entire
          canvas, establishing the light, artistic museum atmosphere.
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-[1] overflow-hidden"
        style={{
          transform: `translate3d(0, ${bgParallaxY}px, 0)`,
          willChange: 'transform',
        }}
        aria-hidden="true"
      >
        <img
          src="/assets/imgs/home-back.jpg"
          alt="Rocky Babcock watercolor tulip garden"
          draggable={false}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center select-none transition-opacity duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 1.5 & LAYER 2: CELESTIAL ACCRETION DISK NEBULA
          Extracted to dedicated <NebulaBackground /> component for modularity
         ───────────────────────────────────────────────────────────── */}
      <NebulaBackground
        nebulaReady={nebulaReady}
        nebulaParallaxY={nebulaParallaxY}
      />

      {/* ─────────────────────────────────────────────────────────────
          LAYER 3: FOREGROUND TYPOGRAPHIC LOCKUP (MUSAB HASSAN EDITORIAL)
          - Positioned in lower-middle sky, right above the vivid flowers
          - Zero background blocks or dark translucent sheets (100% clean watercolor)
          - Delicate, refined silver-purple outer glow on typography
          - Balanced signature in upper left, perfectly clear of any fog
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none box-border pt-10 sm:pt-14 pb-8 sm:pb-12 will-change-transform bg-transparent"
        style={{
          transform: `translate3d(0, ${textParallaxY}px, 0)`,
        }}
      >
        {/* Core title and signature cluster */}
        <div className="relative flex flex-col items-center pointer-events-auto bg-transparent">
          {/* Handcrafted luminous signature placed with commanding presence above 'rocky' */}
          <div className="absolute -top-[52px] sm:-top-[58px] md:-top-[68px] lg:-top-[78px] -left-[14px] sm:-left-[180px] md:-left-[240px] lg:-left-[300px] pointer-events-none z-20">
            <img
              ref={signatureRef}
              src="/assets/imgs/signature.svg"
              alt="Rocky Babcock handwritten signature"
              draggable={false}
              className="signature-illuminated w-[55vw] sm:w-[42vw] md:w-[35vw] lg:w-[30vw] max-w-[440px] min-w-[210px] h-auto object-contain select-none will-change-transform rotate-[-3deg]"
            />
          </div>

          {/* Editorial Display Title Block — completely transparent, delicate silver-purple illumination */}
          <div className="relative px-2 py-1 bg-transparent">
            <h1
              className="hero-title-illuminated flex flex-col items-center m-0 p-0 font-normal select-none bg-transparent"
              style={{
                fontFamily: 'var(--title-font)',
              }}
            >
              {/* First Word: rocky */}
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

              {/* Second Word: babcock */}
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

          {/* Minimalist Occupation Tagline */}
          <div className="overflow-hidden mt-4 sm:mt-5 md:mt-6">
            <p
              ref={occRef}
              className="m-0 text-xs sm:text-sm md:text-base text-white/95 tracking-[0.16em] font-normal lowercase text-center will-change-transform"
              style={{
                fontFamily: 'var(--body-font)',
                filter:
                  'drop-shadow(0 0 10px rgba(168, 85, 247, 0.35)) drop-shadow(0 2px 10px rgba(0, 0, 0, 0.80)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.95))',
              }}
            >
              creative technologist &amp; frontend developer
            </p>
          </div>

          {/* Personal Attitude / Philosophy Statement with enhanced breathing room, scale and luminous integration */}
          <div className="overflow-hidden mt-2.5 sm:mt-3.5 max-w-xl">
            <p
              ref={mottoRef}
              className="m-0 motto-illuminated text-xs sm:text-[13px] md:text-sm font-mono tracking-[0.14em] lowercase text-center will-change-transform px-4 leading-relaxed font-light"
            >
              bridging aesthetic intuition and algorithmic precision into tactile digital spaces.
            </p>
          </div>

          {/* Interactive '↓ SCROLL' Action Cue with Gentle Floating Animation */}
          <div className="overflow-hidden mt-4 sm:mt-5 md:mt-6">
            <button
              ref={scrollCtaRef}
              type="button"
              onClick={handleScrollCueClick}
              className="scroll-cue-float group font-mono text-xs sm:text-sm tracking-[0.28em] uppercase text-white/90 hover:text-white flex items-center gap-2 cursor-pointer transition-all duration-300 py-2 px-4 border-none bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded clickable will-change-transform"
              aria-label="Scroll down to studio projects"
              style={{
                filter:
                  'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.70)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.90))',
              }}
            >
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-1 text-sm sm:text-base font-normal">
                ↓
              </span>
              <span className="font-mono tracking-[0.28em]">SCROLL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Bottom Organic Vignette: Replaced heavy dark curtain with ultra-light transition (<15% intensity),
          preserving maximum brightness, crispness, and clarity of the watercolor tulips */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 pointer-events-none z-[4] bg-gradient-to-b from-transparent via-[#030014]/10 to-[#030014]/35"
        aria-hidden="true"
      />
    </section>
  );
};

