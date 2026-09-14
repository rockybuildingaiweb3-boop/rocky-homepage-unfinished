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
          : 'scale-100 z-10 opacity-95 hover:opacity-100 hover:scale-110'
      } transition-all duration-300 ease-out ${className}`}
    >
      {/* Surrounding Ambient Particle Ring on Active / Hover */}
      <div
        className={`absolute -inset-2.5 rounded-full pointer-events-none -z-20 transition-all duration-300 ${
          isActive
            ? 'opacity-100 scale-105'
            : 'opacity-0 scale-95 group-hover:opacity-70 group-hover:scale-100'
        }`}
        style={{
          background: `radial-gradient(circle, ${skill.brandColor}40 0%, ${skill.brandColor}15 45%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Surrounding Resonance Micro-Ring */}
      <div
        className={`absolute -inset-1 rounded-full pointer-events-none -z-10 transition-all duration-300 border ${
          isActive
            ? 'border-white/35 opacity-100 animate-pulse'
            : 'border-white/0 opacity-0 group-hover:border-white/25 group-hover:opacity-80'
        }`}
        aria-hidden="true"
      />

      {/* Cosmic Substrate Core (Enhanced contrast & legibility) */}
      <div
        className={`relative flex items-center justify-center rounded-full w-9 h-9 sm:w-10 sm:h-10 transition-all duration-300 backdrop-blur-sm ${
          isActive
            ? 'bg-[#1D1739] border border-white/50 shadow-[0_0_22px_rgba(255,255,255,0.18),0_4px_18px_rgba(0,0,0,0.85)]'
            : 'bg-[#120E24]/92 border border-white/[0.18] group-hover:border-white/40 group-hover:bg-[#1A1435] shadow-[0_2px_12px_rgba(0,0,0,0.65)]'
        }`}
      >
        <TechLogo
          id={skill.id}
          name={skill.name}
          className={`w-5 h-5 sm:w-5.5 sm:h-5.5 transition-all duration-300 pointer-events-none ${
            isActive ? 'brightness-125' : 'group-hover:brightness-115'
          }`}
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
