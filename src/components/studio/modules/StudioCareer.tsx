import React from 'react';
import { CAREER_DATA } from '../../../data/careerData';
import { RxEnvelopeClosed, RxDownload } from 'react-icons/rx';

export const StudioCareer: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-12 select-none">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="font-mono text-xs text-purple-300 tracking-[0.24em] uppercase">
              STUDIO &bull; DOSSIER &amp; CAPABILITIES
            </span>
            <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              AVAILABLE FOR 2026
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-normal lowercase tracking-[-0.035em] text-white"
            style={{ fontFamily: 'var(--title-font)' }}
          >
            career &amp; technical profile
          </h2>
          <p className="mt-3 text-sm text-white/60 font-mono max-w-2xl leading-relaxed">
            {CAREER_DATA.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="mailto:rockybuilding.aiweb3@gmail.com"
            data-cursor="pointer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-mono tracking-wider uppercase text-purple-200 transition-colors"
          >
            <RxEnvelopeClosed />
            <span>Initiate Collaboration</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Experience Timeline (Left 7 cols) & Capabilities Matrix (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
        
        {/* Experience Timeline */}
        <div className="lg:col-span-7 space-y-8">
          <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-white/45 flex items-center gap-2">
            <span>[ 01 // PROFESSIONAL TIMELINE ]</span>
          </h3>

          <div className="space-y-10 relative before:absolute before:top-3 before:bottom-3 before:left-[7px] before:w-[1.5px] before:bg-white/10">
            {CAREER_DATA.roles.map((role, idx) => (
              <div key={idx} className="relative pl-7 group">
                {/* Timeline node */}
                <span className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-purple-400 bg-[#0c0c10] group-hover:scale-125 transition-transform" />

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-7 space-y-4 hover:border-white/20 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-mono text-xs text-purple-300 tracking-wider">
                      {role.period}
                    </span>
                    <span className="font-mono text-xs text-white/40">
                      {role.location}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-medium text-white">
                      {role.role}
                    </h4>
                    <p className="text-xs font-mono text-white/50 mt-0.5">
                      {role.company}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                    {role.summary}
                  </p>

                  <ul className="list-none p-0 m-0 space-y-1.5 pt-2 border-t border-white/5 text-xs text-white/60 font-light">
                    {role.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-purple-400 font-mono">&bull;</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {role.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-white/60 border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Capabilities Matrix & Education */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-white/45 flex items-center gap-2 mb-6">
              <span>[ 02 // TECHNICAL CAPABILITIES ]</span>
            </h3>

            <div className="space-y-4">
              {CAREER_DATA.capabilities.map((cap, cIdx) => (
                <div
                  key={cIdx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2.5"
                >
                  <h4 className="text-sm font-mono tracking-wider uppercase text-purple-200">
                    {cap.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cap.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.03] text-white/75 border border-white/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-white/45 flex items-center gap-2 mb-6">
              <span>[ 03 // EDUCATION & CREDENTIALS ]</span>
            </h3>

            <div className="space-y-4">
              {CAREER_DATA.education.map((edu, eIdx) => (
                <div
                  key={eIdx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2"
                >
                  <span className="font-mono text-xs text-purple-300 tracking-wider">
                    {edu.period}
                  </span>
                  <h4 className="text-sm sm:text-base font-medium text-white">
                    {edu.degree}
                  </h4>
                  <p className="text-xs font-mono text-white/50">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-white/60 font-light pt-1 leading-relaxed">
                    {edu.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudioCareer;
