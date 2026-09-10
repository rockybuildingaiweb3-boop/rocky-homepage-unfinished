import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WorkItem, SiteData } from '../../types';
import { useRouter } from '../../router/RouterContext';
import { RxArrowLeft, RxArrowTopRight } from 'react-icons/rx';

export interface StudioPageResolverProps {
  workData: WorkItem[];
  siteData: SiteData | null;
}

/**
 * StudioPageResolver
 * 
 * Architectural layout orchestrator for the Studio building:
 * - Directs route resolution to independent page family layouts
 * - Same-domain canonical URL routing (/studio, /studio/:projectId, /studio/blog, /studio/career)
 * - Decoupled from tabbed/nested container monoliths
 * - Supports full-page transitions with fluid motion easing
 */
export const StudioPageResolver: React.FC<StudioPageResolverProps> = ({ workData, siteData }) => {
  const { currentRoute, navigate } = useRouter();

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
              {currentRoute.family === 'case-study'
                ? 'Case Study'
                : currentRoute.family === 'editorial'
                ? 'Editorial'
                : currentRoute.family === 'career'
                ? 'Career Dossier'
                : 'Studio Hub'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Full-Page Transition Host */}
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
            {/* 1. Studio Hub Layout (/studio) */}
            {currentRoute.family === 'studio-hub' && (
              <div className="space-y-12 py-6">
                <div className="max-w-2xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs uppercase tracking-widest">
                    Studio Building
                  </div>
                  <h1
                    className="text-4xl sm:text-6xl font-light text-white tracking-tight lowercase"
                    style={{ fontFamily: 'var(--title-font)' }}
                  >
                    studio destinations
                  </h1>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
                    Autonomous digital chambers. Select a destination card to enter its independent same-origin route.
                  </p>
                </div>

                {/* Section 1: Canonical Project Case Studies */}
                <div className="space-y-4">
                  <h3 className="font-mono uppercase text-xs tracking-[0.22em] text-white/40">
                    Project Case Studies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workData.map((project, idx) => (
                      <button
                        key={project.id}
                        type="button"
                        onClick={() => navigate(`/studio/${project.id}`)}
                        data-cursor="pointer"
                        className="group text-left border border-white/10 hover:border-purple-400/40 bg-white/[0.02] hover:bg-purple-500/[0.04] p-6 rounded-xl transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer"
                      >
                        <div className="flex items-start justify-between w-full">
                          <span className="font-mono text-xs text-white/30 group-hover:text-purple-300 transition-colors">
                            {idx < 9 ? `0${idx + 1}` : idx + 1}
                          </span>
                          <RxArrowTopRight className="text-base text-white/30 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                        <div className="space-y-2">
                          <h4
                            className="text-xl font-normal text-white group-hover:text-purple-200 transition-colors"
                            style={{ fontFamily: 'var(--title-font)' }}
                          >
                            {project.title}
                          </h4>
                          <p className="text-xs text-white/50 line-clamp-2 font-light leading-relaxed">
                            {project.details.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                          {project.roles.slice(0, 2).map((role) => (
                            <span
                              key={role}
                              className="text-[10px] font-mono tracking-wider uppercase text-white/40 group-hover:text-white/60 transition-colors"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Future Content Rooms (Editorial & Career) */}
                <div className="space-y-4 pt-6 border-t border-white/[0.08]">
                  <h3 className="font-mono uppercase text-xs tracking-[0.22em] text-white/40">
                    Content Rooms
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                      type="button"
                      onClick={() => navigate('/studio/blog')}
                      data-cursor="pointer"
                      className="group text-left border border-white/10 hover:border-cyan-400/40 bg-white/[0.02] hover:bg-cyan-500/[0.04] p-6 rounded-xl transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="font-mono text-xs text-cyan-300/60 uppercase tracking-widest">
                          Editorial Chamber
                        </span>
                        <RxArrowTopRight className="text-base text-white/30 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <div>
                        <h4
                          className="text-xl font-normal text-white group-hover:text-cyan-200 transition-colors"
                          style={{ fontFamily: 'var(--title-font)' }}
                        >
                          Essays &amp; Articles
                        </h4>
                        <p className="text-xs text-white/50 font-light mt-1">
                          Technical essays, architecture retrospectives, and creative engineering thoughts.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/studio/career')}
                      data-cursor="pointer"
                      className="group text-left border border-white/10 hover:border-purple-400/40 bg-white/[0.02] hover:bg-purple-500/[0.04] p-6 rounded-xl transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer"
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="font-mono text-xs text-purple-300/60 uppercase tracking-widest">
                          Dossier Chamber
                        </span>
                        <RxArrowTopRight className="text-base text-white/30 group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <div>
                        <h4
                          className="text-xl font-normal text-white group-hover:text-purple-200 transition-colors"
                          style={{ fontFamily: 'var(--title-font)' }}
                        >
                          Career Dossier
                        </h4>
                        <p className="text-xs text-white/50 font-light mt-1">
                          Engineering timeline, architectural leadership, and select commissions.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Case Study Layout (/studio/:projectId) */}
            {currentRoute.family === 'case-study' && (() => {
              const project = workData.find((w) => w.id === currentRoute.params.projectId);
              if (!project) {
                return (
                  <div className="text-center py-20 space-y-6">
                    <h2 className="text-2xl font-light">Project Not Found</h2>
                    <p className="text-white/50 text-sm">
                      The project identifier "{currentRoute.params.projectId}" is not in the exhibition catalog.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate('/studio')}
                      data-cursor="pointer"
                      className="px-6 py-2 rounded-full border border-white/20 text-xs font-mono uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                    >
                      Back to Studio Hub
                    </button>
                  </div>
                );
              }

              return (
                <div className="max-w-3xl mx-auto py-8 space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs uppercase tracking-widest">
                      {project.details.summary}
                    </div>
                    <h1
                      className="text-4xl sm:text-6xl font-light text-white tracking-tight"
                      style={{ fontFamily: 'var(--title-font)' }}
                    >
                      {project.title}
                    </h1>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.roles.map((role) => (
                        <span
                          key={role}
                          className="text-xs font-mono tracking-wider uppercase text-white/50 px-2.5 py-1 rounded bg-white/[0.03] border border-white/[0.08]"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-b border-white/[0.08] py-8 space-y-4">
                    <h3 className="font-mono text-xs uppercase tracking-[0.24em] text-white/40">
                      Overview
                    </h3>
                    <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed">
                      {project.details.description}
                    </p>
                  </div>

                  {project.links && project.links.length > 0 && (
                    <div className="flex items-center gap-4 pt-2">
                      {project.links.map((link, idx) => (
                        <a
                          key={`link-${idx}`}
                          href={link.link}
                          target="_blank"
                          rel="noreferrer"
                          data-cursor="pointer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-mono text-xs tracking-wider uppercase hover:bg-purple-200 transition-colors duration-200 font-medium"
                        >
                          <span>{link.text}</span>
                          <RxArrowTopRight className="text-sm" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={() => navigate('/studio')}
                      data-cursor="pointer"
                      className="text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                    >
                      &larr; Back to All Studio Destinations
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* 3. Editorial Layout (/studio/blog & /studio/blog/:slug) */}
            {currentRoute.family === 'editorial' && (
              <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-xs uppercase tracking-widest">
                  Editorial Architecture
                </div>
                <h1
                  className="text-3xl sm:text-5xl font-light text-white tracking-tight lowercase"
                  style={{ fontFamily: 'var(--title-font)' }}
                >
                  editorial chamber
                </h1>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
                  {currentRoute.params.slug
                    ? `Article destination: ${currentRoute.params.slug}. Independent reading layout architecture established.`
                    : 'Independent editorial collection layout architecture established. Ready for future article implementations.'}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/studio')}
                    data-cursor="pointer"
                    className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs tracking-wider uppercase hover:bg-cyan-200 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Back to Studio Hub
                  </button>
                </div>
              </div>
            )}

            {/* 4. Career Layout (/studio/career) */}
            {currentRoute.family === 'career' && (
              <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs uppercase tracking-widest">
                  Career Dossier
                </div>
                <h1
                  className="text-3xl sm:text-5xl font-light text-white tracking-tight lowercase"
                  style={{ fontFamily: 'var(--title-font)' }}
                >
                  career dossier
                </h1>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
                  Independent career timeline architecture established. Ready for future dossier implementations.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/studio')}
                    data-cursor="pointer"
                    className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs tracking-wider uppercase hover:bg-purple-200 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Back to Studio Hub
                  </button>
                </div>
              </div>
            )}

            {/* 5. 404 Not Found */}
            {currentRoute.family === 'not-found' && (
              <div className="max-w-md mx-auto py-16 text-center space-y-6">
                <h1
                  className="text-4xl font-light text-white tracking-tight lowercase"
                  style={{ fontFamily: 'var(--title-font)' }}
                >
                  chamber not found
                </h1>
                <p className="text-white/50 text-sm font-light">
                  The requested destination path ({currentRoute.path}) is not recognized.
                </p>
                <div className="flex justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    data-cursor="pointer"
                    className="px-5 py-2 rounded-full bg-white text-black font-mono text-xs uppercase tracking-wider hover:bg-purple-200 transition-colors"
                  >
                    Exhibition Home
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/studio')}
                    data-cursor="pointer"
                    className="px-5 py-2 rounded-full border border-white/20 font-mono text-xs uppercase tracking-wider hover:border-white transition-colors"
                  >
                    Studio Hub
                  </button>
                </div>
              </div>
            )}
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

export default StudioPageResolver;
