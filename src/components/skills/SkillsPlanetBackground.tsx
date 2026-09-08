import React, { useEffect, useState, useRef } from 'react';

interface SkillsPlanetBackgroundProps {
  activeBrandColor?: string;
}

/**
 * SkillsPlanetBackground
 * 
 * Signature cosmic background feature from sanidhyy/space-portfolio:
 * Seamlessly integrates the rotating Purple Cosmic Planet (/videos/skills-bg.webm)
 * into the deep space starfield with NO opaque clipping borders, NO artificial width boxes,
 * and NO separated floating artifacts.
 * 
 * Full-bleed celestial composition with radial feathering so the planet and tunnel
 * appear as an organic, living part of the cosmos behind the tech constellation.
 */
export const SkillsPlanetBackground: React.FC<SkillsPlanetBackgroundProps> = ({
  activeBrandColor = '#7042F8',
}) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left - rect.width / 2;
      const clientY = e.clientY - rect.top - rect.height / 2;
      setMouseOffset({
        x: (clientX / rect.width) * 16,
        y: (clientY / rect.height) * 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 flex items-center justify-center overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ─── LAYER 1: AMBIENT PURPLE CELESTIAL NEBULA ─── */}
      <div
        className="absolute w-[100vw] h-[800px] pointer-events-none transition-transform duration-500 ease-out"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(112, 66, 248, 0.4) 0%, rgba(147, 51, 234, 0.18) 35%, rgba(79, 70, 229, 0.06) 65%, transparent 80%)',
          filter: 'blur(70px)',
          transform: `translate(${mouseOffset.x * 0.2}px, ${mouseOffset.y * 0.2}px)`,
        }}
      />

      {/* ─── LAYER 2: DYNAMIC BRAND RESONANCE CORE ─── */}
      <div
        className="absolute w-[75vw] max-w-[1000px] h-[550px] pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeBrandColor}30 0%, ${activeBrandColor}08 45%, transparent 70%)`,
          filter: 'blur(65px)',
          transform: `translate(${mouseOffset.x * 0.35}px, ${mouseOffset.y * 0.35}px)`,
        }}
      />

      {/* ─── LAYER 3: FULL-BLEED ROTATING PURPLE PLANET (space-portfolio signature video) ─── */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mouseOffset.x * 0.5}px, ${mouseOffset.y * 0.5}px)`,
          maskImage:
            'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, rgba(0,0,0,0.6) 75%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 70% at 50% 50%, black 45%, rgba(0,0,0,0.6) 75%, transparent 100%)',
        }}
      >
        <video
          className="w-full h-full object-cover min-w-[1100px] opacity-70 sm:opacity-80 pointer-events-none select-none mix-blend-screen"
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
            'radial-gradient(ellipse 90% 75% at 50% 50%, transparent 40%, rgba(3, 0, 20, 0.45) 80%, rgba(3, 0, 20, 0.9) 100%)',
        }}
      />
    </div>
  );
};

