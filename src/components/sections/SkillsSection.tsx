import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { SKILLS_DATA } from '../../data/skills';
import { SkillsAtmosphere } from '../skills/SkillsAtmosphere';
import { SkillsConstellation } from '../skills/SkillsConstellation';
import { KnowledgeCanopy } from '../skills/KnowledgeCanopy';
import { CATEGORY_CONSTELLATIONS } from '../../features/skills/constellationLayout';
import { validateSkillsDataset } from '../../features/skills/validateSkills';

/**
 * SkillsSection
 *
 * Interactive Technical Constellation framing the Purple Cosmic Planet.
 * Features 88 instruments across 8 core disciplines organized into a
 * three-level hierarchical experience:
 * - Level 1: Category Constellation Overview (8 distinct orbital constellations)
 * - Level 2: Expanded Category Constellation (Core, Professional, Ecosystem tiers)
 * - Level 3: Individual Skill Focus (Persistent selection, insights, selective relationships)
 */
export const SkillsSection: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [focusedSkillId, setFocusedSkillId] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);

  // Development-time dataset integrity check
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      validateSkillsDataset();
    }
  }, []);

  // Keyboard Escape handler: Level 3 -> Level 2 -> Level 1
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
    setHoveredCategoryId(null);
  }, []);

  const handleSelectSkill = useCallback((skillId: string) => {
    const skill = SKILLS_DATA.find((s) => s.id === skillId);
    if (!skill) return;

    // Ensure the skill's category is expanded if selecting from KnowledgeCanopy or cross-category related link
    setSelectedCategoryId((prevCat) => prevCat || skill.categoryId);
    setFocusedSkillId((prevFocus) => (prevFocus === skillId ? prevFocus : skillId));
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

  const handleHoverCategory = useCallback((categoryId: string) => {
    setHoveredCategoryId(categoryId);
  }, []);

  const handleLeaveCategory = useCallback(() => {
    setHoveredCategoryId(null);
  }, []);

  const effectiveSkillId = focusedSkillId || hoveredSkillId;

  // Compute active brand color for atmosphere resonance
  const activeBrandColor = useMemo(() => {
    if (effectiveSkillId) {
      const activeSkill = SKILLS_DATA.find((s) => s.id === effectiveSkillId);
      if (activeSkill?.brandColor) return activeSkill.brandColor;
    }
    if (selectedCategoryId) {
      const cat = CATEGORY_CONSTELLATIONS.find((c) => c.id === selectedCategoryId);
      if (cat?.accentColor) return cat.accentColor;
    }
    if (hoveredCategoryId) {
      const cat = CATEGORY_CONSTELLATIONS.find((c) => c.id === hoveredCategoryId);
      if (cat?.accentColor) return cat.accentColor;
    }
    return '#7042F8';
  }, [effectiveSkillId, selectedCategoryId, hoveredCategoryId]);

  const interactionLevel: 1 | 2 | 3 = focusedSkillId
    ? 3
    : selectedCategoryId
    ? 2
    : 1;

  return (
    <section
      id="skills"
      className="relative flex flex-col items-center justify-center w-full mt-6 sm:mt-10 pt-16 sm:pt-20 pb-16 sm:pb-24 text-white z-10 bg-transparent overflow-hidden"
      aria-label="Technical Constellation & Instruments"
    >
      {/* ─── 1. CELESTIAL PLANET ATMOSPHERE (HERO PROTAGONIST) ─── */}
      <SkillsAtmosphere
        activeBrandColor={activeBrandColor}
        isHovered={Boolean(effectiveSkillId || hoveredCategoryId)}
        interactionLevel={interactionLevel}
      />

      {/* ─── 2. EDITORIAL MINIMALIST HEADER ─── */}
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10 mb-3 sm:mb-4">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.28em] uppercase text-white/45 mb-1 select-none">
          02 · Technical Constellation
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-normal lowercase tracking-wide text-white/90 select-none mb-2"
          style={{ fontFamily: 'var(--title-font)' }}
        >
          instruments
        </h2>
        <p className="font-mono text-xs sm:text-[13px] tracking-widest text-white/40 uppercase max-w-[640px] select-none">
          88 technologies across 8 orbital constellations — core software, spatial computing, web3 & agentic systems
        </p>
      </div>

      {/* ─── 3. SPATIAL TECHNICAL CONSTELLATION (3-LEVEL HIERARCHY) ─── */}
      <div className="w-full relative z-10">
        <SkillsConstellation
          selectedCategoryId={selectedCategoryId}
          focusedSkillId={focusedSkillId}
          hoveredSkillId={hoveredSkillId}
          hoveredCategoryId={hoveredCategoryId}
          onSelectCategory={handleSelectCategory}
          onSelectSkill={handleSelectSkill}
          onClearSkillFocus={handleClearSkillFocus}
          onHoverSkill={handleHoverSkill}
          onLeaveSkill={handleLeaveSkill}
          onHoverCategory={handleHoverCategory}
          onLeaveCategory={handleLeaveCategory}
        />
      </div>

      {/* ─── 4. KNOWLEDGE CANOPY (88 PERSPECTIVES, BIDIRECTIONALLY LINKED) ─── */}
      <div className="w-full relative z-10 mt-6 sm:mt-10">
        <KnowledgeCanopy
          activeSkillId={effectiveSkillId}
          selectedCategoryId={selectedCategoryId}
          onSelectSkill={handleSelectSkill}
          onHoverSkill={handleHoverSkill}
          onLeaveSkill={handleLeaveSkill}
        />
      </div>
    </section>
  );
};

export default SkillsSection;
