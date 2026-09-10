import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RxArrowLeft } from 'react-icons/rx';
import { useRouter } from '../../../router/RouterContext';

export interface StudioLayoutProps {
  children: React.ReactNode;
}

/**
 * StudioLayout
 * 
 * Autonomous layout shell for the Studio universe:
 * - Dedicated studio top header with exhibition return and room breadcrumbs
 * - Chamber status indicator
 * - Full-page enter/exit motion transition orchestrator
 * - Colophon footer
 * - Completely decoupled from homepage WebGL slider and planet systems
 */
export const StudioLayout: React.FC<StudioLayoutProps> = ({ children }) => {
  const { currentRoute, navigate } = useRouter();

  const chamberLabel = (() => {
    switch (currentRoute.family) {
      case 'case-study':
        return 'Case Study';
      case 'editorial':
        return 'Editorial';
      case 'career':
        return 'Career Dossier';
      case 'not-found':
        return '404 Chamber';
      default:
        return 'Studio Hub';
    }
  })();

  return (
    <div className="relative min-h-screen w-full bg-[#050508] text-white flex flex-col justify-between selection:bg-purple-500/30">
      {/* Studio Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050508]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
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

            {currentRoute.family !== 'studio-hub' && (
              <>
                <span className="text-white/20">/</span>
                <button
                  type="button"
                  onClick={() => navigate('/studio')}
                  data-cursor="pointer"
                  className="text-xs sm:text-sm font-mono tracking-widest text-white/60 hover:text-white transition-colors duration-200 uppercase cursor-pointer"
                >
                  Studio Hub
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.24em] text-white/50">
              {chamberLabel}
            </span>
          </div>
        </div>
      </header>

      {/* Full-Page Motion Transition Host */}
      <main className="flex-1 pt-24 sm:pt-32 pb-16 px-6 sm:px-10 max-w-7xl mx-auto w-full flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute.path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimal Colophon Footer */}
      <footer className="border-t border-white/[0.06] py-6 px-6 text-center">
        <p className="font-mono text-[11px] text-white/30 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Rocky Babcock &middot; Studio Foundation
        </p>
      </footer>
    </div>
  );
};

export default StudioLayout;
