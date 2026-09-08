import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkillItem, SKILLS_BY_ROW, SKILL_ROWS } from '../../data/skills';
import { TechLogo } from './TechLogo';
import { getTechQuote } from '../../data/techQuotes';
import { playMechanicalClick } from './audio';

interface TechLogoConstellationProps {
  activeSkillId?: string;
  onSelectSkill?: (skill: SkillItem) => void;
}

/**
 * TechLogoConstellation
 * 
 * Implements the user's exact 50 skills (5 rows x 10 items):
 * Row 1: 核心前端与交互动效 (10)
 * Row 2: 3D 空间计算与图形资产 (10)
 * Row 3: 服务端、数据与基础设施 (10)
 * Row 4: Web3 与去中心化架构 (10)
 * Row 5: AI 智能体与现代设计工作流 (10)
 * 
 * Features:
 * - Pure frameless floating vector logos hovering directly over the cosmic purple planet
 * - Scheme A (Simple Icons CDN) + Scheme B (@iconify/react) dual-engine rendering
 * - Kinetic spring hover scale (1.28x) with official brand color radiant drop-shadows
 * - Floating telemetry HUD showing skill name, domain tag, and quote
 * - Bidirectional real-time linkage with the bottom flowing marquee
 */
export const TechLogoConstellation: React.FC<TechLogoConstellationProps> = ({
  activeSkillId,
  onSelectSkill,
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);

  const handleMouseEnter = (skill: SkillItem) => {
    setHoveredSkill(skill);
    // Real-time linkage: hovering an icon notifies the section and marquee
    onSelectSkill?.(skill);
  };

  const handleMouseLeave = () => {
    setHoveredSkill(null);
  };

  const handleClick = (skill: SkillItem) => {
    playMechanicalClick();
    onSelectSkill?.(skill);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4 select-none">
      {/* ─── FLOATING TELEMETRY HUD / BADGE ─── */}
      <div className="h-11 sm:h-12 flex items-center justify-center mb-5">
        <AnimatePresence mode="wait">
          {hoveredSkill ? (
            <motion.div
              key={hoveredSkill.id}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#030014]/90 border backdrop-blur-xl shadow-2xl z-30"
              style={{
                borderColor: `${hoveredSkill.brandColor}55`,
                boxShadow: `0 0 24px ${hoveredSkill.brandColor}35, 0 4px 20px rgba(0,0,0,0.8)`,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse shadow-sm"
                style={{ backgroundColor: hoveredSkill.brandColor }}
              />
              <span className="text-sm font-semibold text-white tracking-wide">
                {hoveredSkill.name}
              </span>
              <span className="text-xs text-purple-300/80 font-mono hidden sm:inline">
                [{hoveredSkill.category}]
              </span>
              <span className="text-xs text-neutral-300 font-light max-w-[280px] sm:max-w-md truncate border-l border-white/15 pl-2.5">
                &ldquo;{getTechQuote(hoveredSkill.id, hoveredSkill.shortDescription || hoveredSkill.positioning)}&rdquo;
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs sm:text-sm text-purple-300/65 font-mono tracking-wider flex items-center gap-2"
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
              <span>HOVER LOGO FOR TELEMETRY // REAL-TIME LINKAGE ACTIVE</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── 5-ROW CONSTELLATION: EXACT 50 SKILLS (10 PER ROW) ─── */}
      <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-y-7 sm:gap-y-9 md:gap-y-11 px-2 sm:px-4">
        {SKILL_ROWS.map((rowDef, rowIndex) => {
          const rowSkills = SKILLS_BY_ROW[rowDef.row] || [];

          return (
            <motion.div
              key={`row-${rowDef.row}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: rowIndex * 0.07 }}
              className="w-full flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-7 md:gap-x-9 lg:gap-x-10 gap-y-3"
            >
              {rowSkills.map((skill) => {
                const isActive = activeSkillId === skill.id;
                const isHovered = hoveredSkill?.id === skill.id;
                const brandColor = skill.brandColor || '#FFFFFF';

                return (
                  <motion.button
                    key={skill.id}
                    type="button"
                    onClick={() => handleClick(skill)}
                    onMouseEnter={() => handleMouseEnter(skill)}
                    onMouseLeave={handleMouseLeave}
                    whileHover={{
                      scale: 1.28,
                      transition: { type: 'spring', stiffness: 450, damping: 18 },
                    }}
                    whileTap={{ scale: 0.92 }}
                    className="group relative flex items-center justify-center p-2 sm:p-2.5 rounded-xl cursor-pointer focus:outline-none transition-transform duration-200"
                    aria-label={skill.name}
                    title={`${skill.name} (${skill.category})`}
                  >
                    {/* Glowing Ambient Aura on Hover/Active */}
                    {(isHovered || isActive) && (
                      <motion.div
                        layoutId="logo-aura"
                        className="absolute inset-0 rounded-full blur-xl pointer-events-none opacity-70"
                        style={{
                          backgroundColor: brandColor,
                          transform: 'scale(1.35)',
                        }}
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    {/* Pure Floating High-Definition Logo */}
                    <div
                      className="relative z-10 flex items-center justify-center transition-all duration-300"
                      style={{
                        filter:
                          isHovered || isActive
                            ? `drop-shadow(0 0 16px ${brandColor}) drop-shadow(0 0 4px ${brandColor})`
                            : 'drop-shadow(0 4px 10px rgba(0,0,0,0.65))',
                      }}
                    >
                      <TechLogo
                        id={skill.id}
                        iconUrl={skill.icon}
                        iconifyId={skill.iconify}
                        name={skill.name}
                        color={brandColor}
                        size={44}
                        className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12"
                      />
                    </div>

                    {/* Active Indicator Micro-Halo */}
                    {isActive && (
                      <span
                        className="absolute -bottom-1 w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse"
                        style={{ backgroundColor: brandColor, color: brandColor }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

