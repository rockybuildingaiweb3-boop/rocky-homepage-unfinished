import React from 'react';

export interface NebulaBackgroundProps {
  nebulaReady: boolean;
  nebulaParallaxY: number;
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
export const NebulaBackground: React.FC<NebulaBackgroundProps> = ({
  nebulaReady,
  nebulaParallaxY,
}) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[3] overflow-hidden will-change-transform"
      style={{
        /* Soft downward dissolve ensuring zero bleed onto the tulip blooms */
        maskImage:
          'linear-gradient(to bottom, black 0%, black 36%, rgba(0, 0, 0, 0.5) 50%, transparent 64%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 0%, black 36%, rgba(0, 0, 0, 0.5) 50%, transparent 64%)',
      }}
      aria-hidden="true"
    >
      {/* ─────────────────────────────────────────────────────────────
          CELESTIAL LIGHT MATRIX (AIRY, LUMINOUS, ORGANICALLY WOVEN INTO SKY)
          Horizontal center, positioned at top: 22% in upper sky
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 flex flex-col items-center justify-center pointer-events-none mix-blend-screen will-change-transform"
        style={{
          top: '22%',
          transform: `translate3d(-50%, calc(-50% + ${nebulaParallaxY}px), 0) scale(${nebulaReady ? 1 : 0.94})`,
          opacity: nebulaReady ? 0.88 : 0.10,
          transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.5s ease-out',
          width: 'clamp(320px, 46vw, 620px)',
          height: 'clamp(200px, 28vw, 360px)',
        }}
      >
        {/* 1. Diffuse Ambient Sky Glow (Breathes directly out of watercolor sky, no edges) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(224, 210, 255, 0.32) 0%, rgba(199, 210, 254, 0.16) 42%, transparent 72%)',
            filter: 'blur(20px)',
          }}
        />

        {/* 2. Delicate Outer Geometric Orbit Ring (Spun silver-violet hairline, slow 28s orbit) */}
        <div
          className="absolute pointer-events-none celestial-spin"
          style={{
            width: '88%',
            height: '62%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '1px dashed rgba(224, 231, 255, 0.45)',
            boxShadow: '0 0 16px rgba(199, 210, 254, 0.25)',
          }}
        />

        {/* 3. Airy Luminous Elliptical Corona Ring (Soft pulse, zero black interior) */}
        <div
          className="absolute pointer-events-none celestial-pulse"
          style={{
            width: '74%',
            height: '48%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-5deg)',
            borderRadius: '50%',
            border: '1.4px solid rgba(245, 240, 255, 0.85)',
            boxShadow:
              'inset 0 0 14px rgba(216, 180, 254, 0.30), 0 0 18px 4px rgba(192, 132, 252, 0.45), 0 0 35px 8px rgba(147, 197, 253, 0.20)',
            background:
              'radial-gradient(ellipse 60% 50% at 50% 50%, transparent 40%, rgba(238, 242, 255, 0.12) 80%, transparent 100%)',
          }}
        />

        {/* 4. Refined Horizontal Starlight Beam (Clean lens flare hugging the celestial axis) */}
        <div
          className="absolute pointer-events-none celestial-flare"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-0.5deg)',
            width: 'clamp(280px, 70vw, 840px)',
            height: '1.6px',
            background:
              'linear-gradient(90deg, transparent 0%, transparent 18%, rgba(199, 210, 254, 0.25) 32%, rgba(255, 255, 255, 0.95) 50%, rgba(199, 210, 254, 0.25) 68%, transparent 82%, transparent 100%)',
            boxShadow:
              '0 0 12px 3px rgba(255, 255, 255, 0.85), 0 0 24px 6px rgba(192, 132, 252, 0.45), 0 0 40px 10px rgba(147, 197, 253, 0.25)',
          }}
        />

        {/* 5. Pure Luminous Starlight Nexus (Compact 10px white jewel with gentle breathing pulse) */}
        <div
          className="absolute pointer-events-none diamond-core-pulse"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow:
              '0 0 8px 3px #ffffff, 0 0 16px 5px rgba(238, 242, 255, 0.90), 0 0 28px 8px rgba(192, 132, 252, 0.50)',
          }}
        />
      </div>
    </div>
  );
};

