import React, { useState } from 'react';
import { SkillItem, SKILLS_DATA } from '../../data/skills';
import { TechLogoConstellation } from '../skills/TechLogoConstellation';
import { SkillsPlanetBackground } from '../skills/SkillsPlanetBackground';
import { SkillsMarquee } from '../skills/SkillsMarquee';

export const SkillsSection: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(SKILLS_DATA.find((skill) => skill.id === 'react') || SKILLS_DATA[0]);
  return (
    <section id="skills" className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent px-4 pb-24 pt-16 text-white sm:px-6 lg:px-8" aria-label="Skills & Technologies">
      <SkillsPlanetBackground />
      <div className="relative z-10 w-full max-w-[1380px]">
        <div className="mb-8 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45 sm:text-xs">[ 02 // TECHNICAL CONSTELLATION ]</span>
          <h2 className="mt-2 text-3xl lowercase tracking-wide text-white/90" style={{ fontFamily: 'var(--title-font)' }}>instruments</h2>
        </div>
        <TechLogoConstellation activeSkillId={selectedSkill.id} onSelectSkill={setSelectedSkill} />
      </div>
      <div className="relative z-10 w-full opacity-80 transition-opacity hover:opacity-100">
        <SkillsMarquee activeSkillId={selectedSkill.id} onSelectSkill={setSelectedSkill} />
      </div>
    </section>
  );
};

export default SkillsSection;
