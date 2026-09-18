import React from 'react';
import { LoaderPhase } from './types';

interface CeremonyFlowerProps {
  phase: LoaderPhase;
  phaseProgress?: number; // 0 to 1 within current phase
  climaxProgress?: number; // 0 to 1 during CLIMAX
  isExiting?: boolean;
}

/**
 * CeremonyFlower
 *
 * Implements a true botanical lighting story:
 * 1. VOID: Deep obsidian quietude.
 * 2. AWAKENING: Distant faint organic silhouette stirring in volumetric haze.
 * 3. EMERGENCE: Light reveals the rose from core to outer petals via radial mask,
 *    moving highlight sweep, contrast sculpting, and focal depth resolve.
 * 4. SIGNING: Rose gracefully yields (luminance & scale step back) so the
 *    handwritten signature reigns as undisputed focal hero.
 * 5. SUSPENSE: Quiet, breathless pause before impact.
 * 6. CLIMAX: Signature light cascades backward into the flower; velvet petals
 *    bloom with rich crimson clarity and subtle ambient spill.
 * 7. ARRIVAL: Harmonious settled luxury.
 * 8. EXITING: Smooth aperture expansion into Hero section.
 */
export const CeremonyFlower: React.FC<CeremonyFlowerProps> = ({
  phase,
  phaseProgress = 0,
  climaxProgress = 0,
  isExiting = false,
}) => {
  // Lighting & geometric state
  let opacity = 0;
  let scale = 0.85;
  let rotation = -2.5;
  let blurAmount = 14;
  let brightness = 0.35;
  let contrast = 1.35;
  let saturation = 0.9;
  let revealRadius = 0; // 0 to 100% radial mask coverage
  let ambientHaloOpacity = 0;
  let causticSweepOpacity = 0;
  let causticSweepPos = -50;

  switch (phase) {
    case 'VOID':
      opacity = 0;
      scale = 0.85;
      rotation = -3.0;
      blurAmount = 16;
      revealRadius = 5;
      break;

    case 'AWAKENING': {
      // Act II: Distant botanical silhouette stirs in deep cosmic haze
      const t = Math.max(0, Math.min(1, phaseProgress));
      const easedT = t * t * (3 - 2 * t);
      opacity = 0.05 + easedT * 0.16; // 0.05 -> 0.21
      scale = 0.86 + easedT * 0.03;   // 0.86 -> 0.89
      rotation = -2.8 + easedT * 0.6; // -2.8 -> -2.2 deg
      blurAmount = Math.max(7, 14 - easedT * 7); // 14px -> 7px
      brightness = 0.36;
      contrast = 1.35;
      saturation = 0.95;
      revealRadius = 15 + easedT * 15; // 15% -> 30%
      ambientHaloOpacity = 0.12 * easedT;
      break;
    }

    case 'EMERGENCE': {
      // Act III: True Lighting Story — Core reveals first, light sweeps across velvet folds
      const t = Math.max(0, Math.min(1, phaseProgress));
      // Organic cubic ease-out
      const easedT = 1 - Math.pow(1 - t, 2.6);
      opacity = 0.21 + easedT * 0.44; // 0.21 -> 0.65 (medium velvet luminance)
      scale = 0.89 + easedT * 0.09;   // 0.89 -> 0.98
      rotation = -2.2 + easedT * 1.8; // -2.2 -> -0.4 deg
      blurAmount = Math.max(0, 7 * (1 - easedT)); // 7px -> 0px crisp focus
      brightness = 0.36 + easedT * 0.26; // 0.36 -> 0.62
      contrast = 1.35 - easedT * 0.23;   // 1.35 -> 1.12
      saturation = 0.95 + easedT * 0.15; // 0.95 -> 1.10
      revealRadius = 30 + easedT * 70;   // 30% -> 100% full petal reveal
      ambientHaloOpacity = 0.12 + easedT * 0.32;
      // Caustic highlight beam travels across petals during 20%-80% of emergence
      if (t >= 0.15 && t <= 0.85) {
        const sweepT = (t - 0.15) / 0.70;
        causticSweepOpacity = Math.sin(sweepT * Math.PI) * 0.45;
        causticSweepPos = -30 + sweepT * 160; // sweeps across
      }
      break;
    }

    case 'SIGNING': {
      // Act IV: Signature is Temporary Hero! Rose gracefully yields luminance
      opacity = 0.38;
      scale = 0.96;
      rotation = -0.4;
      blurAmount = 0.5;
      brightness = 0.50; // dimmed for high signature contrast
      contrast = 1.08;
      saturation = 0.90;
      revealRadius = 100;
      ambientHaloOpacity = 0.20; // quiet background atmosphere
      break;
    }

    case 'SUSPENSE': {
      // Act V Part 1: Silence Before Impact — Serene stillness
      opacity = 0.40;
      scale = 0.96;
      rotation = 0;
      blurAmount = 0;
      brightness = 0.52;
      contrast = 1.10;
      saturation = 0.92;
      revealRadius = 100;
      ambientHaloOpacity = 0.22;
      break;
    }

    case 'CLIMAX': {
      // Act V Part 2: Causal Chain — Signature light washes into flower!
      const t = Math.max(0, Math.min(1, climaxProgress));
      // Elastic spring bloom overshoot
      const bloomCurve = Math.sin(t * Math.PI * 0.85);
      scale = 0.96 + t * 0.05 + bloomCurve * 0.025; // 0.96 -> 1.035 -> 1.01
      opacity = 0.40 + t * 0.32; // 0.40 -> 0.72
      rotation = 0;
      blurAmount = 0;
      brightness = 0.52 + t * 0.18; // 0.52 -> 0.70
      contrast = 1.10 + t * 0.06;   // 1.10 -> 1.16
      saturation = 0.92 + t * 0.26; // 0.92 -> 1.18 (rich velvet crimson)
      revealRadius = 100;
      ambientHaloOpacity = 0.22 + t * 0.48; // radiant background aura
      break;
    }

    case 'ARRIVAL': {
      // Act VI Part 1: Settled harmonic lockup
      opacity = 0.66;
      scale = 1.00;
      rotation = 0;
      blurAmount = 0;
      brightness = 0.64;
      contrast = 1.12;
      saturation = 1.10;
      revealRadius = 100;
      ambientHaloOpacity = 0.45;
      break;
    }

    case 'EXITING': {
      // Act VI Part 2: Aperture opens into Hero
      opacity = isExiting ? 0.35 : 0.55;
      scale = 1.12;
      rotation = 0.4;
      blurAmount = 4;
      brightness = 0.60;
      contrast = 1.05;
      saturation = 1.05;
      revealRadius = 100;
      ambientHaloOpacity = 0.60;
      break;
    }

    case 'COMPLETE':
      opacity = 0;
      scale = 1.22;
      break;
  }

  // Radial mask revealing center petals first during early emergence
  const maskStyle =
    revealRadius < 98
      ? {
          maskImage: `radial-gradient(circle at 50% 48%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(
            0,
            revealRadius - 15
          )}%, rgba(0,0,0,0.5) ${revealRadius}%, rgba(0,0,0,0) ${revealRadius + 22}%)`,
          WebkitMaskImage: `radial-gradient(circle at 50% 48%, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${Math.max(
            0,
            revealRadius - 15
          )}%, rgba(0,0,0,0.5) ${revealRadius}%, rgba(0,0,0,0) ${revealRadius + 22}%)`,
        }
      : undefined;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* ── 1. AMBIENT VOLUMETRIC ATMOSPHERIC AURA ── */}
      {/* Multi-layered cosmic halo that breathes with the ceremony */}
      <div
        className="absolute w-[85vw] sm:w-[68vw] max-w-[620px] aspect-square rounded-full pointer-events-none will-change-transform transition-all duration-700 ease-out"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.24) 0%, rgba(225, 29, 72, 0.12) 35%, rgba(99, 102, 241, 0.05) 55%, transparent 72%)',
          filter: 'blur(56px)',
          opacity: ambientHaloOpacity,
          transform: `scale(${scale * 1.06})`,
        }}
      />

      {/* ── 2. SECONDARY CLIMAX AMBIENT SPILL ── */}
      {/* Warm crimson-violet spill that activates specifically at the climax */}
      <div
        className="absolute w-[70vw] sm:w-[55vw] max-w-[500px] aspect-square rounded-full pointer-events-none will-change-transform transition-opacity duration-600 ease-out"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.20) 0%, rgba(147, 51, 234, 0.15) 45%, transparent 68%)',
          filter: 'blur(40px)',
          opacity: phase === 'CLIMAX' || phase === 'ARRIVAL' ? ambientHaloOpacity * 0.8 : 0,
          transform: `scale(${scale * 1.12})`,
        }}
      />

      {/* ── 3. VELVET BOTANICAL ROSE CONTAINER ── */}
      <div
        className="relative w-[76vw] sm:w-[62vw] md:w-[52vw] max-w-[500px] aspect-square flex items-center justify-center will-change-transform"
        style={{
          opacity,
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          filter: `blur(${blurAmount}px) drop-shadow(0 16px 40px rgba(0, 0, 0, 0.85))`,
          transition:
            phase === 'EMERGENCE' || phase === 'CLIMAX'
              ? 'none' // Controlled continuously by RAF loop
              : 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.65s ease',
          ...maskStyle,
        }}
      >
        <picture className="w-full h-full flex items-center justify-center relative">
          <source srcSet="/assets/imgs/loader-flower.webp" type="image/webp" />
          <img
            src="/assets/imgs/loader-flower.png"
            alt="Ceremonial botanical velvet rose"
            draggable={false}
            className="w-full h-full object-contain select-none pointer-events-none"
            style={{
              filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation})`,
              transition:
                phase === 'EMERGENCE' || phase === 'CLIMAX'
                  ? 'none'
                  : 'filter 0.75s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* ── 4. DYNAMIC CAUSTIC LIGHT SWEEP (EMERGENCE ONLY) ── */}
          {/* Light traveling across petal folds like a moving spotlight beam */}
          {causticSweepOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none select-none mix-blend-screen"
              style={{
                background: `linear-gradient(135deg, transparent ${causticSweepPos - 25}%, rgba(244, 114, 182, 0.28) ${causticSweepPos}%, rgba(216, 180, 254, 0.38) ${causticSweepPos + 10}%, transparent ${causticSweepPos + 35}%)`,
                opacity: causticSweepOpacity,
              }}
            />
          )}

          {/* ── 5. CLIMAX STARLIGHT RESONANCE OVERLAY ── */}
          {/* Soft inner core illumination triggered by the signature completion */}
          {(phase === 'CLIMAX' || phase === 'ARRIVAL') && (
            <div
              className="absolute inset-0 pointer-events-none select-none mix-blend-screen rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 50% 48%, rgba(244, 208, 254, 0.18) 0%, rgba(225, 29, 72, 0.10) 40%, transparent 65%)',
                opacity: phase === 'CLIMAX' ? Math.min(1, climaxProgress * 1.2) : 0.6,
                transition: 'opacity 0.5s ease',
              }}
            />
          )}
        </picture>
      </div>
    </div>
  );
};
