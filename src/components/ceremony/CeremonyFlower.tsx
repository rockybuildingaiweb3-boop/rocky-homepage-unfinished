import React from 'react';
import { LoaderPhase } from './types';

interface CeremonyFlowerProps {
  phase: LoaderPhase;
  phaseProgress?: number; // 0 to 1 within the current phase
}

export const CeremonyFlower: React.FC<CeremonyFlowerProps> = ({ phase, phaseProgress = 0 }) => {
  // Determine emergence metrics based on ceremony phase
  let opacity = 0;
  let scale = 0.88;
  let rotation = -2.5;
  let blurAmount = 6;
  let glowIntensity = 0.1;

  switch (phase) {
    case 'INITIALIZING':
      opacity = 0;
      scale = 0.88;
      rotation = -2.5;
      blurAmount = 8;
      glowIntensity = 0;
      break;

    case 'ATMOSPHERE':
      // Subtle presence stirring in deep shadows
      opacity = 0.22;
      scale = 0.91;
      rotation = -2.0;
      blurAmount = 5;
      glowIntensity = 0.25;
      break;

    case 'SIGNING':
      // Gentle velvety silhouette behind the handwriting
      opacity = 0.42;
      scale = 0.95;
      rotation = -1.2;
      blurAmount = 3;
      glowIntensity = 0.45;
      break;

    case 'FLOWER_EMERGE': {
      // Organic bloom emergence with spring-like overshoot and settling
      const t = Math.max(0, Math.min(1, phaseProgress));
      // Spring overshoot curve
      const easedT = 1 - Math.pow(1 - t, 3);
      const overshoot = Math.sin(t * Math.PI) * 0.035;
      scale = 0.95 + easedT * 0.05 + overshoot; // 0.95 -> 1.035 -> 1.00
      opacity = 0.42 + easedT * 0.50; // 0.42 -> 0.92
      rotation = -1.2 + easedT * 1.2; // -1.2 -> 0.0 deg
      blurAmount = Math.max(0, 3 - easedT * 3);
      glowIntensity = 0.45 + easedT * 0.45;
      break;
    }

    case 'IDENTITY_SETTLE':
    case 'READY':
      opacity = 0.92;
      scale = 1.0;
      rotation = 0;
      blurAmount = 0;
      glowIntensity = 0.85;
      break;

    case 'EXITING':
      // Atmospheric expansion: opening the aperture into the Hero world
      opacity = 0;
      scale = 1.15;
      rotation = 1.0;
      blurAmount = 8;
      glowIntensity = 1.0;
      break;

    case 'COMPLETE':
      opacity = 0;
      scale = 1.2;
      break;
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Luminous Ambient Backlight Corona (soft violet-magenta starlight glow behind petals) */}
      <div
        className="absolute w-[85vw] sm:w-[65vw] max-w-[620px] aspect-square rounded-full pointer-events-none mix-blend-screen will-change-transform transition-all duration-1000 ease-out"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.45) 0%, rgba(129, 140, 248, 0.25) 35%, rgba(192, 132, 252, 0.12) 60%, transparent 80%)',
          filter: 'blur(36px)',
          opacity: glowIntensity,
          transform: `scale(${scale * 1.08})`,
        }}
      />

      {/* 2. Studio Botanical Velvet Form with Organic Radial Vignette */}
      <div
        className="relative w-[90vw] sm:w-[75vw] md:w-[65vw] max-w-[680px] aspect-square flex items-center justify-center will-change-transform"
        style={{
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
          transition:
            phase === 'FLOWER_EMERGE'
              ? 'none'
              : 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), filter 1.0s ease',
          maskImage:
            'radial-gradient(circle at 50% 50%, black 28%, rgba(0, 0, 0, 0.95) 52%, rgba(0, 0, 0, 0.6) 72%, transparent 88%)',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 50%, black 28%, rgba(0, 0, 0, 0.95) 52%, rgba(0, 0, 0, 0.6) 72%, transparent 88%)',
        }}
      >
        <img
          src="/assets/imgs/loader-flower.jpg"
          alt="Studio botanical flower artwork"
          draggable={false}
          className="w-full h-full object-contain sm:object-cover object-center select-none pointer-events-none"
        />

        {/* Delicate inner starlight breathing sheen */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle at 52% 48%, rgba(255, 255, 255, 0.22) 0%, rgba(199, 210, 254, 0.12) 30%, transparent 65%)',
            opacity: glowIntensity * 0.8,
          }}
        />
      </div>
    </div>
  );
};
