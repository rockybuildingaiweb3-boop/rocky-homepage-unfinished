import React, { memo, useRef } from 'react';
import { SKILLS_DATA, SkillItem } from '../../data/skills';
import { TechLogo } from './TechLogo';

interface KnowledgeCanopyProps {
  activeSkillId: string | null;
  onHoverSkill: (id: string) => void;
  onLeaveSkill: () => void;
}

// Split into two thematic streams for balanced visual cadence
const STREAM_1 = SKILLS_DATA.filter((_, i) => i % 2 === 0);
const STREAM_2 = SKILLS_DATA.filter((_, i) => i % 2 !== 0);

export const KnowledgeCanopy: React.FC<KnowledgeCanopyProps> = memo(({
  activeSkillId,
  onHoverSkill,
  onLeaveSkill,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderInsightCard = (skill: SkillItem, keyPrefix: string) => {
    const isActive = activeSkillId === skill.id;

    return (
      <div
        key={`${keyPrefix}-${skill.id}`}
        role="button"
        tabIndex={0}
        aria-label={`${skill.name} insight`}
        onMouseEnter={() => onHoverSkill(skill.id)}
        onMouseLeave={onLeaveSkill}
        onFocus={() => onHoverSkill(skill.id)}
        onBlur={onLeaveSkill}
        className={`group relative flex shrink-0 items-start gap-3.5 rounded-xl border px-4 py-3 max-w-[380px] sm:max-w-[420px] transition-all duration-300 text-left select-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 ${
          isActive
            ? 'border-purple-400/60 bg-white/[0.09] shadow-lg shadow-purple-950/40 z-20 scale-[1.02]'
            : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] z-10'
        }`}
      >
        {/* Active brand accent border */}
        {isActive && (
          <div
            className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
            style={{ backgroundColor: skill.brandColor }}
          />
        )}

        {/* Mini Brand Mark */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 p-1 mt-0.5 ${
            isActive
              ? 'border-white/30 bg-white/[0.1]'
              : 'border-white/10 bg-white/[0.03] group-hover:border-white/20'
          }`}
        >
          <TechLogo id={skill.id} name={skill.name} className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`font-mono text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-white/85 group-hover:text-white'
              }`}
            >
              {skill.name}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/35">
              [{skill.categoryNumber}]
            </span>
          </div>

          <p
            className={`text-xs sm:text-[13px] leading-relaxed transition-colors duration-200 line-clamp-3 font-normal ${
              isActive ? 'text-white/95' : 'text-white/60 group-hover:text-white/80'
            }`}
          >
            {skill.insight}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center mt-12 sm:mt-16 overflow-hidden"
    >
      {/* Sub-header */}
      <div className="w-full max-w-[1380px] px-4 sm:px-6 flex items-center justify-between mb-4 select-none">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/45">
            [ KNOWLEDGE CANOPY ]
          </span>
          <span className="text-white/20">·</span>
          <span className="font-mono text-[10px] lowercase tracking-wider text-white/40 hidden sm:inline">
            architectural observations across 88 instruments
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">
          hover to link
        </span>
      </div>

      {/* Track 1 (Forward flow) */}
      <div className="marquee-band w-full overflow-hidden py-1.5 mask-edges">
        <div className="marquee-track marquee-track-forward flex w-max gap-3 sm:gap-4.5">
          {STREAM_1.map((skill) => renderInsightCard(skill, 's1-a'))}
          {STREAM_1.map((skill) => renderInsightCard(skill, 's1-b'))}
        </div>
      </div>

      {/* Track 2 (Reverse flow) */}
      <div className="marquee-band w-full overflow-hidden py-1.5 mask-edges mt-2">
        <div className="marquee-track marquee-track-reverse flex w-max gap-3 sm:gap-4.5">
          {STREAM_2.map((skill) => renderInsightCard(skill, 's2-a'))}
          {STREAM_2.map((skill) => renderInsightCard(skill, 's2-b'))}
        </div>
      </div>
    </div>
  );
});

KnowledgeCanopy.displayName = 'KnowledgeCanopy';
