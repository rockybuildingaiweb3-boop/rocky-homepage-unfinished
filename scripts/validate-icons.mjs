import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

async function validateIcons() {
  console.log('====================================================');
  console.log('--- STRICT TECHNICAL ICON VALIDATION ---');
  console.log('====================================================\n');

  // Load authoritative skills data and resolver
  const { SKILLS_DATA, SKILL_ROWS } = await import('../src/data/skills.ts');
  const {
    resolveSkillIcon,
    GENUINELY_UNBRANDED_SKILLS,
  } = await import('../src/components/skills/iconResolver.ts');

  console.log(`Auditing ${SKILLS_DATA.length} skills across ${SKILL_ROWS.length} category rows.`);

  const errors = [];
  const seenIds = new Set();
  const seenNames = new Set();
  const duplicateIds = [];
  const duplicateNames = [];

  const rowCounts = {};
  for (let r = 1; r <= 8; r++) {
    rowCounts[r] = 0;
  }

  const stats = {
    packageBacked: 0,
    localSvg: 0,
    approvedNeutral: 0,
    unresolvedBranded: 0,
    brokenLocalSvgs: 0,
    incorrectSubstitutions: 0,
  };

  const neutralList = [];

  for (const skill of SKILLS_DATA) {
    if (!skill.id) {
      errors.push(`Skill has empty id: ${JSON.stringify(skill)}`);
      continue;
    }

    // 1. Uniqueness check
    if (seenIds.has(skill.id)) {
      duplicateIds.push(skill.id);
    }
    seenIds.add(skill.id);

    if (seenNames.has(skill.name)) {
      duplicateNames.push(skill.name);
    }
    seenNames.add(skill.name);

    // 2. Row distribution check
    if (skill.row >= 1 && skill.row <= 8) {
      rowCounts[skill.row]++;
    } else {
      errors.push(`[${skill.id}] Invalid row index: ${skill.row}`);
    }

    const isApprovedUnbranded = Boolean(GENUINELY_UNBRANDED_SKILLS[skill.id]);
    const resolved = resolveSkillIcon(skill.id, skill.slug, skill.name);

    if (resolved.kind === 'svg-path') {
      if (!resolved.path || typeof resolved.path !== 'string' || resolved.path.length < 10) {
        errors.push(`[${skill.id}] Invalid SVG path from simple-icons: ${resolved.path}`);
      }
      if (!resolved.hex || typeof resolved.hex !== 'string') {
        errors.push(`[${skill.id}] Missing brand hex color in package definition`);
      }
      stats.packageBacked++;
    } else if (resolved.kind === 'local-svg') {
      if (!resolved.url) {
        errors.push(`[${skill.id}] Local SVG definition missing URL`);
        stats.brokenLocalSvgs++;
      } else {
        const localFilePath = path.join(ROOT, 'public', resolved.url);
        if (!fs.existsSync(localFilePath)) {
          errors.push(`[${skill.id}] Local SVG file missing on disk: ${localFilePath}`);
          stats.brokenLocalSvgs++;
        } else {
          const content = fs.readFileSync(localFilePath, 'utf8');
          if (!content.includes('<svg')) {
            errors.push(`[${skill.id}] Local asset is not valid SVG XML: ${localFilePath}`);
            stats.brokenLocalSvgs++;
          }
          if (content.includes('data:image/jpeg') || content.includes('data:image/png')) {
            errors.push(`[${skill.id}] Local SVG contains embedded raster image: ${localFilePath}`);
            stats.brokenLocalSvgs++;
          }
        }
      }
      stats.localSvg++;
    } else if (resolved.kind === 'unbranded') {
      if (!isApprovedUnbranded) {
        errors.push(
          `[${skill.id}] Branded technology "${skill.name}" has NO verified logo vector! (fallback = FAIL)`
        );
        stats.unresolvedBranded++;
      } else {
        stats.approvedNeutral++;
        neutralList.push({ id: skill.id, name: skill.name, reason: GENUINELY_UNBRANDED_SKILLS[skill.id] });
      }
    }

    // 3. Strict prohibitions: Disallow incorrect brand substitutions
    if (skill.id === 'glsl' && resolved.kind === 'svg-path' && resolved.title?.toLowerCase().includes('opengl')) {
      errors.push(`[glsl] Incorrect logo substitution: GLSL must NOT use OpenGL logo.`);
      stats.incorrectSubstitutions++;
    }
    if (skill.id === 'r3f' && resolved.kind === 'svg-path' && resolved.title?.toLowerCase() === 'react') {
      errors.push(`[r3f] Incorrect logo substitution: React Three Fiber must NOT use React logo.`);
      stats.incorrectSubstitutions++;
    }
    if (skill.id === 'draco' && resolved.kind === 'svg-path' && resolved.title?.toLowerCase().includes('three')) {
      errors.push(`[draco] Incorrect logo substitution: Draco must NOT use Three.js logo.`);
      stats.incorrectSubstitutions++;
    }
    if (skill.id === 'canvasapi' && resolved.kind === 'svg-path' && resolved.title?.toLowerCase().includes('html5')) {
      errors.push(`[canvasapi] Incorrect logo substitution: Canvas API must NOT use HTML5 logo.`);
      stats.incorrectSubstitutions++;
    }
  }

  // Row distribution summary
  console.log('Row distribution (Target: 10 per row):');
  let rowDistributionPass = true;
  for (let r = 1; r <= 8; r++) {
    const count = rowCounts[r];
    const isOk = count === 10;
    if (!isOk) rowDistributionPass = false;
    console.log(`  Row ${r}: ${count} skills ${isOk ? '✓' : '✗'}`);
  }

  if (duplicateIds.length > 0) {
    errors.push(`Duplicate skill IDs detected: ${duplicateIds.join(', ')}`);
  }
  if (duplicateNames.length > 0) {
    errors.push(`Duplicate skill names detected: ${duplicateNames.join(', ')}`);
  }

  console.log('\n--- RESOLUTION BREAKDOWN ---');
  console.log(`✓ Simple Icons package vectors: ${stats.packageBacked}`);
  console.log(`✓ Verified local SVG assets:    ${stats.localSvg}`);
  console.log(`✓ Approved neutral standards:   ${stats.approvedNeutral}`);
  console.log(`✗ Unresolved branded logos:     ${stats.unresolvedBranded}`);
  console.log(`✗ Broken local SVG files:       ${stats.brokenLocalSvgs}`);
  console.log(`✗ Incorrect logo substitutions: ${stats.incorrectSubstitutions}`);

  console.log('\n--- APPROVED NEUTRAL STANDARDS (< / > SPECIFICATION ICON) ---');
  for (const n of neutralList) {
    console.log(`  · [${n.id}] ${n.name}: ${n.reason}`);
  }

  console.log('\n====================================================');
  if (errors.length > 0 || !rowDistributionPass) {
    console.error(`FAILED: ${errors.length} validation errors found.`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  if (SKILLS_DATA.length !== 80) {
    console.error(`FAILED: Expected exactly 80 skills, got ${SKILLS_DATA.length}`);
    process.exit(1);
  }

  console.log('SUCCESS: All 80 skills verified with 100% strict compliance.');
  console.log('====================================================');
}

validateIcons().catch((err) => {
  console.error('Validation script crashed:', err);
  process.exit(1);
});
