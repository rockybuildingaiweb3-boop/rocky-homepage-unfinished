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
  let rotation = -2.0;
  let blurAmount = 6;
  let glowIntensity = 0.1;

  switch (phase) {
    case 'INITIALIZING':
      opacity = 0;
      scale = 0.86;
      rotation = -2.5;
      blurAmount = 8;
      glowIntensity = 0;
      break;

    case 'ATMOSPHERE':
      // Subtle organic presence stirring in the deep void
      opacity = 0.25;
      scale = 0.90;
      rotation = -1.8;
      blurAmount = 4;
      glowIntensity = 0.3;
      break;

    case 'SIGNING':
      // Gentle velvety silhouette blooming softly behind the calligraphy
      opacity = 0.50;
      scale = 0.94;
      rotation = -1.0;
      blurAmount = 2.5;
      glowIntensity = 0.5;
      break;

    case 'FLOWER_EMERGE': {
      // Organic bloom emergence with subtle breathing overshoot and settling
      const t = Math.max(0, Math.min(1, phaseProgress));
      const easedT = 1 - Math.pow(1 - t, 2.8);
      const overshoot = Math.sin(t * Math.PI) * 0.025;
      scale = 0.94 + easedT * 0.06 + overshoot; // 0.94 -> 1.025 -> 1.00
      opacity = 0.50 + easedT * 0.44; // 0.50 -> 0.94
      rotation = -1.0 + easedT * 1.0; // -1.0 -> 0.0 deg
      blurAmount = Math.max(0, 2.5 - easedT * 2.5);
      glowIntensity = 0.5 + easedT * 0.45;
      break;
    }

    case 'IDENTITY_SETTLE':
    case 'READY':
      opacity = 0.94;
      scale = 1.0;
      rotation = 0;
      blurAmount = 0;
      glowIntensity = 0.88;
      break;

    case 'EXITING':
      // Atmospheric aperture expansion: flower dissolves as camera moves into Hero garden
      opacity = 0;
      scale = 1.18;
      rotation = 0.8;
      blurAmount = 8;
      glowIntensity = 1.0;
      break;

    case 'COMPLETE':
      opacity = 0;
      scale = 1.25;
      break;
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Luminous Ambient Backlight Corona (soft violet-magenta starlight glow behind petals) */}
      <div
        className="absolute w-[85vw] sm:w-[68vw] max-w-[640px] aspect-square rounded-full pointer-events-none mix-blend-screen will-change-transform transition-all duration-1000 ease-out"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.42) 0%, rgba(129, 140, 248, 0.22) 36%, rgba(192, 132, 252, 0.10) 62%, transparent 80%)',
          filter: 'blur(40px)',
          opacity: glowIntensity,
          transform: `scale(${scale * 1.06})`,
        }}
      />

      {/* 2. Photographic Velvet Flower with 100% Alpha Transparency (no black box / rectangle) */}
      <div
        className="relative w-[85vw] sm:w-[70vw] md:w-[60vw] max-w-[580px] aspect-square flex items-center justify-center will-change-transform"
        style={{
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'none',
          transition:
            phase === 'FLOWER_EMERGE'
              ? 'none'
              : 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s ease',
        }}
      >
        <picture className="w-full h-full flex items-center justify-center">
          <source srcSet="/assets/imgs/loader-flower.webp" type="image/webp" />
          <img
            src="/assets/imgs/loader-flower.png"
            alt="Studio botanical velvet flower"
            draggable={false}
            className="w-full h-full object-contain select-none pointer-events-none"
          />
        </picture>

        {/* Delicate inner starlight sheen breathing with the petals */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle at 52% 48%, rgba(255, 255, 255, 0.24) 0%, rgba(216, 180, 254, 0.14) 32%, transparent 68%)',
            opacity: glowIntensity * 0.75,
          }}
        />
      </div>
    </div>
  );
};
