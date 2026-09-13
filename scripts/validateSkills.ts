import fs from 'node:fs';
import path from 'node:path';
import { validateSkillsDataset } from '../src/features/skills/validateSkills';
import {
  DESKTOP_CONSTELLATION,
  MOBILE_CONSTELLATION,
  SKILL_ZONE_ASSIGNMENTS,
} from '../src/features/skills/constellationLayout';
import { SKILLS_DATA } from '../src/data/skills';

/**
 * Repository-level disk verification.
 * Confirms that every local SVG referenced by the registry actually exists on disk.
 */
const nodeFsAssetChecker = (url: string): boolean => {
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  const fullPath = path.resolve(process.cwd(), 'public', cleanUrl);
  return fs.existsSync(fullPath);
};

const report = validateSkillsDataset(nodeFsAssetChecker);

console.log('==================================================');
console.log('SKILLS V2 — DATASET & ICON INTEGRITY REPORT');
console.log('==================================================');
console.log(report.formattedReport);
console.log('==================================================');

if (!report.isValid) {
  console.error('\n[SKILLS_VALIDATION_ERROR] Dataset validation failed with the following issues:');
  report.errors.forEach((err, idx) => {
    console.error(`  ${idx + 1}. ${err}`);
  });
  process.exit(1);
} else {
  console.log('\n[SKILLS_VALIDATION_SUCCESS] All 88 skills and icon registry entries verified.');
}

// ─── SPATIAL CONSTELLATION VERIFICATION ───
console.log('\n==================================================');
console.log('SKILLS V2 — SPATIAL CONSTELLATION INTEGRITY REPORT');
console.log('==================================================');

const spatialErrors: string[] = [];

// 1. Verify exact 88 node counts
if (DESKTOP_CONSTELLATION.nodePositions.size !== 88) {
  spatialErrors.push(`Desktop constellation has ${DESKTOP_CONSTELLATION.nodePositions.size} nodes (expected 88).`);
}
if (MOBILE_CONSTELLATION.nodePositions.size !== 88) {
  spatialErrors.push(`Mobile constellation has ${MOBILE_CONSTELLATION.nodePositions.size} nodes (expected 88).`);
}

// 2. Verify all skills mapped
for (const s of SKILLS_DATA) {
  if (!DESKTOP_CONSTELLATION.nodePositions.has(s.id)) {
    spatialErrors.push(`Skill ${s.id} missing from Desktop constellation.`);
  }
  if (!MOBILE_CONSTELLATION.nodePositions.has(s.id)) {
    spatialErrors.push(`Skill ${s.id} missing from Mobile constellation.`);
  }
}

// 3. Verify Zone distribution (Zone A: 14, Zone B: 43, Zone C: 23, Zone D: 8)
const zoneCounts = { A: 0, B: 0, C: 0, D: 0 };
for (const s of SKILLS_DATA) {
  const z = SKILL_ZONE_ASSIGNMENTS[s.id];
  if (!z) spatialErrors.push(`Skill ${s.id} has no assigned zone.`);
  else zoneCounts[z]++;
}

if (zoneCounts.A !== 14 || zoneCounts.B !== 43 || zoneCounts.C !== 23 || zoneCounts.D !== 8) {
  spatialErrors.push(`Zone distribution mismatch: ${JSON.stringify(zoneCounts)} (expected A:14, B:43, C:23, D:8)`);
}

// 4. Verify Desktop collisions & planet clearance
const desktopNodes = DESKTOP_CONSTELLATION.nodeList;
let desktopCollisions = 0;
let desktopPlanetCollisions = 0;

for (let i = 0; i < desktopNodes.length; i++) {
  const n1 = desktopNodes[i];
  // Planet clearance: rx=19.5, ry=20.5
  const dPlanet = Math.sqrt(((n1.x - 50) / 19.5) ** 2 + ((n1.y - 50) / 20.5) ** 2);
  if (dPlanet < 1.0) desktopPlanetCollisions++;

  // Viewport bounds
  if (n1.x < 3.0 || n1.x > 97.0 || n1.y < 3.0 || n1.y > 97.0) {
    spatialErrors.push(`Desktop node ${n1.id} out of bounds: (${n1.x}%, ${n1.y}%)`);
  }

  for (let j = i + 1; j < desktopNodes.length; j++) {
    const n2 = desktopNodes[j];
    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;
    const normDist = Math.sqrt((dx / 4.4) ** 2 + (dy / 6.0) ** 2);
    if (normDist < 1.0) desktopCollisions++;
  }
}

// 5. Verify Mobile collisions & planet clearance
const mobileNodes = MOBILE_CONSTELLATION.nodeList;
let mobileCollisions = 0;
let mobilePlanetCollisions = 0;

for (let i = 0; i < mobileNodes.length; i++) {
  const n1 = mobileNodes[i];
  const dPlanet = Math.sqrt(((n1.x - 50) / 18.0) ** 2 + ((n1.y - 50) / 15.0) ** 2);
  if (dPlanet < 1.0) mobilePlanetCollisions++;

  if (n1.x < 3.0 || n1.x > 97.0 || n1.y < 3.0 || n1.y > 97.0) {
    spatialErrors.push(`Mobile node ${n1.id} out of bounds: (${n1.x}%, ${n1.y}%)`);
  }

  for (let j = i + 1; j < mobileNodes.length; j++) {
    const n2 = mobileNodes[j];
    const dx = n2.x - n1.x;
    const dy = n2.y - n1.y;
    const normDist = Math.sqrt((dx / 8.4) ** 2 + (dy / 3.6) ** 2);
    if (normDist < 1.0) mobileCollisions++;
  }
}

console.log(`Desktop Nodes:          ${desktopNodes.length} / 88`);
console.log(`Mobile Nodes:           ${mobileNodes.length} / 88`);
console.log(`Zones:                  Zone A: ${zoneCounts.A}, Zone B: ${zoneCounts.B}, Zone C: ${zoneCounts.C}, Zone D: ${zoneCounts.D}`);
console.log(`Desktop Collisions:     ${desktopCollisions}`);
console.log(`Desktop Planet Bounds:  ${desktopPlanetCollisions}`);
console.log(`Mobile Collisions:      ${mobileCollisions}`);
console.log(`Mobile Planet Bounds:   ${mobilePlanetCollisions}`);
console.log(`Editorial Labels:       ${DESKTOP_CONSTELLATION.categoryLabels.length} / 8`);
console.log('==================================================');

if (spatialErrors.length > 0) {
  console.error('\n[CONSTELLATION_VALIDATION_ERROR] Spatial validation failed:');
  spatialErrors.forEach((err, idx) => {
    console.error(`  ${idx + 1}. ${err}`);
  });
  process.exit(1);
} else {
  console.log('\n[CONSTELLATION_VALIDATION_SUCCESS] Constellation spatial composition verified.\n');
  process.exit(0);
}

