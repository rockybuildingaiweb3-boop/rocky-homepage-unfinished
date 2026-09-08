import React, { useEffect, useState } from 'react';

interface LoaderProps {
  progress: number;
  loadingDone: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ progress, loadingDone }) => {
  const [overlayFade, setOverlayFade] = useState<boolean>(false);

  useEffect(() => {
    if (loadingDone) {
      // Step 1: Progress line wipes to right: 0; width: 0; transition: width 0.8s ease
      // Step 2: Dark overlay then fades out seamlessly over 700ms to awaken the homepage
      const fadeTimer = setTimeout(() => {
        setOverlayFade(true);
      }, 800);
      return () => clearTimeout(fadeTimer);
    }
  }, [loadingDone]);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen flex flex-col justify-center items-center z-[1000] bg-[#222224] transition-opacity duration-700 ease-in-out ${
        overlayFade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden={overlayFade}
    >
      <div className="relative block h-[2px] w-80 max-w-[80vw] overflow-hidden">
        {/* Track subtle line */}
        <div
          className={`absolute top-0 left-0 h-full w-full bg-white/10 transition-opacity duration-500 ${
            loadingDone ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Minimalist horizontal progress bar:
            - While loading: expands left-to-right to progress%
            - When loadingDone: wipes right: 0; width: 0; transition: width 0.8s ease */}
        <div
          className="absolute top-0 h-full bg-white"
          style={{
            width: loadingDone ? '0%' : `${progress}%`,
            left: loadingDone ? 'auto' : 0,
            right: 0,
            transition: loadingDone
              ? 'width 0.8s ease'
              : 'width 0.35s ease-out',
          }}
        />
      </div>
    </div>
  );
};


