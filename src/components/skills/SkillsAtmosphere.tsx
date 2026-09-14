import React, { useEffect, useState, useRef, memo } from 'react';

interface SkillsAtmosphereProps {
  activeBrandColor?: string;
  isHovered?: boolean;
}

/**
 * SkillsAtmosphere
 * 
 * Cosmic atmosphere anchoring the Technical Constellation.
 * The rotating purple planet (/videos/skills-bg.webm) is the visual protagonist,
 * perfectly centered and framed by the orbital constellation.
 * 
 * Kinetic Interaction:
 * When a skill is hovered:
 * - Planetary Core reacts with subtle gravitational pulse & light surge
 * - Energetic shockwave rings emanate outward from the core to the constellation
 * - Brand resonance field surges organically
 * - Scoped IntersectionObserver detaches operations when off-screen
 */
export const SkillsAtmosphere: React.FC<SkillsAtmosphereProps> = memo(({
  activeBrandColor = '#7042F8',
  isHovered = false,
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
        className={`absolute rounded-full pointer-events-none transition-all duration-700 ease-out ${
          isHovered
            ? 'w-[85vw] max-w-[950px] h-[580px] opacity-100'
            : 'w-[70vw] max-w-[850px] h-[500px] opacity-75'
        }`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeBrandColor}30 0%, ${activeBrandColor}08 45%, transparent 70%)`,
          filter: 'blur(65px)',
          transform: `translate(${mouseOffset.x * 0.25}px, ${mouseOffset.y * 0.25}px)`,
        }}
      />

      {/* ─── LAYER 3: PLANETARY ENERGY SHOCKWAVE (Emanates when skill is hovered) ─── */}
      {isHovered && (
        <>
          <div
            className="absolute rounded-full pointer-events-none animate-ping duration-1000 border"
            style={{
              width: '380px',
              height: '380px',
              borderColor: `${activeBrandColor}40`,
              boxShadow: `0 0 30px ${activeBrandColor}35`,
            }}
          />
          <div
            className="absolute rounded-full pointer-events-none border border-purple-400/30 transition-all duration-700"
            style={{
              width: '520px',
              height: '420px',
              transform: `scale(1.05)`,
              boxShadow: `0 0 45px rgba(168, 85, 247, 0.25)`,
            }}
          />
        </>
      )}

      {/* ─── LAYER 4: FULL-BLEED ROTATING PURPLE PLANET (The Hero Protagonist) ─── */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-all duration-500 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px) ${
            isHovered ? 'scale(1.035)' : 'scale(1.0)'
          }`,
          filter: isHovered
            ? 'brightness(1.18) contrast(1.08) drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))'
            : 'brightness(1.0) contrast(1.0)',
          maskImage:
            'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, rgba(0,0,0,0.6) 75%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, rgba(0,0,0,0.6) 75%, transparent 100%)',
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover min-w-[950px] opacity-75 sm:opacity-85 pointer-events-none select-none mix-blend-screen transition-opacity duration-300"
          preload="auto"
          playsInline
          loop
          muted
          autoPlay
          src="/videos/skills-bg.webm"
        />
      </div>

      {/* ─── LAYER 5: ORBITAL HALO RINGS (Cosmic visual framing) ─── */}
      <div
        className={`absolute w-[680px] h-[540px] md:w-[860px] md:h-[660px] lg:w-[1050px] lg:h-[760px] rounded-[50%] border pointer-events-none transition-all duration-500 ease-out ${
          isHovered ? 'border-purple-400/25 scale-[1.01]' : 'border-purple-500/10'
        }`}
        style={{
          transform: `translate(${mouseOffset.x * 0.1}px, ${mouseOffset.y * 0.1}px)`,
        }}
      />
      <div
        className={`absolute w-[460px] h-[370px] md:w-[600px] md:h-[460px] lg:w-[720px] lg:h-[520px] rounded-[50%] border pointer-events-none transition-all duration-500 ease-out ${
          isHovered ? 'border-purple-300/20' : 'border-purple-400/[0.07]'
        }`}
        style={{
          transform: `translate(${mouseOffset.x * 0.18}px, ${mouseOffset.y * 0.18}px)`,
        }}
      />

      {/* ─── LAYER 6: SEAMLESS ATMOSPHERIC DEPTH VIGNETTE ─── */}
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
export default SkillsAtmosphere;
