import React from 'react';
import { RxArrowLeft } from 'react-icons/rx';
import { useRouter } from '../../router/RouterContext';

/**
 * StudioPageResolver
 * 
 * Minimal canonical destination for the /studio route.
 * Strictly decoupled from speculative page grids, mock blogs, and fake case studies.
 */
export const StudioPageResolver: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#050508] text-white flex flex-col justify-between selection:bg-purple-500/30">
      {/* Studio Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            data-cursor="pointer"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-mono tracking-widest text-white/60 hover:text-white transition-colors duration-200 uppercase cursor-pointer"
            aria-label="Return to portfolio exhibition"
          >
            <RxArrowLeft className="text-base transition-transform duration-200 group-hover:-translate-x-1 text-purple-400" />
            <span>Exhibition</span>
          </button>

          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
              Studio
            </span>
          </div>
        </div>
      </header>

      {/* Main Minimal Studio Chamber */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs uppercase tracking-widest">
          Creative Studio
        </div>
        <h1
          className="text-4xl sm:text-6xl font-light text-white tracking-tight lowercase"
          style={{ fontFamily: 'var(--title-font)' }}
        >
          studio building
        </h1>
        <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
          Autonomous creative engineering studio space. Dedicated content chambers currently in development.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            data-cursor="pointer"
            className="px-6 py-2.5 rounded-full border border-white/20 text-xs font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer"
          >
            &larr; Return to Exhibition
          </button>
        </div>
      </main>

      {/* Minimal Colophon Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-6 text-center">
        <p className="font-mono text-[11px] text-white/30 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Rocky Babcock &middot; Studio
        </p>
      </footer>
    </div>
  );
};

export default StudioPageResolver;
