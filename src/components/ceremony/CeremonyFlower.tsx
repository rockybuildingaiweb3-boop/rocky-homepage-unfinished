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
  let rimGlowOpacity = 0;
  let innerCoreGlowOpacity = 0;
  let causticSweepOpacity = 0;
  let causticSweepPos = -50;
  let ambientHaloOpacity = 0;

  switch (phase) {
    case 'VOID': {
      // Act I: Total obsidian quietude. The rose is unlit in the dark.
      opacity = 0;
      scale = 0.98;
      rotation = -1.0;
      revealRadius = 0;
      rimGlowOpacity = 0;
      break;
    }

    case 'AWAKENING': {
      // Act II: Awakening Light — A localized light source stirs in space
      // Light moves from upper-left (36%, 22%) toward center (48%, 40%)
      const t = Math.max(0, Math.min(1, phaseProgress));
      const easedT = t * t * (3 - 2 * t);

      lightX = 36 + easedT * 12;
      lightY = 22 + easedT * 18;

      // Rose begins as dark silhouette catching subtle rim illumination
      opacity = 0.08 + easedT * 0.32; // 0.08 -> 0.40
      scale = 0.98 + easedT * 0.01;
      rotation = -1.0 + easedT * 0.4;
      revealRadius = 18 + easedT * 22; // 18% -> 40% (rim and outer contour)
      rimGlowOpacity = easedT * 0.65;
      ambientHaloOpacity = 0.08 * easedT;
      break;
    }

    case 'EMERGENCE': {
      // Act III: Rose Emergence — The light moves deeper, revealing petal folds
      const t = Math.max(0, Math.min(1, phaseProgress));
      // Organic cubic ease-out
      const easedT = 1 - Math.pow(1 - t, 2.4);

      lightX = 48 + easedT * 2;
      lightY = 40 + easedT * 8;

      opacity = 0.40 + easedT * 0.60; // 0.40 -> 1.00 (full photographic clarity)
      scale = 0.99 + easedT * 0.01;
      rotation = -0.6 + easedT * 0.6; // settles naturally
      revealRadius = 40 + easedT * 60; // 40% -> 100% full reveal

      rimGlowOpacity = 0.65 * (1 - easedT * 0.5);
      ambientHaloOpacity = 0.08 + easedT * 0.18;

      // Caustic highlight beam sweeps across velvet folds during 15%-85%
      if (t >= 0.15 && t <= 0.85) {
        const sweepT = (t - 0.15) / 0.70;
        causticSweepOpacity = Math.sin(sweepT * Math.PI) * 0.35;
        causticSweepPos = -20 + sweepT * 140;
      }
      break;
    }

    case 'SIGNING': {
      // Act IV: Signature is drawing. Rose rests in serene, pure photographic beauty
      opacity = 0.95;
      scale = 1.0;
      rotation = 0;
      revealRadius = 100;
      lightX = 50;
      lightY = 48;
      rimGlowOpacity = 0.15;
      ambientHaloOpacity = 0.22;
      break;
    }

    case 'CONVERGENCE': {
      // Act V Part 1: Signature energy converges toward rose base
      const t = Math.max(0, Math.min(1, convergenceProgress));
      opacity = 0.96;
      scale = 1.0;
      rotation = 0;
      revealRadius = 100;
      // Energy gathering at base/calyx of rose
      innerCoreGlowOpacity = t * 0.45;
      ambientHaloOpacity = 0.22 + t * 0.12;
      break;
    }

    case 'CLIMAX': {
      // Act V Part 2: Inner illumination awakens in petal core -> rose breathes (+3.5%)
      const t = Math.max(0, Math.min(1, climaxProgress));
      // Smooth bell curve for the breath expansion
      const breathCurve = Math.sin(t * Math.PI);

      opacity = 1.0;
      scale = 1.0 + breathCurve * 0.035; // 1.0 -> 1.035 -> 1.008
      rotation = 0;
      revealRadius = 100;
      innerCoreGlowOpacity = 0.45 + t * 0.55; // blooms warmly
      rimGlowOpacity = 0.25 + breathCurve * 0.35;
      ambientHaloOpacity = 0.34 + breathCurve * 0.28;
      break;
    }

    case 'SILENCE': {
      // Act V Part 3: Breathless stillness / hold. Dormant object has awakened.
      opacity = 1.0;
      scale = 1.008;
      rotation = 0;
      revealRadius = 100;
      innerCoreGlowOpacity = 0.75;
      ambientHaloOpacity = 0.38;
      break;
    }

    case 'ARRIVAL': {
      // Act VI: Settled harmonic lockup
      opacity = 1.0;
      scale = 1.0;
      rotation = 0;
      revealRadius = 100;
      innerCoreGlowOpacity = 0.65;
      ambientHaloOpacity = 0.35;
      break;
    }

    case 'EXITING': {
      // Act VII: Aperture expansion into Hero
      opacity = isExiting ? 0.45 : 0.85;
      scale = 1.10;
      rotation = 0.2;
      revealRadius = 100;
      innerCoreGlowOpacity = 0.40;
      ambientHaloOpacity = 0.45;
      break;
    }

    case 'COMPLETE': {
      opacity = 0;
      scale = 1.15;
      break;
    }
  }

  // Directional mask revealing the rose from the moving illumination point
  const maskStyle =
    revealRadius < 98
      ? {
          maskImage: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(
            0,
            revealRadius - 18
          )}%, rgba(0,0,0,0.45) ${revealRadius}%, rgba(0,0,0,0) ${revealRadius + 20}%)`,
          WebkitMaskImage: `radial-gradient(circle at ${lightX}% ${lightY}%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(
            0,
            revealRadius - 18
          )}%, rgba(0,0,0,0.45) ${revealRadius}%, rgba(0,0,0,0) ${revealRadius + 20}%)`,
        }
      : undefined;

  return (
    <div
      className="relative flex items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* ── 1. AMBIENT COSMIC AURA (Proportional to native rose scale) ── */}
      <div
        className="absolute w-[280px] sm:w-[340px] md:w-[380px] aspect-square rounded-full pointer-events-none will-change-transform transition-all duration-700 ease-out"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.22) 0%, rgba(225, 29, 72, 0.10) 40%, transparent 70%)',
          filter: 'blur(36px)',
          opacity: ambientHaloOpacity,
          transform: `scale(${scale * 1.05})`,
        }}
      />

      {/* ── 2. LOCALIZED MOVING AWAKENING LIGHT SOURCE (Act II) ── */}
      {phase === 'AWAKENING' && (
        <div
          className="absolute w-24 h-24 rounded-full pointer-events-none will-change-transform mix-blend-screen"
          style={{
            left: `${lightX}%`,
            top: `${lightY}%`,
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle at 50% 50%, rgba(254, 215, 170, 0.55) 0%, rgba(244, 114, 182, 0.28) 45%, transparent 75%)',
            filter: 'blur(14px)',
            opacity: phaseProgress,
          }}
        />
      )}

      {/* ── 3. NATIVE-SCALE BOTANICAL ROSE CONTAINER ── */}
      {/* Sized appropriately as an intimate, precious physical object */}
      <div
        className="relative w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[240px] md:h-[240px] aspect-square flex items-center justify-center will-change-transform"
        style={{
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          filter:
            rimGlowOpacity > 0
              ? `drop-shadow(0 14px 28px rgba(0, 0, 0, 0.90)) drop-shadow(0 -2px 10px rgba(244, 114, 182, ${(
                  rimGlowOpacity * 0.45
                ).toFixed(2)}))`
              : 'drop-shadow(0 14px 28px rgba(0, 0, 0, 0.90))',
          transition:
            phase === 'EMERGENCE' || phase === 'CLIMAX' || phase === 'AWAKENING'
              ? 'none' // continuous RAF control
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
            style={{
              // True photographic fidelity preserved: No global blowout, no fake HDR
              filter: 'brightness(1.0) contrast(1.0) saturate(1.0)',
            }}
          />

          {/* ── 4. DYNAMIC CAUSTIC LIGHT SWEEP (Act III Emergence) ── */}
          {causticSweepOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none select-none mix-blend-screen rounded-full overflow-hidden"
              style={{
                background: `linear-gradient(135deg, transparent ${causticSweepPos - 25}%, rgba(254, 205, 211, 0.25) ${causticSweepPos}%, rgba(216, 180, 254, 0.35) ${causticSweepPos + 10}%, transparent ${causticSweepPos + 35}%)`,
                opacity: causticSweepOpacity,
              }}
            />
          )}

          {/* ── 5. INNER ILLUMINATION BLOOM (Act V Climax) ── */}
          {/* Light travels through petal structures from the inner core */}
          {innerCoreGlowOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none select-none mix-blend-screen rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 50% 48%, rgba(254, 205, 211, 0.35) 0%, rgba(225, 29, 72, 0.18) 38%, transparent 64%)',
                opacity: innerCoreGlowOpacity,
                transition: phase === 'CLIMAX' ? 'none' : 'opacity 0.4s ease',
              }}
            />
          )}

          {/* ── 6. CAUSAL LIGHT BEAD AT BASE OF ROSE (Transition to Signature) ── */}
          {/* Ember gathering at bottom of rose ready to flow into handwriting */}
          {phase === 'EMERGENCE' && phaseProgress > 0.85 && (
            <div
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white pointer-events-none will-change-transform"
              style={{
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.95), 0 0 20px rgba(216, 180, 254, 0.85)',
                opacity: (phaseProgress - 0.85) / 0.15,
              }}
            />
          )}
        </picture>
      </div>
    </div>
  );
};
