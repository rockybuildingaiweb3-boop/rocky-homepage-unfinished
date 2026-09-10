import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkItem, SiteData } from '../../types';
import { useRouter } from '../../router/RouterContext';
import { RxArrowLeft } from 'react-icons/rx';

export interface StudioPageResolverProps {
  workData: WorkItem[];
  siteData: SiteData | null;
}

/**
 * StudioPageResolver
 * 
 * Architectural routing boundary and layout orchestrator for Studio pages:
 * - Same-domain independent page resolution based on canonical URL path
 * - Decoupled from tabbed/nested container monoliths
 * - Supports full-page transitions with fluid motion easing
 * - Prepared for future standalone page implementations (Projects, Blog, Career)
 */
export const StudioPageResolver: React.FC<StudioPageResolverProps> = ({ siteData }) => {
  const { currentPath, navigate } = useRouter();

  // Normalize subroute for independent page resolution
  const subRoute = currentPath.replace(/^\/studio\/?/, '').split('/')[0] || '';

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-white flex flex-col justify-between selection:bg-purple-500/30">
      {/* Studio Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            data-cursor="pointer"
            className="group inline-flex items-center gap-2.5 text-xs sm:text-sm font-mono tracking-widest text-white/60 hover:text-white transition-colors duration-200 uppercase cursor-pointer"
            aria-label="Return to portfolio exhibition"
          >
            <RxArrowLeft className="text-base transition-transform duration-200 group-hover:-translate-x-1 text-purple-400" />
            <span>Return to Portfolio</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.24em] text-white/50">
              Studio Environment
            </span>
          </div>
        </div>
      </header>

      {/* Main Full-Page Transition Host */}
      <main className="flex-1 pt-24 sm:pt-32 pb-16 px-6 sm:px-10 max-w-7xl mx-auto w-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={subRoute || 'index'}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full py-12"
          >
            {/* Future independent page views plug in here via modular subRoute matching */}
            <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-8 sm:p-14 backdrop-blur-sm max-w-2xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs uppercase tracking-widest">
                Architecture Ready
              </div>
              <h1
                className="text-3xl sm:text-5xl font-light text-white tracking-tight lowercase"
                style={{ fontFamily: 'var(--title-font)' }}
              >
                studio architecture
              </h1>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light max-w-lg mx-auto">
                Independent page foundation established. Each studio room operates as an autonomous, full-page layout ready for future specialized implementations.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  data-cursor="pointer"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs tracking-wider uppercase hover:bg-purple-200 transition-colors duration-200 font-medium"
                >
                  Back to Showcase
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-6 text-center">
        <p className="font-mono text-[11px] text-white/30 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Rocky Babcock &middot; Studio Foundation
        </p>
      </footer>
    </div>
  );
};

export default StudioPageResolver;
