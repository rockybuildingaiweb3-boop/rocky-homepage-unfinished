import React, { memo } from 'react';
import { SkillItem } from '../../data/skills';
import { TechLogo } from './TechLogo';

interface SkillNodeProps {
  skill: SkillItem;
  isActive: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export const SkillNode: React.FC<SkillNodeProps> = memo(({
  skill,
  isActive,
  onHover,
  onLeave,
  style,
  className = '',
}) => {
  return (
    <button
      type="button"
      aria-label={`${skill.name} (${skill.categoryNumber} - ${skill.categoryId})`}
      onMouseEnter={() => onHover(skill.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(skill.id)}
      onBlur={onLeave}
      onTouchStart={() => onHover(skill.id)}
      onTouchEnd={onLeave}
      onTouchCancel={onLeave}
      style={style}
      className={`group relative flex items-center justify-center select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400/60 ${
        isActive
          ? 'scale-118 z-30 opacity-100'
          : 'scale-100 z-10 opacity-75 hover:opacity-100 hover:scale-110'
      } transition-all duration-300 ease-out ${className}`}
    >
      {/* Restrained Cosmic Ambient Glow */}
      <div
        className={`absolute -inset-2 rounded-full pointer-events-none -z-10 transition-opacity duration-300 ${
          isActive
            ? 'opacity-85 blur-md'
            : 'opacity-20 group-hover:opacity-50 blur-sm'
        }`}
        style={{
          background: isActive
            ? `radial-gradient(circle, ${skill.brandColor}38 0%, ${skill.brandColor}10 45%, transparent 72%)`
            : `radial-gradient(circle, ${skill.brandColor}22 0%, transparent 68%)`,
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Translucent Substrate */}
      <div
        className={`relative flex items-center justify-center rounded-full w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 backdrop-blur-[2px] ${
          isActive
            ? 'bg-[#120F24]/85 border border-white/30 shadow-[0_4px_18px_rgba(0,0,0,0.7)]'
            : 'bg-[#0A0815]/65 border border-white/[0.08] group-hover:border-white/20 group-hover:bg-[#0E0B1C]/75 shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
        }`}
      >
        <TechLogo
          id={skill.id}
          name={skill.name}
          className="w-5 h-5 sm:w-5.5 sm:h-5.5 transition-transform duration-300 pointer-events-none"
        />
      </div>

      {/* Micro-label on Active / Hover */}
      <span
        className={`pointer-events-none absolute -bottom-5.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-all duration-200 z-40 ${
          isActive
            ? 'opacity-100 translate-y-0 bg-[#07050E]/90 text-neutral-200 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.6)]'
            : 'opacity-0 translate-y-1'
        }`}
      >
        {skill.name}
      </span>
    </button>
  );
});

SkillNode.displayName = 'SkillNode';

export default SkillNode;
