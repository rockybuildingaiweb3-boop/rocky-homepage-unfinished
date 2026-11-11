import React, { useState, useEffect, useMemo } from 'react';
import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import { getRelatedSkillIds } from '../../features/skills/livingOrbitEngine';
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
  graphics: '3D & Graphics',
  backend: 'Backend',
  data: 'Data & Infra',
  web3: 'Web3',
  models: 'AI Models',
  agents: 'AI Agents',
  rag: 'RAG & Vector',
};

/**
 * MobileLivingOrbit
 *
 * Dedicated mobile presentation (< 768px) for the Living Orbit experience.
 * Reduces simultaneous moving objects, preserves the background planet,
 * uses touch-friendly floating brand marks, and supports category filtering
 * and persistent focus inspection.
 */
export const MobileLivingOrbit: React.FC<MobileLivingOrbitProps> = ({
  selectedCategoryId,
  focusedSkillId,
  onSelectCategory,
  onSelectSkill,
  onClearSkillFocus,
}) => {
  const [streamWindowIndex, setStreamWindowIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Gentle auto-cycling window in "All 88" mode when no skill is focused
  useEffect(() => {
    if (selectedCategoryId || focusedSkillId || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setStreamWindowIndex((prev) => (prev + 1) % 4);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [selectedCategoryId, focusedSkillId, prefersReducedMotion]);

  const focusedSkill = useMemo(
    () => (focusedSkillId ? SKILLS_DATA.find((s) => s.id === focusedSkillId) || null : null),
    [focusedSkillId]
  );

  const relatedSet = useMemo(() => {
    if (!focusedSkillId) return new Set<string>();
    return new Set(getRelatedSkillIds(focusedSkillId));
  }, [focusedSkillId]);

  // Curated mobile orbital streams when in "All 88" mode (18 visible per window + focused/related)
  const visibleMobileSkills = useMemo(() => {
    if (selectedCategoryId) {
      return SKILLS_DATA.filter((s) => s.categoryId === selectedCategoryId);
    }

    const coreAll = SKILLS_DATA.filter((s) => s.tier === 'core');
    const profAll = SKILLS_DATA.filter((s) => s.tier === 'professional');
    const ecoAll = SKILLS_DATA.filter((s) => s.tier === 'ecosystem');

    const pickSlice = (arr: SkillItem[], count: number, offset: number) => {
      const out: SkillItem[] = [];
      for (let i = 0; i < count; i++) {
        out.push(arr[(offset + i) % arr.length]);
      }
      return out;
    };

    const base = [
      ...pickSlice(coreAll, 6, streamWindowIndex * 5),
      ...pickSlice(profAll, 7, streamWindowIndex * 11),
      ...pickSlice(ecoAll, 5, streamWindowIndex * 5),
    ];

    if (focusedSkill) {
      const map = new Map<string, SkillItem>(base.map((s) => [s.id, s]));
      map.set(focusedSkill.id, focusedSkill);
      for (const relId of relatedSet) {
        const rel = SKILLS_DATA.find((s) => s.id === relId);
        if (rel) map.set(rel.id, rel);
      }
      return Array.from(map.values()).slice(0, 18);
    }

    return base;
  }, [selectedCategoryId, streamWindowIndex, focusedSkill, relatedSet]);

  const activeCategory = useMemo(
    () =>
      selectedCategoryId
        ? SKILL_CATEGORIES.find((c) => c.id === selectedCategoryId) || null
        : null,
    [selectedCategoryId]
  );

  return (
    <div
      className="w-full px-3 sm:px-5 flex flex-col items-center gap-4"
      onClick={() => {
        if (focusedSkillId) onClearSkillFocus();
      }}
    >
      {/* ─── 1. COMPACT CATEGORY SELECTOR BAR ─── */}
      <div
        className="w-full overflow-x-auto no-scrollbar py-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 min-w-max mx-auto px-1">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`px-3 py-1.5 rounded-full font-mono text-[10px] tracking-[0.15em] uppercase transition-all cursor-pointer border ${
              selectedCategoryId === null
                ? 'bg-purple-500/25 border-purple-400/60 text-white shadow-[0_0_16px_rgba(168,85,247,0.35)]'
                : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white/90'
            }`}
          >
            All 88 · Orbit
          </button>

          {SKILL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`px-3 py-1.5 rounded-full font-mono text-[10px] tracking-[0.14em] uppercase transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-500/25 border-purple-400/60 text-white shadow-[0_0_16px_rgba(168,85,247,0.35)]'
                    : 'bg-white/[0.03] border-white/10 text-white/60 hover:text-white/90'
                }`}
              >
                <span className="text-purple-300/70 mr-1">{cat.number}</span>
                {SHORT_CATEGORY_NAMES[cat.id] || cat.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 2. ACTIVE CATEGORY SUBHEADER OR ORBIT STREAM INDICATOR ─── */}
      <div
        className="flex items-center justify-between w-full max-w-[460px] px-1"
        onClick={(e) => e.stopPropagation()}
      >
        {activeCategory ? (
          <div className="flex items-center justify-between w-full">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-purple-300/80">
                {activeCategory.number} · {activeCategory.title}
              </span>
              <p className="text-[11px] text-white/50">{activeCategory.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="px-2.5 py-1 rounded-lg border border-white/15 bg-white/[0.04] font-mono text-[10px] uppercase tracking-wider text-white/75"
            >
              ← All 88
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
              Living Stream {streamWindowIndex + 1}/4 · Tap any logo
            </span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`View orbital wave ${idx + 1}`}
                  onClick={() => setStreamWindowIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    streamWindowIndex === idx
                      ? 'w-5 bg-purple-400'
                      : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── 3. FLOATING TECHNOLOGY LOGOS FIELD OVER THE PLANET ─── */}
      <div className="relative w-full max-w-[480px] min-h-[340px] py-4 flex flex-col justify-center gap-5">
        {(['core', 'professional', 'ecosystem'] as const).map((tierKey) => {
          const tierItems = visibleMobileSkills.filter((s) => s.tier === tierKey);
          if (tierItems.length === 0) return null;

          const logoSize =
            tierKey === 'core' ? 46 : tierKey === 'professional' ? 38 : 31;

          return (
            <div
              key={tierKey}
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4 px-2"
            >
              {tierItems.map((skill, idx) => {
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
                    className={`group relative flex flex-col items-center justify-center p-1.5 transition-all duration-300 cursor-pointer select-none ${
                      isDimmed ? 'opacity-20 scale-90' : 'opacity-100'
                    }`}
                    style={{
                      transform: isFocused
                        ? 'scale(1.18)'
                        : isRelated
                        ? 'scale(1.06)'
                        : undefined,
                    }}
                  >
                    <div
                      className={prefersReducedMotion ? '' : 'animate-cosmic-float'}
                      style={{
                        animationDelay: `${(idx * 0.45) % 4}s`,
                        filter: isFocused
                          ? `drop-shadow(0 0 18px ${skill.brandColor}) drop-shadow(0 0 6px rgba(255,255,255,0.45))`
                          : isRelated
                          ? `drop-shadow(0 0 12px ${skill.brandColor}90)`
                          : `drop-shadow(0 4px 12px ${skill.brandColor}45)`,
                      }}
                    >
                      <TechLogo id={skill.id} name={skill.name} size={logoSize} />
                    </div>

                    <span
                      className={`mt-1.5 font-mono text-[10px] tracking-wider whitespace-nowrap transition-opacity ${
                        isFocused
                          ? 'text-white font-semibold opacity-100'
                          : isRelated || selectedCategoryId
                          ? 'text-white/80 opacity-95'
                          : 'text-white/65 opacity-85'
                      }`}
                    >
                      {skill.name}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ─── 4. FOCUSED SKILL INSPECTOR CARD ─── */}
      {focusedSkill && (
        <div className="w-full px-1 z-30">
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
