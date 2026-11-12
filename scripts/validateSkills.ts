import fs from 'node:fs';
import path from 'node:path';
import { validateSkillsDataset } from '../src/features/skills/validateSkills';
import {
  DESKTOP_CONSTELLATION,
  MOBILE_CONSTELLATION,
  computeGeometryDiagnostics,
  computeCategoryDiversityDiagnostics,
} from '../src/features/skills/constellationLayout';
import {
  LIVING_ORBIT_PARTICLES,
  FEATURED_ANCHOR_SPECS,
  SPATIAL_SPLINES,
  evaluateSculptureTrajectory,
} from '../src/features/skills/livingOrbitEngine';
import {
  STARFIELD_LAYER_SPECS,
  evaluateStarfieldCoverage,
} from '../src/components/ui/ParticleBackground';
import { SKILLS_DATA, SKILL_CATEGORIES } from '../src/data/skills';

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
console.log('SKILLS V2.1 — DATASET & ICON INTEGRITY REPORT');
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

// ─── LIVING ORBIT 2.1 & STARFIELD VERIFICATION ───
console.log('\n==================================================');
console.log('LIVING ORBIT 2.1 — 2.5D SCULPTURE & STARFIELD REPORT');
console.log('==================================================');

const spatialErrors: string[] = [];

// 1. Verify Living Orbit 2.1 particle count & Featured Anchors
if (LIVING_ORBIT_PARTICLES.length !== 88) {
  spatialErrors.push(`Living Orbit 2.1 has ${LIVING_ORBIT_PARTICLES.length} particles (expected 88).`);
}
if (FEATURED_ANCHOR_SPECS.length !== 8) {
  spatialErrors.push(`Living Orbit 2.1 has ${FEATURED_ANCHOR_SPECS.length} Featured Anchors (expected 8).`);
}
if (SPATIAL_SPLINES.length !== 3) {
  spatialErrors.push(`Living Orbit 2.1 has ${SPATIAL_SPLINES.length} trajectories (expected 3).`);
}

const seenInOrbitCycle = new Set<string>();
for (let t = 0; t <= 240; t += 4) {
  for (const p of LIVING_ORBIT_PARTICLES) {
    const st = evaluateSculptureTrajectory(p, t);
    if (st.isVisibleInAperture) {
      seenInOrbitCycle.add(p.skill.id);
    }
    if (!Number.isFinite(st.zPx) || st.zPx < -175 || st.zPx > 95) {
      spatialErrors.push(`Invalid zPx=${st.zPx} for ${p.skill.id} at t=${t}`);
    }
  }
}
if (seenInOrbitCycle.size !== 88) {
  spatialErrors.push(
    `Living Orbit 2.1 cycled ${seenInOrbitCycle.size}/88 skills across t=0..240s (expected all 88).`
  );
}

for (const cat of SKILL_CATEGORIES) {
  const catCount = LIVING_ORBIT_PARTICLES.filter((p) => p.skill.categoryId === cat.id).length;
  if (catCount !== 11) {
    spatialErrors.push(`Category ${cat.id} has ${catCount} particles (expected 11).`);
  }
}

// 2. Verify 4-layer Global Starfield parity & multi-viewport corner/quadrant coverage
const cov1440 = evaluateStarfieldCoverage(1440, 900);
const cov1920 = evaluateStarfieldCoverage(1920, 1080);
const covMobile = evaluateStarfieldCoverage(390, 844);

if (STARFIELD_LAYER_SPECS.length !== 4 || cov1440.totalStars !== 5725) {
  spatialErrors.push(
    `Starfield expected 4 layers and 5,725 total stars, got ${STARFIELD_LAYER_SPECS.length} layers and ${cov1440.totalStars} stars.`
  );
}

for (const [label, cov] of [
  ['1440x900', cov1440],
  ['1920x1080', cov1920],
  ['390x844', covMobile],
] as const) {
  if (
    cov.corners.topLeft < 40 ||
    cov.corners.topRight < 40 ||
    cov.corners.bottomLeft < 40 ||
    cov.corners.bottomRight < 40
  ) {
    spatialErrors.push(
      `Starfield corner coverage too low at ${label}: ${JSON.stringify(cov.corners)}`
    );
  }
}

console.log(`Living Orbit Particles: ${LIVING_ORBIT_PARTICLES.length} / 88`);
console.log(`Featured Anchors:       ${FEATURED_ANCHOR_SPECS.length} (${FEATURED_ANCHOR_SPECS.map((a) => a.id).join(', ')})`);
console.log(`Trajectory Systems:     ${SPATIAL_SPLINES.length} (${SPATIAL_SPLINES.map((s) => s.id).join(', ')})`);
console.log(`Cycled in Aperture:     ${seenInOrbitCycle.size} / 88`);
console.log(`Starfield Total Stars:  ${cov1440.totalStars} (tiny=${cov1440.layerCounts.tiny}, medium=${cov1440.layerCounts.medium}, bright=${cov1440.layerCounts.bright}, accent=${cov1440.layerCounts.accent})`);
console.log(`Starfield 1440x900:     Quadrants=${JSON.stringify(cov1440.quadrants)} | Corners=${JSON.stringify(cov1440.corners)}`);
console.log(`Starfield 1920x1080:    Quadrants=${JSON.stringify(cov1920.quadrants)} | Corners=${JSON.stringify(cov1920.corners)}`);
console.log(`Starfield 390x844:      Quadrants=${JSON.stringify(covMobile.quadrants)} | Corners=${JSON.stringify(covMobile.corners)}`);

// 3. Legacy constellation checks
if (DESKTOP_CONSTELLATION.nodePositions.size !== 88) {
  spatialErrors.push(`Desktop constellation has ${DESKTOP_CONSTELLATION.nodePositions.size} nodes (expected 88).`);
}
if (MOBILE_CONSTELLATION.nodePositions.size !== 88) {
  spatialErrors.push(`Mobile constellation has ${MOBILE_CONSTELLATION.nodePositions.size} nodes (expected 88).`);
}

for (const s of SKILLS_DATA) {
  if (!DESKTOP_CONSTELLATION.nodePositions.has(s.id)) {
    spatialErrors.push(`Skill ${s.id} missing from Desktop constellation.`);
  }
  if (!MOBILE_CONSTELLATION.nodePositions.has(s.id)) {
    spatialErrors.push(`Skill ${s.id} missing from Mobile constellation.`);
  }
}

const desktopDiag = computeGeometryDiagnostics(DESKTOP_CONSTELLATION);
const desktopDiversity = computeCategoryDiversityDiagnostics(DESKTOP_CONSTELLATION, 4);
console.log(`Legacy Constellation:   Desktop=${DESKTOP_CONSTELLATION.nodeList.length}/88 | NN min=${desktopDiag.nearestNeighborDistance.min}% | Same-cat rate=${desktopDiversity.sameCategoryPercentage}%`);
console.log('==================================================');

if (spatialErrors.length > 0) {
  console.error('\n[LIVING_ORBIT_VALIDATION_ERROR] Spatial validation failed:');
  spatialErrors.forEach((err, idx) => {
    console.error(`  ${idx + 1}. ${err}`);
  });
  process.exit(1);
} else {
  console.log('\n[LIVING_ORBIT_VALIDATION_SUCCESS] Living Orbit 2.1 & Global Starfield verified.\n');
  process.exit(0);
}
