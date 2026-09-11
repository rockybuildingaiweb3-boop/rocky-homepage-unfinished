import React from 'react';

interface StudioProgressBarProps {
  sliderProgress: number;
  currentSlideIndex: number;
  totalItems: number;
  hidden: boolean;
}

export const StudioProgressBar: React.FC<StudioProgressBarProps> = ({
  sliderProgress,
  currentSlideIndex,
  totalItems,
  hidden,
}) => {
  return (
    <div
      className={`w-full max-w-7xl mx-auto px-6 sm:px-12 mb-6 sm:mb-8 flex items-center justify-between select-none transition-all duration-500 ${
        hidden ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0'
      }`}
      aria-hidden={hidden}
    >
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <span className="font-mono text-xs text-white/50 tracking-widest font-light">01</span>
        <span className="hidden sm:inline-block w-4 h-[1px] bg-white/20" />
        <span className="font-mono text-[11px] sm:text-xs tracking-[0.24em] uppercase text-white/40">
          [ ↔ drag to explore ]
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative w-28 sm:w-44 md:w-60 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-purple-500 via-fuchsia-400 to-white transition-all duration-75 ease-out"
            style={{
              width: `${Math.max(10, sliderProgress * 100)}%`,
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.7), 0 0 3px #ffffff',
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3.5">
        <span className="font-mono text-[11px] sm:text-xs tracking-[0.2em] text-white/75 font-medium">
          {currentSlideIndex < 9 ? `0${currentSlideIndex + 1}` : currentSlideIndex + 1}
          <span className="text-white/30 mx-1.5 font-light">/</span>
          {totalItems < 10 ? `0${totalItems}` : totalItems}
        </span>
      </div>
    </div>
  );
};
