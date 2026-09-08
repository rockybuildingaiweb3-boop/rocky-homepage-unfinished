import React, { useState } from 'react';
import { SkillItem, SKILLS_DATA } from '../data/skills';
import { TechLogoConstellation } from './skills/TechLogoConstellation';
import { SkillsPlanetBackground } from './skills/SkillsPlanetBackground';
import { SkillsMarquee } from './skills/SkillsMarquee';

interface SkillsSectionProps {
  onSelectProject?: (projectId: string) => void;
}

/**
 * SkillsSection
 * 
 * Space-portfolio cosmic atmosphere with full bidirectional linkage:
 * 1. Signature cosmic purple planet rotating in full ambient view (/videos/skills-bg.webm)
 * 2. Elegant minimalist header:
 *    - "✧ Crafting with modern technologies" floating badge
 *    - "Skills & Technologies" clean title
 *    - "Making digital experiences with modern technology." subtitle
 * 3. 5-row constellation of frameless, floating official brand logos (50 items total, 10 per row)
 * 4. Micro-telemetry floating HUD for active/hovered skill
 * 5. Subtle dual-track kinetic marquee at the base, 100% linked in real-time with the constellation!
 */
export const SkillsSection: React.FC<SkillsSectionProps> = ({ onSelectProject }) => {
  // Default selected skill (React or TypeScript)
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(
    SKILLS_DATA.find((s) => s.id === 'react') || SKILLS_DATA[0]
  );

  return (
    <section
      id="skills"
      className="relative flex flex-col items-center justify-center w-full mt-[35vh] sm:mt-[40vh] pt-4 sm:pt-8 pb-16 sm:pb-24 text-white z-10 bg-transparent overflow-hidden"
      aria-label="Skills & Technologies"
    >
      {/* ─── 1. SIGNATURE PURPLE COSMIC PLANET BACKGROUND ─── */}
      <SkillsPlanetBackground activeBrandColor={selectedSkill.brandColor} />

      {/* ─── 2. MAIN STRUCTURAL CONTENT CONTAINER ─── */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        {/* Header */}
        <div className="w-full text-center flex flex-col items-center mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-[#030014]/70 backdrop-blur-md text-xs text-purple-200 shadow-[0_0_20px_rgba(112,66,248,0.25)] mb-2.5">
            <span className="text-purple-400 text-sm">✧</span>
            <span className="font-medium tracking-wide">Crafting with modern technologies</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white font-sans mb-2.5">
            Skills & Technologies
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl text-center">
            Making digital experiences with modern technology.
          </p>
        </div>

        {/* ─── 3. THE 5-ROW CONSTELLATION (50 SKILLS, 10 PER ROW) ─── */}
        <div className="w-full relative">
          <TechLogoConstellation
            activeSkillId={selectedSkill.id}
            onSelectSkill={(skill) => setSelectedSkill(skill)}
          />
        </div>

        {/* ─── 4. BOTTOM AMBIENT STATUS PILL ─── */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-400 font-mono">
          <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
            STACK DEPLOYED // 50 NODES (5×10)
          </span>
          <span
            className="px-3 py-1 rounded-full border backdrop-blur-sm transition-colors duration-300"
            style={{
              backgroundColor: `${selectedSkill.brandColor}15`,
              borderColor: `${selectedSkill.brandColor}35`,
              color: selectedSkill.brandColor,
            }}
          >
            ACTIVE TARGET: {selectedSkill.name.toUpperCase()}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm hidden sm:inline">
            ZERO RUNTIME ARTIFACTS
          </span>
        </div>
      </div>

      {/* ─── 5. DUAL-TRACK MARQUEE (100% BIDIRECTIONAL LINKED TO CONSTELLATION) ─── */}
      <div className="w-full mt-10 sm:mt-14 opacity-80 hover:opacity-100 transition-opacity duration-300">
        <SkillsMarquee
          activeSkillId={selectedSkill.id}
          onSelectSkill={(skill) => setSelectedSkill(skill)}
        />
      </div>
    </section>
  );
};

