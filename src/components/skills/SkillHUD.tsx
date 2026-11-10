import React, { memo } from 'react';
import { SkillItem, SKILL_CATEGORIES } from '../../data/skills';
import {
  getSkillEditorialSummary,
  getRelatedSkillIds,
  getSkillTier,
} from '../../features/skills/skillRelationships';
import {
  CATEGORY_CONSTELLATIONS,
  CategoryConstellationCluster,
} from '../../features/skills/constellationLayout';
import { TechLogo } from './TechLogo';

interface SkillHUDProps {
  /** Currently displayed skill (either locked focus or hovered preview) */
  activeSkill: SkillItem | null;
  /** True when activeSkill is locked via click (Level 3 persistent focus) */
  isLockedFocus: boolean;
  /** Currently expanded category ID (Level 2) */
  selectedCategoryId: string | null;
  /** Currently hovered category ID in Level 1 */
  hoveredCategoryId?: string | null;
  allSkills: SkillItem[];
  onSelectCategory: (categoryId: string | null) => void;
  onSelectSkill: (skillId: string) => void;
  onClearSkillFocus: () => void;
  onHoverSkill: (id: string) => void;
  onLeaveSkill: () => void;
}

/**
 * SkillHUD
 *
 * Cosmic System Interface & Persistent Skill Inspector integrated into the
 * constellation environment across all three interaction levels:
 * - Level 1: Category Constellation Overview & Hovered Discipline Preview
 * - Level 2: Expanded Category Constellation Telemetry & Tier Legend
 * - Level 3: Persistent Focused Technology Inspector with Interactive Related Technologies
 */
