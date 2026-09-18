import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import {
  SIGNATURE_STROKE_DEFS,
  INITIAL_PEN_COORDINATES,
  computeStrokeProgressWindows,
} from './signatureGeometry';
import { LoaderPhase } from './types';

interface CeremonySignatureProps {
  progress: number; // 0 to 1 during SIGNING phase
  phase: LoaderPhase;
  climaxProgress?: number; // 0 to 1 during CLIMAX phase
  isMobile?: boolean;
}

/**
 * CeremonySignature
 *
 * Implements an authored, musical handwriting performance:
 * 1. VOID / AWAKENING / EMERGENCE: Invisible.
 * 2. ANTICIPATION (first 4% of SIGNING): A delicate luminous pen-tip nib appears
 *    at (65, 190) and gathers focus.
 * 3. AUTHENTIC WRITING: Variable stroke velocities, natural pen-lifts, accelerating flourish.
 * 4. TEMPORARY HERO: During writing, razor-sharp white core and luminous halo dominate visual perception.
 * 5. SUSPENSE (Silence Before Impact): Signature hangs in pristine stillness.
 * 6. CLIMAX: Starlight resonance pulses outward along the strokes, illuminating the stage.
 * 7. ARRIVAL: Settled in balanced harmony with the identity and rose.
 */
