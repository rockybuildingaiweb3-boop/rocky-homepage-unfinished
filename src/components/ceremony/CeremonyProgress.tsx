import React from 'react';
import { LoaderPhase } from './types';

interface CeremonyProgressProps {
  displayProgress: number; // 0 to 100, strictly monotonic
  phase: LoaderPhase;
}

export const CeremonyProgress: React.FC<CeremonyProgressProps> = ({ displayProgress, phase }) => {
  const clamped = Math.max(0, Math.min(100, Math.round(displayProgress)));

  // Deterministic milestone labels strictly aligned with progress ranges (never reset)
  let statusText = '01 // INITIALIZING';
  if (clamped >= 15 && clamped < 35) {
    statusText = '02 // ATMOSPHERE';
  } else if (clamped >= 35 && clamped < 70) {
    statusText = '03 // SIGNATURE';
  } else if (clamped >= 70 && clamped < 90) {
    statusText = '04 // AWAKENING';
  } else if (clamped >= 90) {
    statusText = '05 // ARRIVAL';
  }

  const isComplete = clamped >= 100 || phase === 'READY' || phase === 'EXITING';
  const isHidden = phase === 'COMPLETE';

  return (
    <div
      className={`relative z-30 flex flex-col items-center mt-7 sm:mt-9 transition-all duration-700 ease-out select-none will-change-transform ${
        isHidden ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
      aria-label={`Ceremony progress: ${clamped}%`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* 1. Monospace Percentage & Phase Status — Guaranteed Never Truncated */}
      <div className="flex items-center justify-between w-64 sm:w-72 md:w-80 mb-2.5 px-0.5">
        <span
          className="text-[11px] sm:text-xs font-mono tracking-[0.22em] uppercase whitespace-nowrap transition-colors duration-500 select-none font-medium"
          style={{
            color: isComplete ? 'rgba(255, 255, 255, 0.95)' : 'rgba(216, 180, 254, 0.75)',
            textShadow: isComplete ? '0 0 12px rgba(168, 85, 247, 0.65)' : 'none',
          }}
        >
          {statusText}
        </span>

        <span
          className="text-xs sm:text-[13px] font-mono tracking-[0.2em] font-semibold select-none ml-3 tabular-nums transition-colors duration-300"
          style={{
            color: isComplete ? '#ffffff' : 'rgba(255, 255, 255, 0.92)',
            textShadow: isComplete ? '0 0 14px rgba(255, 255, 255, 0.95)' : 'none',
          }}
        >
          {clamped}%
        </span>
      </div>

      {/* 2. High-Visibility Architectural Progress Bar */}
      <div className="relative w-64 sm:w-72 md:w-80 h-[3.5px] rounded-full bg-white/[0.12] overflow-visible border border-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
        {/* Track Fill */}
        <div
          className="h-full rounded-full transition-[width] duration-150 ease-out relative will-change-transform"
          style={{
            width: `${clamped}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #c084fc 0%, #a855f7 50%, #ffffff 100%)'
              : 'linear-gradient(90deg, #9333ea 0%, #c084fc 65%, #ffffff 100%)',
            boxShadow: isComplete
              ? '0 0 16px rgba(192, 132, 252, 0.9), 0 0 5px #ffffff'
              : '0 0 12px rgba(168, 85, 247, 0.6), 0 0 2px rgba(255, 255, 255, 0.8)',
          }}
        >
          {/* Leading-Edge Starlight Spark Bead */}
          {clamped > 0 && clamped < 100 && (
            <div
              className="absolute -right-1.5 -top-[3.5px] w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_#ffffff,0_0_14px_#c084fc] will-change-transform pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};
