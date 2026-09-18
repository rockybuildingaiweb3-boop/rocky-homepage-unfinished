import React from 'react';
import { LoaderPhase } from './types';

interface CeremonyProgressProps {
  displayProgress: number; // 0 to 100, strictly monotonic
  phase: LoaderPhase;
}

/**
 * CeremonyProgress
 *
 * Precision artistic instrumentation measuring the narrative ceremony:
 * - Subordinate to the art (doesn't fight signature or rose for attention)
 * - Monospaced uppercase tracking inspired by high-end digital art installations
 * - Never truncates, never wraps
 * - Deterministic milestone status matching the narrative acts exactly:
 *   VOID → AWAKENING → EMERGENCE → SIGNATURE → CONVERGENCE → CLIMAX → SILENCE → ARRIVAL
 */
export const CeremonyProgress: React.FC<CeremonyProgressProps> = ({
  displayProgress,
  phase,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(displayProgress)));

  // Narrative milestones aligned with percentage thresholds
  let statusText = '01 // THE VOID';
  if (clamped >= 12 && clamped < 28) {
    statusText = '02 // AWAKENING';
  } else if (clamped >= 28 && clamped < 48) {
    statusText = '03 // EMERGENCE';
  } else if (clamped >= 48 && clamped < 76) {
    statusText = '04 // SIGNATURE';
  } else if (clamped >= 76 && clamped < 82) {
    statusText = '05 // CONVERGENCE';
  } else if (clamped >= 82 && clamped < 96) {
    statusText = '06 // CLIMAX';
  } else if (clamped >= 96 && clamped < 99) {
    statusText = '07 // SILENCE';
  } else if (clamped >= 99) {
    statusText = '08 // ARRIVAL';
  }

  const isComplete = clamped >= 100 || phase === 'ARRIVAL' || phase === 'EXITING';
  const isHidden = phase === 'COMPLETE';

  return (
    <div
      className={`relative z-30 flex flex-col items-center mt-5 sm:mt-7 transition-all duration-700 ease-out select-none will-change-transform ${
        isHidden ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
      aria-label={`Ceremony progress: ${clamped}%`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* ── 1. CINEMATIC INSTRUMENTATION STATUS & TABULAR PERCENTAGE ── */}
      <div className="flex items-center justify-between w-60 sm:w-68 md:w-72 mb-2 px-0.5">
        <span
          className="text-[10px] sm:text-[11px] font-mono tracking-[0.24em] uppercase whitespace-nowrap transition-colors duration-500 select-none font-medium"
          style={{
            color: isComplete ? 'rgba(255, 255, 255, 0.95)' : 'rgba(216, 180, 254, 0.70)',
            textShadow: isComplete ? '0 0 12px rgba(168, 85, 247, 0.65)' : 'none',
          }}
        >
          {statusText}
        </span>

        <span
          className="text-xs sm:text-[13px] font-mono tracking-[0.2em] font-medium select-none ml-3 tabular-nums transition-colors duration-300"
          style={{
            color: isComplete ? '#ffffff' : 'rgba(255, 255, 255, 0.88)',
            textShadow: isComplete ? '0 0 14px rgba(255, 255, 255, 0.95)' : 'none',
          }}
        >
          {clamped}%
        </span>
      </div>

      {/* ── 2. REFINED MINIMALIST ARCHITECTURAL PROGRESS BAR ── */}
      <div className="relative w-60 sm:w-68 md:w-72 h-[2.5px] rounded-full bg-white/[0.10] overflow-visible border border-white/[0.06] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
        {/* Track Fill */}
        <div
          className="h-full rounded-full transition-[width] duration-150 ease-out relative will-change-transform"
          style={{
            width: `${clamped}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #a855f7 0%, #c084fc 60%, #ffffff 100%)'
              : 'linear-gradient(90deg, #7e22ce 0%, #a855f7 50%, #e9d5ff 100%)',
            boxShadow: isComplete
              ? '0 0 14px rgba(192, 132, 252, 0.85), 0 0 4px #ffffff'
              : '0 0 10px rgba(168, 85, 247, 0.55)',
          }}
        >
          {/* Subtle Leading-Edge Starlight Spark */}
          {clamped > 0 && clamped < 100 && (
            <div
              className="absolute -right-1 -top-[2px] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#ffffff,0_0_8px_#c084fc] will-change-transform pointer-events-none"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};
