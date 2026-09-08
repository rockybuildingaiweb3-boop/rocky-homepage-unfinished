import React, { useState } from 'react';
import { SKILLS_DATA, SkillItem } from '../../data/skills';
import { TechLogo } from './TechLogo';
import { getTechQuote } from '../../data/techQuotes';
import { playMechanicalClick } from './audio';

// Helper to safely fetch skill data by ID
const getSkill = (id: string): SkillItem => {
  const found = SKILLS_DATA.find((s) => s.id === id);
  if (found) return found;
  return {
    id,
    name: id.toUpperCase(),
    row: 1,
    rowTitle: 'Core Stack',
    category: 'Technology',
    brandColor: '#A855F7',
    positioning: `${id} platform architecture`,
    experience: `Production integration with ${id}`,
    tags: [id],
    shortDescription: `Crafting high-velocity web experiences with ${id} 🚀`,
  };
};

// Track 1: Rows 1 & 2 (Frontend, Interaction, 3D & Graphics) - Strictly De-duplicated (20 unique skills)
const TRACK_1_SKILLS: SkillItem[] = [
  getSkill('typescript'),
  getSkill('javascript'),
  getSkill('react'),
  getSkill('nextjs'),
  getSkill('svelte'),
  getSkill('tailwind'),
  getSkill('motion'),
  getSkill('gsap'),
  getSkill('html5'),
  getSkill('vite'),
  getSkill('threejs'),
  getSkill('webgl'),
  getSkill('glsl'),
  getSkill('webgpu'),
  getSkill('r3f'),
  getSkill('blender'),
  getSkill('spline'),
  getSkill('draco'),
  getSkill('uvbaking'),
  getSkill('canvas'),
];

// Track 2: Rows 3, 4 & 5 (Backend, Systems, Web3 & AI Agents) - Strictly De-duplicated (30 unique skills)
const TRACK_2_SKILLS: SkillItem[] = [
  getSkill('nodejs'),
  getSkill('express'),
  getSkill('postgresql'),
  getSkill('supabase'),
  getSkill('prisma'),
  getSkill('drizzle'),
  getSkill('redis'),
  getSkill('trpc'),
  getSkill('graphql'),
  getSkill('docker'),
  getSkill('solidity'),
  getSkill('viem'),
  getSkill('wagmi'),
  getSkill('ethers'),
  getSkill('foundry'),
  getSkill('privy'),
  getSkill('erc4337'),
  getSkill('thegraph'),
  getSkill('ipfs'),
  getSkill('siwe'),
  getSkill('vercelai'),
  getSkill('langchain'),
  getSkill('llamaindex'),
  getSkill('openai'),
  getSkill('pgvector'),
  getSkill('mcp'),
  getSkill('figma'),
  getSkill('designsystems'),
  getSkill('git'),
  getSkill('rive'),
];

interface SkillsMarqueeProps {
  activeSkillId?: string;
  onSelectSkill?: (skill: SkillItem) => void;
}

/**
 * SkillsMarquee
 * 
 * 100% Transparent Seamless Flowing Marquee with bidirectional linkage:
 * - When user hovers an icon in the 5-row constellation, the matching item in this marquee
 *   radiantly glows with its brand color and pulsing active beacon.
 * - When user clicks or hovers any quote in this marquee, it immediately syncs back
 *   to the constellation, locks the skill in the HUD, and shifts the cosmic nebula tint!
 */
export const SkillsMarquee: React.FC<SkillsMarqueeProps> = ({
  activeSkillId,
  onSelectSkill,
}) => {
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);

  const handleItemClick = (skill: SkillItem) => {
    playMechanicalClick();
    onSelectSkill?.(skill);
  };

  const renderMarqueeItem = (skill: SkillItem, keyPrefix: string) => {
    const isHovered = hoveredSkillId === skill.id;
    const isActive = activeSkillId === skill.id;
    const quote = getTechQuote(skill.id, skill.shortDescription || skill.positioning);

    return (
      <button
        key={`${keyPrefix}-${skill.id}`}
        type="button"
        onClick={() => handleItemClick(skill)}
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
        {/* Unified Glass Pod for the Logo */}
        <span className="flex items-center gap-2.5 shrink-0">
          <span
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center transition-transform duration-300 group-hover/quote:scale-110 shrink-0 relative"
            style={{
              borderColor: isHovered || isActive ? skill.brandColor : 'rgba(255, 255, 255, 0.12)',
              boxShadow:
                isHovered || isActive
                  ? `0 0 16px ${skill.brandColor}80`
                  : '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            <TechLogo
              id={skill.id}
              size={20}
              color={isHovered || isActive ? skill.brandColor : undefined}
            />
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
            {isActive && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                ACTIVE
              </span>
            )}
          </span>
        </span>

        {/* Separator */}
        <span className="text-purple-400/50 font-mono text-xs select-none">::</span>

        {/* The One-Liner Quote */}
        <span
          className={`font-medium text-xs sm:text-sm tracking-normal transition-colors duration-200 ${
            isHovered || isActive
              ? 'text-white font-semibold drop-shadow-[0_0_10px_rgba(255,255,255,0.45)]'
              : 'text-neutral-300 group-hover/quote:text-white'
          }`}
        >
          &ldquo;{quote}&rdquo;
        </span>
      </button>
    );
  };


  return (
    <div className="w-full flex flex-col gap-3 sm:gap-5 my-6 sm:my-10 select-none relative z-10">
      {/* 
        TRACK 1: Rows 1 & 2 Skills Stream (Flowing Forward / Left)
        Completely transparent background so star particles flow right through.
      */}
      <div className="marquee-band group">
        <div className="marquee-track marquee-track-forward">
          {TRACK_1_SKILLS.map((skill) => renderMarqueeItem(skill, 't1-a'))}
          {TRACK_1_SKILLS.map((skill) => renderMarqueeItem(skill, 't1-b'))}
        </div>
      </div>

      {/* 
        TRACK 2: Rows 3, 4 & 5 Skills Stream (Flowing Reverse / Right)
        Completely transparent background so star particles flow right through.
      */}
      <div className="marquee-band group">
        <div className="marquee-track marquee-track-reverse">
          {TRACK_2_SKILLS.map((skill) => renderMarqueeItem(skill, 't2-a'))}
          {TRACK_2_SKILLS.map((skill) => renderMarqueeItem(skill, 't2-b'))}
        </div>
      </div>
    </div>
  );
};
