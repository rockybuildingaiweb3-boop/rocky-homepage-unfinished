import React, { useEffect } from 'react';

interface LoaderProps {
  progress: number;
  loadingDone: boolean;
  onFinish?: () => void;
}

export const Loader: React.FC<LoaderProps> = ({ progress, loadingDone, onFinish }) => {
  useEffect(() => {
    if (!loadingDone) return;
    const timeout = window.setTimeout(() => onFinish?.(), 500);
    return () => window.clearTimeout(timeout);
  }, [loadingDone, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black transition-opacity duration-500 ${
        loadingDone ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={loadingDone}
    >
      <div className="flex w-[min(72vw,320px)] flex-col items-center">
        <img
          src="/assets/imgs/signature.svg"
          alt="Rocky Babcock"
          className="mb-8 h-auto w-full"
          draggable={false}
        />
        <div className="w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-px bg-white transition-[width] duration-200"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
        <span className="mt-3 font-mono text-[10px] tracking-[0.2em] text-white/40">
          {Math.round(Math.max(0, Math.min(100, progress)))}%
        </span>
      </div>
    </div>
  );
};

export default Loader;
