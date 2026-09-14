import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { SKILLS_DATA } from '../../data/skills';
import { SkillsAtmosphere } from '../skills/SkillsAtmosphere';
import { SkillsConstellation } from '../skills/SkillsConstellation';
import { KnowledgeCanopy } from '../skills/KnowledgeCanopy';
import { validateSkillsDataset } from '../../features/skills/validateSkills';

/**
 * SkillsSection
 * 
 * Interactive Technical Constellation framing the Purple Cosmic Planet.
 * Features 88 instruments across 8 core disciplines.
 * 
 * Interaction:
 * - Pure hover-driven interaction. Zero persistent click selection.
 * - Single source of truth: `activeSkillId: string | null`.
 * - 100% bidirectional link between the Constellation and Knowledge Canopy.
 */
export const SkillsSection: React.FC = () => {
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  // Development-time dataset integrity check
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      validateSkillsDataset();
    }
  }, []);

  const handleHoverSkill = useCallback((id: string) => {
    setActiveSkillId(id);
  }, []);

  const handleLeaveSkill = useCallback(() => {
    setActiveSkillId(null);
  }, []);

  // Compute active brand color for atmosphere resonance
  const activeBrandColor = useMemo(() => {
    if (!activeSkillId) return '#7042F8';
    const activeSkill = SKILLS_DATA.find((s) => s.id === activeSkillId);
    return activeSkill?.brandColor || '#7042F8';
  }, [activeSkillId]);

  return (
    <section
      id="skills"
      className="relative flex flex-col items-center justify-center w-full mt-6 sm:mt-12 pt-6 sm:pt-10 pb-16 sm:pb-24 text-white z-10 bg-transparent overflow-hidden"
      aria-label="Technical Constellation & Instruments"
    >
      {/* ─── 1. CELESTIAL PLANET ATMOSPHERE (HERO PROTAGONIST) ─── */}
      <SkillsAtmosphere
        activeBrandColor={activeBrandColor}
        isHovered={Boolean(activeSkillId)}
      />

      {/* ─── 2. EDITORIAL MINIMALIST HEADER ─── */}
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10 mb-6 sm:mb-8">
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.28em] uppercase text-white/45 mb-2 select-none">
          [ 02 // TECHNICAL CONSTELLATION ]
        </span>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-normal lowercase tracking-wide text-white/90 select-none mb-3"
          style={{ fontFamily: 'var(--title-font)' }}
        >
          instruments
        </h2>
        <p className="font-mono text-xs sm:text-[13px] tracking-widest text-white/40 uppercase max-w-[640px] select-none">
          88 technologies orbiting core software, spatial computing, web3 & agentic systems
        </p>
      </div>

      {/* ─── 3. SPATIAL TECHNICAL CONSTELLATION (88 INSTRUMENTS) ─── */}
      <div className="w-full relative z-10">
        <SkillsConstellation
          activeSkillId={activeSkillId}
          onHoverSkill={handleHoverSkill}
          onLeaveSkill={handleLeaveSkill}
        />
      </div>

      {/* ─── 4. KNOWLEDGE CANOPY (88 PERSPECTIVES, BIDIRECTIONALLY LINKED) ─── */}
      <div className="w-full relative z-10 mt-6 sm:mt-10">
        <KnowledgeCanopy
          activeSkillId={activeSkillId}
          onHoverSkill={handleHoverSkill}
          onLeaveSkill={handleLeaveSkill}
        />
      </div>
    </section>
  );
};

export default SkillsSection;
