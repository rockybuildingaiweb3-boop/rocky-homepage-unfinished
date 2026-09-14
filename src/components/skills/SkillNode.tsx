import React, { memo } from 'react';
import { SkillItem } from '../../data/skills';
import { TechLogo } from './TechLogo';
import { getSkillTier, SkillTier } from '../../features/skills/skillRelationships';

interface SkillNodeProps {
  skill: SkillItem;
  isHovered: boolean;
  isRelated: boolean;
  isDimmed: boolean;
  onHover: (id: string) => void;
  onLeave: () => void;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * SkillNode
 * 
 * Interactive celestial instrument node adhering to:
 * - Three-Tier Architectural Hierarchy (Tier 1 Core, Tier 2 Tool, Tier 3 Ecosystem)
 * - Transparent-by-default container state (no heavy dark circular disks at rest)
 * - Hover-driven knowledge illumination (active purple/white glow, secondary resonance for related nodes)
 * - Clean hover-only lifecycle with zero click state
 */
export const SkillNode: React.FC<SkillNodeProps> = memo(({
  skill,
  isHovered,
  isRelated,
  isDimmed,
  onHover,
  onLeave,
  style,
  className = '',
}) => {
  const tier: SkillTier = getSkillTier(skill.id);

  // Dimension scaling across the 3 visual tiers (Major Stars vs Supporting Stars)
  const sizeClasses =
    tier === 'core'
      ? 'w-12 h-12 sm:w-13 sm:h-13'
      : tier === 'professional'
      ? 'w-9 h-9 sm:w-10 sm:h-10'
      : 'w-7 h-7 sm:w-7.5 sm:h-7.5';

  const logoClasses =
    tier === 'core'
      ? 'w-6.5 h-6.5 sm:w-7 sm:h-7'
      : tier === 'professional'
      ? 'w-4.5 h-4.5 sm:w-5 sm:h-5'
      : 'w-3.5 h-3.5 sm:w-3.5 sm:h-3.5';

  return (
    <button
      type="button"
      aria-label={`${skill.name} (${tier} - ${skill.categoryId})`}
      onMouseEnter={() => onHover(skill.id)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(skill.id)}
      onBlur={onLeave}
      onTouchStart={() => onHover(skill.id)}
      onTouchEnd={onLeave}
      onTouchCancel={onLeave}
      style={style}
      className={`group relative flex items-center justify-center select-none focus-visible:outline-none transition-all duration-300 ease-out ${
        isHovered
          ? 'scale-115 z-40 opacity-100'
          : isRelated
          ? 'scale-105 z-30 opacity-100'
          : isDimmed
          ? 'scale-95 z-10 opacity-20 hover:opacity-90 hover:scale-105'
          : tier === 'core'
          ? 'scale-100 z-25 opacity-100 hover:opacity-100 hover:scale-110'
          : tier === 'professional'
          ? 'scale-100 z-15 opacity-80 hover:opacity-100 hover:scale-105'
          : 'scale-95 z-10 opacity-50 hover:opacity-90 hover:scale-105'
      } ${className}`}
    >
      {/* ─── LAYER 1: AMBIENT LOCAL LIGHT FIELD (Major stars have persistent glow) ─── */}
      <div
        className={`absolute -inset-3 rounded-full pointer-events-none -z-20 transition-all duration-400 ${
          isHovered
            ? 'opacity-100 scale-125'
            : isRelated
            ? 'opacity-70 scale-110'
            : tier === 'core'
            ? 'opacity-40 scale-105 group-hover:opacity-80'
            : tier === 'professional'
            ? 'opacity-10 scale-95 group-hover:opacity-40'
            : 'opacity-0 scale-90 group-hover:opacity-20'
        }`}
        style={{
          background: isHovered
            ? `radial-gradient(circle, #A855F770 0%, ${skill.brandColor}40 40%, transparent 70%)`
            : isRelated
            ? `radial-gradient(circle, #C084FC50 0%, ${skill.brandColor}30 45%, transparent 70%)`
            : tier === 'core'
            ? `radial-gradient(circle, ${skill.brandColor}45 0%, ${skill.brandColor}15 45%, transparent 70%)`
            : `radial-gradient(circle, ${skill.brandColor}30 0%, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* ─── LAYER 2: RESONANCE RING (Active on hover/related) ─── */}
      <div
        className={`absolute -inset-1 rounded-full pointer-events-none -z-10 transition-all duration-300 border ${
          isHovered
            ? 'border-white/60 opacity-100 animate-pulse scale-105'
            : isRelated
            ? 'border-purple-400/40 opacity-80 scale-100'
            : tier === 'core'
            ? 'border-white/10 opacity-40 group-hover:border-white/30 group-hover:opacity-75'
            : 'border-transparent opacity-0 group-hover:border-white/20 group-hover:opacity-60'
        }`}
        aria-hidden="true"
      />

      {/* ─── LAYER 3: DYNAMIC CONTAINER (Core has subtle ambient grounding; Eco is quiet) ─── */}
      <div
        className={`relative flex items-center justify-center rounded-full ${sizeClasses} transition-all duration-300 ${
          isHovered
            ? 'bg-[#1C153B]/90 border border-white/70 shadow-[0_0_24px_rgba(168,85,247,0.55),0_0_10px_rgba(255,255,255,0.7)] backdrop-blur-md'
            : isRelated
            ? 'bg-[#140F2A]/60 border border-purple-400/45 shadow-[0_0_16px_rgba(168,85,247,0.3)] backdrop-blur-xs'
            : tier === 'core'
            ? 'bg-[#181133]/40 border border-white/20 shadow-[0_0_10px_rgba(168,85,247,0.2)] group-hover:border-white/40 group-hover:bg-[#1a133b]/60'
            : tier === 'professional'
            ? 'bg-transparent border border-white/[0.06] group-hover:border-white/30 group-hover:bg-[#181133]/40'
            : 'bg-transparent border border-white/[0.02] group-hover:border-white/20 group-hover:bg-[#181133]/30'
        }`}
      >
        <TechLogo
          id={skill.id}
          name={skill.name}
          className={`${logoClasses} transition-all duration-300 pointer-events-none ${
            isHovered
              ? 'brightness-125 contrast-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
              : isRelated
              ? 'brightness-115 drop-shadow-[0_0_6px_rgba(192,132,252,0.4)]'
              : 'group-hover:brightness-110'
          }`}
        />
      </div>

      {/* ─── LAYER 4: EDITORIAL MICRO-LABEL ─── */}
      <span
        className={`pointer-events-none absolute -bottom-5.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] transition-all duration-200 z-50 ${
          isHovered
            ? 'opacity-100 translate-y-0 bg-[#090616]/95 text-white border border-purple-400/40 shadow-[0_2px_10px_rgba(0,0,0,0.85)]'
            : isRelated
            ? 'opacity-90 translate-y-0 bg-[#090616]/80 text-purple-200 border border-white/10'
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
