import React from 'react';
import { LoaderPhase } from './types';

interface CeremonyFlowerProps {
  phase: LoaderPhase;
  phaseProgress?: number; // 0 to 1 within current phase
  climaxProgress?: number; // 0 to 1 during CLIMAX
  convergenceProgress?: number; // 0 to 1 during CONVERGENCE
  isExiting?: boolean;
}

/**
 * CeremonyFlower
 *
 * Rebuilt according to strict artistic direction:
 * - Native-scale presentation: Precious physical jewel suspended in vast space (~220-250px container)
 * - Preserves authentic photographic character: natural red/burgundy velvet tones, sharpness, texture
 * - No artificial CSS filter blowout (brightness/contrast/saturation remain true)
 * - Act II & III: THE LIGHT REVEALS THE ROSE (moving illumination event, directional rim highlight, petal reveal)
 * - Act IV: Rose rests serenely as botanical anchor while light flows down to signature
 * - Act V: Signature energy converges into rose -> inner illumination blossoms in core -> rose breathes (+3.5%)
 * - Act VI & VII: Poised arrival & smooth spatial aperture transition into Hero
 */
export const CeremonyFlower: React.FC<CeremonyFlowerProps> = ({
  phase,
  phaseProgress = 0,
  climaxProgress = 0,
  convergenceProgress = 0,
  isExiting = false,
}) => {
  // Lighting & geometric state
  let opacity = 0;
  let scale = 1.0;
  let rotation = -0.5;
  let revealRadius = 100; // % radial reveal
  let lightX = 50; // %
  let lightY = 48; // %
  let ambientHaloOpacity = 0;

  switch (phase) {
    case 'VOID': {
      // Act I: Obsidian quietude. Unlit in the dark.
      opacity = 0;
      scale = 0.98;
      rotation = -1.0;
      revealRadius = 0;
      ambientHaloOpacity = 0;
      break;
    }

    case 'AWAKENING': {
      // Act II: Awakening Light — Subtle spatial emergence
      const t = Math.max(0, Math.min(1, phaseProgress));
      const easedT = t * t * (3 - 2 * t);

      lightX = 38 + easedT * 12;
      lightY = 25 + easedT * 18;

      opacity = 0.12 + easedT * 0.38; // 0.12 -> 0.50
      scale = 0.985 + easedT * 0.01;
      rotation = -1.0 + easedT * 0.4;
      revealRadius = 20 + easedT * 30; // 20% -> 50%
      ambientHaloOpacity = 0.15 * easedT;
      break;
    }

    case 'EMERGENCE': {
      // Act III: Rose Emergence — Full photographic clarity
      const t = Math.max(0, Math.min(1, phaseProgress));
      const easedT = 1 - Math.pow(1 - t, 2.2);

      lightX = 50;
      lightY = 48;

      opacity = 0.50 + easedT * 0.50; // 0.50 -> 1.00
      scale = 0.995 + easedT * 0.005;
      rotation = -0.6 + easedT * 0.6;
      revealRadius = 50 + easedT * 50; // 50% -> 100%
      ambientHaloOpacity = 0.15 + easedT * 0.35;
      break;
    }

    case 'SIGNING': {
      // Act IV: Signature is drawing. Rose rests as natural botanical anchor
      opacity = 1.0;
      scale = 1.0;
      rotation = 0;
      revealRadius = 100;
      ambientHaloOpacity = 0.50;
      break;
    }

    case 'CONVERGENCE': {
      // Act V Part 1: Convergence
      const t = Math.max(0, Math.min(1, convergenceProgress));
      opacity = 1.0;
      scale = 1.0;
      rotation = 0;
      revealRadius = 100;
      ambientHaloOpacity = 0.50 + t * 0.15;
      break;
    }

    case 'CLIMAX': {
      // Act V Part 2: Rose breathes subtly (+2.8%) with restrained ambient response
      const t = Math.max(0, Math.min(1, climaxProgress));
      const breathCurve = Math.sin(t * Math.PI);

      opacity = 1.0;
      scale = 1.0 + breathCurve * 0.028;
      rotation = 0;
      revealRadius = 100;
      ambientHaloOpacity = 0.65 + breathCurve * 0.25;
      break;
    }

    case 'SILENCE': {
      // Act V Part 3: Stillness
      opacity = 1.0;
      scale = 1.005;
      rotation = 0;
      revealRadius = 100;
      ambientHaloOpacity = 0.60;
      break;
    }

    case 'ARRIVAL': {
      // Act VI: Harmonic lockup
      opacity = 1.0;
      scale = 1.0;
      rotation = 0;
      revealRadius = 100;
      ambientHaloOpacity = 0.55;
      break;
    }

    case 'EXITING': {
      // Act VII: Smooth aperture transition into Hero
      opacity = isExiting ? 0.45 : 0.85;
      scale = 1.08;
      rotation = 0.2;
      revealRadius = 100;
      ambientHaloOpacity = 0.40;
      break;
    }

    case 'COMPLETE': {
      opacity = 0;
      scale = 1.12;
      break;
    }
  }

  // Directional mask revealing the rose from the moving illumination point during awakening
  const maskStyle =
    revealRadius < 98
      ? {
          maskImage: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(
            0,
            revealRadius - 15
          )}%, rgba(0,0,0,0.3) ${revealRadius}%, rgba(0,0,0,0) ${revealRadius + 18}%)`,
          WebkitMaskImage: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(
            0,
            revealRadius - 15
          )}%, rgba(0,0,0,0.3) ${revealRadius}%, rgba(0,0,0,0) ${revealRadius + 18}%)`,
        }
      : undefined;

  return (
    <div
      className="relative flex items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* ── 1. RESTRAINED LOCAL RED ILLUMINATION (Soft atmospheric falloff, no giant purple bloom) ── */}
      <div
        className="absolute w-[240px] sm:w-[280px] md:w-[320px] aspect-square rounded-full pointer-events-none will-change-transform transition-all duration-700 ease-out"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(159, 18, 57, 0.16) 0%, rgba(136, 19, 55, 0.06) 42%, transparent 70%)',
          filter: 'blur(30px)',
          opacity: ambientHaloOpacity,
          transform: `scale(${scale * 1.04})`,
        }}
      />

      {/* ── 2. NATIVE-SCALE BOTANICAL ROSE CONTAINER ── */}
      {/* Physical object suspended with authentic depth shadow */}
      <div
        className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[240px] md:h-[240px] aspect-square flex items-center justify-center will-change-transform"
        style={{
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          filter: 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.88))',
          transition:
            phase === 'EMERGENCE' || phase === 'CLIMAX' || phase === 'AWAKENING'
              ? 'none'
              : 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
          ...maskStyle,
        }}
      >
        <picture className="w-full h-full flex items-center justify-center relative">
          <source srcSet="/assets/imgs/loader-flower.webp" type="image/webp" />
          <img
            src="/assets/imgs/loader-flower.png"
            alt="Ceremonial botanical rose"
            draggable={false}
            className="w-full h-full object-contain select-none pointer-events-none"
          />
        </picture>
      </div>
    </div>
  );
};
