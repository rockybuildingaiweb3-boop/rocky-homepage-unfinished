import React from 'react';
import { RxArrowTopRight } from 'react-icons/rx';
import { WorkItem } from '../../../types';
import { useRouter } from '../../../router/RouterContext';

export interface CaseStudyPageProps {
  projectId: string;
  workData: WorkItem[];
}

/**
 * CaseStudyPage
 * 
 * Independent Case Study Layout (/studio/:projectId)
 * Displays canonical project overview, roles, and live destination links.
 */
export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ projectId, workData }) => {
  const { navigate } = useRouter();
  const project = workData.find((w) => w.id === projectId);

  if (!project) {
    return (
      <div className="text-center py-20 space-y-6">
        <h2 className="text-2xl font-light">Project Not Found</h2>
        <p className="text-white/50 text-sm">
          The project identifier &quot;{projectId}&quot; is not in the exhibition catalog.
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
          className="text-xs font-mono uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          &larr; Back to All Studio Destinations
        </button>
      </div>
    </div>
  );
};

export default CaseStudyPage;