export const CeremonySignature: React.FC<CeremonySignatureProps> = ({
  progress,
  phase,
  climaxProgress = 0,
}) => {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [measuredLengths, setMeasuredLengths] = useState<number[]>(() =>
    SIGNATURE_STROKE_DEFS.map((s) => s.approxLength)
  );

  // Measure actual SVG geometry precisely on mount
  useLayoutEffect(() => {
    const lengths = pathRefs.current.map((pathEl, idx) => {
      if (pathEl && typeof pathEl.getTotalLength === 'function') {
        try {
          const len = pathEl.getTotalLength();
          if (len > 10) return len;
        } catch {
          // fallback
        }
      }
      return SIGNATURE_STROKE_DEFS[idx].approxLength;
    });
    setMeasuredLengths(lengths);
  }, []);

  // Compute stroke windows with per-stroke velocity profiles
  const { windows, totalDuration } = useMemo(() => {
    return computeStrokeProgressWindows(measuredLengths);
  }, [measuredLengths]);

  // Handwriting timeline mapping with initial anticipation pause
  const { currentTime, isAnticipating, anticipationOpacity } = useMemo(() => {
    if (phase === 'VOID' || phase === 'AWAKENING' || phase === 'EMERGENCE') {
      return { currentTime: 0, isAnticipating: false, anticipationOpacity: 0 };
    }

    if (phase === 'SIGNING') {
      const clamped = Math.max(0, Math.min(1, progress));
      // First 4% is dedicated to ink-tip anticipation
      const ANTICIPATION_WINDOW = 0.04;
      if (clamped < ANTICIPATION_WINDOW) {
        const t = clamped / ANTICIPATION_WINDOW;
        return {
          currentTime: 0,
          isAnticipating: true,
          anticipationOpacity: Math.min(1, t * 2.2),
        };
      }

      // Handwriting motion runs from 0 to totalDuration
      const strokeT = (clamped - ANTICIPATION_WINDOW) / (1 - ANTICIPATION_WINDOW);
      return {
        currentTime: strokeT * totalDuration,
        isAnticipating: false,
        anticipationOpacity: 1,
      };
    }

    // SUSPENSE, CLIMAX, ARRIVAL, EXITING, COMPLETE: fully drawn
    return {
      currentTime: totalDuration,
      isAnticipating: false,
      anticipationOpacity: 0,
    };
  }, [phase, progress, totalDuration]);

  // Compute stroke offsets & active pen tip coordinates
  const { strokeOffsets, penPosition, isWriting, activeIndex, isPenLifting } = useMemo(() => {
    let penPos: { x: number; y: number } | null = null;
    let writing = false;
    let lifting = false;
    let activeIdx = -1;

    // In anticipation mode, place pen tip at the starting anchor
    if (isAnticipating) {
      return {
        strokeOffsets: windows.map((w) => ({ offset: w.length, opacity: 0 })),
        penPosition: INITIAL_PEN_COORDINATES,
        isWriting: false,
        activeIndex: 0,
        isPenLifting: false,
      };
    }

    const offsets = windows.map((w, idx) => {
      if (currentTime <= w.startTime) {
        // Stroke has not started yet
        return { offset: w.length, opacity: 0 };
      } else if (currentTime >= w.strokeEndTime) {
        // Stroke is completely drawn
        return { offset: 0, opacity: 1 };
      } else {
        // Currently drawing this stroke
        activeIdx = idx;
        writing = true;
        const localT = (currentTime - w.startTime) / w.strokeDuration;

        // Custom calligraphic flourish easing on the final stroke
        let easedLocalT = localT;
        if (w.id === 'babcock-k-flourish') {
          if (localT < 0.55) {
            // Acceleration into the flourish loop
            easedLocalT = Math.pow(localT / 0.55, 1.3) * 0.60;
          } else {
            // Elegant deceleration through the grand horizontal tail
            const tailT = (localT - 0.55) / 0.45;
            easedLocalT = 0.60 + (1 - Math.pow(1 - tailT, 2.0)) * 0.40;
          }
        }

        const localDist = easedLocalT * w.length;
        const offset = Math.max(0, w.length - localDist);

        const pathEl = pathRefs.current[idx];
        if (pathEl && typeof pathEl.getPointAtLength === 'function') {
          try {
            const pt = pathEl.getPointAtLength(localDist);
            penPos = { x: pt.x, y: pt.y };
          } catch {
            // fallback
          }
        }
        return { offset, opacity: 1 };
      }
    });

    // Check natural pen-lift pause in the air between strokes
    if (!penPos && currentTime > 0 && currentTime < totalDuration) {
      for (let i = 0; i < windows.length - 1; i++) {
        const w = windows[i];
        if (currentTime > w.strokeEndTime && currentTime < w.windowEndTime) {
          activeIdx = i;
          lifting = true;
          const prevEl = pathRefs.current[i];
          const nextEl = pathRefs.current[i + 1];
          if (prevEl && nextEl) {
            try {
              const pEnd = prevEl.getPointAtLength(w.length);
              const pStart = nextEl.getPointAtLength(0);
              const pauseT = (currentTime - w.strokeEndTime) / w.pauseDuration;
              // Gentle natural hand lift arc in the air
              const arcY = -Math.sin(pauseT * Math.PI) * 12;
              penPos = {
                x: pEnd.x + (pStart.x - pEnd.x) * pauseT,
                y: pEnd.y + (pStart.y - pEnd.y) * pauseT + arcY,
              };
            } catch {
              // fallback
            }
          }
          break;
        }
      }
    }

    return {
      strokeOffsets: offsets,
      penPosition: penPos,
      isWriting: writing,
      activeIndex: activeIdx,
      isPenLifting: lifting,
    };
  }, [currentTime, totalDuration, windows, isAnticipating]);

  // Overall visibility and climax resonance metrics
  const isVisible =
    phase !== 'VOID' && phase !== 'AWAKENING' && phase !== 'EMERGENCE';

  // Climax starlight resonance pulse calculations
  const climaxT = Math.max(0, Math.min(1, climaxProgress));
  const climaxPulse =
    phase === 'CLIMAX'
      ? Math.sin(climaxT * Math.PI) * 0.45
      : 0;

  const auraBlur = 4.5 + climaxPulse * 9;
  const auraOpacity = 0.48 + climaxPulse * 0.35;
  const coreStrokeWidth = 1.45 + climaxPulse * 0.25;

  return (
    <div
      className="relative w-full max-w-[640px] mx-auto select-none pointer-events-none transition-all duration-700 ease-out will-change-transform z-20"
      style={{
        opacity: isVisible ? 1 : 0,
        transform:
          phase === 'EXITING'
            ? 'scale(1.04) translate3d(0, -6px, 0)'
            : 'scale(1) translate3d(0, 0, 0)',
        filter: isVisible ? 'drop-shadow(0 12px 28px rgba(0,0,0,0.85))' : 'none',
      }}
    >
      <svg
        viewBox="0 0 1150 360"
        fill="none"
        className="w-full h-auto overflow-visible select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          {/* Dynamic atmospheric aura that pulses at the Climax */}
          <filter id="sig-atmospheric-aura" x="-25%" y="-45%" width="150%" height="190%">
            <feGaussianBlur stdDeviation={auraBlur} result="blurDeep" />
            <feFlood floodColor="rgba(192, 132, 252, 0.55)" result="colorDeep" />
            <feComposite in="colorDeep" in2="blurDeep" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Luminous liquid ink body */}
          <filter id="sig-luminous-body" x="-15%" y="-30%" width="130%" height="160%">
            <feGaussianBlur stdDeviation="1.8" result="blurSoft" />
            <feFlood floodColor="rgba(243, 232, 255, 0.90)" result="colorSoft" />
            <feComposite in="colorSoft" in2="blurSoft" operator="in" result="glowSoft" />
            <feMerge>
              <feMergeNode in="glowSoft" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Micro-nib pen tip point of contact */}
          <filter id="pen-tip-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.0" result="blur" />
            <feFlood floodColor="rgba(216, 180, 254, 0.85)" result="color" />
            <feComposite in="color" in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Laser-pure core white gradient */}
          <linearGradient id="sig-core-white" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#faf5ff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* ── 1. ATMOSPHERIC AURA (Luminous field that responds at Climax) ── */}
        <g filter="url(#sig-atmospheric-aura)" opacity={auraOpacity}>
          {windows.map((stroke, idx) => {
            const { offset, opacity } = strokeOffsets[idx] || { offset: stroke.length, opacity: 0 };
            return (
              <path
                key={`aura-${stroke.id}`}
                d={stroke.pathD}
                stroke="rgba(192, 132, 252, 0.55)"
                strokeWidth={4.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={stroke.length}
                strokeDashoffset={offset}
                opacity={opacity}
                style={{
                  transition: isWriting && idx === activeIndex ? 'none' : 'opacity 0.2s ease',
                }}
              />
            );
          })}
        </g>

        {/* ── 2. LUMINOUS INK BODY (Fluid calligraphic body) ── */}
        <g
          filter="url(#sig-luminous-body)"
          stroke="rgba(245, 240, 255, 0.94)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {windows.map((stroke, idx) => {
            const { offset, opacity } = strokeOffsets[idx] || { offset: stroke.length, opacity: 0 };
            return (
              <path
                key={`body-${stroke.id}`}
                d={stroke.pathD}
                strokeWidth={2.5}
                strokeDasharray={stroke.length}
                strokeDashoffset={offset}
                opacity={opacity}
                style={{
                  transition: isWriting && idx === activeIndex ? 'none' : 'opacity 0.2s ease',
                }}
              />
            );
          })}
        </g>

        {/* ── 3. SHARP CRISP WHITE CORE (Laser-sharp liquid ink) ── */}
        <g stroke="url(#sig-core-white)" strokeLinecap="round" strokeLinejoin="round">
          {windows.map((stroke, idx) => {
            const { offset, opacity } = strokeOffsets[idx] || { offset: stroke.length, opacity: 0 };
            return (
              <path
                key={`core-${stroke.id}`}
                ref={(el) => {
                  pathRefs.current[idx] = el;
                }}
                d={stroke.pathD}
                strokeWidth={coreStrokeWidth}
                strokeDasharray={stroke.length}
                strokeDashoffset={offset}
                opacity={opacity}
                style={{
                  transition: isWriting && idx === activeIndex ? 'none' : 'opacity 0.2s ease',
                }}
              />
            );
          })}
        </g>

        {/* ── 4. REFINED PEN TIP (Anticipation bead & active writing micro-nib) ── */}
        {penPosition && (isAnticipating || (phase === 'SIGNING' && !isPenLifting)) && (
          <g
            transform={`translate(${penPosition.x}, ${penPosition.y})`}
            className="will-change-transform pointer-events-none transition-opacity duration-150"
            style={{
              opacity: isAnticipating ? anticipationOpacity : isPenLifting ? 0 : 1,
            }}
          >
            {/* Luminous starlight halo around the nib */}
            <circle
              r={isAnticipating ? 4.5 : 3.6}
              fill="rgba(216, 180, 254, 0.55)"
              filter="url(#pen-tip-glow)"
            />
            {/* Crisp white point of contact */}
            <circle
              r={isAnticipating ? 1.8 : 1.5}
              fill="#ffffff"
            />
          </g>
        )}

        {/* ── 5. CLIMAX RESONANT GLINTS (Subtle starlight sheen on crests) ── */}
        {(phase === 'CLIMAX' || phase === 'ARRIVAL') && (
          <g className="pointer-events-none transition-opacity duration-500" opacity={phase === 'CLIMAX' ? Math.min(1, climaxT * 1.5) : 0.75}>
            {/* Crest of R */}
            <circle cx={160} cy={70} r={1.6} fill="#ffffff" filter="url(#pen-tip-glow)" />
            {/* Crest of B */}
            <circle cx={565} cy={65} r={1.6} fill="#ffffff" filter="url(#pen-tip-glow)" />
          </g>
        )}
      </svg>
    </div>
  );
};
