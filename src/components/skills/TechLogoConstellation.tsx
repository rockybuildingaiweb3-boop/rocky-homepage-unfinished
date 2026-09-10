import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkillItem, SKILLS_DATA, SKILLS_BY_ROW, SKILL_ROWS, SKILL_CATEGORIES } from '../../data/skills';
import { TechLogo } from './TechLogo';

interface TechLogoConstellationProps {
  activeSkillId?: string;
  onSelectSkill?: (skill: SkillItem) => void;
}

export const TechLogoConstellation: React.FC<TechLogoConstellationProps> = ({ activeSkillId, onSelectSkill }) => {
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [selectedCategoryRow, setSelectedCategoryRow] = useState(0);

  const handleFilterClick = (row: number) => {
    setSelectedCategoryRow(row);
    if (row !== 0 && (!activeSkillId || SKILLS_DATA.find((skill) => skill.id === activeSkillId)?.row !== row)) {
      const first = SKILLS_BY_ROW[row]?.[0];
      if (first) onSelectSkill?.(first);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-2 select-none">
      <nav aria-label="Skills categories" className="mb-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4">
        {SKILL_CATEGORIES.map((category, index) => (
          <React.Fragment key={category.id}>
            <button type="button" onClick={() => handleFilterClick(category.row)} className={`relative py-1 text-xs sm:text-[13px] tracking-[0.2em] lowercase font-mono border-none bg-transparent ${selectedCategoryRow === category.row ? 'text-white' : 'text-white/40 hover:text-white/80'}`}>
              {category.label}
              <span className={`absolute -bottom-1 left-0 right-0 h-px bg-purple-300 transition-transform ${selectedCategoryRow === category.row ? 'scale-x-100' : 'scale-x-0'}`} />
            </button>
            {index < SKILL_CATEGORIES.length - 1 && <span className="hidden text-white/15 sm:inline" aria-hidden="true">·</span>}
          </React.Fragment>
        ))}
      </nav>

      <div className="mb-6 min-h-8 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {hoveredSkill && (
            <motion.div key={hoveredSkill.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs text-white/80 backdrop-blur-md">
              <span className="font-semibold text-white">{hoveredSkill.name}</span>
              <span className="mx-2 text-white/25">·</span>
              <span>row {hoveredSkill.row}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-[1240px] flex flex-col items-center justify-center gap-y-5 px-2 sm:gap-y-6 md:gap-y-7 sm:px-4">
        {SKILL_ROWS.map((rowDef) => {
          const skills = SKILLS_BY_ROW[rowDef.row] || [];
          const filtered = selectedCategoryRow !== 0 && selectedCategoryRow !== rowDef.row;
          return (
            <motion.div key={rowDef.row} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`w-full flex flex-wrap items-center justify-center gap-x-3.5 gap-y-2.5 sm:gap-x-5 sm:gap-y-3 md:gap-x-6 lg:gap-x-8 transition-opacity ${filtered ? 'opacity-15' : 'opacity-100'}`}>
              {skills.map((skill) => {
                const active = activeSkillId === skill.id;
                const hovered = hoveredSkill?.id === skill.id;
                return (
                  <motion.button key={skill.id} type="button" onClick={() => onSelectSkill?.(skill)} onMouseEnter={() => { setHoveredSkill(skill); onSelectSkill?.(skill); }} onMouseLeave={() => setHoveredSkill(null)} whileHover={{ scale: 1.16, y: -4 }} whileTap={{ scale: 0.94 }} className="group relative flex items-center justify-center rounded-xl p-2">
                    {(active || hovered) && <motion.div layoutId="logo-aura" className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl" />}
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
                      <TechLogo id={skill.id} slug={skill.slug} name={skill.name} size={40} className="h-9 w-9 sm:h-10 sm:w-10" />
                    </div>
                    {active && <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-purple-300 animate-pulse" />}
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

export default TechLogoConstellation;
