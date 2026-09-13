import React, { useMemo, memo } from 'react';
import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';
import { SkillNode } from './SkillNode';

interface SkillsConstellationProps {
  activeSkillId: string | null;
  onHoverSkill: (id: string) => void;
  onLeaveSkill: () => void;
}

// 8 Celestial Sector angles around the central planet
const SECTOR_CENTER_ANGLES: Record<string, number> = {
  frontend: -90, // North
  graphics: -45, // North-East
  backend: 0,    // East
  data: 45,      // South-East
  web3: 90,      // South
  models: 135,   // South-West
  agents: 180,   // West
  rag: 225,      // North-West
};

// 11-slot orbital layout distribution within each 45° sector
// 3 concentric orbital rings: Arc 1 (inner, r=28%), Arc 2 (mid, r=38%), Arc 3 (outer, r=47%)
const SECTOR_SLOTS = [
  // Arc 1 (3 items):
  { arc: 1, deltaAngle: -11 },
  { arc: 1, deltaAngle: 0 },
  { arc: 1, deltaAngle: 11 },
  // Arc 2 (4 items):
  { arc: 2, deltaAngle: -16 },
  { arc: 2, deltaAngle: -5 },
  { arc: 2, deltaAngle: 5 },
  { arc: 2, deltaAngle: 16 },
  // Arc 3 (4 items):
  { arc: 3, deltaAngle: -19 },
  { arc: 3, deltaAngle: -6 },
  { arc: 3, deltaAngle: 6 },
  { arc: 3, deltaAngle: 19 },
];

const ARC_RADII: Record<number, { rx: number; ry: number }> = {
  1: { rx: 28, ry: 25 },
  2: { rx: 38, ry: 35 },
  3: { rx: 47, ry: 43 },
};

export const SkillsConstellation: React.FC<SkillsConstellationProps> = memo(({
  activeSkillId,
  onHoverSkill,
  onLeaveSkill,
}) => {
  // Deterministic positions for the 88 skills framing the central planet (Desktop/Tablet)
  const skillPositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();

    SKILLS_DATA.forEach((skill, idx) => {
      const baseAngle = SECTOR_CENTER_ANGLES[skill.categoryId];
      const slotIndex = idx % 11;
      const slot = SECTOR_SLOTS[slotIndex];

      const angleDeg = baseAngle + slot.deltaAngle;
      const angleRad = (angleDeg * Math.PI) / 180;
      const { rx, ry } = ARC_RADII[slot.arc];

      // Elliptical coordinate centered at (50%, 50%)
      const x = 50 + rx * Math.cos(angleRad);
      const y = 50 + ry * Math.sin(angleRad);

      map.set(skill.id, {
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
      });
    });

    return map;
  }, []);

  // Category label anchor positions (just beyond outer arc)
  const categoryLabels = useMemo(() => {
    return SKILL_CATEGORIES.map((category) => {
      const angleDeg = SECTOR_CENTER_ANGLES[category.id];
      const angleRad = (angleDeg * Math.PI) / 180;
      const rx = 49.5;
      const ry = 46.5;

      const x = 50 + rx * Math.cos(angleRad);
      const y = 50 + ry * Math.sin(angleRad);

      return {
        ...category,
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
      };
    });
  }, []);

  return (
    <div className="relative w-full max-w-[1380px] mx-auto px-2 sm:px-4 flex flex-col items-center">
      {/* ─── DESKTOP / TABLET: SPATIAL ORBITAL CONSTELLATION (>= 768px) ─── */}
      <div className="hidden md:block relative w-full h-[760px] lg:h-[840px] xl:h-[900px] select-none">
        {/* Category Celestial Sector Typographic Badges */}
        {categoryLabels.map((cat) => {
          return (
            <div
              key={cat.id}
              style={{ left: `${cat.x}%`, top: `${cat.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 transition-all duration-300"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 backdrop-blur-xs border-white/[0.06] bg-black/20 text-white/40">
                <span className="font-mono text-[9px] tracking-widest uppercase">
                  [{cat.number} // {cat.title.split('&')[0].trim()}]
                </span>
              </div>
            </div>
          );
        })}

        {/* 88 Deterministic Skill Nodes */}
        {SKILLS_DATA.map((skill) => {
          const pos = skillPositions.get(skill.id) || { x: 50, y: 50 };
          const isActive = activeSkillId === skill.id;

          return (
            <div
              key={skill.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
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

      {/* ─── MOBILE: ADAPTED COSMIC SECTOR FLOW (< 768px) ─── */}
      <div className="md:hidden w-full flex flex-col gap-6 py-4 px-2">
        {SKILL_CATEGORIES.map((cat) => {
          const categorySkills = SKILLS_DATA.filter((s) => s.categoryId === cat.id);

          return (
            <div
              key={cat.id}
              className="flex flex-col rounded-2xl border p-3.5 transition-all duration-300 backdrop-blur-md border-white/[0.08] bg-black/25"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-purple-300/80">
                    [{cat.number}]
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-white/90">
                    {cat.title}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-white/35">11 instruments</span>
              </div>

              {/* 11 Skills Flow */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {categorySkills.map((skill) => {
                  const isActive = activeSkillId === skill.id;

                  return (
                    <SkillNode
                      key={skill.id}
                      skill={skill}
                      isActive={isActive}
                      onHover={onHoverSkill}
                      onLeave={onLeaveSkill}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

SkillsConstellation.displayName = 'SkillsConstellation';
