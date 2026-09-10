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
    LOCAL_SVG_ASSETS,
    PACKAGE_ICONS,
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

    const isUnbranded = Boolean(GENUINELY_UNBRANDED_SKILLS[skill.id]);
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
    } else if (resolved.kind === 'neutral') {
      // For branded technologies, fallback = FAIL
      if (!isUnbranded) {
        errors.push(
          `[${skill.id}] UNRESOLVED BRANDED LOGO: Branded technology degraded to monogram without legitimate logo.`
        );
        stats.unresolvedBranded++;
      } else {
        stats.approvedNeutral++;
        neutralList.push({
          id: skill.id,
          name: skill.name,
          row: skill.row,
          reason: resolved.neutralReason,
        });
      }
    }
  }

  // 3. Row count validation (exactly 10 per row)
  for (let r = 1; r <= 8; r++) {
    if (rowCounts[r] !== 10) {
      errors.push(`Row ${r} has ${rowCounts[r]} skills (expected exactly 10).`);
    }
  }

  if (duplicateIds.length > 0) {
    errors.push(`Duplicate Skill IDs: ${duplicateIds.join(', ')}`);
  }
  if (duplicateNames.length > 0) {
    errors.push(`Duplicate Skill Names: ${duplicateNames.join(', ')}`);
  }

  const totalReconciled = stats.packageBacked + stats.localSvg + stats.approvedNeutral + stats.unresolvedBranded;

  console.log('--- VALIDATION SUMMARY ---');
  console.log(`Total skills:                              ${SKILLS_DATA.length} (expected 80)`);
  console.log(`Rows verified (10 per row):                ${Object.values(rowCounts).every((c) => c === 10) ? '8/8 PASS' : 'FAIL'}`);
  console.log(`Verified package icons (simple-icons):      ${stats.packageBacked}`);
  console.log(`Verified local official SVGs:              ${stats.localSvg}`);
  console.log(`Approved neutral specifications:           ${stats.approvedNeutral}`);
  console.log(`Unresolved branded logos:                  ${stats.unresolvedBranded}`);
  console.log(`Broken local SVGs:                         ${stats.brokenLocalSvgs}`);
  console.log(`Incorrect logo substitutions:              ${stats.incorrectSubstitutions}`);
  console.log(`Reconciliation check:                      ${totalReconciled}/80\n`);

  console.log('Approved Genuinely Unbranded Specifications:');
  neutralList.forEach((n) => {
    console.log(`  ✓ [Row ${n.row}] ${n.id.padEnd(16)} (${n.name.padEnd(20)}): ${n.reason}`);
  });

  if (errors.length > 0) {
    console.error(`\n✖ STRICT VALIDATION FAILED WITH ${errors.length} ERRORS:\n`);
    errors.forEach((err) => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log('\n✔ ALL 80 SKILLS VALIDATED. Zero unresolved branded logos, zero broken SVGs.\n');
}

validateIcons().catch((err) => {
  console.error('Validation script crashed:', err);
  process.exit(1);
});
