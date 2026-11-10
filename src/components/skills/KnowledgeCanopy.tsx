import React, { memo, useRef } from 'react';
import { SKILLS_DATA, SkillItem } from '../../data/skills';
import { TechLogo } from './TechLogo';
import { getSkillTier } from '../../features/skills/skillRelationships';

interface KnowledgeCanopyProps {
  activeSkillId: string | null;
  selectedCategoryId?: string | null;
  onSelectSkill?: (id: string) => void;
  onHoverSkill: (id: string) => void;
  onLeaveSkill: () => void;
}

// Split into two thematic streams for balanced visual cadence
const STREAM_1 = SKILLS_DATA.filter((_, i) => i % 2 === 0);
const STREAM_2 = SKILLS_DATA.filter((_, i) => i % 2 !== 0);

export const KnowledgeCanopy: React.FC<KnowledgeCanopyProps> = memo(({
  activeSkillId,
  selectedCategoryId = null,
  onSelectSkill,
  onHoverSkill,
  onLeaveSkill,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderInsightCard = (skill: SkillItem, keyPrefix: string) => {
    const isActive = activeSkillId === skill.id;
    const isInSelectedCategory =
      !selectedCategoryId || skill.categoryId === selectedCategoryId;
    const tier = getSkillTier(skill.id);

    return (
      <button
        key={`${keyPrefix}-${skill.id}`}
        type="button"
        aria-label={`Focus ${skill.name} insight`}
        onClick={() => {
          if (onSelectSkill) onSelectSkill(skill.id);
        }}
        onMouseEnter={() => onHoverSkill(skill.id)}
        onMouseLeave={onLeaveSkill}
        onFocus={() => onHoverSkill(skill.id)}
        onBlur={onLeaveSkill}
        className={`group relative flex shrink-0 items-start gap-3.5 rounded-xl border px-4 py-3 max-w-[380px] sm:max-w-[420px] transition-all duration-300 text-left select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
          isActive
            ? 'border-purple-400/70 bg-[#140B2E]/90 shadow-[0_6px_24px_rgba(112,66,248,0.3)] z-20 scale-[1.02]'
            : isInSelectedCategory
            ? 'border-white/[0.09] bg-white/[0.025] hover:border-purple-400/35 hover:bg-white/[0.06] z-10'
            : 'border-white/[0.05] bg-white/[0.01] opacity-55 hover:opacity-100 hover:border-white/20 z-10'
        }`}
      >
        {/* Mini Brand Mark */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 p-1.5 mt-0.5 ${
            isActive
              ? 'border-white/35 bg-white/[0.12]'
              : 'border-white/10 bg-white/[0.03] group-hover:border-white/25'
          }`}
        >
          <TechLogo id={skill.id} name={skill.name} className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-1 font-mono">
            <span
              className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                isActive ? 'text-white' : 'text-white/85 group-hover:text-white'
              }`}
            >
              {skill.name}
            </span>
            <span aria-hidden="true" className="text-white/25 text-[10px]">·</span>
            <span className="text-[10px] uppercase tracking-widest text-purple-300/65">
              {tier}
            </span>
            <span aria-hidden="true" className="text-white/25 text-[10px]">·</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              {skill.categoryNumber}
            </span>
          </div>

          <p
            className={`text-xs sm:text-[13px] leading-relaxed transition-colors duration-200 line-clamp-3 font-normal ${
              isActive ? 'text-white/95' : 'text-white/60 group-hover:text-white/85'
            }`}
          >
            {skill.insight}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center mt-8 sm:mt-12 overflow-hidden"
    >
      {/* Sub-header */}
      <div className="w-full max-w-[1380px] px-4 sm:px-6 flex items-center justify-between mb-4 select-none">
        <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] uppercase text-white/50">
          <span>Knowledge Canopy</span>
          <span aria-hidden="true" className="text-white/20">·</span>
          <span className="lowercase tracking-wider text-white/40 hidden sm:inline">
            architectural observations across 88 instruments
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-purple-300/60">
          Click any card to focus in constellation
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
export default KnowledgeCanopy;
