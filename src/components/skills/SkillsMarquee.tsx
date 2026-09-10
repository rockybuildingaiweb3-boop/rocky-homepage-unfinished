import React, { useState } from 'react';
import { SKILLS_DATA, SkillItem } from '../../data/skills';
import { TechLogo } from './TechLogo';

const TRACK_1_SKILLS: SkillItem[] = SKILLS_DATA.filter((s) => s.row <= 4);
const TRACK_2_SKILLS: SkillItem[] = SKILLS_DATA.filter((s) => s.row >= 5);

interface SkillsMarqueeProps {
  activeSkillId?: string;
  onSelectSkill?: (skill: SkillItem) => void;
}

export const SkillsMarquee: React.FC<SkillsMarqueeProps> = ({ activeSkillId, onSelectSkill }) => {
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  const renderMarqueeItem = (skill: SkillItem, keyPrefix: string) => {
    const isHovered = hoveredSkillId === skill.id;
    const isActive = activeSkillId === skill.id;

    return (
      <button
        key={`${keyPrefix}-${skill.id}`}
        type="button"
        onClick={() => onSelectSkill?.(skill)}
        onMouseEnter={() => {
          setHoveredSkillId(skill.id);
          onSelectSkill?.(skill);
        }}
        onMouseLeave={() => setHoveredSkillId(null)}
        className={`marquee-quote-item group/quote cursor-pointer text-left transition-all duration-300 rounded-full py-1.5 px-3.5 ${
          isActive
            ? 'bg-white/[0.12] border border-purple-400/60 shadow-[0_0_20px_rgba(112,66,248,0.4)] scale-105'
            : 'border border-transparent hover:bg-white/[0.05]'
        }`}
      >
        <span className="flex items-center gap-2.5 shrink-0">
          <span
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center transition-transform duration-300 group-hover/quote:scale-110 shrink-0 relative"
            style={{
              borderColor: isHovered || isActive ? skill.brandColor : 'rgba(255, 255, 255, 0.12)',
              boxShadow: isHovered || isActive ? `0 0 16px ${skill.brandColor}80` : '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            <TechLogo id={skill.id} size={20} />
            {isActive && (
              <span
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: skill.brandColor }}
              />
            )}
          </span>

          <span
            className="font-extrabold uppercase tracking-wide text-xs sm:text-sm md:text-base font-['Bricolage_Grotesque'] transition-colors duration-200 flex items-center gap-1.5"
            style={{
              color: isHovered || isActive ? skill.brandColor : '#FFFFFF',
              textShadow: isHovered || isActive ? `0 0 14px ${skill.brandColor}90` : 'none',
            }}
          >
            {skill.name}
          </span>
        </span>

        <span className="text-purple-400/50 font-mono text-xs select-none">::</span>

        <span
          className={`font-medium text-xs sm:text-sm tracking-normal transition-colors duration-200 ${
            isHovered || isActive
              ? 'text-white font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]'
              : 'text-neutral-300 group-hover/quote:text-white'
          }`}
        >
          &ldquo;{skill.shortDescription || skill.positioning || ''}&rdquo;
        </span>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-5 my-6 sm:my-10 select-none relative z-10">
      <div className="marquee-band group">
        <div className="marquee-track marquee-track-forward">
          {TRACK_1_SKILLS.map((skill) => renderMarqueeItem(skill, 't1-a'))}
          {TRACK_1_SKILLS.map((skill) => renderMarqueeItem(skill, 't1-b'))}
        </div>
      </div>
      <div className="marquee-band group">
        <div className="marquee-track marquee-track-reverse">
          {TRACK_2_SKILLS.map((skill) => renderMarqueeItem(skill, 't2-a'))}
          {TRACK_2_SKILLS.map((skill) => renderMarqueeItem(skill, 't2-b'))}
        </div>
      </div>
    </div>
  );
};
