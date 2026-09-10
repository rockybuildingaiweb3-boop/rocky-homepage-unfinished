// scripts/generate-quotes-ts.mjs
import fs from 'fs';
import { SKILLS_80 } from './build-skills.mjs';

const quotes = {};
for (const s of SKILLS_80) {
  quotes[s.id] = s.shortDescription;
}

const content = `/**
 * Dedicated Punchy One-Liner Quotes for Technologies
 * Complete 80-skill coverage across all 5 rows.
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

fs.writeFileSync('src/data/techQuotes.ts', content, 'utf-8');
console.log('Successfully written src/data/techQuotes.ts with 80 quotes!');
