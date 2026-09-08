import React, { useRef } from 'react';
import { VISUAL_CONSTANTS } from '../../constants/visual';

export interface NebulaBackgroundProps {
  nebulaReady: boolean;
  nebulaParallaxY: number;
}

/**
 * NebulaBackground
 * High-contrast accretion disk and celestial nebula structure crowning the hero typography.
 * Modularized for independent parameter tuning, isolation, and testing.
 */
export const NebulaBackground: React.FC<NebulaBackgroundProps> = ({
  nebulaReady,
  nebulaParallaxY,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          LAYER 1.5: ULTRA-LIGHT MULTIPLY CENTER ANCHOR (LIGHTWEIGHT INTEGRATION)
          Translucent multiply anchor keeping watercolor garden bright & natural
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 pointer-events-none select-none z-[2]"
        style={{
          top: '42%',
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
          LAYER 2: ACCRETION DISK NEBULA (HIGH-CONTRAST CELESTIAL STRUCTURE)
          - Clear, high-contrast hollow outer ring (transparent 50%, purple rim 60%-70%)
          - Sculpted geometric torus ring contour with defined rim-glow
          - Scaled-down singularity video (blackhole.webm) with tight radial mask (opacity 0.30)
          - Reinforced horizontal flare beam (2.5px height, intense white core, wide purple glow)
          - Positioned closely above title to cradle letters
         ───────────────────────────────────────────────────────────── */}
      <div
        className="absolute left-1/2 pointer-events-none select-none z-[3] flex flex-col items-center justify-center overflow-visible mix-blend-screen will-change-transform"
        style={{
          top: 'clamp(44%, 46.5%, 48%)',
          transform: `translate3d(-50%, calc(-50% + ${nebulaParallaxY}px), 0) scale(${nebulaReady ? 1 : 0.88})`,
          opacity: nebulaReady ? 1 : 0.25,
          transition: 'transform 1.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.3s ease-out',
          width: 'clamp(340px, 62vw, 820px)',
          height: 'clamp(250px, 44vw, 540px)',
        }}
        aria-hidden="true"
      >
        {/* Tier 1: Crisp Hollow Outer Corona Ring (Defined Rim, Transparent Center, No Misty Fog) */}
        <div
          className="absolute pointer-events-none celestial-spin"
          style={{
            width: '138%',
            height: '118%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 48%, rgba(167, 139, 250, 0.35) 60%, rgba(139, 92, 246, 0.22) 72%, transparent 84%)',
            filter: 'blur(7px)',
            mixBlendMode: 'screen',
          }}
        />

        {/* Tier 2: Sculpted Hollow Accretion Torus Ring (High-Contrast Geometric Disk Rim) */}
        <div
          className="absolute pointer-events-none celestial-pulse"
          style={{
            width: '108%',
            height: '76%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-7deg)',
            borderRadius: '50%',
            border: '2px solid rgba(224, 195, 255, 0.85)',
            boxShadow:
              'inset 0 0 28px rgba(168, 85, 247, 0.35), 0 0 38px 8px rgba(192, 132, 252, 0.65), 0 0 70px 14px rgba(139, 92, 246, 0.30)',
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
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(14deg)',
            borderRadius: '50%',
            border: '1.2px dashed rgba(230, 235, 255, 0.45)',
            boxShadow: '0 0 18px rgba(168, 85, 247, 0.35)',
            background: 'transparent',
          }}
        />

        {/* Tier 3: Singularity Core Reference (blackhole.webm) — Scaled Down, Tight Mask, No Fog */}
        <div
          className="relative w-[86%] h-[86%] max-w-[540px] max-h-[360px] flex items-center justify-center overflow-hidden"
          style={{
            maskImage:
              'radial-gradient(ellipse 66% 56% at 50% 48%, black 20%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.20) 64%, transparent 80%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 66% 56% at 50% 48%, black 20%, rgba(0,0,0,0.85) 42%, rgba(0,0,0,0.20) 64%, transparent 80%)',
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
              opacity: VISUAL_CONSTANTS.NEBULA.VIDEO_OPACITY,
              objectPosition: 'center 46%',
              filter: `brightness(${VISUAL_CONSTANTS.NEBULA.VIDEO_BRIGHTNESS}) contrast(${VISUAL_CONSTANTS.NEBULA.VIDEO_CONTRAST}) saturate(${VISUAL_CONSTANTS.NEBULA.VIDEO_SATURATE})`,
            }}
            src="/videos/blackhole.webm"
          />
        </div>

        {/* Tier 4: Strong Center Horizontal Flare Beam (Intense Pure White Core, Vivid Purple Radiance) */}
        <div
          className="absolute w-[200%] max-w-[94vw] sm:max-w-[1280px] h-[3px] pointer-events-none celestial-flare"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-1.5deg)',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(167, 139, 250, 0.15) 15%, rgba(216, 180, 254, 0.70) 38%, #ffffff 50%, rgba(216, 180, 254, 0.70) 62%, rgba(167, 139, 250, 0.15) 85%, transparent 100%)',
            boxShadow:
              '0 0 20px 6px rgba(167, 139, 250, 0.60), 0 0 42px 12px rgba(139, 92, 246, 0.38), 0 0 10px 4px #ffffff',
          }}
        />

        {/* Tier 5: Vertical Crosshair Ray for Balanced Starburst */}
        <div
          className="absolute w-[2px] h-[170px] sm:h-[230px] pointer-events-none celestial-vertical-ray"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'linear-gradient(180deg, transparent 0%, rgba(167, 139, 250, 0.20) 25%, rgba(255, 255, 255, 0.90) 50%, rgba(139, 92, 246, 0.20) 75%, transparent 100%)',
            boxShadow: '0 0 12px 3px rgba(216, 180, 254, 0.60), 0 0 4px 1px #ffffff',
          }}
        />

        {/* Tier 6: Diamond Supernova Focal Core (Pure Radiant Nexus) */}
        <div
          className="absolute pointer-events-none diamond-core-pulse"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0.95) 30%, rgba(216, 180, 254, 0.55) 60%, transparent 80%)',
            boxShadow:
              '0 0 14px 4px #ffffff, 0 0 28px 8px rgba(192, 132, 252, 0.85), 0 0 48px 12px rgba(139, 92, 246, 0.40)',
          }}
        />
      </div>
    </>
  );
};
