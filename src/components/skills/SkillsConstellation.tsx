import React, { useState, useEffect, useMemo, memo } from 'react';
import { SKILLS_DATA, SkillItem } from '../../data/skills';
import { SkillNode } from './SkillNode';
import { CategoryConstellationNode } from './CategoryConstellationNode';
import { ConstellationEnergyLines } from './ConstellationEnergyLines';
import { SkillHUD } from './SkillHUD';
import { MobileSkillsConstellation } from './MobileSkillsConstellation';
import {
  CATEGORY_CONSTELLATIONS,
  computeExpandedCategoryLayout,
  ExpandedCategoryConstellation,
} from '../../features/skills/constellationLayout';
import { getRelatedSkillIds } from '../../features/skills/skillRelationships';

interface SkillsConstellationProps {
  selectedCategoryId: string | null;
  focusedSkillId: string | null;
  hoveredSkillId: string | null;
  hoveredCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectSkill: (skillId: string) => void;
  onClearSkillFocus: () => void;
  onHoverSkill: (id: string) => void;
  onLeaveSkill: () => void;
  onHoverCategory: (categoryId: string) => void;
  onLeaveCategory: () => void;
}

/**
 * SkillsConstellation
 *
 * Three-Level Hierarchical Technical Constellation framing the central purple planet:
 * - Level 1 (Category Constellation Overview): 8 distinct technological constellations
 *   orbiting the central celestial body.
 * - Level 2 (Expanded Category Constellation): Selected category expands into 3 distinct
 *   gravitational orbital tiers (Core, Professional, Ecosystem) while other categories
 *   recede to peripheral horizon satellites.
 * - Level 3 (Individual Skill Focus): Persistent click selection locking a technology,
 *   highlighting 3–6 genuinely related technologies, drawing selective relationship lines,
 *   and revealing architectural insights in the cosmic HUD.
 */
