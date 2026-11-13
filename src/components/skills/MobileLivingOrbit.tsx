import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import {
  FEATURED_ANCHOR_SPECS,
  FeaturedAnchorTier,
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
 * Asymmetric 14-point mobile spatial coordinates in `All` mode (Living Orbit 2.2):
 * - First 4 slots: Level 1 Primary Featured Anchors (OpenAI, TypeScript, React, Three.js — 48–52px)
 * - Next 4 slots: Level 2 Secondary Featured Anchors (LangGraph, PostgreSQL, FastAPI, Solidity — 38–40px)
 * - Next 6 slots: Supporting cycling ambient marks (26–28px)
 * Leaves the central planet core (50%, 48%) clear and luminous.
 */
const MOBILE_ALL_SLOTS: readonly {
  x: number;
  y: number;
  size: number;
  isFeatured: boolean;
  anchorTier: FeaturedAnchorTier | null;
}[] = [
  // 4 Primary Featured Anchors (Level 1 — Dominant Focal Anchors, 48–52px)
  { x: 80, y: 23, size: 52, isFeatured: true, anchorTier: 'primary' }, // OpenAI
  { x: 20, y: 24, size: 50, isFeatured: true, anchorTier: 'primary' }, // TypeScript
  { x: 50, y: 8.5, size: 48, isFeatured: true, anchorTier: 'primary' }, // React
  { x: 16, y: 63, size: 48, isFeatured: true, anchorTier: 'primary' }, // Three.js
  // 4 Secondary Featured Anchors (Level 2 — Supporting Focal Anchors, 38–40px)
  { x: 84, y: 55, size: 40, isFeatured: true, anchorTier: 'secondary' }, // LangGraph
  { x: 26, y: 81, size: 40, isFeatured: true, anchorTier: 'secondary' }, // PostgreSQL
  { x: 14, y: 43, size: 38, isFeatured: true, anchorTier: 'secondary' }, // FastAPI
  { x: 78, y: 78, size: 38, isFeatured: true, anchorTier: 'secondary' }, // Solidity
  // 6 Supporting Ambient Slots (placed in open channels away from anchor icons & captions)
  { x: 22, y: 7, size: 26, isFeatured: false, anchorTier: null },
  { x: 78, y: 7, size: 26, isFeatured: false, anchorTier: null },
  { x: 86, y: 39, size: 27, isFeatured: false, anchorTier: null },
  { x: 50, y: 72, size: 28, isFeatured: false, anchorTier: null },
  { x: 52, y: 92, size: 26, isFeatured: false, anchorTier: null },
  { x: 86, y: 93, size: 26, isFeatured: false, anchorTier: null },
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
      setWaveIndex((prev) => (prev + 1) % 14);
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
          anchorTier: null as FeaturedAnchorTier | null,
        };
      });
    }

    const anchorIds = new Set(FEATURED_ANCHOR_SPECS.map((a) => a.id));
    const anchorSkills = FEATURED_ANCHOR_SPECS.map(
      (a) => SKILLS_DATA.find((s) => s.id === a.id)!
    );
    const secondaryPool = SKILLS_DATA.filter((s) => !anchorIds.has(s.id));

    const secondarySlice: SkillItem[] = [];
    for (let i = 0; i < 6; i++) {
      secondarySlice.push(secondaryPool[(waveIndex * 6 + i) % secondaryPool.length]);
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
        anchorTier: slot.anchorTier,
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

      {/* ─── 2. ASYMMETRIC MOBILE 2.5D SPATIAL SCULPTURE OVER THE PLANET ─── */}
      <div
        className="relative w-full max-w-[420px] h-[435px] my-1 select-none"
        style={{ perspective: '900px', transformStyle: 'preserve-3d' }}
      >
        {positionedMobileNodes.map(({ skill, x, y, size, showLabel, anchorTier }, idx) => {
          const isFocused = focusedSkillId === skill.id;
          const isRelated = relatedSet.has(skill.id);
          const isDimmed = Boolean(focusedSkillId && !isFocused && !isRelated);
          const isPrimary = anchorTier === 'primary';
          const zPx = isFocused ? 42 : isPrimary ? 28 : showLabel ? 14 : -36;

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
              className={`absolute flex flex-col items-center justify-center p-1 transition-all duration-300 cursor-pointer ${
                isDimmed
                  ? 'opacity-20 scale-90'
                  : showLabel || isFocused || isRelated
                  ? 'opacity-100'
                  : 'opacity-80'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate3d(-50%, -50%, ${zPx}px)`,
                zIndex: isFocused ? 40 : isPrimary ? 30 : showLabel ? 22 : 14,
              }}
            >
              <div
                className={`relative flex items-center justify-center ${
                  prefersReducedMotion ? '' : 'animate-cosmic-float'
                }`}
                style={{
                  animationDelay: `${(idx * 0.55) % 4}s`,
                  filter: isFocused
                    ? `drop-shadow(0 0 16px ${skill.brandColor}99) drop-shadow(0 2px 6px rgba(0,0,0,0.8))`
                    : isPrimary
                    ? `drop-shadow(0 6px 14px rgba(0,0,0,0.8)) drop-shadow(0 0 14px ${skill.brandColor}55)`
                    : `drop-shadow(0 4px 12px rgba(0,0,0,0.75)) drop-shadow(0 0 10px ${skill.brandColor}40)`,
                }}
              >
                {isFocused && (
                  <>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-3 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${skill.brandColor}24 0%, ${skill.brandColor}08 55%, transparent 75%)`,
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-1.5 rounded-full border"
                      style={{ borderColor: `${skill.brandColor}55` }}
                    />
                  </>
                )}
                <TechLogo id={skill.id} name={skill.name} size={size} />
              </div>

              {!isFocused && (showLabel || isRelated) && (
                <span
                  className={`mt-1 font-mono text-[9.5px] tracking-[0.1em] whitespace-nowrap ${
                    isRelated
                      ? 'text-purple-100/95 font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]'
                      : isPrimary
                      ? 'text-white/90 font-medium drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]'
                      : 'text-white/75 drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]'
                  }`}
                >
                  {skill.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── 3. FOCUSED SKILL INSPECTOR CARD (ORBITAL DOSSIER 2.0) ─── */}
      <AnimatePresence>
        {focusedSkill && (
          <motion.div
            key="mobile-orbital-dossier"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{
              duration: prefersReducedMotion ? 0.12 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full px-1 z-40"
          >
            <SkillFocusCard
              skill={focusedSkill}
              isMobileLayout
              onSelectSkill={onSelectSkill}
              onClose={onClearSkillFocus}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileLivingOrbit;
