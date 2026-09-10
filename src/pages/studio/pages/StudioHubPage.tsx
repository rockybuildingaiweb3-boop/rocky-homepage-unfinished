import React from 'react';
import { RxArrowTopRight } from 'react-icons/rx';
import { WorkItem } from '../../../types';
import { useRouter } from '../../../router/RouterContext';

export interface StudioHubPageProps {
  workData: WorkItem[];
}

/**
 * StudioHubPage
 * 
 * The catalog of destinations in the Studio universe:
 * Every card is an entry point to a distinct canonical URL.
 */
export const StudioHubPage: React.FC<StudioHubPageProps> = ({ workData }) => {
  const { navigate } = useRouter();

  return (
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
  );
};

export default StudioHubPage;
