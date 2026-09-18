import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { SIGNATURE_STROKE_DEFS, computeStrokeProgressWindows } from './signatureGeometry';
import { LoaderPhase } from './types';

interface CeremonySignatureProps {
  progress: number; // 0 to 1 during SIGNING phase
  phase: LoaderPhase;
  isMobile?: boolean;
}

export const CeremonySignature: React.FC<CeremonySignatureProps> = ({
  progress,
  phase,
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

  // Determine virtual handwriting time from phase and progress
  const currentTime = useMemo(() => {
    if (phase === 'INITIALIZING' || phase === 'ATMOSPHERE') return 0;
    if (phase === 'SIGNING') {
      // Smooth ease through the handwriting ceremony
      const clamped = Math.max(0, Math.min(1, progress));
      return clamped * totalDuration;
    }
    // Fully written during FLOWER_EMERGE, IDENTITY_SETTLE, READY, EXITING
    return totalDuration;
  }, [phase, progress, totalDuration]);

  // Compute stroke offsets & active pen tip coordinates
  const { strokeOffsets, penPosition, isWriting, activeIndex, isPenLifting } = useMemo(() => {
    let penPos: { x: number; y: number } | null = null;
    let writing = false;
    let lifting = false;
    let activeIdx = -1;

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
        
        // Final flourish custom deceleration at tail
        let easedLocalT = localT;
        if (w.id === 'babcock-k-flourish') {
          // Accelerate initially into flourish, then decelerate into a graceful tip
          if (localT < 0.6) {
            easedLocalT = Math.pow(localT / 0.6, 1.25) * 0.65;
          } else {
            const tailT = (localT - 0.6) / 0.4;
            easedLocalT = 0.65 + (1 - Math.pow(1 - tailT, 1.8)) * 0.35;
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

    // Check if currently in a natural pen-lift pause between strokes
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
              // Gentle natural hand lift arc in air
              const arcY = -Math.sin(pauseT * Math.PI) * 10;
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
  }, [currentTime, totalDuration, windows]);

  // Settling moment: signature is complete
  const isComplete = currentTime >= totalDuration || phase !== 'SIGNING';
  // Rare, structural glints appear subtly only after the signature has settled
  const showGlints = isComplete && phase !== 'INITIALIZING' && phase !== 'ATMOSPHERE';

  return (
    <div
      className="relative w-full max-w-[640px] mx-auto select-none pointer-events-none transition-all duration-700 ease-out will-change-transform"
      style={{
        opacity: phase === 'INITIALIZING' ? 0 : 1,
        transform: phase === 'EXITING' ? 'scale(1.03) translate3d(0, -4px, 0)' : 'scale(1) translate3d(0, 0, 0)',
      }}
    >
      <svg
        viewBox="0 0 1150 360"
        fill="none"
        className="w-full h-auto overflow-visible select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle atmospheric aura: restrained, ethereal violet glow */}
          <filter id="sig-atmospheric-aura" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="5.5" result="blurDeep" />
            <feFlood floodColor="rgba(168, 85, 247, 0.45)" result="colorDeep" />
            <feComposite in="colorDeep" in2="blurDeep" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft luminous body: refined, non-neon illumination */}
          <filter id="sig-luminous-body" x="-15%" y="-30%" width="130%" height="160%">
            <feGaussianBlur stdDeviation="1.8" result="blurSoft" />
            <feFlood floodColor="rgba(224, 210, 255, 0.85)" result="colorSoft" />
            <feComposite in="colorSoft" in2="blurSoft" operator="in" result="glowSoft" />
            <feMerge>
              <feMergeNode in="glowSoft" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Restrained pen tip micro-glow */}
          <filter id="pen-tip-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feFlood floodColor="rgba(192, 132, 252, 0.75)" result="color" />
            <feComposite in="color" in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle gradient along strokes */}
          <linearGradient id="sig-core-white" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#faf5ff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* ── 1. SUBTLE ATMOSPHERIC AURA (Restrained, delicate background depth) ── */}
        <g filter="url(#sig-atmospheric-aura)" opacity="0.45">
          {windows.map((stroke, idx) => {
            const { offset, opacity } = strokeOffsets[idx] || { offset: stroke.length, opacity: 0 };
            return (
              <path
                key={`aura-${stroke.id}`}
                d={stroke.pathD}
                stroke="rgba(168, 85, 247, 0.45)"
                strokeWidth={3.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={stroke.length}
                strokeDashoffset={offset}
                opacity={opacity}
                style={{
                  transition: isWriting && idx === activeIndex ? 'none' : 'opacity 0.25s ease',
                }}
              />
            );
          })}
        </g>

        {/* ── 2. SOFT LUMINOUS BODY (Liquid calligraphic ink body) ── */}
        <g filter="url(#sig-luminous-body)" stroke="rgba(242, 235, 255, 0.92)" strokeLinecap="round" strokeLinejoin="round">
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
                  transition: isWriting && idx === activeIndex ? 'none' : 'opacity 0.25s ease',
                }}
              />
            );
          })}
        </g>

        {/* ── 3. SHARP CRISP WHITE CORE (Laser-sharp calligraphic line) ── */}
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
                strokeWidth={1.4}
                strokeDasharray={stroke.length}
                strokeDashoffset={offset}
                opacity={opacity}
                style={{
                  transition: isWriting && idx === activeIndex ? 'none' : 'opacity 0.25s ease',
                }}
              />
            );
          })}
        </g>

        {/* ── 4. REFINED PEN TIP (Ink bead / micro-nib point of contact, hides during pen lifts) ── */}
        {penPosition && !isComplete && (
          <g
            transform={`translate(${penPosition.x}, ${penPosition.y})`}
            className="will-change-transform pointer-events-none transition-opacity duration-150"
            style={{ opacity: isPenLifting ? 0 : 1 }}
          >
            {/* Subtle local glow halo */}
            <circle
              r={3.5}
              fill="rgba(192, 132, 252, 0.45)"
              filter="url(#pen-tip-glow)"
            />
            {/* Tiny crisp point of contact */}
            <circle
              r={1.5}
              fill="#ffffff"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
