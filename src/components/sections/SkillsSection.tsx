import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { SKILLS_DATA } from '../../data/skills';
import { SkillsAtmosphere } from '../skills/SkillsAtmosphere';
import { LivingOrbitStage } from '../skills/LivingOrbitStage';
import { validateSkillsDataset } from '../../features/skills/validateSkills';

/**
 * SkillsSection — LIVING ORBIT / A LIVING FIELD OF TECHNOLOGIES
 *
 * Authentic technology brand marks float and flow along 4 counter-rotating curved
 * orbital streams in front of the cosmic purple planet (/videos/skills-bg.webm).
 * Preserves all 88 validated technologies and 8 canonical categories without
 * visual clutter, category spheres, or bottom dashboard panels.
 */
export const SkillsSection: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  // Development-time dataset integrity check
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      validateSkillsDataset();
    }
  }, []);

  // Keyboard Escape handler: clears focused skill first, then resets category filter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (focusedSkillId) {
          setFocusedSkillId(null);
        } else if (selectedCategoryId) {
          setSelectedCategoryId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedSkillId, selectedCategoryId]);

  const handleSelectCategory = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setFocusedSkillId(null);
    setHoveredSkillId(null);
  }, []);

  const handleSelectSkill = useCallback((skillId: string) => {
    const skill = SKILLS_DATA.find((s) => s.id === skillId);
    if (!skill) return;

    // If user is currently filtering by a specific category and clicks a cross-category
    // related technology, transition smoothly to that technology's category
    setSelectedCategoryId((prevCat) =>
      prevCat && prevCat !== skill.categoryId ? skill.categoryId : prevCat
    );
    setFocusedSkillId(skillId);
  }, []);

  const handleClearSkillFocus = useCallback(() => {
    setFocusedSkillId(null);
  }, []);

  const handleHoverSkill = useCallback((id: string) => {
    setHoveredSkillId(id);
  }, []);

  const handleLeaveSkill = useCallback(() => {
    setHoveredSkillId(null);
  }, []);

  const effectiveSkillId = focusedSkillId || hoveredSkillId;

  // Compute active brand color for subtle planetary atmosphere resonance
  const activeBrandColor = useMemo(() => {
    if (effectiveSkillId) {
      const activeSkill = SKILLS_DATA.find((s) => s.id === effectiveSkillId);
      if (activeSkill?.brandColor) return activeSkill.brandColor;
    }
    return '#7042F8';
  }, [effectiveSkillId]);

  const interactionLevel: 1 | 2 | 3 = focusedSkillId
    ? 3
    : selectedCategoryId
    ? 2
    : 1;

  return (
    <section
      id="skills"
      className="relative flex flex-col items-center justify-center w-full mt-6 sm:mt-10 pt-16 sm:pt-20 pb-14 sm:pb-20 text-white z-10 bg-transparent overflow-hidden"
      aria-label="Living Orbit of Technologies"
    >
      {/* ─── 1. CELESTIAL PLANET ATMOSPHERE (PRESERVED VISUAL ANCHOR) ─── */}
      <SkillsAtmosphere
        activeBrandColor={activeBrandColor}
        isHovered={Boolean(effectiveSkillId)}
        interactionLevel={interactionLevel}
      />

      {/* ─── 2. MINIMAL EDITORIAL HEADER ─── */}
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10 mb-3 sm:mb-4">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.28em] uppercase text-white/45 mb-1 select-none">
          02 · Living Orbit
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-normal lowercase tracking-wide text-white/95 select-none mb-1.5"
          style={{ fontFamily: 'var(--title-font)' }}
        >
          instruments
        </h2>
        <p className="font-mono text-[11px] sm:text-xs tracking-[0.2em] text-white/40 uppercase max-w-[620px] select-none">
          A living field of 88 technologies across frontend, spatial computing, web3 & agentic AI
        </p>
      </div>

      {/* ─── 3. LIVING ORBIT FIELD OF TECHNOLOGIES ─── */}
      <div className="w-full relative z-10">
        <LivingOrbitStage
          selectedCategoryId={selectedCategoryId}
          focusedSkillId={focusedSkillId}
          hoveredSkillId={hoveredSkillId}
          onSelectCategory={handleSelectCategory}
          onSelectSkill={handleSelectSkill}
          onClearSkillFocus={handleClearSkillFocus}
          onHoverSkill={handleHoverSkill}
          onLeaveSkill={handleLeaveSkill}
        />
      </div>
    </section>
  );
};

export default SkillsSection;
