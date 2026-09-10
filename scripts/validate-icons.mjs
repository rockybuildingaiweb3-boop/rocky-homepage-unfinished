import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Authoritative regression baseline: Minimum expected counts
const REGRESSION_BASELINE = {
  totalSkills: 80,
  minPackageIcons: 53,
  minLocalSvgs: 15,
  maxApprovedNeutral: 12,
  maxIncorrectFallbacks: 0,
};

async function validateIcons() {
  console.log('====================================================');
  console.log('--- AUTHORITATIVE TECHNICAL ICON VALIDATION ---');
  console.log('====================================================\n');

  // 1. Load data and registry
  const { SKILLS_DATA, SKILL_ROWS } = await import('../src/data/skills.ts');
  const { resolveSkillIcon } = await import('../src/components/skills/iconResolver.ts');
  const { ICON_REGISTRY } = await import('../src/components/skills/iconRegistry.ts');

  console.log(`Loaded ${SKILLS_DATA.length} skills across ${SKILL_ROWS.length} category rows.`);

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
    incorrectFallbacks: 0,
  };

  const neutralAuditList = [];

  for (const skill of SKILLS_DATA) {
    if (!skill.id) {
      errors.push(`Skill has empty id: ${JSON.stringify(skill)}`);
      continue;
    }

    // Duplicate detection
    if (seenIds.has(skill.id)) {
      duplicateIds.push(skill.id);
    }
    seenIds.add(skill.id);

    if (seenNames.has(skill.name)) {
      duplicateNames.push(skill.name);
    }
    seenNames.add(skill.name);

    // Row distribution verification
    if (skill.row >= 1 && skill.row <= 8) {
      rowCounts[skill.row]++;
    } else {
      errors.push(`[${skill.id}] Invalid row index: ${skill.row}`);
    }

    // Registry presence
    const registryEntry = ICON_REGISTRY[skill.id];
    if (!registryEntry) {
      errors.push(`[${skill.id}] Missing from canonical ICON_REGISTRY in iconRegistry.ts`);
    }

    // Resolution check
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
      } else {
        const localFilePath = path.join(ROOT, 'public', resolved.url);
        if (!fs.existsSync(localFilePath)) {
          errors.push(`[${skill.id}] Local SVG file missing on disk: ${localFilePath}`);
        } else {
          const content = fs.readFileSync(localFilePath, 'utf8');
          if (!content.includes('<svg')) {
            errors.push(`[${skill.id}] Local asset is not valid SVG XML: ${localFilePath}`);
          }
          if (content.includes('data:image/jpeg') || content.includes('data:image/png')) {
            errors.push(`[${skill.id}] Local SVG contains embedded raster image: ${localFilePath}`);
          }
        }
      }
      stats.localSvg++;
    } else if (resolved.kind === 'neutral') {
      if (!resolved.neutralReason) {
        errors.push(`[${skill.id}] Neutral representation missing documented neutralReason`);
      }
      if (!resolved.fallbackText || resolved.fallbackText.length !== 2) {
        errors.push(`[${skill.id}] Neutral monogram must be exactly 2 characters: "${resolved.fallbackText}"`);
      }
      stats.approvedNeutral++;
      neutralAuditList.push({
        id: skill.id,
        name: skill.name,
        row: skill.row,
        reason: resolved.neutralReason,
      });
    } else {
      // Any generic or unapproved fallback is a STRICT FAILURE for branded skills
      errors.push(
        `[${skill.id}] INCORRECT FALLBACK: Technology degraded to generic monogram without approved neutral classification.`
      );
      stats.incorrectFallbacks++;
    }
  }

  // Row distribution assertion: exactly 10 per row
  for (let r = 1; r <= 8; r++) {
    if (rowCounts[r] !== 10) {
      errors.push(`Row ${r} has ${rowCounts[r]} skills (expected exactly 10).`);
    }
  }

  // Duplicate errors
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate Skill IDs: ${duplicateIds.join(', ')}`);
  }
  if (duplicateNames.length > 0) {
    errors.push(`Duplicate Skill Names: ${duplicateNames.join(', ')}`);
  }

  // Regression protection assertions
  if (stats.packageBacked < REGRESSION_BASELINE.minPackageIcons) {
    errors.push(
      `REGRESSION: Package-backed icons dropped to ${stats.packageBacked} (baseline: ${REGRESSION_BASELINE.minPackageIcons}).`
    );
  }
  if (stats.localSvg < REGRESSION_BASELINE.minLocalSvgs) {
    errors.push(
      `REGRESSION: Local official SVGs dropped to ${stats.localSvg} (baseline: ${REGRESSION_BASELINE.minLocalSvgs}).`
    );
  }
  if (stats.approvedNeutral > REGRESSION_BASELINE.maxApprovedNeutral) {
    errors.push(
      `REGRESSION: Approved neutral representations increased to ${stats.approvedNeutral} (baseline max: ${REGRESSION_BASELINE.maxApprovedNeutral}).`
    );
  }
  if (stats.incorrectFallbacks > REGRESSION_BASELINE.maxIncorrectFallbacks) {
    errors.push(`REGRESSION: Found ${stats.incorrectFallbacks} incorrect fallbacks.`);
  }

  const totalReconciled = stats.packageBacked + stats.localSvg + stats.approvedNeutral + stats.incorrectFallbacks;
  if (totalReconciled !== 80) {
    errors.push(`Total skills reconciled to ${totalReconciled} instead of 80.`);
  }

  console.log('--- VALIDATION SUMMARY ---');
  console.log(`Total skills: ${SKILLS_DATA.length}`);
  console.log(`Rows: 8 (10 skills per row: ${Object.values(rowCounts).every((c) => c === 10) ? 'VERIFIED' : 'FAILED'})`);
  console.log(`Verified package icons (simple-icons):      ${stats.packageBacked}`);
  console.log(`Verified local official SVGs:              ${stats.localSvg}`);
  console.log(`Approved neutral specifications:           ${stats.approvedNeutral}`);
  console.log(`Incorrect fallbacks:                       ${stats.incorrectFallbacks}`);
  console.log(`Reconciliation check:                      ${totalReconciled}/80\n`);

  console.log('Approved Neutral Representations Audit:');
  neutralAuditList.forEach((n) => {
    console.log(`  - [Row ${n.row}] ${n.id} (${n.name}): ${n.reason}`);
  });

  if (errors.length > 0) {
    console.error(`\n✖ ICON VALIDATION FAILED WITH ${errors.length} ERRORS:\n`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('\n✔ ICON VALIDATION PASSED. Zero fake SVGs, zero unapproved fallbacks, 100% deterministic.\n');
}

validateIcons().catch((err) => {
  console.error('Validation script crashed:', err);
  process.exit(1);
});
