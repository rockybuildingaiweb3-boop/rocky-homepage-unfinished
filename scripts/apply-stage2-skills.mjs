// scripts/apply-stage2-skills.mjs
import fs from 'fs';
import { SKILLS_80_V2, SKILL_ROWS_8 } from './build-80-skills-v2.mjs';

// 1. Generate src/data/skills.ts
const skillsTsContent = `export interface SkillItem {
  id: string;
  name: string;
  slug: string;
  row: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  rowTitle: string;
  category: string;
  brandColor: string;
  shortDescription: string;
  positioning?: string;
  relatedProjects?: string[];
  icon?: string;
}

export interface SkillRowDefinition {
  row: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  title: string;
  subtitle: string;
}

export const SKILL_ROWS: SkillRowDefinition[] = ${JSON.stringify(SKILL_ROWS_8, null, 2)};

export const PROJECT_NAMES: Record<
  string,
  { title: string; number: string; category: string; image: string }
> = {
  marymount: {
    title: 'Marymount Paris',
    number: '01',
    category: 'Enterprise Full-Stack CMS',
    image: '/assets/imgs/work-back/marymount/cover.jpg',
  },
  lcml: {
    title: 'Life-Cycle Management Laboratory',
    number: '02',
    category: 'Full-Stack Digital Platform',
    image: '/assets/imgs/work-back/lcml/cover.jpg',
  },
  v1: {
    title: 'Portfolio v1',
    number: '03',
    category: 'Personal Portfolio',
    image: '/assets/imgs/work-back/v1/cover.jpg',
  },
  kic: {
    title: 'Kelowna Islamic Center',
    number: '04',
    category: 'Multi-platform Solutions',
    image: '/assets/imgs/work-back/kic/cover.jpg',
  },
  grillzzy: {
    title: 'Grillzzy Foods',
    number: '05',
    category: 'Brand Website',
    image: '/assets/imgs/work-back/grillzzy/cover.jpg',
  },
  aurora: {
    title: 'Aurora Spatial',
    number: '06',
    category: 'Creative Experiment',
    image: '/assets/imgs/work-back/aurora/cover.jpg',
  },
  chronos: {
    title: 'Chronos Studio',
    number: '07',
    category: 'Algorithmic Design Tool',
    image: '/assets/imgs/work-back/chronos/cover.jpg',
  },
};

export const SKILLS_DATA: SkillItem[] = ${JSON.stringify(SKILLS_80_V2, null, 2)};

// Group skills by their designated row (1-8)
export const SKILLS_BY_ROW: Record<number, SkillItem[]> = {
  1: SKILLS_DATA.filter((s) => s.row === 1),
  2: SKILLS_DATA.filter((s) => s.row === 2),
  3: SKILLS_DATA.filter((s) => s.row === 3),
  4: SKILLS_DATA.filter((s) => s.row === 4),
  5: SKILLS_DATA.filter((s) => s.row === 5),
  6: SKILLS_DATA.filter((s) => s.row === 6),
  7: SKILLS_DATA.filter((s) => s.row === 7),
  8: SKILLS_DATA.filter((s) => s.row === 8),
};

// Skill Icons mapping directly derived from SKILLS_DATA for TechLogo consumption
export const SKILL_ICONS: Record<
  string,
  { id: string; slug: string; name: string; brandColor: string; cdnUrl: string; iconUrl?: string }
> = Object.fromEntries(
  SKILLS_DATA.map((s) => [
    s.id,
    {
      id: s.id,
      slug: s.slug,
      name: s.name,
      brandColor: s.brandColor,
      cdnUrl: s.icon || \`https://cdn.simpleicons.org/\${s.slug}\`,
      iconUrl: s.icon,
    },
  ])
);
`;

fs.writeFileSync('src/data/skills.ts', skillsTsContent, 'utf-8');
console.log('✅ Updated src/data/skills.ts for 8 rows × 10 items (80 skills)');

// 2. Generate src/data/techQuotes.ts
const quotes = {};
for (const s of SKILLS_80_V2) {
  quotes[s.id] = s.shortDescription;
}

const techQuotesTsContent = `/**
 * Dedicated Punchy One-Liner Quotes for Technologies
 * Complete 80-skill coverage across all 8 rows.
 */

export const TECH_QUOTES: Record<string, string> = ${JSON.stringify(quotes, null, 2)};

export function getTechQuote(skillId: string, fallback?: string): string {
  const normId = skillId.toLowerCase().replace(/[^a-z0-9]/g, '');
  return (
    TECH_QUOTES[normId] ||
    TECH_QUOTES[skillId] ||
    fallback ||
    'High-performance production technical capability ⚡'
  );
}
`;

fs.writeFileSync('src/data/techQuotes.ts', techQuotesTsContent, 'utf-8');
console.log('✅ Updated src/data/techQuotes.ts with quotes for all 80 skills');
