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
      className={`group relative flex items-center justify-center rounded-xl p-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 select-none ${
        isActive
          ? 'scale-125 z-30 opacity-100'
          : 'scale-100 z-10 opacity-70 hover:opacity-100 hover:scale-115'
      } ${className}`}
    >
      {/* Active Brand Aura */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full blur-md transition-opacity duration-300 pointer-events-none -z-10"
          style={{
            background: `radial-gradient(circle, ${skill.brandColor}55 0%, ${skill.brandColor}00 70%)`,
          }}
        />
      )}

      {/* Frame / Chip substrate */}
      <div
        className={`relative flex items-center justify-center rounded-xl transition-colors duration-300 p-1.5 backdrop-blur-[2px] ${
          isActive
            ? 'bg-white/[0.12] border border-white/40 shadow-lg'
            : 'bg-white/[0.02] border border-white/8 group-hover:bg-white/[0.08] group-hover:border-white/20'
        }`}
      >
        <TechLogo
          id={skill.id}
          name={skill.name}
          className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 pointer-events-none"
        />
      </div>

      {/* Micro-label on Active / Hover */}
      <span
        className={`pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-all duration-200 z-40 ${
          isActive
            ? 'opacity-100 translate-y-0 bg-black/80 text-white border border-white/20 shadow-md'
            : 'opacity-0 translate-y-1'
        }`}
      >
        {skill.name}
      </span>
    </button>
  );
});

SkillNode.displayName = 'SkillNode';
