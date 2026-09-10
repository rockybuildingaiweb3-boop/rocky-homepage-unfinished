import React, { useState } from 'react';
import { SKILLS_DATA, SkillItem } from '../../data/skills';
import { TechLogo } from './TechLogo';

const TRACK_1 = SKILLS_DATA.filter((skill) => skill.row <= 4);
const TRACK_2 = SKILLS_DATA.filter((skill) => skill.row >= 5);

interface SkillsMarqueeProps {
  activeSkillId?: string;
  onSelectSkill?: (skill: SkillItem) => void;
}

export const SkillsMarquee: React.FC<SkillsMarqueeProps> = ({ activeSkillId, onSelectSkill }) => {
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  const renderItem = (skill: SkillItem, keyPrefix: string) => {
    const active = activeSkillId === skill.id;
    const hovered = hoveredSkillId === skill.id;
    return (
      <button
        key={`${keyPrefix}-${skill.id}`}
        type="button"
        onClick={() => onSelectSkill?.(skill)}
        onMouseEnter={() => { setHoveredSkillId(skill.id); onSelectSkill?.(skill); }}
        onMouseLeave={() => setHoveredSkillId(null)}
        className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-all sm:text-sm ${active ? 'border-purple-400/60 bg-white/[0.1]' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'}`}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/20">
          <TechLogo id={skill.id} slug={skill.slug} name={skill.name} size={18} className="h-4 w-4" />
        </span>
        <span className={hovered || active ? 'text-white' : 'text-white/70'}>{skill.name}</span>
      </button>
    );
  };

  return (
    <div className="my-6 flex w-full flex-col gap-3 overflow-hidden sm:my-10 sm:gap-5">
      <div className="marquee-band overflow-hidden">
        <div className="marquee-track marquee-track-forward flex w-max gap-3 sm:gap-4">
          {TRACK_1.map((skill) => renderItem(skill, 't1-a'))}
          {TRACK_1.map((skill) => renderItem(skill, 't1-b'))}
        </div>
      </div>
      <div className="marquee-band overflow-hidden">
        <div className="marquee-track marquee-track-reverse flex w-max gap-3 sm:gap-4">
          {TRACK_2.map((skill) => renderItem(skill, 't2-a'))}
          {TRACK_2.map((skill) => renderItem(skill, 't2-b'))}
        </div>
      </div>
    </div>
  );
};

export default SkillsMarquee;
