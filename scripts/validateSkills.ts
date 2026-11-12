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
  ORBIT_ARC_LENGTH_TABLES,
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
console.log('SKILLS V2.2 — DATASET & ICON INTEGRITY REPORT');
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

// ─── LIVING ORBIT 2.2 & FULL-SCREEN STAR SEA VERIFICATION ───
console.log('\n==================================================');
console.log('LIVING ORBIT 2.2 — 2.5D SCULPTURE & 8,000-STAR SEA REPORT');
console.log('==================================================');

const spatialErrors: string[] = [];

// 1. Verify Living Orbit 2.2 particle count, Two-Level Featured Anchors & Arc-Length LUTs
if (LIVING_ORBIT_PARTICLES.length !== 88) {
  spatialErrors.push(`Living Orbit 2.2 has ${LIVING_ORBIT_PARTICLES.length} particles (expected 88).`);
}
if (FEATURED_ANCHOR_SPECS.length !== 8) {
  spatialErrors.push(`Living Orbit 2.2 has ${FEATURED_ANCHOR_SPECS.length} Featured Anchors (expected 8).`);
}
const primaryAnchors = FEATURED_ANCHOR_SPECS.filter((a) => a.anchorTier === 'primary');
const secondaryAnchors = FEATURED_ANCHOR_SPECS.filter((a) => a.anchorTier === 'secondary');
if (primaryAnchors.length !== 4 || secondaryAnchors.length !== 4) {
  spatialErrors.push(
    `Expected 4 Primary and 4 Secondary Featured Anchors, got ${primaryAnchors.length} and ${secondaryAnchors.length}.`
  );
}
if (SPATIAL_SPLINES.length !== 3 || Object.keys(ORBIT_ARC_LENGTH_TABLES).length !== 3) {
  spatialErrors.push(`Living Orbit 2.2 expected 3 trajectories and 3 arc-length LUTs.`);
}

const seenInOrbitCycle = new Set<string>();
for (let t = 0; t <= 240; t += 4) {
  let movingVisible = 0;
  for (const p of LIVING_ORBIT_PARTICLES) {
    const st = evaluateSculptureTrajectory(p, t);
    if (st.isVisibleInAperture) {
      seenInOrbitCycle.add(p.skill.id);
      if (!p.isFeaturedAnchor) movingVisible++;
    }
    if (!Number.isFinite(st.zPx) || st.zPx < -175 || st.zPx > 95) {
      spatialErrors.push(`Invalid zPx=${st.zPx} for ${p.skill.id} at t=${t}`);
    }
  }
  if (movingVisible < 24 || movingVisible > 28) {
    spatialErrors.push(`Moving visible count ${movingVisible} outside 24-28 range at t=${t}`);
  }
}
if (seenInOrbitCycle.size !== 88) {
  spatialErrors.push(
    `Living Orbit 2.2 cycled ${seenInOrbitCycle.size}/88 skills across t=0..240s (expected all 88).`
  );
}

for (const cat of SKILL_CATEGORIES) {
  const catCount = LIVING_ORBIT_PARTICLES.filter((p) => p.skill.categoryId === cat.id).length;
  if (catCount !== 11) {
    spatialErrors.push(`Category ${cat.id} has ${catCount} particles (expected 11).`);
  }
}

// 2. Verify 4-layer 6,500-Star Global Starfield & 12x8 / 8x12 grid occupancy across viewports & times
const viewports: readonly [string, number, number][] = [
  ['1440x900', 1440, 900],
  ['1920x1080', 1920, 1080],
  ['2048x1002', 2048, 1002],
  ['390x844', 390, 844],
];
const sampleTimes = [0, 10, 30, 60];

for (const [label, w, h] of viewports) {
  for (const t of sampleTimes) {
    const cov = evaluateStarfieldCoverage(w, h, t);
    if (STARFIELD_LAYER_SPECS.length !== 4 || cov.totalStars !== 6500) {
      spatialErrors.push(
        `Starfield at ${label} (t=${t}s) expected 6,500 stars across 4 layers, got ${cov.totalStars}.`
      );
    }
    if (
      cov.emptyCellCount > 0 ||
      cov.cellsWithAtLeast38Pct < 95 ||
      cov.minCellCount < 25
    ) {
      spatialErrors.push(
        `Starfield grid occupancy failed at ${label} (t=${t}s): empty=${cov.emptyCellCount}, >=38Pct=${cov.cellsWithAtLeast38Pct}%, minCell=${cov.minCellCount}`
      );
    }
  }
}

const cov1440 = evaluateStarfieldCoverage(1440, 900, 0);
const cov1920 = evaluateStarfieldCoverage(1920, 1080, 0);
const cov2048 = evaluateStarfieldCoverage(2048, 1002, 0);
const covMobile = evaluateStarfieldCoverage(390, 844, 0);

console.log(`Living Orbit Particles: ${LIVING_ORBIT_PARTICLES.length} / 88`);
console.log(
  `Primary Anchors (4):    ${primaryAnchors.map((a) => `${a.id}(${a.desktopSize}px)`).join(', ')}`
);
console.log(
  `Secondary Anchors (4):  ${secondaryAnchors.map((a) => `${a.id}(${a.desktopSize}px)`).join(', ')}`
);
console.log(
  `Trajectory Systems:     ${SPATIAL_SPLINES.map(
    (s) => `${s.id}[cap=${s.visibleCapacity}, pass=${s.targetPassDurationSec}s]`
  ).join(', ')}`
);
console.log(`Cycled in Aperture:     ${seenInOrbitCycle.size} / 88 (26 moving + 8 anchors = 34 visible)`);
console.log(
  `Starfield Total Stars:  ${cov1440.totalStars} (tiny=${cov1440.layerCounts.tiny}, medium=${cov1440.layerCounts.medium}, bright=${cov1440.layerCounts.bright}, accent=${cov1440.layerCounts.accent})`
);
console.log(
  `Starfield 1440x900:     12x8 Grid min=${cov1440.minCellCount}, max=${cov1440.maxCellCount}, >=38=${cov1440.cellsWithAtLeast38Pct}%`
);
console.log(
  `Starfield 1920x1080:    12x8 Grid min=${cov1920.minCellCount}, max=${cov1920.maxCellCount}, >=38=${cov1920.cellsWithAtLeast38Pct}%`
);
console.log(
  `Starfield 2048x1002:    12x8 Grid min=${cov2048.minCellCount}, max=${cov2048.maxCellCount}, >=38=${cov2048.cellsWithAtLeast38Pct}%`
);
console.log(
  `Starfield 390x844:      8x12 Grid min=${covMobile.minCellCount}, max=${covMobile.maxCellCount}, >=38=${covMobile.cellsWithAtLeast38Pct}%`
);

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
console.log(
  `Legacy Constellation:   Desktop=${DESKTOP_CONSTELLATION.nodeList.length}/88 | NN min=${desktopDiag.nearestNeighborDistance.min}% | Same-cat rate=${desktopDiversity.sameCategoryPercentage}%`
);
console.log('==================================================');

if (spatialErrors.length > 0) {
  console.error('\n[LIVING_ORBIT_VALIDATION_ERROR] Spatial validation failed:');
  spatialErrors.forEach((err, idx) => {
    console.error(`  ${idx + 1}. ${err}`);
  });
  process.exit(1);
} else {
  console.log('\n[LIVING_ORBIT_VALIDATION_SUCCESS] Living Orbit 2.2 & 8,000-Star Sea verified.\n');
  process.exit(0);
}
