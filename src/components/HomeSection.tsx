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
          LAYER 1.5: ULTRA-LIGHT MULTIPLY CENTER ANCHOR (LIGHTWEIGHT INTEGRATION)
          Translucent multiply anchor (opacity ~0.12) keeping the watercolor
          garden and flower blossoms bright, natural, and transparent.
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 pointer-events-none select-none z-[2]"
        style={{
          top: '40%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(380px, 58vw, 760px)',
          height: 'clamp(240px, 38vw, 440px)',
          background:
            'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(20, 15, 38, 0.12) 0%, rgba(20, 15, 38, 0.05) 45%, transparent 70%)',
          mixBlendMode: 'multiply',
        }}
        aria-hidden="true"
      />

      {/* ─────────────────────────────────────────────────────────────
          LAYER 2: LIGHTWEIGHT ACCRETION DISK NEBULA (SPACE-PORTFOLIO INSPIRED)
          - Hollow outer ring (center 46% transparent, luminous violet perimeter)
          - Sculpted geometric torus ring contour with violet rim-glow
          - Scaled-down singularity video (blackhole.webm) with tight radial mask (opacity 0.30)
          - Concentrated horizontal flare beam with fast falloff
          - Balanced vertical crosshair ray & diamond supernova core
          - Situated immediately crowning the title block for cohesive unity
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 pointer-events-none select-none z-[3] flex flex-col items-center justify-center overflow-visible mix-blend-screen will-change-transform"
        style={{
          top: '38%',
          transform: `translate3d(-50%, calc(-50% + ${nebulaParallaxY}px), 0) scale(${nebulaReady ? 1 : 0.88})`,
          opacity: nebulaReady ? 1 : 0.25,
          transition: 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.3s ease-out',
          width: 'clamp(360px, 60vw, 780px)',
          height: 'clamp(260px, 42vw, 520px)',
        }}
        aria-hidden="true"
      >
        {/* Tier 1: Hollow Outer Corona Ring (Accretion Disc Rim — Clear Center, Luminous Purple Edge) */}
        <div
          className="absolute pointer-events-none celestial-spin"
          style={{
            width: '132%',
            height: '112%',
            left: '50%',
            top: '49%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(ellipse 76% 64% at 50% 50%, transparent 46%, rgba(167, 139, 250, 0.26) 56%, rgba(139, 92, 246, 0.16) 68%, rgba(99, 102, 241, 0.06) 78%, transparent 88%)',
            filter: 'blur(16px)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Tier 2: Sculpted Hollow Accretion Torus Ring (Crisp Geometric Disk Rim) */}
        <div
          className="absolute pointer-events-none celestial-pulse"
          style={{
            width: '105%',
            height: '74%',
            left: '50%',
            top: '48.5%',
            transform: 'translate(-50%, -50%) rotate(-7deg)',
            borderRadius: '50%',
            border: '1.5px solid rgba(216, 180, 254, 0.55)',
            boxShadow:
              'inset 0 0 22px rgba(168, 85, 247, 0.22), 0 0 28px 5px rgba(192, 132, 252, 0.40), 0 0 55px 8px rgba(99, 102, 241, 0.18)',
            background: 'transparent',
          }}
        />

        {/* Tier 2.5: Secondary Resonant Orbit Ring */}
        <div
          className="absolute pointer-events-none celestial-spin"
          style={{
            width: '88%',
            height: '60%',
            left: '50%',
            top: '49%',
            transform: 'translate(-50%, -50%) rotate(14deg)',
            borderRadius: '50%',
            border: '1px dashed rgba(224, 231, 255, 0.35)',
            boxShadow: '0 0 14px rgba(147, 51, 234, 0.22)',
            background: 'transparent',
          }}
        />

        {/* Tier 3: Singularity Motion Reference (blackhole.webm) — Scaled Down, Tight Mask, Opacity 0.30 */}
        <div
          className="relative w-[88%] h-[88%] max-w-[560px] max-h-[380px] flex items-center justify-center overflow-hidden"
          style={{
            maskImage:
              'radial-gradient(ellipse 65% 55% at 50% 48%, black 18%, rgba(0,0,0,0.75) 42%, rgba(0,0,0,0.18) 64%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 65% 55% at 50% 48%, black 18%, rgba(0,0,0,0.75) 42%, rgba(0,0,0,0.18) 64%, transparent 80%)',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-[115%] h-[115%] max-w-none object-cover select-none pointer-events-none"
            style={{
              opacity: 0.30,
              objectPosition: 'center 46%',
              filter: 'brightness(0.55) contrast(1.30) saturate(1.25)',
            }}
            src="/videos/blackhole.webm"
          />
        </div>

        {/* Tier 4: Concentrated Horizontal Flare Beam (Intense Center Core, Rapid Radial Falloff) */}
        <div
          className="absolute w-[175%] max-w-[1200px] h-[2.5px] pointer-events-none celestial-flare"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-1.5deg)',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0) 18%, rgba(167, 139, 250, 0.20) 32%, rgba(216, 180, 254, 0.70) 45%, #ffffff 50%, rgba(216, 180, 254, 0.70) 55%, rgba(167, 139, 250, 0.20) 68%, rgba(99, 102, 241, 0) 82%, transparent 100%)',
            boxShadow:
              '0 0 14px 3px rgba(216, 180, 254, 0.85), 0 0 28px 6px rgba(168, 85, 247, 0.45), 0 0 6px 2px #ffffff',
          }}
        />

        {/* Tier 5: Vertical Crosshair Ray for Balanced Starburst */}
        <div
          className="absolute w-[2px] h-[160px] sm:h-[220px] pointer-events-none celestial-vertical-ray"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'linear-gradient(180deg, transparent 0%, rgba(167, 139, 250, 0.15) 25%, rgba(255, 255, 255, 0.85) 50%, rgba(139, 92, 246, 0.15) 75%, transparent 100%)',
            boxShadow: '0 0 10px 2px rgba(216, 180, 254, 0.50)',
          }}
        />

        {/* Tier 6: Diamond Supernova Focal Core (Pure Radiant Nexus) */}
        <div
          className="absolute pointer-events-none diamond-core-pulse"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.95) 28%, rgba(216, 180, 254, 0.45) 55%, transparent 78%)',
            boxShadow:
              '0 0 12px 3px #ffffff, 0 0 24px 6px rgba(192, 132, 252, 0.75), 0 0 42px 10px rgba(139, 92, 246, 0.35)',
          }}
        />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LAYER 3: FOREGROUND TYPOGRAPHIC LOCKUP (MUSAB HASSAN EDITORIAL)
          - Same light environment: delicate purple back-luster on serif letters
          - Layered dark drop-shadows ensuring pristine readability over watercolor
          - Strictly transparent containers, zero rectangle artifacts
         ───────────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-none box-border pt-12 sm:pt-16 pb-4 will-change-transform bg-transparent"
        style={{
          transform: `translate3d(0, ${textParallaxY}px, 0)`,
        }}
      >
        {/* Core title and signature cluster */}
        <div className="relative flex flex-col items-center pointer-events-auto bg-transparent">
          {/* Handcrafted white signature placed with refined triangular composition toward 'rocky' */}
          <div className="absolute -left-[22vw] sm:-left-[170px] md:-left-[230px] lg:-left-[270px] top-[1%] sm:top-[2.5%] md:top-[4%] pointer-events-none z-20">
            <img
              ref={signatureRef}
              src="/assets/imgs/signature-white.png"
              alt="Rocky Babcock handwritten signature"
              draggable={false}
              className="w-[38vw] sm:w-[27vw] md:w-[21vw] max-w-[270px] min-w-[150px] h-auto object-contain select-none will-change-transform rotate-[-1.5deg]"
              style={{
                filter:
                  'drop-shadow(0 0 12px rgba(192, 132, 252, 0.35)) drop-shadow(0 2px 10px rgba(0, 0, 0, 0.70)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.85))',
              }}
            />
          </div>

          {/* Editorial Display Title Block — completely transparent, zero rectangle artifacts */}
          <div className="relative px-2 py-1 bg-transparent">
            <h1
              className="flex flex-col items-center m-0 p-0 font-normal select-none bg-transparent"
              style={{
                fontFamily: 'var(--title-font)',
                filter:
                  'drop-shadow(0 0 18px rgba(168, 85, 247, 0.40)) drop-shadow(0 0 36px rgba(147, 51, 234, 0.20)) drop-shadow(0 2px 14px rgba(0, 0, 0, 0.75)) drop-shadow(0 1px 3px rgba(0, 0, 0, 0.90))',
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

