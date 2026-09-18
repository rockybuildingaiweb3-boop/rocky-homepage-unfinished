import React from 'react';
import { LoaderPhase } from './types';

interface CeremonyProgressProps {
  displayProgress: number; // 0 to 100, guaranteed monotonic
  phase: LoaderPhase;
}

export const CeremonyProgress: React.FC<CeremonyProgressProps> = ({ displayProgress, phase }) => {
  const clamped = Math.max(0, Math.min(100, Math.round(displayProgress)));

  // Milestone label corresponding to ceremony phases
  let statusText = '01 // CALIBRATING ATMOSPHERE';
  if (phase === 'SIGNING') {
    statusText = '02 // ENGRAVING SIGNATURE';
  } else if (phase === 'FLOWER_EMERGE') {
    statusText = '03 // AWAKENING BOTANICAL FORM';
  } else if (phase === 'IDENTITY_SETTLE') {
    statusText = '04 // HARMONIZING IDENTITY';
  } else if (phase === 'READY' || phase === 'EXITING' || phase === 'COMPLETE' || clamped >= 100) {
    statusText = '05 // EXPERIENCE READY';
  }

  const isComplete = clamped >= 100 || phase === 'READY' || phase === 'EXITING';
  const isHidden = phase === 'INITIALIZING' || phase === 'COMPLETE';

  return (
    <div
      className={`relative z-30 flex flex-col items-center mt-8 sm:mt-10 transition-all duration-700 ease-out select-none will-change-transform ${
        isHidden ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
      aria-label={`Ceremony progress: ${clamped}%`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* 1. Monospace Percentage & Phase Status */}
      <div className="flex items-center justify-between w-56 sm:w-64 md:w-72 mb-2.5 px-0.5">
        <span
          className="text-[10px] sm:text-[11px] font-mono tracking-[0.24em] transition-colors duration-500 select-none uppercase truncate max-w-[200px]"
          style={{
            color: isComplete ? 'rgba(255, 255, 255, 0.95)' : 'rgba(224, 210, 255, 0.65)',
            textShadow: isComplete ? '0 0 12px rgba(168, 85, 247, 0.6)' : 'none',
          }}
        >
          {statusText}
        </span>

        <span
          className="text-xs sm:text-[13px] font-mono tracking-[0.22em] font-medium select-none ml-2 transition-colors duration-300"
          style={{
            color: isComplete ? '#ffffff' : 'rgba(255, 255, 255, 0.88)',
            textShadow: isComplete ? '0 0 14px rgba(255, 255, 255, 0.9)' : 'none',
          }}
        >
          {clamped}%
        </span>
      </div>

      {/* 2. Architectural Horizontal Progress Bar */}
      <div className="relative w-56 sm:w-64 md:w-72 h-[2px] rounded-full bg-white/[0.08] overflow-visible border border-white/[0.04]">
        {/* Track Fill */}
        <div
          className="h-full rounded-full transition-all duration-150 ease-out relative will-change-transform"
          style={{
            width: `${clamped}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #c084fc 0%, #a855f7 50%, #ffffff 100%)'
              : 'linear-gradient(90deg, #9333ea 0%, #c084fc 60%, #ffffff 100%)',
            boxShadow: isComplete
              ? '0 0 16px rgba(192, 132, 252, 0.85), 0 0 4px #ffffff'
              : '0 0 10px rgba(168, 85, 247, 0.5)',
          }}
        >
          {/* Leading-Edge Starlight Spark */}
          {clamped > 1 && clamped < 100 && (
            <div
              className="absolute -right-1 -top-[3px] w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_16px_#c084fc] will-change-transform pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};
