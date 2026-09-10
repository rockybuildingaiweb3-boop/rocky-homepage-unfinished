// scripts/generate-skills-ts.mjs
import fs from 'fs';
import { SKILLS_80 } from './build-skills.mjs';

const skillsTsContent = `export interface SkillItem {
  id: string;
  name: string;
  slug: string;
  row: 1 | 2 | 3 | 4 | 5;
  rowTitle: string;
  category: string;
  brandColor: string;
  shortDescription: string;
  positioning?: string;
  relatedProjects?: string[];
  icon?: string;
}

export interface SkillRowDefinition {
  row: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
}

export const SKILL_ROWS: SkillRowDefinition[] = [
  { row: 1, title: 'Core Frontend & Kinetic Motion', subtitle: 'TypeScript · Modern Frameworks · Design Tokens · Kinetic Motion' },
  { row: 2, title: '3D Spatial Computing & Graphics', subtitle: 'WebGL · WebGPU · Shaders · 3D Game Engines · Vulkan' },
  { row: 3, title: 'Backend, Systems & Cloud Infrastructure', subtitle: 'High-Throughput APIs · Relational Databases · Edge & Containers' },
  { row: 4, title: 'Web3 & Decentralized Protocols', subtitle: 'Smart Contracts · Layer 1 & 2 Blockchains · Oracles · DePIN' },
  { row: 5, title: 'AI Engineering, LLMs & Agentic Systems', subtitle: 'OpenAI · ChatGPT · Anthropic · LangChain · Vector RAG · PyTorch' },
];

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

export const SKILLS_DATA: SkillItem[] = ${JSON.stringify(SKILLS_80, null, 2)};

// Group skills by their designated row (1-5)
export const SKILLS_BY_ROW: Record<number, SkillItem[]> = {
  1: SKILLS_DATA.filter((s) => s.row === 1),
  2: SKILLS_DATA.filter((s) => s.row === 2),
  3: SKILLS_DATA.filter((s) => s.row === 3),
  4: SKILLS_DATA.filter((s) => s.row === 4),
  5: SKILLS_DATA.filter((s) => s.row === 5),
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
console.log('Successfully written src/data/skills.ts with 80 skills!');
