import React from 'react';
import { LoaderPhase } from './types';

interface CeremonyIdentityProps {
  phase: LoaderPhase;
}

export const CeremonyIdentity: React.FC<CeremonyIdentityProps> = ({ phase }) => {
  const isVisible =
    phase === 'IDENTITY_SETTLE' ||
    phase === 'READY' ||
    phase === 'EXITING';

  return (
    <div
      className={`relative z-20 flex flex-col items-center mt-5 sm:mt-7 select-none will-change-transform transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible
          ? 'opacity-100 translate-y-0 filter blur-0'
          : 'opacity-0 translate-y-3 filter blur-[4px] pointer-events-none'
      }`}
      style={{
        transform: phase === 'EXITING' ? 'scale(1.04) translate3d(0, -4px, 0)' : undefined,
      }}
    >
      <h1
        className="text-center m-0 p-0 font-normal lowercase tracking-[-0.015em] text-white text-3xl sm:text-4xl md:text-5xl select-none"
        style={{
          fontFamily: 'var(--title-font)',
          textShadow:
            '0 2px 14px rgba(0, 0, 0, 0.9), 0 0 24px rgba(216, 180, 254, 0.35)',
        }}
      >
        rocky babcock
      </h1>
      <p className="mt-1.5 text-center text-[11px] sm:text-xs font-mono tracking-[0.22em] text-purple-200/75 lowercase select-none">
        creative technologist &amp; web developer
      </p>
    </div>
  );
};
