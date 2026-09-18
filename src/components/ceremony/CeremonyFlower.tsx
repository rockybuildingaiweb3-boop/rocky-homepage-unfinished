import React from 'react';
import { LoaderPhase } from './types';

interface CeremonyFlowerProps {
  phase: LoaderPhase;
  phaseProgress?: number; // 0 to 1 within the current phase
}

/**
 * CeremonyFlower
 *
 * Restrained botanical velvet rose emerging from darkness:
 * - Restrained medium luminance hierarchy (Signature > Rose > Atmosphere > Progress)
 * - Rich internal petal detail and deep burgundy velvety folds preserved
 * - No fluorescent neon red, no white/screen washouts over petals
 * - Smooth anti-aliased edge falloff with color decontamination, zero rectangular border
 * - Sits in harmonious, balanced spatial depth behind the calligraphic signature
 */
export const CeremonyFlower: React.FC<CeremonyFlowerProps> = ({ phase, phaseProgress = 0 }) => {
  // Determine emergence metrics based on ceremony phase
  let opacity = 0;
  let scale = 0.88;
  let rotation = -2.0;
  let blurAmount = 8;
  let glowIntensity = 0.1;

  switch (phase) {
    case 'INITIALIZING':
      opacity = 0;
      scale = 0.86;
      rotation = -2.5;
      blurAmount = 10;
      glowIntensity = 0;
      break;

    case 'ATMOSPHERE':
      // Subtle organic presence stirring in the deep void
      opacity = 0.16;
      scale = 0.89;
      rotation = -2.0;
      blurAmount = 6;
      glowIntensity = 0.18;
      break;

    case 'SIGNING':
      // Gentle velvety silhouette blooming softly in atmospheric depth behind the calligraphy
      opacity = 0.38;
      scale = 0.93;
      rotation = -1.2;
      blurAmount = 2.5;
      glowIntensity = 0.35;
      break;

    case 'FLOWER_EMERGE': {
      // Organic bloom emergence with subtle breathing overshoot and settling into velvety dimension
      const t = Math.max(0, Math.min(1, phaseProgress));
      const easedT = 1 - Math.pow(1 - t, 2.8);
      const overshoot = Math.sin(t * Math.PI) * 0.02;
      scale = 0.93 + easedT * 0.07 + overshoot; // 0.93 -> 1.02 -> 1.00
      opacity = 0.38 + easedT * 0.27; // 0.38 -> 0.65 (restrained medium luminance)
      rotation = -1.2 + easedT * 1.2; // -1.2 -> 0.0 deg
      blurAmount = Math.max(0, 2.5 - easedT * 2.5);
      glowIntensity = 0.35 + easedT * 0.30; // 0.35 -> 0.65
      break;
    }

    case 'IDENTITY_SETTLE':
    case 'READY':
      // Settled, mysterious, dimensional botanical object (Signature remains primary focus)
      opacity = 0.65;
      scale = 1.0;
      rotation = 0;
      blurAmount = 0;
      glowIntensity = 0.65;
      break;

    case 'EXITING':
      // Atmospheric aperture expansion: flower dissolves as camera moves into Hero garden
      opacity = 0.50;
      scale = 1.10;
      rotation = 0.5;
      blurAmount = 3;
      glowIntensity = 0.40;
      break;

    case 'COMPLETE':
      opacity = 0;
      scale = 1.20;
      break;
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Restrained Ambient Atmosphere (deep violet-slate cosmic mist behind flower) */}
      <div
        className="absolute w-[80vw] sm:w-[62vw] max-w-[560px] aspect-square rounded-full pointer-events-none will-change-transform transition-all duration-1000 ease-out"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.16) 0%, rgba(99, 102, 241, 0.08) 38%, transparent 70%)',
          filter: 'blur(52px)',
          opacity: glowIntensity,
          transform: `scale(${scale * 1.04})`,
        }}
      />

      {/* 2. Photographic Velvet Flower with Alpha Transparency (no black box, no edge contours) */}
      <div
        className="relative w-[75vw] sm:w-[60vw] md:w-[50vw] max-w-[480px] aspect-square flex items-center justify-center will-change-transform"
        style={{
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : 'drop-shadow(0 12px 36px rgba(0, 0, 0, 0.7))',
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
      </div>
    </div>
  );
};
