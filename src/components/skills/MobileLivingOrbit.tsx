import React, { useState, useEffect, useMemo } from 'react';
import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import {
  FEATURED_ANCHOR_SPECS,
  getRelatedSkillIds,
} from '../../features/skills/livingOrbitEngine';
import { TechLogo } from './TechLogo';
import { SkillFocusCard } from './SkillFocusCard';

interface MobileLivingOrbitProps {
  selectedCategoryId: string | null;
  focusedSkillId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectSkill: (skillId: string) => void;
  onClearSkillFocus: () => void;
}

const SHORT_CATEGORY_NAMES: Record<string, string> = {
  frontend: 'Frontend',
  graphics: 'Spatial & 3D',
  backend: 'Backend',
  data: 'Data & Infra',
  web3: 'Web3',
  models: 'AI Models',
  agents: 'AI Agents',
  rag: 'RAG & Vector',
};

/**
 * Asymmetric 14-point mobile spatial coordinates in `All` mode:
 * - First 7 slots: Featured Core Anchors (large, foreground)
 * - Next 7 slots: Secondary cycling marks (midground/ambient)
 * Leaves the central planet core (50%, 48%) visible.
 */
const MOBILE_ALL_SLOTS: readonly {
  x: number;
  y: number;
  size: number;
  isFeatured: boolean;
}[] = [
  // 7 Featured Core Anchors
  { x: 22, y: 24, size: 48, isFeatured: true }, // TypeScript
  { x: 52, y: 12, size: 44, isFeatured: true }, // React
  { x: 80, y: 22, size: 48, isFeatured: true }, // OpenAI
  { x: 18, y: 56, size: 46, isFeatured: true }, // Three.js
  { x: 83, y: 52, size: 42, isFeatured: true }, // LangGraph
  { x: 74, y: 78, size: 44, isFeatured: true }, // Solidity
  { x: 30, y: 80, size: 42, isFeatured: true }, // PostgreSQL
  // 7 Secondary Midground/Ambient Slots (flanking the planet without covering its core)
  { x: 14, y: 10, size: 32, isFeatured: false },
  { x: 86, y: 9, size: 32, isFeatured: false },
  { x: 14, y: 39, size: 34, isFeatured: false },
  { x: 86, y: 37, size: 34, isFeatured: false },
  { x: 14, y: 88, size: 31, isFeatured: false },
  { x: 53, y: 89, size: 33, isFeatured: false },
  { x: 88, y: 88, size: 31, isFeatured: false },
];

/**
 * Asymmetric 11-point mobile spatial coordinates when a Category is selected.
 */
const MOBILE_CATEGORY_SLOTS: readonly { x: number; y: number; size: number }[] = [
  // Core (1..3)
  { x: 25, y: 24, size: 48 },
  { x: 75, y: 22, size: 48 },
  { x: 50, y: 12, size: 46 },
  // Professional (4..8)
  { x: 17, y: 48, size: 38 },
  { x: 83, y: 46, size: 38 },
  { x: 28, y: 69, size: 38 },
  { x: 72, y: 68, size: 38 },
  { x: 50, y: 76, size: 38 },
  // Ecosystem (9..11)
  { x: 18, y: 88, size: 32 },
  { x: 50, y: 91, size: 32 },
  { x: 82, y: 88, size: 32 },
];

/**
 * MobileLivingOrbit — Dedicated Mobile Orbital Sculpture (< 768px)
 */
