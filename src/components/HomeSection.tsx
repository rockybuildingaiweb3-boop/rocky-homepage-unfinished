import React, { useEffect, useRef, useState } from 'react';

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
  const scrollCtaRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [nebulaReady, setNebulaReady] = useState<boolean>(false);
  const [shimmerActive, setShimmerActive] = useState<boolean>(false);

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
      if (scrollCtaRef.current) {
        scrollCtaRef.current.style.opacity = '1';
        scrollCtaRef.current.style.transform = 'none';
      }
      return;
    }

    // Set initial animation state with Musab Hassan's masked reveal coordinates:
    // transform: translate3d(0, 130%, 0) rotate(7deg) -> translate3d(0, 0%, 0) rotate(0deg)
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

    if (scrollCtaRef.current) {
      scrollCtaRef.current.style.opacity = '0';
      scrollCtaRef.current.style.transform = 'translate3d(0, 20px, 0)';
      scrollCtaRef.current.style.transition =
        'opacity 0.9s ease 0.8s, transform 0.9s cubic-bezier(0.165, 0.84, 0.44, 1) 0.8s';
    }

    // Trigger staggered entrance animation & ceremonial awakening
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Synchronize gentle entrance expansion & illumination for the celestial nebula
        setTimeout(() => {
          setNebulaReady(true);
        }, 120);

        if (word1Ref.current) {
          setTimeout(() => {
            word1Ref.current!.style.transform = 'translate3d(0, 0%, 0) rotate(0deg)';
            word1Ref.current!.style.opacity = '1';
          }, 200);
        }

        if (word2Ref.current) {
          setTimeout(() => {
            word2Ref.current!.style.transform = 'translate3d(0, 0%, 0) rotate(0deg)';
            word2Ref.current!.style.opacity = '1';
          }, 340);
        }

        if (signatureRef.current) {
          setTimeout(() => {
            signatureRef.current!.style.opacity = '1';
            signatureRef.current!.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(-4deg)';
          }, 460);
        }

        // Light sweeps across title right as words lock into resting position
        setTimeout(() => {
          setShimmerActive(true);
        }, 620);

        if (occRef.current) {
          setTimeout(() => {
            occRef.current!.style.opacity = '1';
            occRef.current!.style.transform = 'translate3d(0, 0, 0)';
          }, 650);
        }

        if (scrollCtaRef.current) {
          setTimeout(() => {
            scrollCtaRef.current!.style.opacity = '1';
            scrollCtaRef.current!.style.transform = 'translate3d(0, 0, 0)';
          }, 800);
        }
      });
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  // Multi-tier parallax offsets for deep dimensional separation
  const bgParallaxY = scrollY * 0.15;
  const nebulaParallaxY = scrollY * 0.35; // Enhanced from 0.12 for distinct cosmic depth
  const textParallaxY = scrollY * 0.08;

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
          LAYER 1.5: FOCUSED LOCAL DARK CRADLE (ONLY DIRECTLY UNDER TITLE)
          Extremely light, compact anchor keeping the expansive watercolor
          background clean and bright while lifting the title & signature.
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 pointer-events-none select-none z-[2]"
        style={{
          top: '46%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(380px, 58vw, 760px)',
          height: 'clamp(240px, 40vw, 440px)',
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(10, 8, 25, 0.40) 0%, rgba(15, 10, 32, 0.20) 45%, rgba(20, 15, 40, 0.05) 72%, transparent 92%)',
          filter: 'blur(36px)',
        }}
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          LAYER 2: SCULPTED CELESTIAL ACCRETION NEBULA (ICONIC HERO CENTERPIECE)
          Structured, high-contrast celestial architecture:
          1. Outer Accretion Mantle: Deep indigo/violet mantle for perimeter
          2. Sculpted Hollow Torus Ring: Defined hollow ring contour (not a solid blob)
          3. Secondary Fine Filament Orbit: Ethereal dashed resonant ring
          4. Directional Plasma Swirl: Elliptical matter streaming
          5. Cold Core: Icy lilac / silver-blue radiant center
          6. Singularity Video (blackhole.webm): Low-profile subtle morphological motion (opacity 0.30)
          7. Horizontal Beam & Starburst: Strengthened center highlight with 10s breathing
          8. Seamless vertical proximity to title, cradling title & signature
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 pointer-events-none select-none z-[3] flex flex-col items-center justify-center overflow-visible mix-blend-screen will-change-transform"
        style={{
          top: '36%',
          transform: `translate3d(-50%, calc(-50% + ${nebulaParallaxY}px), 0) scale(${nebulaReady ? 1 : 0.88})`,
          opacity: nebulaReady ? 1 : 0.25,
          transition: 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.3s ease-out',
          width: 'clamp(380px, 64vw, 820px)',
          height: 'clamp(280px, 46vw, 560px)',
        }}
        aria-hidden="true"
      >
        {/* Tier 1: Outer Accretion Mantle — Deep Indigo/Dark Violet */}
        <div
          className="absolute pointer-events-none celestial-spin"
          style={{
            width: '150%',
            height: '130%',
            left: '50%',
            top: '49%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(ellipse 80% 64% at 50% 49%, rgba(49, 46, 129, 0.22) 0%, rgba(67, 56, 202, 0.14) 35%, rgba(79, 70, 229, 0.08) 60%, transparent 92%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Tier 1.5: Distinct Hollow Violet Corona Ring (transparent center 52%, luminous purple perimeter) */}
        <div
          className="absolute pointer-events-none celestial-spin"
          style={{
            width: '136%',
            height: '116%',
            left: '50%',
            top: '49%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 52%, rgba(167, 139, 250, 0.26) 62%, rgba(139, 92, 246, 0.16) 72%, transparent 85%)',
            filter: 'blur(16px)',
          }}
        />

        {/* Tier 2: Sculpted Hollow Accretion Torus Ring (Hollow Ring Contour) */}
        <div
          className="absolute pointer-events-none celestial-pulse"
          style={{
            width: '112%',
            height: '80%',
            left: '50%',
            top: '48.5%',
            transform: 'translate(-50%, -50%) rotate(-7deg)',
            borderRadius: '50%',
            border: '1.5px solid rgba(216, 180, 254, 0.50)',
            boxShadow:
              'inset 0 0 28px rgba(168, 85, 247, 0.28), 0 0 34px 6px rgba(192, 132, 252, 0.45), 0 0 72px 12px rgba(99, 102, 241, 0.24)',
            background: 'transparent',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Tier 2.5: Secondary Fine Filament Orbit Ring (Hollow Accretion Silhouette) */}
        <div
          className="absolute pointer-events-none celestial-spin"
          style={{
            width: '94%',
            height: '66%',
            left: '50%',
            top: '49%',
            transform: 'translate(-50%, -50%) rotate(14deg)',
            borderRadius: '50%',
            border: '1px dashed rgba(224, 231, 255, 0.36)',
            boxShadow: '0 0 20px rgba(147, 51, 234, 0.26)',
            background: 'transparent',
          }}
        />

        {/* Tier 3: Directional Plasma Swirl Flow (elliptical matter streaming into the vortex) */}
        <div
          className="absolute pointer-events-none celestial-spin"
          style={{
            width: '125%',
            height: '105%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            background:
              'radial-gradient(ellipse 68% 46% at 50% 50%, rgba(147, 51, 234, 0.18) 0%, rgba(99, 102, 241, 0.14) 40%, rgba(56, 189, 248, 0.06) 68%, transparent 88%)',
            filter: 'blur(28px)',
          }}
        />

        {/* Tier 4: Cold Lilac & Silver-Blue Radiant Core (icy photon sphere, stark contrast with outer ring) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 48% 40% at 50% 48.5%, rgba(248, 250, 252, 0.34) 0%, rgba(224, 231, 255, 0.22) 28%, rgba(192, 132, 252, 0.10) 55%, transparent 84%)',
            filter: 'blur(16px)',
          }}
        />

        {/* Tier 5: Micro-Grain Cosmic Dust Texture (low-contrast noise for retinal structure detection) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
          style={{
            opacity: 0.065,
            maskImage:
              'radial-gradient(ellipse 80% 70% at 50% 50%, black 25%, rgba(0, 0, 0, 0.6) 65%, transparent 92%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 70% at 50% 50%, black 25%, rgba(0, 0, 0, 0.6) 65%, transparent 92%)',
          }}
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="cosmic-dust-noise">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.85"
                numOctaves="3"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#cosmic-dust-noise)" />
          </svg>
        </div>

        {/* Tier 6: Subtle Singularity Video (blackhole.webm) with controlled presence (opacity ~0.32, brightness 0.6, contrast 1.2) */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            maskImage:
              'radial-gradient(ellipse 88% 76% at 50% 48%, black 36%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.30) 78%, transparent 96%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 88% 76% at 50% 48%, black 36%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.30) 78%, transparent 96%)',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-[125%] h-[125%] max-w-none object-cover select-none pointer-events-none opacity-32"
            style={{
              objectPosition: 'center 46%',
              filter: 'brightness(0.60) contrast(1.20) saturate(1.20)',
            }}
            src="/videos/blackhole.webm"
          />
        </div>

        {/* Tier 7: Anamorphic Horizontal Flare with Intensified Center Highlight & 10s Slow Breath */}
        <div
          className="absolute w-[185%] max-w-[1280px] h-[2px] sm:h-[2.5px] pointer-events-none celestial-flare"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0) 8%, rgba(147, 51, 234, 0.48) 26%, rgba(255, 255, 255, 1) 50%, rgba(147, 51, 234, 0.48) 74%, rgba(56, 189, 248, 0) 92%, transparent 100%)',
            boxShadow:
              '0 0 20px 4px rgba(192, 132, 252, 0.85), 0 0 42px 8px rgba(139, 92, 246, 0.45), 0 0 8px 3px #ffffff',
          }}
        />

        {/* Tier 8: Delicate Vertical Starburst Ray (creates the iconic Cross-Flare / 十字星芒) */}
        <div
          className="absolute w-[1.5px] sm:w-[2px] h-[170px] sm:h-[240px] pointer-events-none celestial-flare"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'linear-gradient(180deg, transparent 0%, rgba(129, 140, 248, 0.15) 20%, rgba(255, 255, 255, 0.90) 50%, rgba(168, 85, 247, 0.15) 80%, transparent 100%)',
            boxShadow:
              '0 0 14px 2px rgba(224, 231, 255, 0.45), 0 0 26px 3px rgba(168, 85, 247, 0.20)',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 3: FOREGROUND TYPOGRAPHIC LOCKUP (MUSAB HASSAN EDITORIAL)
          Balanced composition:
          - 'rocky' and 'babcock' display serif centered below the celestial crown.
          - Handwritten signature positioned with artistic breathing room to the
            upper-left flank of 'rocky', clearing the 'babcock' letters.
          - Occupation tagline and interactive '↓ SCROLL' cue aligned cleanly below.
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none box-border pt-12 sm:pt-16 pb-4 will-change-transform"
        style={{
          transform: `translate3d(0, ${textParallaxY}px, 0)`,
        }}
      >
        {/* Core title and signature cluster */}
        <div className="relative flex flex-col items-center pointer-events-auto">
          {/* Handcrafted white signature placed to upper-left flank with cold purple shadow */}
          <div className="absolute -left-[24vw] sm:-left-[190px] md:-left-[250px] lg:-left-[290px] top-[2%] sm:top-[4%] md:top-[6%] pointer-events-none z-20">
            <img
              ref={signatureRef}
              src="/assets/imgs/signature-white.png"
              alt="Rocky Babcock handwritten signature"
              draggable={false}
              className="w-[40vw] sm:w-[28vw] md:w-[22vw] max-w-[280px] min-w-[155px] h-auto object-contain select-none will-change-transform"
              style={{
                filter:
                  'drop-shadow(0 3px 14px rgba(25, 12, 48, 0.70)) drop-shadow(0 0 18px rgba(192, 132, 252, 0.40))',
              }}
            />
          </div>

          {/* Editorial Display Title Block with Ceremonial Light Sweep & Subtle Purple Corona Glow */}
          <div className="relative overflow-hidden px-4 py-1">
            {/* Soft luminous light sweep across title after letters lock into place */}
            {shimmerActive && <div className="title-light-sweep" />}

            <h1
              className="flex flex-col items-center m-0 p-0 font-normal select-none"
              style={{
                fontFamily: 'var(--title-font)',
                filter:
                  'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.60)) drop-shadow(0 0 28px rgba(168, 85, 247, 0.38)) drop-shadow(0 0 60px rgba(129, 140, 248, 0.20))',
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
              className="m-0 text-xs sm:text-sm md:text-base text-white/95 tracking-[0.14em] font-normal lowercase text-center will-change-transform"
              style={{
                fontFamily: 'var(--body-font)',
                filter:
                  'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.65)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.85))',
              }}
            >
              creative technologist &amp; frontend developer
            </p>
          </div>

          {/* Interactive '↓ SCROLL' Action Cue */}
          <div className="overflow-hidden mt-3 sm:mt-4 md:mt-5">
            <button
              ref={scrollCtaRef}
              type="button"
              onClick={handleScrollCueClick}
              className="group font-mono text-xs sm:text-sm tracking-[0.28em] uppercase text-white/90 hover:text-white flex items-center gap-2 cursor-pointer transition-all duration-300 py-2 px-4 border-none bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded clickable will-change-transform"
              aria-label="Scroll down to studio projects"
              style={{
                filter:
                  'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.65)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.85))',
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

      {/* Hero Bottom Organic Vignette / Smooth Gradient Transition to Dark Projects Section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 sm:h-48 pointer-events-none z-[4] bg-gradient-to-b from-transparent via-[#030014]/40 to-[#030014]"
        aria-hidden="true"
      />
    </section>
  );
};

