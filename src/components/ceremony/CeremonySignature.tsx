import React, { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { SIGNATURE_STROKE_DEFS, easeHandwriting } from './signatureGeometry';
import { LoaderPhase } from './types';

interface CeremonySignatureProps {
  progress: number; // 0 to 1 during SIGNING phase
  phase: LoaderPhase;
  isMobile?: boolean;
}

export const CeremonySignature: React.FC<CeremonySignatureProps> = ({
  progress,
  phase,
  isMobile = false,
}) => {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [measuredLengths, setMeasuredLengths] = useState<number[]>(() =>
    SIGNATURE_STROKE_DEFS.map((s) => s.approxLength)
  );

  // Measure actual SVG geometry when mounted
  useLayoutEffect(() => {
    const lengths = pathRefs.current.map((pathEl, idx) => {
      if (pathEl && typeof pathEl.getTotalLength === 'function') {
        try {
          const len = pathEl.getTotalLength();
          if (len > 10) return len;
        } catch {
          // fallback to approx
        }
      }
      return SIGNATURE_STROKE_DEFS[idx].approxLength;
    });
    setMeasuredLengths(lengths);
  }, []);

  // Compute total virtual distance including natural pen lift pauses
  const { strokeWindows, totalVirtualDistance } = useMemo(() => {
    let currentDistance = 0;
    const windows = SIGNATURE_STROKE_DEFS.map((stroke, idx) => {
      const len = measuredLengths[idx] || stroke.approxLength;
      const start = currentDistance;
      const strokeEnd = start + len;
      const windowEnd = strokeEnd + stroke.pauseAfter;
      currentDistance = windowEnd;
      return {
        id: stroke.id,
        index: idx,
        length: len,
        start,
        strokeEnd,
        windowEnd,
        pauseAfter: stroke.pauseAfter,
        pathD: stroke.pathD,
      };
    });
    return { strokeWindows: windows, totalVirtualDistance: currentDistance };
  }, [measuredLengths]);

  // Determine drawing state from phase and progress
  const effectiveProgress = useMemo(() => {
    if (phase === 'INITIALIZING' || phase === 'ATMOSPHERE') return 0;
    if (phase === 'SIGNING') return easeHandwriting(progress);
    // If FLOWER_EMERGE, IDENTITY_SETTLE, READY, EXITING: fully written
    return 1;
  }, [phase, progress]);

  // Current distance along virtual drawing timeline
  const currentVirtualDistance = effectiveProgress * totalVirtualDistance;

  // Compute stroke offsets & active pen tip coordinates
  const { strokeOffsets, penPosition, isWriting, activeIndex } = useMemo(() => {
    let penPos: { x: number; y: number } | null = null;
    let writing = false;
    let activeIdx = -1;

    const offsets = strokeWindows.map((w, idx) => {
      if (currentVirtualDistance <= w.start) {
        // Stroke has not started yet
        return { offset: w.length, opacity: 0 };
      } else if (currentVirtualDistance >= w.strokeEnd) {
        // Stroke is completely drawn
        return { offset: 0, opacity: 1 };
      } else {
        // Currently drawing this stroke
        activeIdx = idx;
        writing = true;
        const localDist = currentVirtualDistance - w.start;
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

    // Check if in a pen-lift pause between strokes
    if (!penPos && effectiveProgress > 0 && effectiveProgress < 1) {
      for (let i = 0; i < strokeWindows.length - 1; i++) {
        const w = strokeWindows[i];
        if (currentVirtualDistance > w.strokeEnd && currentVirtualDistance < w.windowEnd) {
          activeIdx = i;
          const prevEl = pathRefs.current[i];
          const nextEl = pathRefs.current[i + 1];
          if (prevEl && nextEl) {
            try {
              const pEnd = prevEl.getPointAtLength(w.length);
              const pStart = nextEl.getPointAtLength(0);
              const pauseT = (currentVirtualDistance - w.strokeEnd) / w.pauseAfter;
              // Smooth air glide with slight arc
              const arcY = -Math.sin(pauseT * Math.PI) * 14;
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

    // Default fallback pen position if writing but point sampling failed
    if (!penPos && writing && activeIdx >= 0) {
      penPos = { x: 65 + effectiveProgress * 1035, y: 190 };
    }

    return {
      strokeOffsets: offsets,
      penPosition: penPos,
      isWriting: writing,
      activeIndex: activeIdx,
    };
  }, [currentVirtualDistance, effectiveProgress, strokeWindows]);

  const isComplete = effectiveProgress >= 0.999 || phase !== 'SIGNING';
  const showGlints = effectiveProgress > 0.92 || phase !== 'SIGNING';

  return (
    <div
      className="relative w-full max-w-[620px] mx-auto select-none pointer-events-none transition-all duration-700 ease-out will-change-transform"
      style={{
        opacity: phase === 'INITIALIZING' ? 0 : 1,
        transform: phase === 'EXITING' ? 'scale(1.04) translate3d(0, -6px, 0)' : 'scale(1) translate3d(0, 0, 0)',
      }}
    >
      <svg
        viewBox="0 0 1150 360"
        fill="none"
        className="w-full h-auto overflow-visible select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          {/* Celestial starlight glow matching the brand signature */}
          <filter id="super-radiant-glow" x="-30%" y="-50%" width="160%" height="200%">
            <feGaussianBlur stdDeviation="14" result="blurDeep" />
            <feFlood floodColor="rgba(168, 85, 247, 0.72)" result="colorDeep" />
            <feComposite in="colorDeep" in2="blurDeep" operator="in" result="glowDeep" />

            <feGaussianBlur stdDeviation="6" result="blurMid" />
            <feFlood floodColor="rgba(199, 210, 254, 0.92)" result="colorMid" />
            <feComposite in="colorMid" in2="blurMid" operator="in" result="glowMid" />

            <feGaussianBlur stdDeviation="2.5" result="blurTight" />
            <feFlood floodColor="rgba(245, 243, 255, 1.0)" result="colorTight" />
            <feComposite in="colorTight" in2="blurTight" operator="in" result="glowTight" />

            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0, 0, 0, 0.9)" />

            <feMerge>
              <feMergeNode in="glowDeep" />
              <feMergeNode in="glowMid" />
              <feMergeNode in="glowTight" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Starlight pen tip diamond flare filter */}
          <filter id="pen-tip-flare" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="#c084fc" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="radiant-core-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#f5f3ff" />
            <stop offset="70%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* 1. DEEP BLOOM UNDERLAYER (Radiant purple/cyan starlight aura) */}
        <g opacity="0.88" filter="url(#super-radiant-glow)">
          {strokeWindows.map((stroke, idx) => {
            const isWordRocky = idx < 6;
            const strokeWidth = isWordRocky ? 4.4 : 4.8;
            const { offset, opacity } = strokeOffsets[idx] || { offset: stroke.length, opacity: 0 };
            return (
              <path
                key={`bloom-${stroke.id}`}
                d={stroke.pathD}
                stroke="url(#radiant-core-grad)"
                strokeWidth={strokeWidth}
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

        {/* 2. PURE BRILLIANT WHITE ULTRA-SHARP CORE (Laser-sharp foreground stroke) */}
        <g stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round">
          {strokeWindows.map((stroke, idx) => {
            const isWordRocky = idx < 6;
            const strokeWidth = isWordRocky ? 2.4 : 2.6;
            const { offset, opacity } = strokeOffsets[idx] || { offset: stroke.length, opacity: 0 };
            return (
              <path
                key={`core-${stroke.id}`}
                ref={(el) => {
                  pathRefs.current[idx] = el;
                }}
                d={stroke.pathD}
                strokeWidth={strokeWidth}
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

        {/* 3. DYNAMIC STARLIGHT PEN TIP FLARE (Follows real path coordinates as written) */}
        {penPosition && !isComplete && (
          <g
            transform={`translate(${penPosition.x}, ${penPosition.y})`}
            className="will-change-transform pointer-events-none"
          >
            {/* Luminous diamond flare */}
            <path
              d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"
              fill="#ffffff"
              filter="url(#pen-tip-flare)"
              opacity="0.95"
            />
            {/* Inner hot white core */}
            <circle r="3.2" fill="#ffffff" />
            {/* Ambient starlight aura */}
            <circle
              r="12"
              fill="none"
              stroke="rgba(192, 132, 252, 0.6)"
              strokeWidth="1.2"
              className="animate-ping"
            />
          </g>
        )}

        {/* 4. SPECULAR STARLIGHT GLINTS ON APICES (Flare as signature completes) */}
        {showGlints && (
          <g className="transition-opacity duration-700 ease-out" style={{ opacity: showGlints ? 1 : 0 }}>
            {/* Glint on R peak */}
            <g transform="translate(160, 68) scale(0.65)">
              <path
                fill="#ffffff"
                filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 16px #a855f7)"
                d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"
                className="animate-pulse"
              />
            </g>
            {/* Glint on B crest */}
            <g transform="translate(615, 128) scale(0.55)">
              <path
                fill="#ffffff"
                filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 14px #38bdf8)"
                d="M 0 -16 Q 0 0 16 0 Q 0 0 0 16 Q 0 0 -16 0 Q 0 0 0 -16 Z"
                className="animate-pulse"
                style={{ animationDelay: '150ms' }}
              />
            </g>
            {/* Glint on tail flourish tip */}
            <g transform="translate(1095, 174) scale(0.6)">
              <path
                fill="#ffffff"
                filter="drop-shadow(0 0 8px #ffffff) drop-shadow(0 0 18px #c084fc)"
                d="M 0 -18 Q 0 0 18 0 Q 0 0 0 18 Q 0 0 -18 0 Q 0 0 0 -18 Z"
                className="animate-pulse"
                style={{ animationDelay: '300ms' }}
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