export const SkillsConstellation: React.FC<SkillsConstellationProps> = memo(({
  selectedCategoryId,
  focusedSkillId,
  hoveredSkillId,
  hoveredCategoryId,
  onSelectCategory,
  onSelectSkill,
  onClearSkillFocus,
  onHoverSkill,
  onLeaveSkill,
  onHoverCategory,
  onLeaveCategory,
}) => {
  // Responsive mobile breakpoint detection (< 768px uses dedicated MobileSkillsConstellation)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Effective active skill ID: Persistent focus (Level 3) takes priority over temporary hover preview
  const effectiveSkillId = focusedSkillId || hoveredSkillId;

  const activeSkill: SkillItem | null = useMemo(() => {
    if (!effectiveSkillId) return null;
    return SKILLS_DATA.find((s) => s.id === effectiveSkillId) ?? null;
  }, [effectiveSkillId]);

  // Derived related skill IDs (selective 3–6 relationships)
  const relatedSkillIds: string[] = useMemo(() => {
    if (!effectiveSkillId) return [];
    return getRelatedSkillIds(effectiveSkillId).slice(0, 6);
  }, [effectiveSkillId]);

  // Compute Level 2 / Level 3 Expanded Category Layout when a category is selected
  const expandedLayout: ExpandedCategoryConstellation | null = useMemo(() => {
    if (!selectedCategoryId) return null;
    return computeExpandedCategoryLayout(selectedCategoryId, effectiveSkillId);
  }, [selectedCategoryId, effectiveSkillId]);

  // Node position map for ConstellationEnergyLines
  const activeNodePositionMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    if (expandedLayout) {
      expandedLayout.nodes.forEach((n) => {
        map.set(n.skill.id, { x: n.x, y: n.y });
      });
    }
    return map;
  }, [expandedLayout]);

  // Hovered category coordinates for Level 1 tether
  const hoveredCategoryPos = useMemo(() => {
    if (selectedCategoryId || !hoveredCategoryId) return null;
    const found = CATEGORY_CONSTELLATIONS.find((c) => c.id === hoveredCategoryId);
    if (!found) return null;
    return { x: found.x, y: found.y, color: found.accentColor };
  }, [selectedCategoryId, hoveredCategoryId]);

  // Mobile-First Dedicated Presentation Strategy
  if (isMobile) {
    return (
      <MobileSkillsConstellation
        selectedCategoryId={selectedCategoryId}
        focusedSkillId={focusedSkillId}
        onSelectCategory={onSelectCategory}
        onSelectSkill={onSelectSkill}
        onClearSkillFocus={onClearSkillFocus}
      />
    );
  }

  return (
    <div
      className="relative w-full max-w-[1380px] mx-auto px-4 flex flex-col items-center select-none"
      data-testid="desktop-constellation"
      data-level={focusedSkillId ? '3' : selectedCategoryId ? '2' : '1'}
    >
      {/* ─── TOP SPATIAL NAVIGATION & HIERARCHY BAR ─── */}
      <div className="w-full max-w-[1120px] flex flex-col gap-2 mb-1 px-2 z-30">
        {selectedCategoryId && expandedLayout ? (
          <>
            <div className="w-full flex flex-wrap items-center justify-between gap-3">
              {/* Left: Back to All Categories + Active Constellation Title */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onSelectCategory(null)}
                  aria-label="Back to All Categories"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#120A2A]/90 hover:bg-purple-500/25 border border-purple-400/45 text-xs font-mono uppercase tracking-wider text-white transition-all duration-200 cursor-pointer shadow-[0_0_18px_rgba(112,66,248,0.25)]"
                >
                  <span>← All Categories</span>
                </button>

                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white/90">
                  <span className="text-purple-300">{expandedLayout.category.number}</span>
                  <span aria-hidden="true" className="text-white/30">·</span>
                  <span className="font-semibold">{expandedLayout.category.title}</span>
                  <span aria-hidden="true" className="text-white/30">·</span>
                  <span className="text-white/55 tabular-nums">
                    {expandedLayout.category.skills.length} instruments
                  </span>
                </div>
              </div>

              {/* Right: 3-Tier Orbital Hierarchy Legend & Focus Reset */}
              <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-white/65">
                <div className="hidden md:flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border border-white/80 bg-purple-400/50" />
                    <span>Core ({expandedLayout.category.tierCounts.core})</span>
                  </span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full border border-white/45 bg-purple-400/25" />
                    <span>Professional ({expandedLayout.category.tierCounts.professional})</span>
                  </span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full border border-white/30 bg-white/10" />
                    <span>Ecosystem ({expandedLayout.category.tierCounts.ecosystem})</span>
                  </span>
                </div>

                {focusedSkillId && (
                  <button
                    type="button"
                    onClick={onClearSkillFocus}
                    className="px-2.5 py-1 rounded-md bg-purple-500/25 hover:bg-purple-500/40 border border-purple-300/50 text-white text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    ✕ Clear Focus (Esc)
                  </button>
                )}
              </div>
            </div>

            {/* Recessed Peripheral Constellation Switcher Horizon */}
            <div className="w-full flex flex-wrap items-center gap-1.5 pt-1">
              {CATEGORY_CONSTELLATIONS.map((cluster) => {
                if (cluster.id === selectedCategoryId) return null;
                return (
                  <CategoryConstellationNode
                    key={cluster.id}
                    cluster={cluster}
                    isHovered={hoveredCategoryId === cluster.id}
                    isRecessed={true}
                    onSelectCategory={onSelectCategory}
                    onHoverCategory={onHoverCategory}
                    onLeaveCategory={onLeaveCategory}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <div className="w-full flex items-center justify-between text-white/55 font-mono text-[11px] uppercase tracking-[0.18em]">
            <span>Level 01 · Category Constellation Overview</span>
            <span className="hidden sm:inline text-purple-200/70">
              Select any of the 8 orbital constellations to expand its technologies
            </span>
          </div>
        )}
      </div>

      {/* ─── UNIFIED SPATIAL CONSTELLATION STAGE ─── */}
      <div
        onClick={() => {
          if (focusedSkillId) {
            onClearSkillFocus();
          }
        }}
        className="relative w-full h-[460px] lg:h-[480px] overflow-visible"
      >
        {/* ─── 1. SELECTIVE ENERGY CONDUITS & GRAVITATIONAL TIER RINGS ─── */}
        <ConstellationEnergyLines
          hoveredSkillId={effectiveSkillId}
          isLockedFocus={Boolean(focusedSkillId)}
          relatedSkillIds={relatedSkillIds}
          nodePositions={activeNodePositionMap}
          brandColor={
            activeSkill?.brandColor ||
            expandedLayout?.category.accentColor ||
            '#A855F7'
          }
          tierRings={expandedLayout ? expandedLayout.tierRings : null}
          hoveredCategoryPos={hoveredCategoryPos}
        />

        {/* ─── 2. EIGHT CATEGORY CONSTELLATION CLUSTERS (LEVEL 1 OVERVIEW) ─── */}
        {!selectedCategoryId &&
          CATEGORY_CONSTELLATIONS.map((cluster) => (
            <div
              key={cluster.id}
              style={{ left: `${cluster.x}%`, top: `${cluster.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
            >
              <CategoryConstellationNode
                cluster={cluster}
                isHovered={hoveredCategoryId === cluster.id}
                isRecessed={false}
                onSelectCategory={onSelectCategory}
                onHoverCategory={onHoverCategory}
                onLeaveCategory={onLeaveCategory}
              />
            </div>
          ))}

        {/* ─── 3. EXPANDED CATEGORY SKILL NODES (LEVEL 2 & LEVEL 3) ─── */}
        {expandedLayout &&
          expandedLayout.nodes.map((nodePos) => {
            const { skill, x, y, isCrossCategoryRelated, driftPhase } = nodePos;
            const isFocused = focusedSkillId === skill.id;
            const isHovered = !focusedSkillId && hoveredSkillId === skill.id;
            const isRelated = relatedSkillIds.includes(skill.id);
            const isDimmed = Boolean(
              effectiveSkillId &&
                effectiveSkillId !== skill.id &&
                !isRelated
            );

            return (
              <div
                key={skill.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
              >
                <SkillNode
                  skill={skill}
                  isFocused={isFocused}
                  isHovered={isHovered}
                  isRelated={isRelated}
                  isDimmed={isDimmed}
                  isCrossCategoryRelated={isCrossCategoryRelated}
                  driftPhase={driftPhase}
                  onSelect={onSelectSkill}
                  onHover={onHoverSkill}
                  onLeave={onLeaveSkill}
                />
              </div>
            );
          })}
      </div>

      {/* ─── 4. COSMIC SYSTEM INTERFACE / SKILL FOCUS HUD ─── */}
      <SkillHUD
        activeSkill={activeSkill}
        isLockedFocus={Boolean(focusedSkillId)}
        selectedCategoryId={selectedCategoryId}
        hoveredCategoryId={hoveredCategoryId}
        allSkills={SKILLS_DATA}
        onSelectCategory={onSelectCategory}
        onSelectSkill={onSelectSkill}
        onClearSkillFocus={onClearSkillFocus}
        onHoverSkill={onHoverSkill}
        onLeaveSkill={onLeaveSkill}
      />
    </div>
  );
});

SkillsConstellation.displayName = 'SkillsConstellation';
export default SkillsConstellation;
