import React, { useEffect, useState, useRef, memo } from 'react';

interface SkillsAtmosphereProps {
  activeBrandColor?: string;
}

/**
 * SkillsAtmosphere
 * 
 * Cosmic atmosphere anchoring the Technical Constellation.
 * The rotating purple planet (/videos/skills-bg.webm) is the visual protagonist,
 * perfectly centered and framed by the orbital constellation.
 * 
 * Performance & Lifecycle:
 * - Scoped IntersectionObserver pauses video AND detaches mouse parallax when off-screen.
 * - Gentle ambient modulation with active brand color (no disruptive explosions or jumps).
 */
export const SkillsAtmosphere: React.FC<SkillsAtmosphereProps> = memo(({
  activeBrandColor = '#7042F8',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const container = containerRef.current;
    if (!container) return;

    let isIntersecting = false;
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isIntersecting || prefersReducedMotion || rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left - rect.width / 2;
        const clientY = e.clientY - rect.top - rect.height / 2;
        setMouseOffset({
          x: (clientX / rect.width) * 12,
          y: (clientY / rect.height) * 8,
        });
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (videoRef.current) {
          if (isIntersecting && !prefersReducedMotion) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(container);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 flex items-center justify-center overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ─── LAYER 1: AMBIENT PURPLE CELESTIAL NEBULA ─── */}
      <div
        className="absolute w-[110vw] h-[880px] pointer-events-none transition-transform duration-500 ease-out"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(112, 66, 248, 0.32) 0%, rgba(147, 51, 234, 0.14) 35%, rgba(79, 70, 229, 0.04) 65%, transparent 80%)',
          filter: 'blur(75px)',
          transform: `translate(${mouseOffset.x * 0.15}px, ${mouseOffset.y * 0.15}px)`,
        }}
      />

      {/* ─── LAYER 2: DYNAMIC BRAND RESONANCE CORE ─── */}
      <div
        className="absolute w-[70vw] max-w-[850px] h-[500px] pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeBrandColor}25 0%, ${activeBrandColor}06 45%, transparent 70%)`,
          filter: 'blur(60px)',
          transform: `translate(${mouseOffset.x * 0.25}px, ${mouseOffset.y * 0.25}px)`,
        }}
      />

      {/* ─── LAYER 3: FULL-BLEED ROTATING PURPLE PLANET (The Hero Protagonist) ─── */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`,
          maskImage:
            'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, rgba(0,0,0,0.6) 75%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, rgba(0,0,0,0.6) 75%, transparent 100%)',
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover min-w-[950px] opacity-75 sm:opacity-85 pointer-events-none select-none mix-blend-screen"
          preload="auto"
          playsInline
          loop
          muted
          autoPlay
          src="/videos/skills-bg.webm"
        />
      </div>

      {/* ─── LAYER 4: ORBITAL HALO RINGS (Cosmic visual framing) ─── */}
      <div
        className="absolute w-[680px] h-[540px] md:w-[860px] md:h-[660px] lg:w-[1050px] lg:h-[760px] rounded-[50%] border border-purple-500/10 pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 0.1}px, ${mouseOffset.y * 0.1}px)`,
        }}
      />
      <div
        className="absolute w-[460px] h-[370px] md:w-[600px] md:h-[460px] lg:w-[720px] lg:h-[520px] rounded-[50%] border border-purple-400/[0.07] pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 0.18}px, ${mouseOffset.y * 0.18}px)`,
        }}
      />

      {/* ─── LAYER 5: SEAMLESS ATMOSPHERIC DEPTH VIGNETTE ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(3, 0, 20, 0.5) 80%, rgba(3, 0, 20, 0.95) 100%)',
        }}
      />
    </div>
  );
});

SkillsAtmosphere.displayName = 'SkillsAtmosphere';
