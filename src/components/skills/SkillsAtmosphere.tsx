import React, { useEffect, useState, useRef, memo } from 'react';

interface SkillsAtmosphereProps {
  activeBrandColor?: string;
  isHovered?: boolean;
  interactionLevel?: 1 | 2 | 3;
}

/**
 * SkillsAtmosphere
 *
 * Cosmic atmosphere anchoring the Living Orbit field of technologies.
 * Preserves the rotating purple planet (/videos/skills-bg.webm) and ambient
 * purple celestial nebula as the atmospheric visual anchor behind the floating logos.
 */
export const SkillsAtmosphere: React.FC<SkillsAtmosphereProps> = memo(({
  activeBrandColor = '#7042F8',
  isHovered = false,
  interactionLevel = 1,
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
          x: (clientX / rect.width) * 10,
          y: (clientY / rect.height) * 7,
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
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(112, 66, 248, 0.30) 0%, rgba(147, 51, 234, 0.13) 35%, rgba(79, 70, 229, 0.04) 65%, transparent 80%)',
          filter: 'blur(75px)',
          transform: `translate(${mouseOffset.x * 0.15}px, ${mouseOffset.y * 0.15}px)`,
        }}
      />

      {/* ─── LAYER 2: SUBTLE BRAND RESONANCE CORE ─── */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-700 ease-out ${
          isHovered
            ? 'w-[80vw] max-w-[900px] h-[540px] opacity-95'
            : 'w-[68vw] max-w-[820px] h-[480px] opacity-70'
        }`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeBrandColor}24 0%, ${activeBrandColor}08 45%, transparent 70%)`,
          filter: 'blur(65px)',
          transform: `translate(${mouseOffset.x * 0.25}px, ${mouseOffset.y * 0.25}px)`,
        }}
      />

      {/* ─── LAYER 3: FULL-BLEED ROTATING PURPLE PLANET (The Atmospheric Anchor) ─── */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-all duration-700 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 0.35}px, ${mouseOffset.y * 0.35}px) scale(${
            interactionLevel === 3
              ? 1.03
              : interactionLevel === 2
              ? 1.015
              : isHovered
              ? 1.01
              : 1.0
          })`,
          filter:
            isHovered || interactionLevel > 1
              ? 'brightness(1.08) contrast(1.04)'
              : 'brightness(1.0) contrast(1.0)',
          maskImage:
            'radial-gradient(ellipse 85% 72% at 50% 50%, black 48%, rgba(0,0,0,0.65) 76%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 72% at 50% 50%, black 48%, rgba(0,0,0,0.65) 76%, transparent 100%)',
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover min-w-[950px] opacity-80 sm:opacity-90 pointer-events-none select-none mix-blend-screen transition-opacity duration-300"
          preload="auto"
          playsInline
          loop
          muted
          autoPlay
          src="/videos/skills-bg.webm"
        />
      </div>

      {/* ─── LAYER 4: SEAMLESS ATMOSPHERIC DEPTH VIGNETTE ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 92% 82% at 50% 50%, transparent 44%, rgba(3, 0, 20, 0.48) 82%, rgba(3, 0, 20, 0.94) 100%)',
        }}
      />
    </div>
  );
});

SkillsAtmosphere.displayName = 'SkillsAtmosphere';
export default SkillsAtmosphere;
