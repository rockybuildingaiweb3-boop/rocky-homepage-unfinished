import React, { memo } from 'react';
import { motion } from 'motion/react';
import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import { getRelatedSkillIds } from '../../features/skills/livingOrbitEngine';
import { TechLogo } from './TechLogo';

interface SkillFocusCardProps {
  skill: SkillItem;
  onSelectSkill: (skillId: string) => void;
  onClose: () => void;
}

const TIER_EDITORIAL_META: Record<
  SkillItem['tier'],
  { label: string; roleDescriptor: string; toneClass: string }
> = {
  core: {
    label: 'Core Architecture',
    roleDescriptor: 'Primary Foundation',
    toneClass: 'text-amber-200/90',
  },
  professional: {
    label: 'Professional Stack',
    roleDescriptor: 'Production Systems',
    toneClass: 'text-purple-200/90',
  },
  ecosystem: {
    label: 'Ecosystem & Tooling',
    roleDescriptor: 'Specialized Integration',
    toneClass: 'text-sky-200/85',
  },
};

/**
 * SkillFocusCard — Editorial Technology Dossier (Living Orbit 2.3)
 *
 * Refined, floating editorial dossier designed for a cosmic exhibition portfolio:
 * - Asymmetric two-column composition on desktop, clean vertical flow on mobile
 * - Authentic floating logo presentation without generic boxed icon wrappers
 * - Unboxed editorial metadata with typographic separators (zero-pill discipline)
 * - Fine structural hairlines and restrained brand-color top luminance accent
 * - Interactive connected architecture nodes with authentic logos
 */
export const SkillFocusCard: React.FC<SkillFocusCardProps> = memo(
  ({ skill, onSelectSkill, onClose }) => {
    const category = SKILL_CATEGORIES.find((c) => c.id === skill.categoryId);
    const tierMeta = TIER_EDITORIAL_META[skill.tier];

    const relatedSkills = React.useMemo(() => {
      const ids = getRelatedSkillIds(skill.id).slice(0, 5);
      return ids
        .map((id) => SKILLS_DATA.find((s) => s.id === id))
        .filter((s): s is SkillItem => Boolean(s));
    }, [skill.id]);

    return (
      <motion.div
        key={skill.id}
        role="dialog"
        aria-label={`${skill.name} technical details`}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[760px] mx-auto overflow-hidden rounded-2xl border border-white/[0.12] bg-[#050214]/94 backdrop-blur-2xl px-5 py-4 sm:px-6 sm:py-5 shadow-[0_24px_64px_rgba(2,0,14,0.94)]"
      >
        {/* Restrained Top Luminance Hairline & Subtle Atmospheric Aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent 6%, ${skill.brandColor}aa 36%, rgba(243,232,255,0.65) 52%, transparent 94%)`,
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-8 w-56 h-32 rounded-full blur-3xl opacity-20"
          style={{ background: skill.brandColor }}
        />

        {/* Header Eyebrow Row + Minimal Close Control */}
        <div className="relative flex items-center justify-between gap-4 pb-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2 min-w-0 font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 truncate">
            <span className="text-purple-200/75">Technical Profile</span>
            {category && (
              <>
                <span aria-hidden="true" className="text-white/25">
                  ·
                </span>
                <span className="text-white/65 truncate">
                  {category.number} {category.title}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Clear focused technology"
            className="shrink-0 group inline-flex items-center gap-1.5 py-0.5 px-1.5 rounded text-white/55 hover:text-white transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-purple-400/60"
          >
            <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-white/45 group-hover:text-white/85 transition-colors">
              Esc
            </span>
            <span aria-hidden="true" className="text-white/20">
              /
            </span>
            <span className="text-xs leading-none text-white/70 group-hover:text-white">
              ✕
            </span>
          </button>
        </div>

        {/* Asymmetric Two-Column Desktop Dossier / Clean Vertical Mobile Flow */}
        <div className="relative mt-3.5 grid grid-cols-1 md:grid-cols-[1.22fr_0.78fr] gap-4 md:gap-6 items-start">
          {/* Left Column: Authentic Floating Brand Mark, Title, Unboxed Metadata & Insight */}
          <div className="min-w-0">
            <div className="flex items-center gap-3.5">
              {/* Floating Authentic Logo (No generic square box enclosure) */}
              <div
                className="relative flex items-center justify-center shrink-0 w-9 h-9 sm:w-10 sm:h-10"
                style={{
                  filter: `drop-shadow(0 0 16px ${skill.brandColor}66) drop-shadow(0 4px 10px rgba(0,0,0,0.8))`,
                }}
              >
                <TechLogo id={skill.id} name={skill.name} size={36} />
              </div>

              <div className="min-w-0">
                <h3
                  className="text-lg sm:text-xl font-normal tracking-[0.03em] text-white truncate"
                  style={{ fontFamily: 'var(--title-font)' }}
                >
                  {skill.name}
                </h3>

                {/* Unboxed Editorial Tier & Role Metadata */}
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[10px] tracking-[0.14em] uppercase">
                  <span className={tierMeta.toneClass}>{tierMeta.label}</span>
                  <span aria-hidden="true" className="text-white/25">
                    ·
                  </span>
                  <span className="text-white/45">{tierMeta.roleDescriptor}</span>
                </div>
              </div>
            </div>

            {/* Technical Insight Prose */}
            <p className="mt-3 text-[13px] sm:text-[13.5px] leading-[1.65] text-white/82 font-normal max-w-[54ch]">
              {skill.insight}
            </p>
          </div>

          {/* Right Column: Connected Architecture Interactive Stack */}
          {relatedSkills.length > 0 && (
            <div className="pt-3 md:pt-0 md:pl-5 border-t md:border-t-0 md:border-l border-white/[0.08] flex flex-col justify-between">
              <div className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-white/40 mb-2">
                Connected Architecture
              </div>

              <div className="flex flex-wrap md:flex-col gap-x-3 gap-y-1.5">
                {relatedSkills.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectSkill(rel.id)}
                    className="group inline-flex items-center justify-between gap-2 py-1 px-1.5 -mx-1.5 rounded-md hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer text-left"
                  >
                    <span className="inline-flex items-center gap-2 min-w-0">
                      <span className="shrink-0 flex items-center justify-center w-4 h-4 opacity-85 group-hover:opacity-100 transition-opacity">
                        <TechLogo id={rel.id} name={rel.name} size={15} />
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.06em] text-white/75 group-hover:text-white transition-colors truncate">
                        {rel.name}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden md:inline-block font-mono text-[10px] text-white/25 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all"
                    >
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

SkillFocusCard.displayName = 'SkillFocusCard';
export default SkillFocusCard;