export const SkillHUD: React.FC<SkillHUDProps> = memo(({
  activeSkill,
  isLockedFocus,
  selectedCategoryId,
  hoveredCategoryId = null,
  allSkills,
  onSelectCategory,
  onSelectSkill,
  onClearSkillFocus,
  onHoverSkill,
  onLeaveSkill,
}) => {
  const editorialQuote = activeSkill
    ? getSkillEditorialSummary(activeSkill.id)
    : null;

  const relatedIds = activeSkill ? getRelatedSkillIds(activeSkill.id).slice(0, 6) : [];
  const relatedSkills = relatedIds
    .map((id) => allSkills.find((s) => s.id === id))
    .filter((s): s is SkillItem => Boolean(s));

  const skillTier = activeSkill ? getSkillTier(activeSkill.id) : null;
  const skillCategory = activeSkill
    ? SKILL_CATEGORIES.find((c) => c.id === activeSkill.categoryId)
    : null;

  const activeCategoryCluster: CategoryConstellationCluster | null =
    selectedCategoryId
      ? CATEGORY_CONSTELLATIONS.find((c) => c.id === selectedCategoryId) || null
      : hoveredCategoryId
      ? CATEGORY_CONSTELLATIONS.find((c) => c.id === hoveredCategoryId) || null
      : null;

  return (
    <div
      className="relative w-full max-w-[1120px] mx-auto px-4 sm:px-6 my-4 select-none z-30"
      role="region"
      aria-label="Constellation telemetry and skill inspector"
    >
      <div
        className={`relative overflow-hidden rounded-xl transition-all duration-300 ease-out border ${
          activeSkill
            ? 'bg-[#090518]/92 border-purple-400/45 shadow-[0_8px_36px_rgba(112,66,248,0.26),inset_0_1px_1px_rgba(255,255,255,0.16)]'
            : activeCategoryCluster
            ? 'bg-[#080515]/88 border-purple-500/30 shadow-[0_4px_24px_rgba(112,66,248,0.16)]'
            : 'bg-[#070412]/75 border-white/10'
        }`}
      >
        {/* Top Luminous Horizon Line */}
        <div
          className={`
            absolute top-0 left-0 right-0 h-[1.5px] transition-opacity duration-500
            ${
              activeSkill || activeCategoryCluster
                ? 'bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-100'
                : 'bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-50'
            }
          `}
        />

        {/* ─── STATE A: LEVEL 3 INDIVIDUAL SKILL FOCUS (LOCKED OR PREVIEW) ─── */}
        {activeSkill ? (
          <div className="p-4 sm:p-6 flex flex-col gap-5">
            {/* Top Navigation & Status Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-white/65">
                <span>{skillCategory?.number || activeSkill.categoryNumber}</span>
                <span aria-hidden="true" className="text-white/25">·</span>
                <span className="text-purple-200/90">
                  {skillCategory?.title || activeSkill.categoryId}
                </span>
                <span aria-hidden="true" className="text-white/25">·</span>
                <span
                  className={
                    skillTier === 'core'
                      ? 'text-amber-300 font-semibold'
                      : skillTier === 'professional'
                      ? 'text-cyan-300 font-semibold'
                      : 'text-purple-300'
                  }
                >
                  {skillTier === 'core'
                    ? 'Core Tier'
                    : skillTier === 'professional'
                    ? 'Professional Tier'
                    : 'Ecosystem Tier'}
                </span>
                <span aria-hidden="true" className="text-white/25">·</span>
                <span className="text-white/50">
                  {isLockedFocus ? 'Focused Selection' : 'Preview'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedCategoryId && (
                  <button
                    type="button"
                    onClick={() => onSelectCategory(null)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/15 text-xs font-mono text-white/80 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    ← All Categories
                  </button>
                )}
                {isLockedFocus && (
                  <button
                    type="button"
                    onClick={onClearSkillFocus}
                    aria-label="Close skill focus"
                    className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/45 text-xs font-mono text-purple-100 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                  >
                    ✕ Clear Focus
                  </button>
                )}
              </div>
            </div>

            {/* Main Content Row: Skill Identity & Insights + Related Technologies */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              {/* Left Column: Authentic Logo, Title, & Technical Insights */}
              <div className="flex items-start gap-4 max-w-2xl">
                <div
                  className="relative flex items-center justify-center shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-white/25 p-3"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22) 0%, ${activeSkill.brandColor}35 45%, rgba(10,6,24,0.95) 100%)`,
                    boxShadow: `0 0 24px ${activeSkill.brandColor}40`,
                  }}
                >
                  <TechLogo
                    id={activeSkill.id}
                    name={activeSkill.name}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="font-mono text-lg sm:text-xl font-bold tracking-wide text-white">
                    {activeSkill.name}
                  </h3>

                  {/* Primary Verified Technical Insight */}
                  <p className="mt-1.5 text-sm sm:text-[15px] leading-relaxed text-white/90 font-normal">
                    {activeSkill.insight}
                  </p>

                  {/* Secondary Architectural Context if different from primary insight */}
                  {editorialQuote && editorialQuote !== activeSkill.insight && (
                    <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-purple-200/70 font-normal">
                      {editorialQuote}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Related Technologies (3–6 Genuine Connections) */}
              <div className="flex flex-col lg:items-end shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55 mb-2.5">
                  Related Technologies ({relatedSkills.length})
                </div>

                <div className="flex flex-wrap lg:justify-end gap-2 max-w-md">
                  {relatedSkills.map((rel) => {
                    const relTier = getSkillTier(rel.id);
                    return (
                      <button
                        key={rel.id}
                        type="button"
                        onClick={() => onSelectSkill(rel.id)}
                        onMouseEnter={() => {
                          if (!isLockedFocus) onHoverSkill(rel.id);
                        }}
                        onMouseLeave={() => {
                          if (!isLockedFocus) onLeaveSkill();
                        }}
                        aria-label={`Focus related technology ${rel.name}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-purple-500/20 border border-white/15 hover:border-purple-300/50 text-xs font-mono text-white/90 hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
                      >
                        <TechLogo id={rel.id} name={rel.name} className="w-4 h-4 shrink-0" />
                        <span>{rel.name}</span>
                        <span className="text-[10px] text-white/45 uppercase">
                          · {relTier === 'core' ? 'Core' : relTier === 'professional' ? 'Pro' : 'Eco'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : activeCategoryCluster ? (
          /* ─── STATE B: LEVEL 2 EXPANDED CATEGORY OVERVIEW (OR LEVEL 1 HOVER PREVIEW) ─── */
          <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-2xl">
              <div
                className="flex items-center justify-center shrink-0 w-12 h-12 rounded-xl border border-white/20 p-2.5"
                style={{
                  background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.2) 0%, ${activeCategoryCluster.accentColor}35 50%, rgba(10,6,24,0.92) 100%)`,
                }}
              >
                <TechLogo
                  id={activeCategoryCluster.nucleusSkill.id}
                  name={activeCategoryCluster.nucleusSkill.name}
                  className="w-full h-full"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-purple-300/80">
                  <span>Constellation {activeCategoryCluster.number}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeCategoryCluster.skills.length} Technologies</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-white/60">
                    {activeCategoryCluster.tierCounts.core} Core / {activeCategoryCluster.tierCounts.professional} Professional / {activeCategoryCluster.tierCounts.ecosystem} Ecosystem
                  </span>
                </div>
                <h3 className="mt-0.5 font-mono text-base sm:text-lg font-bold tracking-wide text-white">
                  {activeCategoryCluster.title}
                </h3>
                <p className="mt-0.5 text-xs sm:text-[13px] text-white/65">
                  {activeCategoryCluster.subtitle} — Click any technology node to lock focus and inspect its relationships.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {selectedCategoryId ? (
                <button
                  type="button"
                  onClick={() => onSelectCategory(null)}
                  className="px-3.5 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/35 border border-purple-400/45 text-xs font-mono text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  ← All Categories
                </button>
              ) : (
                <span className="font-mono text-xs text-purple-200/80">
                  Click constellation to expand {activeCategoryCluster.skills.length} nodes →
                </span>
              )}
            </div>
          </div>
        ) : (
          /* ─── STATE C: LEVEL 1 CONSTELLATION OVERVIEW DEFAULT ─── */
          <div className="p-4 sm:px-6 sm:py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col">
              <div className="font-mono text-xs tracking-wider uppercase text-white/80">
                8 Technological Constellations · 88 Validated Instruments
              </div>
              <p className="mt-0.5 text-xs sm:text-[13px] text-white/55">
                Select any orbital constellation to expand its Core, Professional, and Ecosystem technology tiers.
              </p>
            </div>

            {/* Quick-access Constellation Bar for keyboard & direct navigation */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORY_CONSTELLATIONS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-purple-500/20 border border-white/10 hover:border-purple-400/40 font-mono text-[10px] tracking-wider uppercase text-white/75 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  {cat.number} {cat.shortLabel}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SkillHUD.displayName = 'SkillHUD';
export default SkillHUD;
