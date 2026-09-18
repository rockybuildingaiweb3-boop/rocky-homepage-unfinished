import React from 'react';
import { LoaderPhase } from './types';

interface CeremonyIdentityProps {
  phase: LoaderPhase;
  climaxProgress?: number;
}

/**
 * CeremonyIdentity
 *
 * Sits below the handwritten signature in the visual hierarchy:
 * 1. Rose (visual anchor)
 * 2. Signature
 * 3. Atmosphere
 * 4. Identity text ("rocky babcock / creative technologist & web developer")
 * 5. Progress telemetry
 *
 * Awakens during ACT V (CLIMAX) and settles into crystal focus during SILENCE and ARRIVAL.
 */
export const CeremonyIdentity: React.FC<CeremonyIdentityProps> = ({
  phase,
  climaxProgress = 0,
}) => {
  const isVisible =
    phase === 'CLIMAX' ||
    phase === 'SILENCE' ||
    phase === 'ARRIVAL' ||
    phase === 'EXITING';

  return (
    <div
      className={`relative z-20 flex flex-col items-center mt-3 sm:mt-4 select-none will-change-transform transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? 'opacity-100 translate-y-0 filter blur-0'
          : 'opacity-0 translate-y-3 filter blur-[5px] pointer-events-none'
      }`}
      style={{
        transform:
          phase === 'EXITING'
            ? 'scale(1.03) translate3d(0, -4px, 0)'
            : 'scale(1) translate3d(0, 0, 0)',
      }}
    >
      <h1
        className="text-center m-0 p-0 font-normal lowercase tracking-[-0.015em] text-white text-2xl sm:text-3xl md:text-4xl select-none"
        style={{
          fontFamily: 'var(--title-font)',
          textShadow:
            '0 2px 14px rgba(0, 0, 0, 0.95), 0 0 24px rgba(216, 180, 254, 0.35)',
        }}
      >
        rocky babcock
      </h1>
      <p className="mt-1 text-center text-[10px] sm:text-[11px] font-mono tracking-[0.22em] text-purple-200/80 uppercase select-none">
        creative technologist &amp; web developer
      </p>
    </div>
  );
};
