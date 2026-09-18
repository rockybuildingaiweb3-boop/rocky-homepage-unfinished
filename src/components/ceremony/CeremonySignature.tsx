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
  convergenceProgress?: number; // 0 to 1 during CONVERGENCE phase
}

/**
 * CeremonySignature
 *
 * Authored handwritten signature with physical causality:
 * - Sits below the rose, complementing rather than covering the botanical anchor
 * - Light flows from the rose into the initial pen coordinate (65, 190)
 * - Authentic handwriting dynamics (variable stroke speeds, pen lifts, grand flourish)
 * - Refined ink materiality (crisp core + fluid ink body + restrained atmospheric falloff, NO generic neon)
 * - Act V Convergence: light ripples backward along strokes and flows upward into the rose
 * - Act V Climax: resonant micro-glints on crests
 */
export const CeremonySignature: React.FC<CeremonySignatureProps> = ({
  progress,
  phase,
  climaxProgress = 0,
  convergenceProgress = 0,
}) => {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [measuredLengths, setMeasuredLengths] = useState<number[]>(() =>
    SIGNATURE_STROKE_DEFS.map((s) => s.approxLength)
  );

  // Measure actual SVG geometry on mount for perfect stroke dash calculation
  useLayoutEffect(() => {
    const lengths = pathRefs.current.map((pathEl, idx) => {
      if (pathEl && typeof pathEl.getTotalLength === 'function') {
        try {
          const len = pathEl.getTotalLength();
          if (len > 10) return len;
        } catch {
          // fallback to approxLength
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

  // Causal light trace & handwriting timeline mapping
  const { currentTime, isBridgeActive, bridgeProgress, isAnticipating } = useMemo(() => {
    if (phase === 'VOID' || phase === 'AWAKENING' || phase === 'EMERGENCE') {
      return { currentTime: 0, isBridgeActive: false, bridgeProgress: 0, isAnticipating: false };
    }

    if (phase === 'SIGNING') {
      const clamped = Math.max(0, Math.min(1, progress));
      // First 5% is the light bridge traveling from rose into signature origin
      const BRIDGE_WINDOW = 0.05;
      if (clamped < BRIDGE_WINDOW) {
        const t = clamped / BRIDGE_WINDOW;
        return {
          currentTime: 0,
          isBridgeActive: true,
          bridgeProgress: t,
          isAnticipating: true,
        };
      }

      // Remaining 95% is handwriting travel
      const strokeT = (clamped - BRIDGE_WINDOW) / (1 - BRIDGE_WINDOW);
      return {
        currentTime: strokeT * totalDuration,
        isBridgeActive: false,
        bridgeProgress: 1,
        isAnticipating: false,
      };
    }

    // CONVERGENCE, CLIMAX, SILENCE, ARRIVAL, EXITING, COMPLETE: fully drawn
    return {
      currentTime: totalDuration,
      isBridgeActive: false,
      bridgeProgress: 1,
      isAnticipating: false,
    };
  }, [phase, progress, totalDuration]);

  // Compute stroke offsets & active pen tip coordinates
  const { strokeOffsets, penPosition, isWriting, activeIndex, isPenLifting } = useMemo(() => {
    let penPos: { x: number; y: number } | null = null;
    let writing = false;
    let lifting = false;
    let currentActiveIdx = -1;

    // During causal bridge, pen position travels from top-center (575, -15) to initial coordinate (65, 190)
    if (isBridgeActive) {
      const t = bridgeProgress;
      // Smooth trajectory from above to pen origin
      const startX = 575;
      const startY = -20;
      const endX = INITIAL_PEN_COORDINATES.x;
      const endY = INITIAL_PEN_COORDINATES.y;
      penPos = {
        x: startX + (endX - startX) * t,
        y: startY + (endY - startY) * t,
      };
      return {
        strokeOffsets: windows.map((w) => ({ offset: w.length, opacity: 0 })),
        penPosition: penPos,
        isWriting: false,
        activeIndex: -1,
        isPenLifting: false,
      };
    }

    const offsets = windows.map((stroke, idx) => {
      // Stroke hasn't started yet
      if (currentTime < stroke.startTime) {
        return { offset: stroke.length, opacity: 0 };
      }

      // Stroke is currently being written
      if (currentTime >= stroke.startTime && currentTime <= stroke.strokeEndTime) {
        writing = true;
        currentActiveIdx = idx;
        const strokeT = (currentTime - stroke.startTime) / stroke.strokeDuration;
        const currentLen = stroke.length * (1 - strokeT);

        if (phase === 'SIGNING') {
          const pathEl = pathRefs.current[idx];
          if (pathEl && typeof pathEl.getPointAtLength === 'function') {
            try {
              const drawnLen = stroke.length * strokeT;
              const pt = pathEl.getPointAtLength(Math.min(stroke.length, Math.max(0, drawnLen)));
              penPos = { x: pt.x, y: pt.y };
            } catch {
              penPos = INITIAL_PEN_COORDINATES;
            }
          }
        }

        return { offset: currentLen, opacity: 1 };
      }

      // Stroke has finished; in pen-lift pause before next stroke
      if (currentTime > stroke.strokeEndTime && currentTime < stroke.windowEndTime) {
        lifting = true;
        currentActiveIdx = idx;
        return { offset: 0, opacity: 1 };
      }

      // Stroke is fully written
      return { offset: 0, opacity: 1 };
    });

    return {
      strokeOffsets: offsets,
      penPosition: penPos,
      isWriting: writing,
      activeIndex: currentActiveIdx,
      isPenLifting: lifting,
    };
  }, [windows, currentTime, phase, isBridgeActive, bridgeProgress]);

  // Overall signature presence
  const isVisible =
    phase !== 'VOID' &&
    phase !== 'AWAKENING' &&
    phase !== 'EMERGENCE';

  const isExiting = phase === 'EXITING';

  // Convergence energy wave (ripples backwards along stroke from flourish to core)
  const convergenceWaveProgress = Math.max(0, Math.min(1, convergenceProgress));

  return (
    <div
      className={`relative w-full max-w-[440px] sm:max-w-[480px] aspect-[1150/360] flex items-center justify-center select-none will-change-transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        transform: isExiting
          ? 'scale(1.04) translate3d(0, -4px, 0)'
          : 'scale(1) translate3d(0, 0, 0)',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1150 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible pointer-events-none"
      >
        <defs>
          {/* Atmospheric subtle ink falloff (restrained, NOT heavy neon) */}
          <filter id="sig-atmospheric-falloff" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.0" result="blur" />
            <feFlood floodColor="rgba(192, 132, 252, 0.45)" result="color" />
            <feComposite in="color" in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Luminous fluid ink body filter */}
          <filter id="sig-fluid-body" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Micro-nib pen tip point of contact */}
          <filter id="pen-tip-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feFlood floodColor="rgba(233, 213, 255, 0.85)" result="color" />
            <feComposite in="color" in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Natural ink core gradient: warm ivory to pure white */}
          <linearGradient id="sig-ink-core" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fdf4ff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* ── 1. ATMOSPHERIC AURA (Subtle falloff layer) ── */}
        <g filter="url(#sig-atmospheric-falloff)" opacity={0.75}>
          {windows.map((stroke, idx) => {
            const { offset, opacity } = strokeOffsets[idx] || { offset: stroke.length, opacity: 0 };
            return (
              <path
                key={`aura-${stroke.id}`}
                d={stroke.pathD}
                stroke="rgba(192, 132, 252, 0.40)"
                strokeWidth={3.8}
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
          filter="url(#sig-fluid-body)"
          stroke="rgba(243, 232, 255, 0.95)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {windows.map((stroke, idx) => {
            const { offset, opacity } = strokeOffsets[idx] || { offset: stroke.length, opacity: 0 };
            return (
              <path
                key={`body-${stroke.id}`}
                d={stroke.pathD}
                strokeWidth={2.4}
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

        {/* ── 3. CRISP WHITE CORE (Ultra-fine calligraphic ink) ── */}
        <g stroke="url(#sig-ink-core)" strokeLinecap="round" strokeLinejoin="round">
          {windows.map((stroke, idx) => {
            const { offset, opacity } = strokeOffsets[idx] || { offset: stroke.length, opacity: 0 };
            return (
              <path
                key={`core-${stroke.id}`}
                ref={(el) => {
                  pathRefs.current[idx] = el;
                }}
                d={stroke.pathD}
                strokeWidth={1.8}
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

        {/* ── 4. REFINED PEN TIP (Active writing micro-nib & causal light bead) ── */}
        {penPosition && (isBridgeActive || isAnticipating || (phase === 'SIGNING' && !isPenLifting)) && (
          <g
            transform={`translate(${penPosition.x}, ${penPosition.y})`}
            className="will-change-transform pointer-events-none"
          >
            {/* Luminous starlight bead */}
            <circle
              r={isBridgeActive ? 4.2 : 3.2}
              fill="rgba(216, 180, 254, 0.65)"
              filter="url(#pen-tip-glow)"
            />
            {/* Crisp white point of contact */}
            <circle
              r={isBridgeActive ? 2.0 : 1.4}
              fill="#ffffff"
            />
          </g>
        )}

        {/* ── 5. CONVERGENCE ENERGY BEAM (Ascending to Rose) ── */}
        {phase === 'CONVERGENCE' && convergenceWaveProgress > 0 && (
          <g className="pointer-events-none">
            {/* Energy wave rushing from right flourish back to center */}
            <circle
              cx={1100 - convergenceWaveProgress * 525}
              cy={174 - Math.sin(convergenceWaveProgress * Math.PI) * 45}
              r={3.5}
              fill="#ffffff"
              filter="url(#pen-tip-glow)"
            />
            {/* Upward vertical energy beam connecting signature to rose base */}
            <line
              x1={575}
              y1={160}
              x2={575}
              y2={160 - convergenceWaveProgress * 180}
              stroke="rgba(244, 208, 254, 0.75)"
              strokeWidth={2}
              strokeDasharray="4 4"
              opacity={convergenceWaveProgress}
            />
          </g>
        )}

        {/* ── 6. CLIMAX RESONANT GLINTS (Subtle starlight sheen on crests) ── */}
        {(phase === 'CLIMAX' || phase === 'SILENCE' || phase === 'ARRIVAL') && (
          <g
            className="pointer-events-none transition-opacity duration-500"
            opacity={phase === 'CLIMAX' ? Math.min(1, climaxProgress * 1.5) : 0.65}
          >
            {/* Crest of R */}
            <circle cx={160} cy={70} r={1.5} fill="#ffffff" filter="url(#pen-tip-glow)" />
            {/* Crest of B */}
            <circle cx={565} cy={65} r={1.5} fill="#ffffff" filter="url(#pen-tip-glow)" />
          </g>
        )}
      </svg>
    </div>
  );
};
