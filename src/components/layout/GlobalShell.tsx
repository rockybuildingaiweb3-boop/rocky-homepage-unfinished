import React, { useState } from 'react';
import { Loader } from './Loader';
import { CursorDot } from '../../features/cursor';

interface GlobalShellProps {
  progress: number;
  loadingDone: boolean;
  isMobile: boolean;
  children: React.ReactNode;
}

export const GlobalShell: React.FC<GlobalShellProps> = ({
  progress,
  loadingDone,
  isMobile,
  children,
}) => {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <>
      <CursorDot isMobile={isMobile} />

      {!loaderDone && (
        <Loader
          progress={progress}
          loadingDone={loadingDone}
          onFinish={() => setLoaderDone(true)}
        />
      )}

      <div className="cinematic-grain" aria-hidden="true" />
      {children}
    </>
  );
};
