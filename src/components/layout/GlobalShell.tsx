import React, { useState } from 'react';
import { Loader } from './Loader';
import { ParticleBackground } from '../ui';
import { CursorDot } from '../../features/cursor';

interface GlobalShellProps {
  progress: number;
  loadingDone: boolean;
  isMobile: boolean;
  onAwakenHero?: () => void;
  children: React.ReactNode;
}

/**
 * GlobalShell
 * 
 * Central coordinator for application-wide persistent systems:
 * - Interactive custom cursor (wakes up cleanly once Hero is active)
 * - Atmospheric 35mm cinematic film grain texture layer
 * - Atmospheric 3D starfield & cosmic depth layer (ParticleBackground)
 * - Ceremonial opening loader (isolated cinematic opening ceremony)
 */
export const GlobalShell: React.FC<GlobalShellProps> = ({
  progress,
  loadingDone,
  isMobile,
  onAwakenHero,
  children,
}) => {
  const [ceremonyDone, setCeremonyDone] = useState<boolean>(false);
  const [heroAwakened, setHeroAwakened] = useState<boolean>(false);

  const handleAwakenHero = () => {
    setHeroAwakened(true);
    if (onAwakenHero) onAwakenHero();
  };

  const handleFinish = () => {
    setCeremonyDone(true);
  };

  return (
    <>
      {/* Interactive custom cursor - strictly hidden during ceremony, wakes up when Hero activates */}
      {ceremonyDone && <CursorDot isMobile={isMobile} />}

      {/* Ceremonial Opening Sequence - sealed visual world with total viewport ownership */}
      {!ceremonyDone && (
        <Loader
          progress={progress}
          loadingDone={loadingDone}
          onAwakenHero={handleAwakenHero}
          onFinish={handleFinish}
        />
      )}

      {/* Atmospheric 35mm Cinematic Film Grain Texture Layer */}
      <div className="cinematic-grain" aria-hidden="true" />

      {/* Atmospheric 3D Starfield & Spatial Depth Layer - persists across routes */}
      <ParticleBackground />

      {/* Page Content / Route Canvas - strictly suppressed while loader is active, revealed smoothly upon exit */}
      <div
        className={`w-full transition-opacity duration-1000 ease-out ${
          heroAwakened ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'
        }`}
        style={{
          visibility: heroAwakened ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </>
  );
};
