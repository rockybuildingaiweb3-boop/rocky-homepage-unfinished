import React, { memo } from 'react';
import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import { getRelatedSkillIds } from '../../features/skills/livingOrbitEngine';
import { TechLogo } from './TechLogo';

interface SkillFocusCardProps {
  skill: SkillItem;
  onSelectSkill: (skillId: string) => void;
  onClose: () => void;
}

const TIER_LABELS: Record<SkillItem['tier'], { label: string; badgeClass: string }> = {
  core: {
    label: 'Core Architecture',
    badgeClass: 'text-amber-200/95 border-amber-400/35 bg-amber-500/10',
  },
  professional: {
    label: 'Professional Stack',
    badgeClass: 'text-purple-200/95 border-purple-400/35 bg-purple-500/10',
  },
  ecosystem: {
    label: 'Ecosystem & Tooling',
    badgeClass: 'text-sky-200/90 border-sky-400/30 bg-sky-500/10',
  },
};

/**
 * SkillFocusCard
 *
 * Compact, floating glassmorphic inspector displayed only when a technology logo
 * is locked into persistent focus. Secondary to the visual composition.
 */
export const SkillFocusCard: React.FC<SkillFocusCardProps> = memo(({
  skill,
  onSelectSkill,
  onClose,
}) => {
  const category = SKILL_CATEGORIES.find((c) => c.id === skill.categoryId);
  const tierMeta = TIER_LABELS[skill.tier];

  const relatedSkills = React.useMemo(() => {
    const ids = getRelatedSkillIds(skill.id);
    return ids
      .map((id) => SKILLS_DATA.find((s) => s.id === id))
      .filter((s): s is SkillItem => Boolean(s));
  }, [skill.id]);

  return (
    <div
      role="dialog"
      aria-label={`${skill.name} technical details`}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-[660px] mx-auto rounded-2xl border border-white/15 bg-[#070318]/85 backdrop-blur-xl px-5 py-4 shadow-[0_18px_50px_rgba(3,0,20,0.85)] transition-all duration-300"
      style={{
        boxShadow: `0 16px 48px rgba(3, 0, 20, 0.85), 0 0 28px ${skill.brandColor}22`,
      }}
    >
      {/* Top Row: Logo, Name, Category & Tier, Close button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.04] border border-white/10"
            style={{
              boxShadow: `0 0 20px ${skill.brandColor}30`,
            }}
          >
            <TechLogo id={skill.id} name={skill.name} size={28} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-semibold tracking-tight text-white truncate">
                {skill.name}
              </h3>
              <span
                className={`font-mono text-[9px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-md border ${tierMeta.badgeClass}`}
              >
                {tierMeta.label}
              </span>
            </div>
            {category && (
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/50 mt-0.5 truncate">
                {category.number} · {category.title}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Clear focused technology"
          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/25 font-mono text-[10px] tracking-widest uppercase text-white/70 hover:text-white transition-colors cursor-pointer"
        >
          <span>✕</span>
          <span className="hidden sm:inline">Esc</span>
        </button>
      </div>

      {/* Technical Insight */}
      <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-white/80 font-normal">
        {skill.insight}
      </p>

      {/* Related Technologies */}
      {relatedSkills.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 mr-1">
            Connected:
          </span>
          {relatedSkills.map((rel) => (
            <button
              key={rel.id}
              type="button"
              onClick={() => onSelectSkill(rel.id)}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.09] hover:border-purple-400/40 transition-all cursor-pointer"
            >
              <TechLogo id={rel.id} name={rel.name} size={14} />
              <span className="font-mono text-[10px] tracking-wider text-white/75 group-hover:text-white">
                {rel.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

SkillFocusCard.displayName = 'SkillFocusCard';
export default SkillFocusCard;
