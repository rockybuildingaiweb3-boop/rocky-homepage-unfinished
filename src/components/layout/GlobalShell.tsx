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

  return (
    <>
      {/* Interactive custom cursor - strictly hidden during ceremony, wakes up when Hero activates */}
      {ceremonyDone && <CursorDot isMobile={isMobile} />}

      {/* Ceremonial Opening Sequence */}
      {!ceremonyDone && (
        <Loader
          progress={progress}
          loadingDone={loadingDone}
          onAwakenHero={onAwakenHero}
          onFinish={() => setCeremonyDone(true)}
        />
      )}

      {/* Atmospheric 35mm Cinematic Film Grain Texture Layer */}
      <div className="cinematic-grain" aria-hidden="true" />

      {/* Atmospheric 3D Starfield & Spatial Depth Layer - persists across routes */}
      <ParticleBackground />

      {/* Page Content / Route Canvas */}
      {children}
    </>
  );
};
