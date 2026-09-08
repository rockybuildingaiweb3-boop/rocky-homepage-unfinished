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
      {/* Refined Glowing Gradient Progress Bar Container */}
      <div className="relative flex flex-col items-center">
        {/* Track bar */}
        <div className="relative block h-[3px] w-80 max-w-[80vw] rounded-full overflow-visible bg-white/[0.08] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
          {/* Subtle ambient track glow */}
          <div
            className={`absolute inset-0 rounded-full bg-indigo-500/10 transition-opacity duration-500 ${
              loadingDone ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Glowing Gradient Progress Bar */}
          <div
            className="absolute top-0 h-full rounded-full transition-all"
            style={{
              width: loadingDone ? '0%' : `${progress}%`,
              left: loadingDone ? 'auto' : 0,
              right: 0,
              background:
                'linear-gradient(90deg, rgba(79, 70, 229, 0.8) 0%, rgba(168, 85, 247, 0.95) 45%, rgba(192, 132, 252, 1) 85%, #ffffff 100%)',
              boxShadow:
                '0 0 14px 1px rgba(168, 85, 247, 0.75), 0 0 26px 3px rgba(99, 102, 241, 0.35), 0 0 4px 1px rgba(255, 255, 255, 0.9)',
              transition: loadingDone
                ? 'width 0.8s cubic-bezier(0.65, 0, 0.35, 1)'
                : 'width 0.35s ease-out',
            }}
          >
            {/* Leading photon flare (spark on the moving tip) */}
            {!loadingDone && progress > 2 && (
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-white"
                style={{
                  boxShadow:
                    '0 0 8px 2px #ffffff, 0 0 16px 4px rgba(192, 132, 252, 0.9), 0 0 24px 6px rgba(99, 102, 241, 0.6)',
                }}
              />
            )}
          </div>
        </div>

        {/* Minimalist Tech / Editorial Status */}
        <div
          className={`flex items-center justify-between w-80 max-w-[80vw] mt-4 transition-opacity duration-500 ${
            loadingDone ? 'opacity-0' : 'opacity-60'
          }`}
        >
          <span className="text-[10px] tracking-[0.24em] font-mono text-white/50 lowercase">
            loading archive
          </span>
          <span className="text-[10px] tracking-[0.2em] font-mono text-white/70 font-medium">
            {Math.min(100, Math.round(progress))}%
          </span>
        </div>
      </div>
    </div>
  );
};


