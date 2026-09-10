import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

async function validateIcons() {
  console.log('--- STRICT SKILL ICON VALIDATION ---');
  
  // 1. Load skills data
  const { SKILLS_DATA } = await import('../src/data/skills.ts');
  const { resolveSkillIcon } = await import('../src/components/skills/iconResolver.ts');

  console.log(`Total skills in dataset: ${SKILLS_DATA.length}`);

  const seenIds = new Set();
  const duplicateIds = [];
  const errors = [];
  const stats = {
    packageBacked: 0,
    localSvg: 0,
    controlledFallback: 0,
  };

  for (const skill of SKILLS_DATA) {
    if (!skill.id) {
      errors.push(`Skill has empty id: ${JSON.stringify(skill)}`);
      continue;
    }

    if (seenIds.has(skill.id)) {
      duplicateIds.push(skill.id);
    }
    seenIds.add(skill.id);

    const resolved = resolveSkillIcon(skill.id, skill.slug, skill.name);

    if (resolved.kind === 'svg-path') {
      if (!resolved.path || typeof resolved.path !== 'string' || resolved.path.length < 10) {
        errors.push(`[${skill.id}] Invalid SVG path from simple-icons: ${resolved.path}`);
      }
      if (!resolved.hex || typeof resolved.hex !== 'string') {
        errors.push(`[${skill.id}] Missing brand hex color`);
      }
      stats.packageBacked++;
    } else if (resolved.kind === 'local-svg') {
      if (!resolved.url) {
        errors.push(`[${skill.id}] Local SVG has no url`);
      } else {
        const localFilePath = path.join(ROOT, 'public', resolved.url);
        if (!fs.existsSync(localFilePath)) {
          errors.push(`[${skill.id}] Local SVG file does not exist at: ${localFilePath}`);
        }
      }
      stats.localSvg++;
    } else if (resolved.kind === 'fallback') {
      if (!resolved.fallbackText || resolved.fallbackText.length < 2) {
        errors.push(`[${skill.id}] Controlled fallback missing valid 2-letter monogram: "${resolved.fallbackText}"`);
      }
      stats.controlledFallback++;
    } else {
      errors.push(`[${skill.id}] Unknown resolution kind: ${resolved.kind}`);
    }
  }

  console.log('\nResolution Breakdown:');
  console.log(`  ✓ Package-backed (simple-icons official vectors): ${stats.packageBacked}`);
  console.log(`  ✓ Local official SVGs (public/assets/icons/):      ${stats.localSvg}`);
  console.log(`  ✓ Controlled fallbacks (standardized monograms):  ${stats.controlledFallback}`);

  if (duplicateIds.length > 0) {
    console.error(`\n✖ Duplicate Skill IDs found: ${duplicateIds.join(', ')}`);
  }

  if (errors.length > 0) {
    console.error(`\n✖ Icon Validation FAILED with ${errors.length} errors:`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('\n✔ All skills have valid, verified icon definitions. Zero fake SVGs detected.\n');
}

validateIcons().catch((err) => {
  console.error('Validation script crashed:', err);
  process.exit(1);
});
