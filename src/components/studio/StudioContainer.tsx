import React, { useState, useEffect, useCallback } from 'react';
import { WorkItem } from '../../types';
import { StudioModuleId, StudioModuleMeta } from './types';
import { StudioProjects } from './modules/StudioProjects';
import { StudioModulePlaceholder } from './modules/StudioModulePlaceholder';

interface StudioContainerProps {
  workData: WorkItem[];
}

const STUDIO_MODULES: StudioModuleMeta[] = [
  {
    id: 'projects',
    label: 'Projects',
    code: 'MOD.01',
    description: 'Curated enterprise applications, interactive platforms, and design engineering projects.',
    path: '/studio/projects',
    status: 'active',
    count: '06',
  },
  {
    id: 'experiments',
    label: 'Experiments',
    code: 'MOD.02',
    description: 'WebGL, Three.js shaders, compute simulations, and generative creative coding prototypes.',
    path: '/studio/experiments',
    status: 'upcoming',
    count: 'LAB',
  },
  {
    id: 'blog',
    label: 'Essays',
    code: 'MOD.03',
    description: 'Essays on tactile digital interfaces, spatial systems, design engineering, and modern web architecture.',
    path: '/studio/blog',
    status: 'upcoming',
    count: 'WRITING',
  },
  {
    id: 'life',
    label: 'Field Notes',
    code: 'MOD.04',
    description: 'Atmospheric photography, analogue modular synthesis, and field recordings from around the world.',
    path: '/studio/life',
    status: 'upcoming',
    count: 'LOG',
  },
  {
    id: 'archive',
    label: 'Archive',
    code: 'MOD.05',
    description: 'Earlier web experiments, historical portfolio iterations, and deprecated code artifacts.',
    path: '/studio/archive',
    status: 'upcoming',
    count: 'ARCH',
  },
];

export const StudioContainer: React.FC<StudioContainerProps> = ({ workData }) => {
  const [activeModule, setActiveModule] = useState<StudioModuleId>('projects');
  const [hasActiveProject, setHasActiveProject] = useState<boolean>(false);

  // Sync with URL hash for route-aware addressability (e.g. #studio/experiments, #studio/blog, #work)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('experiments')) {
        setActiveModule('experiments');
      } else if (hash.includes('blog')) {
        setActiveModule('blog');
      } else if (hash.includes('life')) {
        setActiveModule('life');
      } else if (hash.includes('archive')) {
        setActiveModule('archive');
      } else if (hash.includes('projects') || hash === '#work' || hash === '#studio') {
        setActiveModule('projects');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectModule = useCallback((moduleId: StudioModuleId) => {
    setActiveModule(moduleId);
    const newHash = moduleId === 'projects' ? 'work' : `studio/${moduleId}`;
    if (window.location.hash.replace('#', '') !== newHash) {
      window.history.replaceState(null, '', `#${newHash}`);
    }
  }, []);

  const currentMeta = STUDIO_MODULES.find((m) => m.id === activeModule) || STUDIO_MODULES[0];

  return (
    <section
      id="work"
      className="studio-section relative w-full overflow-hidden pt-24 sm:pt-32 pb-20 select-none"
      aria-label="Studio Showcase"
    >
      {/* Studio Header & Modular Architecture Navigation */}
      <div
        className={`w-full max-w-7xl mx-auto px-6 sm:px-12 mb-8 sm:mb-12 transition-all duration-500 ${
          hasActiveProject ? 'opacity-0 pointer-events-none -translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        aria-hidden={hasActiveProject}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs tracking-[0.26em] uppercase text-purple-200/70">
                STUDIO ARCHITECTURE
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-normal lowercase tracking-[-0.035em] text-white"
              style={{ fontFamily: 'var(--title-font)' }}
            >
              selected work &amp; studio
            </h2>
          </div>

          {/* Module Selector Tabs (Modular Future Studio Navigation) */}
          <nav
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1"
            aria-label="Studio Module Selector"
          >
            {STUDIO_MODULES.map((module) => {
              const isActive = activeModule === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => selectModule(module.id)}
                  data-cursor="pointer"
                  className={`group relative px-3 py-1.5 rounded-full text-xs font-mono tracking-[0.16em] uppercase transition-all duration-300 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                    isActive
                      ? 'text-white font-medium bg-white/10 border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                      : 'text-white/50 hover:text-white/80 bg-white/[0.02] border border-white/5 hover:border-white/20'
                  }`}
                  aria-pressed={isActive}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {module.label}
                    {module.count && (
                      <span
                        className={`text-[9px] px-1 rounded transition-colors ${
                          isActive ? 'bg-purple-500/40 text-purple-100' : 'text-white/30 group-hover:text-white/60'
                        }`}
                      >
                        {module.count}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active Module View */}
      {activeModule === 'projects' ? (
        <StudioProjects
          workData={workData}
          onActiveChange={setHasActiveProject}
        />
      ) : (
        <StudioModulePlaceholder
          meta={currentMeta}
          onBackToProjects={() => selectModule('projects')}
        />
      )}
    </section>
  );
};
