import React, { memo } from 'react';
import { SKILLS_DATA, SkillItem } from '../../data/skills';
import {
  CATEGORY_CONSTELLATIONS,
  CategoryConstellationCluster,
} from '../../features/skills/constellationLayout';
import {
  getRelatedSkillIds,
  getSkillEditorialSummary,
  getSkillTier,
} from '../../features/skills/skillRelationships';
import { TechLogo } from './TechLogo';

interface MobileSkillsConstellationProps {
  selectedCategoryId: string | null;
  focusedSkillId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectSkill: (skillId: string) => void;
  onClearSkillFocus: () => void;
}

/**
 * MobileSkillsConstellation
 *
 * Dedicated mobile-first adaptive constellation experience (< 768px).
 * Replaces shrunk 88-node scatter with a touch-native 3-level cosmic hierarchy:
 * - Level 1: 8 Interactive Category Constellation Cards over the cosmic planet
 * - Level 2: Expanded Category organized clearly into Core, Professional, and Ecosystem tiers
 * - Level 3: Persistent Focused Skill Inspector with one-tap Related Technology traversal
 */
export const MobileSkillsConstellation: React.FC<MobileSkillsConstellationProps> = memo(({
  selectedCategoryId,
  focusedSkillId,
  onSelectCategory,
  onSelectSkill,
  onClearSkillFocus,
}) => {
  const activeCategory: CategoryConstellationCluster | null = selectedCategoryId
    ? CATEGORY_CONSTELLATIONS.find((c) => c.id === selectedCategoryId) || null
    : null;

  const focusedSkill: SkillItem | null = focusedSkillId
    ? SKILLS_DATA.find((s) => s.id === focusedSkillId) || null
    : null;

  const relatedIds = focusedSkill ? getRelatedSkillIds(focusedSkill.id).slice(0, 6) : [];
  const relatedSkills = relatedIds
    .map((id) => SKILLS_DATA.find((s) => s.id === id))
    .filter((s): s is SkillItem => Boolean(s));

  // ─── LEVEL 1: MOBILE 8-CATEGORY CONSTELLATION OVERVIEW ───
  if (!activeCategory) {
    return (
      <div
        className="w-full px-4 py-2 flex flex-col gap-3.5 select-none"
        data-testid="mobile-constellation-overview"
      >
        <div className="text-center mb-1">
          <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-purple-200/80">
            Tap any constellation to explore its technologies
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CATEGORY_CONSTELLATIONS.map((cluster) => (
            <button
              key={cluster.id}
              type="button"
              onClick={() => onSelectCategory(cluster.id)}
              aria-label={`Explore ${cluster.title} (${cluster.skills.length} technologies)`}
              className="group relative flex items-center justify-between gap-3.5 p-4 rounded-2xl border border-white/15 bg-[#0A051C]/85 active:bg-[#150B33]/95 hover:border-purple-400/50 text-left transition-all duration-200 cursor-pointer"
              style={{
                boxShadow: `0 6px 24px rgba(0, 0, 0, 0.55), inset 0 1px 1px rgba(255, 255, 255, 0.12)`,
              }}
            >
              {/* Left: Constellation Identity & Counts */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-purple-300/85">
                  <span>{cluster.number}</span>
                  <span aria-hidden="true">·</span>
                  <span>{cluster.skills.length} Technologies</span>
                </div>

                <h3 className="mt-1 font-mono text-sm font-bold tracking-wide text-white truncate">
                  {cluster.title}
                </h3>

                <p className="mt-1 text-xs text-white/60 line-clamp-1">
                  {cluster.subtitle}
                </p>

                <div className="mt-2.5 flex items-center gap-2 font-mono text-[10px] text-white/55">
                  <span className="text-amber-300/90">{cluster.tierCounts.core} Core</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-300/85">{cluster.tierCounts.professional} Pro</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-purple-300/80">{cluster.tierCounts.ecosystem} Eco</span>
                </div>
              </div>

              {/* Right: Nucleus + Orbiting Core Logos */}
              <div className="relative flex items-center justify-center shrink-0 w-16 h-16">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center border border-white/30"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.28) 0%, ${cluster.accentColor}45 42%, rgba(12,7,28,0.95) 100%)`,
                    boxShadow: `0 0 18px ${cluster.accentColor}45`,
                  }}
                >
                  <TechLogo
                    id={cluster.nucleusSkill.id}
                    name={cluster.nucleusSkill.name}
                    className="w-6 h-6"
                  />
                </div>

                {/* Mini orbiting core badges */}
                {cluster.satelliteSkills.slice(0, 2).map((sat, idx) => (
                  <div
                    key={sat.id}
                    className={`absolute w-6 h-6 rounded-full bg-[#120A28] border border-white/25 flex items-center justify-center ${
                      idx === 0 ? '-top-1 -right-1' : '-bottom-1 -left-1'
                    }`}
                  >
                    <TechLogo id={sat.id} name={sat.name} className="w-3.5 h-3.5" />
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Group active category skills by tier
  const coreSkills = activeCategory.skills.filter((s) => getSkillTier(s.id) === 'core');
  const profSkills = activeCategory.skills.filter((s) => getSkillTier(s.id) === 'professional');
  const ecoSkills = activeCategory.skills.filter((s) => getSkillTier(s.id) === 'ecosystem');

  const renderTierSkillButton = (skill: SkillItem, tier: 'core' | 'professional' | 'ecosystem') => {
    const isFocused = focusedSkillId === skill.id;
    const isRelated = relatedIds.includes(skill.id);
    const isDimmed = Boolean(focusedSkillId && !isFocused && !isRelated);

    return (
      <button
        key={skill.id}
        type="button"
        onClick={() => onSelectSkill(skill.id)}
        aria-pressed={isFocused}
        aria-label={`${skill.name} (${tier} tier)`}
        className={`relative flex items-center gap-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
          tier === 'core'
            ? 'p-3.5 min-h-[60px]'
            : tier === 'professional'
            ? 'p-3 min-h-[52px]'
            : 'p-2.5 min-h-[46px]'
        } ${
          isFocused
            ? 'bg-[#190E3A]/95 border-white shadow-[0_0_24px_rgba(168,85,247,0.5)] scale-[1.01]'
            : isRelated
            ? 'bg-[#140B2E]/90 border-purple-300/65 shadow-[0_0_14px_rgba(192,132,252,0.3)]'
            : isDimmed
            ? 'bg-[#090518]/50 border-white/5 opacity-45'
            : tier === 'core'
            ? 'bg-[#110926]/90 border-white/25'
            : tier === 'professional'
            ? 'bg-[#0C061C]/80 border-white/15'
            : 'bg-[#080414]/70 border-white/10'
        }`}
      >
        <div
          className={`flex items-center justify-center shrink-0 rounded-full border ${
            tier === 'core'
              ? 'w-11 h-11 border-white/35'
              : tier === 'professional'
              ? 'w-9 h-9 border-white/20'
              : 'w-7.5 h-7.5 border-white/15'
          }`}
          style={{
            background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22) 0%, ${skill.brandColor}40 45%, rgba(9,5,22,0.95) 100%)`,
          }}
        >
          <TechLogo
            id={skill.id}
            name={skill.name}
            className={
              tier === 'core'
                ? 'w-6 h-6'
                : tier === 'professional'
                ? 'w-4.5 h-4.5'
                : 'w-4 h-4'
            }
          />
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <span
              className={`font-mono font-semibold truncate ${
                tier === 'core'
                  ? 'text-sm text-white'
                  : tier === 'professional'
                  ? 'text-xs text-white/95'
                  : 'text-xs text-white/80'
              }`}
            >
              {skill.name}
            </span>
            {isRelated && (
              <span className="font-mono text-[9px] uppercase tracking-wider text-purple-300 shrink-0">
                Related
              </span>
            )}
          </div>
          {tier === 'core' && (
            <p className="mt-0.5 text-[11px] text-white/60 line-clamp-1">
              {skill.insight}
            </p>
          )}
        </div>
      </button>
    );
  };

  // ─── LEVEL 2 & 3: MOBILE EXPANDED CATEGORY & SKILL FOCUS ───
  return (
    <div
      className="w-full px-4 py-2 flex flex-col gap-4 select-none"
      data-testid="mobile-expanded-category"
    >
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] active:bg-white/[0.15] border border-white/15 font-mono text-xs text-white cursor-pointer"
        >
          ← All Categories
        </button>

        <span className="font-mono text-[11px] uppercase tracking-wider text-purple-200/80">
          {activeCategory.number} · {activeCategory.shortLabel}
        </span>
      </div>

      {/* Category Header */}
      <div className="p-4 rounded-2xl bg-[#0B061E]/85 border border-purple-400/25">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-purple-300/80">
          Constellation {activeCategory.number} · {activeCategory.skills.length} Technologies
        </div>
        <h3 className="mt-1 font-mono text-lg font-bold text-white">
          {activeCategory.title}
        </h3>
        <p className="mt-0.5 text-xs text-white/65">
          {activeCategory.subtitle}
        </p>
      </div>

      {/* LEVEL 3: Persistent Focused Skill Inspector Drawer */}
      {focusedSkill && (
        <div
          className="p-4 rounded-2xl bg-[#130A2E]/95 border border-purple-400/60 shadow-[0_8px_30px_rgba(112,66,248,0.35)] flex flex-col gap-3.5"
          role="region"
          aria-label={`Focused skill ${focusedSkill.name}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl border border-white/30 flex items-center justify-center p-2.5 shrink-0"
                style={{
                  background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25) 0%, ${focusedSkill.brandColor}45 50%, rgba(10,5,24,0.95) 100%)`,
                }}
              >
                <TechLogo id={focusedSkill.id} name={focusedSkill.name} className="w-full h-full" />
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-purple-200/80">
                  {getSkillTier(focusedSkill.id).toUpperCase()} TIER · {focusedSkill.categoryId.toUpperCase()}
                </div>
                <h4 className="font-mono text-base font-bold text-white">
                  {focusedSkill.name}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={onClearSkillFocus}
              aria-label="Close skill focus"
              className="px-2.5 py-1.5 rounded-lg bg-white/10 text-xs font-mono text-white/85 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <p className="text-xs sm:text-sm leading-relaxed text-white/90">
            {focusedSkill.insight}
          </p>

          {getSkillEditorialSummary(focusedSkill.id) !== focusedSkill.insight && (
            <p className="text-xs leading-relaxed text-purple-200/75">
              {getSkillEditorialSummary(focusedSkill.id)}
            </p>
          )}

          {/* Related Technologies */}
          <div className="pt-2 border-t border-white/10">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 mb-2">
              Related Technologies ({relatedSkills.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedSkills.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => onSelectSkill(rel.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.07] active:bg-purple-500/30 border border-white/20 text-xs font-mono text-white cursor-pointer"
                >
                  <TechLogo id={rel.id} name={rel.name} className="w-3.5 h-3.5" />
                  <span>{rel.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tier 1: CORE */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-amber-300/90 px-1">
          <span>Core Technologies · Inner Gravity</span>
          <span>{coreSkills.length}</span>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {coreSkills.map((s) => renderTierSkillButton(s, 'core'))}
        </div>
      </div>

      {/* Tier 2: PROFESSIONAL */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-cyan-300/90 px-1">
          <span>Professional · Secondary Orbit</span>
          <span>{profSkills.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {profSkills.map((s) => renderTierSkillButton(s, 'professional'))}
        </div>
      </div>

      {/* Tier 3: ECOSYSTEM */}
      {ecoSkills.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-purple-300/80 px-1">
            <span>Ecosystem · Outer Halo</span>
            <span>{ecoSkills.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ecoSkills.map((s) => renderTierSkillButton(s, 'ecosystem'))}
          </div>
        </div>
      )}
    </div>
  );
});

MobileSkillsConstellation.displayName = 'MobileSkillsConstellation';
export default MobileSkillsConstellation;
