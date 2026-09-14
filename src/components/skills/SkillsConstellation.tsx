import React, { useState, useEffect, useMemo, memo } from 'react';
import { SKILLS_DATA, SkillItem } from '../../data/skills';
import { SkillNode } from './SkillNode';
import { ConstellationEnergyLines } from './ConstellationEnergyLines';
import { SkillHUD } from './SkillHUD';
import {
  DESKTOP_CONSTELLATION,
  MOBILE_CONSTELLATION,
  ConstellationLayout,
} from '../../features/skills/constellationLayout';
import { getRelatedSkillIds } from '../../features/skills/skillRelationships';

interface SkillsConstellationProps {
  activeSkillId: string | null;
  onHoverSkill: (id: string) => void;
  onLeaveSkill: () => void;
}

/**
 * SkillsConstellation
 *
 * Authored, deterministic 2D spatial field framing the central purple planet.
 * 
 * Interaction Layer:
 * - Three Skill Tiers (Tier 1 Core, Tier 2 Tools, Tier 3 Supporting Ecosystem)
 * - Transparent-by-default containers (removes icon-grid feeling, manifests on interaction)
 * - Hover-driven knowledge illumination:
 *   - Active node: 1.15 scale, purple/white glow, sharper icon
 *   - Related nodes: secondary illumination & subtle resonance
 *   - Subtle connection energy: soft glow conduits & particle trails
 * - Futuristic System Interface HUD:
 *   - Displays editorial knowledge quote, category, and resonating nodes
 * - Clean state architecture: Pure hover, zero click state.
 */
export const SkillsConstellation: React.FC<SkillsConstellationProps> = memo(({
  activeSkillId,
  onHoverSkill,
  onLeaveSkill,
}) => {
  // Deterministic breakpoint selection (Desktop vs Mobile spatial field)
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

  const activeLayout: ConstellationLayout = isMobile
    ? MOBILE_CONSTELLATION
    : DESKTOP_CONSTELLATION;

  // Active skill object
  const hoveredSkill: SkillItem | null = useMemo(() => {
    if (!activeSkillId) return null;
    return SKILLS_DATA.find((s) => s.id === activeSkillId) ?? null;
  }, [activeSkillId]);

  // Derived related skill IDs
  const relatedSkillIds: string[] = useMemo(() => {
    if (!activeSkillId) return [];
    return getRelatedSkillIds(activeSkillId);
  }, [activeSkillId]);

  return (
    <div className="relative w-full max-w-[1380px] mx-auto px-2 sm:px-4 flex flex-col items-center select-none">
      {/* ─── UNIFIED SPATIAL CONSTELLATION STAGE ─── */}
      <div className="relative w-full h-[960px] sm:h-[900px] md:h-[840px] lg:h-[860px] xl:h-[880px] overflow-visible">
        {/* ─── 1. SECONDARY EDITORIAL CATEGORY ANNOTATIONS (Non-interactive) ─── */}
        {activeLayout.categoryLabels.map((cat) => (
          <div
            key={cat.id}
            style={{ left: `${cat.x}%`, top: `${cat.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 select-none transition-opacity duration-300"
          >
            <div className="flex items-center gap-1.5 opacity-40 hover:opacity-60 transition-opacity">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-white/50 uppercase whitespace-nowrap">
                [{cat.number}] {cat.shortLabel}
              </span>
            </div>
          </div>
        ))}

        {/* ─── 2. SUBTLE CONNECTION ENERGY & GLOW TRAILS (Active on hover) ─── */}
        <ConstellationEnergyLines
          hoveredSkillId={activeSkillId}
          relatedSkillIds={relatedSkillIds}
          nodePositions={activeLayout.nodePositions}
          brandColor={hoveredSkill?.brandColor || '#A855F7'}
        />

        {/* ─── 3. 88 DETERMINISTIC SPATIAL SKILL NODES ─── */}
        {SKILLS_DATA.map((skill) => {
          const pos = activeLayout.nodePositions.get(skill.id) || {
            x: 50,
            y: 50,
            categoryId: skill.categoryId,
          };
          const isHovered = activeSkillId === skill.id;
          const isRelated = relatedSkillIds.includes(skill.id);
          const isDimmed = Boolean(activeSkillId && !isHovered && !isRelated);

          return (
            <div
              key={skill.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform origin-center"
            >
              <SkillNode
                skill={skill}
                isHovered={isHovered}
                isRelated={isRelated}
                isDimmed={isDimmed}
                onHover={onHoverSkill}
                onLeave={onLeaveSkill}
              />
            </div>
          );
        })}
      </div>

      {/* ─── 4. FUTURISTIC SYSTEM INTERFACE / EDITORIAL TELEMETRY HUD ─── */}
      <SkillHUD
        hoveredSkill={hoveredSkill}
        allSkills={SKILLS_DATA}
        onHoverSkill={onHoverSkill}
        onLeaveSkill={onLeaveSkill}
      />
    </div>
  );
});

SkillsConstellation.displayName = 'SkillsConstellation';
export default SkillsConstellation;
