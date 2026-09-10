import React, { useState } from 'react';
import { SkillItem, SKILLS_DATA } from '../../data/skills';
import { TechLogoConstellation } from '../skills/TechLogoConstellation';
import { SkillsPlanetBackground } from '../skills/SkillsPlanetBackground';
import { SkillsMarquee } from '../skills/SkillsMarquee';

/**
 * SkillsSection
 * 
 * Space-portfolio cosmic atmosphere with full bidirectional linkage:
 * 1. Signature cosmic purple planet rotating in full ambient view (/videos/skills-bg.webm)
 * 2. Elegant minimalist header:
 *    - "instruments" clean editorial title
 * 3. 5-row constellation of frameless, floating official brand logos (50 items total, 10 per row)
 * 4. Micro-telemetry floating HUD for active/hovered skill
 * 5. Subtle dual-track kinetic marquee at the base, 100% linked in real-time with the constellation!
 */
export const SkillsSection: React.FC = () => {
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

      {/* Deep cosmic grain overlay */}
      <div className="dark-section-grain" aria-hidden="true" />

      {/* ─── 2. MAIN STRUCTURAL CONTENT CONTAINER ─── */}
      <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        {/* Editorial Minimalist Title - Serene museum atmosphere matching Hero 'rocky babcock' */}
        <div className="w-full text-center flex flex-col items-center mb-6 sm:mb-8">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.28em] uppercase text-white/45 mb-2 select-none">
            [ 02 // TECHNICAL CONSTELLATION ]
          </span>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-normal lowercase tracking-wide text-white/90 select-none"
            style={{ fontFamily: 'var(--title-font)' }}
          >
            instruments
          </h2>
        </div>

        {/* ─── 3. THE TECHNICAL CONSTELLATION ─── */}
        <div className="w-full relative">
          <TechLogoConstellation
            activeSkillId={selectedSkill.id}
            onSelectSkill={(skill) => setSelectedSkill(skill)}
          />
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

