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
      className={`relative z-20 flex flex-col items-center mt-6 sm:mt-8 select-none will-change-transform transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible
          ? 'opacity-100 translate-y-0 filter blur-0'
          : 'opacity-0 -translate-y-8 filter blur-[6px] pointer-events-none'
      }`}
      style={{
        transform: phase === 'EXITING' ? 'scale(1.05) translate3d(0, -4px, 0)' : undefined,
      }}
    >
      <h1
        className="text-center m-0 p-0 font-normal lowercase tracking-[-0.035em] text-white text-3xl sm:text-4xl md:text-5xl select-none"
        style={{
          fontFamily: 'var(--title-font)',
          textShadow:
            '0 0 24px rgba(255, 255, 255, 0.92), 0 0 44px rgba(168, 85, 247, 0.75), 0 4px 18px rgba(0, 0, 0, 0.95)',
        }}
      >
        rocky babcock
      </h1>
      <p className="mt-2 text-center text-[10px] sm:text-xs font-mono tracking-[0.24em] text-purple-200/70 lowercase select-none">
        creative technologist &amp; web developer
      </p>
    </div>
  );
};
