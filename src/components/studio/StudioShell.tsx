import React, { useEffect } from 'react';
import { WorkItem, SiteData } from '../../types';
import { useRouter, Link } from '../../router/RouterContext';
import { StudioProjects } from './modules/StudioProjects';
import { StudioBlog } from './modules/StudioBlog';
import { StudioCareer } from './modules/StudioCareer';
import { Footer } from '../layout/Footer';
import { useBackgroundMusic } from '../../hooks/useBackgroundMusic';

interface StudioShellProps {
  workData: WorkItem[];
  siteData?: SiteData | null;
}

const STUDIO_NAV_ITEMS = [
  { path: '/studio/projects', label: 'Projects', badge: '06', id: 'projects' },
  { path: '/studio/blog', label: 'Essays', badge: '03', id: 'blog' },
  { path: '/studio/career', label: 'Career', badge: 'Dossier', id: 'career' },
];

export const StudioShell: React.FC<StudioShellProps> = ({ workData, siteData }) => {
  const { currentPath, studioModule, navigate } = useRouter();
  const { isPlaying, isMuted, toggleMute } = useBackgroundMusic();

  // Ensure window scrolls up when switching Studio modules
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [studioModule]);

  return (
    <div className="w-full min-h-screen relative z-10 flex flex-col bg-[#030014] text-white select-none">
      {/* ─── STUDIO GLOBAL HEADER ─── */}
      <header className="sticky top-0 left-0 right-0 z-40 w-full border-b border-white/[0.08] bg-black/60 backdrop-blur-xl px-6 sm:px-10 lg:px-12 py-4">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Return Gateway to Cinematic Homepage */}
          <button
            type="button"
            onClick={() => navigate('/')}
            data-cursor="pointer"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
            <span className="hidden sm:inline">return to exhibition</span>
            <span className="sm:hidden">exhibition</span>
          </button>

          {/* Center: Museum Index Tabs */}
          <nav aria-label="Studio Navigation" className="flex items-center gap-1.5 sm:gap-2">
            {STUDIO_NAV_ITEMS.map((item) => {
              const isActive = studioModule === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  data-cursor="pointer"
                  className={`group relative px-3 sm:px-4 py-1.5 rounded-full text-xs font-mono tracking-[0.18em] uppercase transition-all duration-300 no-underline whitespace-nowrap ${
                    isActive
                      ? 'text-white font-medium bg-white/10 border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.12)]'
                      : 'text-white/50 hover:text-white/80 bg-white/[0.02] border border-white/5 hover:border-white/15'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span>{item.label}</span>
                    <span
                      className={`text-[9px] px-1 rounded transition-colors ${
                        isActive ? 'bg-purple-500/40 text-purple-100' : 'text-white/30 group-hover:text-white/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Background Audio Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              data-cursor="pointer"
              aria-label={isMuted ? 'Play background sound' : 'Mute background sound'}
              title={isMuted ? 'Sound: Muted (Click to play)' : 'Sound: Playing (Click to mute)'}
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-white/60 hover:text-white border border-white/10 hover:border-white/30 bg-white/[0.03] px-3 py-1.5 rounded-full cursor-pointer transition-colors"
            >
              <div className="flex items-end gap-[2px] h-3 w-3">
                {isMuted ? (
                  <span className="text-[10px] text-white/40">OFF</span>
                ) : (
                  <>
                    <span
                      className={`w-[2px] rounded-full bg-purple-300 ${
                        isPlaying ? 'animate-[pulse_0.8s_ease-in-out_infinite] h-2.5' : 'h-1.5'
                      }`}
                    />
                    <span
                      className={`w-[2px] rounded-full bg-purple-200 ${
                        isPlaying ? 'animate-[pulse_0.6s_ease-in-out_infinite_0.2s] h-3' : 'h-2'
                      }`}
                    />
                    <span
                      className={`w-[2px] rounded-full bg-fuchsia-300 ${
                        isPlaying ? 'animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-1.5' : 'h-1'
                      }`}
                    />
                  </>
                )}
              </div>
              <span className="hidden md:inline">{isMuted ? 'Muted' : 'Sound'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* ─── ACTIVE MODULE CONTENT ─── */}
      <main className="flex-1 w-full relative">
        {studioModule === 'projects' && (
          <div className="pt-8 sm:pt-12">
            <StudioProjects workData={workData} />
          </div>
        )}

        {studioModule === 'blog' && (
          <StudioBlog />
        )}

        {studioModule === 'career' && (
          <StudioCareer />
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <Footer siteData={siteData} onNavigateRoute={navigate} />
    </div>
  );
};

export default StudioShell;
