import React, { memo } from 'react';

export interface NebulaBackgroundProps {
  nebulaReady: boolean;
  nebulaParallaxY?: number;
}

/**
 * NebulaBackground
 * Atmosphere & Ambient Starlight Architecture:
 * - Redefines celestial presence as an ethereal ambient halo rather than an invasive "black body".
 * - 80% visual weight belongs to the watercolor canvas and botanical garden.
 * - Extracts purely the poetic geometry (delicate ring + refined horizontal flare beam + bright nexus point).
 * - Colors naturally sampled from the sky (soft periwinkle, lavender, cool silver-violet).
 * - Completely free of dark matter, heavy opacity, cutouts, or grey holes.
 * - Positioned as an ethereal celestial crown slightly behind & above the title with generous breathing room.
 */
export const NebulaBackground: React.FC<NebulaBackgroundProps> = memo(({
  nebulaReady,
  nebulaParallaxY,
}) => {
  const parallaxOffsetY =
    nebulaParallaxY !== undefined ? `${nebulaParallaxY}px` : 'var(--nebula-parallax-y, 0px)';
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[3] overflow-hidden will-change-transform"
      style={{
        /* Soft downward dissolve ensuring zero bleed onto the tulip blooms */
        maskImage:
          'linear-gradient(to bottom, black 0%, black 28%, rgba(0, 0, 0, 0.38) 44%, transparent 56%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 0%, black 28%, rgba(0, 0, 0, 0.38) 44%, transparent 56%)',
      }}
      aria-hidden="true"
    >
      {/* ─────────────────────────────────────────────────────────────
          CELESTIAL LIGHT MATRIX (AIRY, LUMINOUS, ORGANICALLY WOVEN INTO SKY)
          Horizontal center, positioned as an airy sky crown above the title
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 flex flex-col items-center justify-center pointer-events-none mix-blend-screen will-change-transform"
        style={{
          top: '15.5%',
          transform: `translate3d(calc(-50% + var(--nebula-mx, 0px)), calc(-50% + ${parallaxOffsetY} + var(--nebula-my, 0px)), 0) scale(${nebulaReady ? 1 : 0.94})`,
          opacity: nebulaReady ? 0.72 : 0.08,
          transition: 'opacity 1.5s ease-out',
          width: 'clamp(260px, 38vw, 520px)',
          height: 'clamp(140px, 19vw, 250px)',
        }}
      >
        {/* 1. Diffuse Ambient Sky Glow (Breathes directly out of watercolor sky, no edges) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(224, 210, 255, 0.28) 0%, rgba(199, 210, 254, 0.12) 45%, transparent 74%)',
            filter: 'blur(22px)',
          }}
        />

        {/* 2. Delicate Outer Geometric Orbit Ring (Spun silver-violet hairline, slow 34s orbit) */}
        <div
          className="absolute pointer-events-none celestial-spin"
          style={{
            width: '86%',
            height: '62%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px dashed rgba(224, 231, 255, 0.34)',
            boxShadow: '0 0 14px rgba(199, 210, 254, 0.18)',
          }}
        />

        {/* 3. Airy Luminous Elliptical Corona Ring (Soft pulse, ethereal edge) */}
        <div
          className="absolute pointer-events-none celestial-pulse"
          style={{
            width: '72%',
            height: '46%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-5deg)',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.56)',
            boxShadow:
              'inset 0 0 12px rgba(216, 180, 254, 0.18), 0 0 16px 3px rgba(192, 132, 252, 0.28), 0 0 32px 6px rgba(147, 197, 253, 0.14)',
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 45%, rgba(238, 242, 255, 0.05) 85%, transparent 100%)',
          }}
        />

        {/* 4. Refined Horizontal Starlight Beam (Clean lens flare hugging the celestial axis) */}
        <div
          className="absolute pointer-events-none celestial-flare"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-0.5deg)',
            width: 'clamp(240px, 60vw, 720px)',
            height: '1.2px',
            background:
              'linear-gradient(90deg, transparent 0%, transparent 18%, rgba(199, 210, 254, 0.22) 32%, rgba(255, 255, 255, 0.9) 50%, rgba(199, 210, 254, 0.22) 68%, transparent 82%, transparent 100%)',
            boxShadow:
              '0 0 10px 2px rgba(255, 255, 255, 0.72), 0 0 22px 5px rgba(192, 132, 252, 0.34), 0 0 36px 8px rgba(147, 197, 253, 0.18)',
          }}
        />

        {/* 5. Pure Luminous Starlight Nexus (Compact 8px white jewel with gentle breathing pulse) */}
        <div
          className="absolute pointer-events-none diamond-core-pulse"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow:
              '0 0 8px 2px #ffffff, 0 0 16px 4px rgba(238, 242, 255, 0.85), 0 0 28px 8px rgba(192, 132, 252, 0.42)',
          }}
        />
      </div>
    </div>
  );
});

NebulaBackground.displayName = 'NebulaBackground';

