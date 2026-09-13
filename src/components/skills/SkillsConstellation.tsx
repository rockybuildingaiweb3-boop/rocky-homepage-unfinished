import React, { useState, useEffect, memo } from 'react';
import { SKILLS_DATA } from '../../data/skills';
import { SkillNode } from './SkillNode';
import {
  DESKTOP_CONSTELLATION,
  MOBILE_CONSTELLATION,
  ConstellationLayout,
} from '../../features/skills/constellationLayout';

interface SkillsConstellationProps {
  activeSkillId: string | null;
  onHoverSkill: (id: string) => void;
  onLeaveSkill: () => void;
}

/**
 * SkillsConstellation (Skills V2)
 *
 * Authored, deterministic 2D spatial field framing the central purple planet.
 * Replaces all radial/orbital geometry with an organic technical ecosystem.
 *
 * Characteristics:
 * - 100% deterministic (zero Math.random(), stable seeded calculation)
 * - 2D Cartesian spatial field with high radial distance variance and natural asymmetry
 * - Cross-disciplinary ecosystem weaving with intentional negative space corridors
 * - Guaranteed planet exclusion clearance and node collision avoidance
 * - Secondary restrained editorial category annotations (non-interactive)
 * - Pure single-skill hover synchronization with Knowledge Canopy
 * - True constellation layout maintained on both desktop and mobile
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

        {/* ─── 2. 88 DETERMINISTIC SPATIAL SKILL NODES ─── */}
        {SKILLS_DATA.map((skill) => {
          const pos = activeLayout.nodePositions.get(skill.id) || {
            x: 50,
            y: 50,
            categoryId: skill.categoryId,
          };
          const isActive = activeSkillId === skill.id;

          return (
            <div
              key={skill.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 scale-80 sm:scale-90 md:scale-100 transition-transform origin-center"
            >
              <SkillNode
                skill={skill}
                isActive={isActive}
                onHover={onHoverSkill}
                onLeave={onLeaveSkill}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

SkillsConstellation.displayName = 'SkillsConstellation';