export const MobileLivingOrbit: React.FC<MobileLivingOrbitProps> = ({
  selectedCategoryId,
  focusedSkillId,
  onSelectCategory,
  onSelectSkill,
  onClearSkillFocus,
}) => {
  const [waveIndex, setWaveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (selectedCategoryId || focusedSkillId || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setWaveIndex((prev) => (prev + 1) % 12);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [selectedCategoryId, focusedSkillId, prefersReducedMotion]);

  const focusedSkill = useMemo(
    () => (focusedSkillId ? SKILLS_DATA.find((s) => s.id === focusedSkillId) || null : null),
    [focusedSkillId]
  );

  const relatedSet = useMemo(() => {
    if (!focusedSkillId) return new Set<string>();
    return new Set(getRelatedSkillIds(focusedSkillId).slice(0, 5));
  }, [focusedSkillId]);

  const positionedMobileNodes = useMemo(() => {
    if (selectedCategoryId) {
      const catSkills = SKILLS_DATA.filter((s) => s.categoryId === selectedCategoryId);
      const ordered = [
        ...catSkills.filter((s) => s.tier === 'core'),
        ...catSkills.filter((s) => s.tier === 'professional'),
        ...catSkills.filter((s) => s.tier === 'ecosystem'),
      ];
      return ordered.map((skill, idx) => {
        const slot = MOBILE_CATEGORY_SLOTS[idx % MOBILE_CATEGORY_SLOTS.length];
        return {
          skill,
          x: slot.x,
          y: slot.y,
          size: slot.size,
          showLabel: true,
        };
      });
    }

    const anchorIds = new Set(FEATURED_ANCHOR_SPECS.map((a) => a.id));
    const anchorSkills = FEATURED_ANCHOR_SPECS.map(
      (a) => SKILLS_DATA.find((s) => s.id === a.id)!
    );
    const secondaryPool = SKILLS_DATA.filter((s) => !anchorIds.has(s.id));

    const secondarySlice: SkillItem[] = [];
    for (let i = 0; i < 7; i++) {
      secondarySlice.push(secondaryPool[(waveIndex * 7 + i) % secondaryPool.length]);
    }

    const combined = [...anchorSkills, ...secondarySlice];
    return combined.map((skill, idx) => {
      const slot = MOBILE_ALL_SLOTS[idx];
      return {
        skill,
        x: slot.x,
        y: slot.y,
        size: slot.size,
        showLabel: slot.isFeatured,
      };
    });
  }, [selectedCategoryId, waveIndex]);

  return (
    <div
      className="w-full px-3 flex flex-col items-center gap-2"
      onClick={() => {
        if (focusedSkillId) onClearSkillFocus();
      }}
    >
      {/* ─── 1. EDITORIAL TYPOGRAPHIC CATEGORY NAVIGATION ─── */}
      <nav
        className="w-full overflow-x-auto no-scrollbar border-b border-white/[0.07] pb-2"
        onClick={(e) => e.stopPropagation()}
        aria-label="Technology disciplines"
      >
        <div className="flex items-center gap-4 min-w-max px-2">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`relative py-1 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
              selectedCategoryId === null
                ? 'text-white after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-[9px] after:h-[1.5px] after:bg-purple-400'
                : 'text-white/45'
            }`}
          >
            All
          </button>

          {SKILL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`relative py-1 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors ${
                  isSelected
                    ? 'text-white after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-[9px] after:h-[1.5px] after:bg-purple-400'
                    : 'text-white/45'
                }`}
              >
                <span className="text-purple-300/50 mr-1 text-[9px]">{cat.number}</span>
                {SHORT_CATEGORY_NAMES[cat.id] || cat.title}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ─── 2. ASYMMETRIC MOBILE SPATIAL SCULPTURE OVER THE PLANET ─── */}
      <div className="relative w-full max-w-[420px] h-[420px] my-1 select-none">
        {positionedMobileNodes.map(({ skill, x, y, size, showLabel }, idx) => {
          const isFocused = focusedSkillId === skill.id;
          const isRelated = relatedSet.has(skill.id);
          const isDimmed = Boolean(focusedSkillId && !isFocused && !isRelated);

          return (
            <button
              key={skill.id}
              type="button"
              aria-label={`Inspect ${skill.name}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isFocused) {
                  onClearSkillFocus();
                } else {
                  onSelectSkill(skill.id);
                }
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center p-1 transition-all duration-300 cursor-pointer ${
                isDimmed ? 'opacity-20 scale-90' : 'opacity-100'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                zIndex: isFocused ? 40 : showLabel ? 25 : 15,
              }}
            >
              <div
                className={prefersReducedMotion ? '' : 'animate-cosmic-float'}
                style={{
                  animationDelay: `${(idx * 0.55) % 4}s`,
                  filter: isFocused
                    ? `drop-shadow(0 0 18px ${skill.brandColor}) drop-shadow(0 2px 6px rgba(0,0,0,0.8))`
                    : `drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 0 10px ${skill.brandColor}40)`,
                }}
              >
                <TechLogo id={skill.id} name={skill.name} size={size} />
              </div>

              {(showLabel || isFocused || isRelated) && (
                <span
                  className={`mt-1 font-mono text-[9.5px] tracking-[0.1em] whitespace-nowrap ${
                    isFocused
                      ? 'text-white font-semibold bg-[#060218]/90 px-1.5 py-0.5 rounded border border-white/15'
                      : 'text-white/80 drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]'
                  }`}
                >
                  {skill.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── 3. FOCUSED SKILL INSPECTOR CARD ─── */}
      {focusedSkill && (
        <div className="w-full px-1 z-40">
          <SkillFocusCard
            skill={focusedSkill}
            onSelectSkill={onSelectSkill}
            onClose={onClearSkillFocus}
          />
        </div>
      )}
    </div>
  );
};

export default MobileLivingOrbit;
