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
  TOTAL_STARFIELD_COUNT,
  TOTAL_PERIPHERAL_STARFIELD_COUNT,
  evaluateStarfieldCoverage,
  evaluateSkillsPeripheralCoverage,
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

// ─── LIVING ORBIT 2.3 & SMART DUAL-MODE STARFIELD VERIFICATION ───
console.log('\n==================================================');
console.log('LIVING ORBIT — DUAL-MODE STARFIELD (5,500 NORMAL / 800 SKILLS PERIPHERAL)');
console.log('==================================================');

const spatialErrors: string[] = [];

// 1. Verify Living Orbit particle count, Two-Level Featured Anchors & Arc-Length LUTs
if (LIVING_ORBIT_PARTICLES.length !== 88) {
  spatialErrors.push(`Living Orbit has ${LIVING_ORBIT_PARTICLES.length} particles (expected 88).`);
}
if (FEATURED_ANCHOR_SPECS.length !== 8) {
  spatialErrors.push(`Living Orbit has ${FEATURED_ANCHOR_SPECS.length} Featured Anchors (expected 8).`);
}
const primaryAnchors = FEATURED_ANCHOR_SPECS.filter((a) => a.anchorTier === 'primary');
const secondaryAnchors = FEATURED_ANCHOR_SPECS.filter((a) => a.anchorTier === 'secondary');
if (primaryAnchors.length !== 4 || secondaryAnchors.length !== 4) {
  spatialErrors.push(
    `Expected 4 Primary and 4 Secondary Featured Anchors, got ${primaryAnchors.length} and ${secondaryAnchors.length}.`
  );
}
if (SPATIAL_SPLINES.length !== 3 || Object.keys(ORBIT_ARC_LENGTH_TABLES).length !== 3) {
  spatialErrors.push(`Living Orbit expected 3 trajectories and 3 arc-length LUTs.`);
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
    `Living Orbit cycled ${seenInOrbitCycle.size}/88 skills across t=0..240s (expected all 88).`
  );
}

for (const cat of SKILL_CATEGORIES) {
  const catCount = LIVING_ORBIT_PARTICLES.filter((p) => p.skill.categoryId === cat.id).length;
  if (catCount !== 11) {
    spatialErrors.push(`Category ${cat.id} has ${catCount} particles (expected 11).`);
  }
}

// 2. Verify Mode A (5,500) & Mode B (800 peripheral, 0 core leaks) across viewports & times
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
    if (
      STARFIELD_LAYER_SPECS.length !== 4 ||
      cov.totalStars !== TOTAL_STARFIELD_COUNT ||
      cov.layerCounts.tiny !== 4500 ||
      cov.layerCounts.medium !== 800 ||
      cov.layerCounts.bright !== 150 ||
      cov.layerCounts.accent !== 50
    ) {
      spatialErrors.push(
        `Mode A Starfield at ${label} (t=${t}s) expected 5,500 stars (4500/800/150/50), got ${cov.totalStars}.`
      );
    }
    if (
      cov.emptyCellCount > 0 ||
      cov.cellsWithAtLeast32Pct < 95 ||
      cov.minCellCount < 22
    ) {
      spatialErrors.push(
        `Mode A grid occupancy failed at ${label} (t=${t}s): empty=${cov.emptyCellCount}, >=32Pct=${cov.cellsWithAtLeast32Pct}%, minCell=${cov.minCellCount}`
      );
    }

    const peri = evaluateSkillsPeripheralCoverage(w, h, t);
    if (
      peri.drawnCount !== TOTAL_PERIPHERAL_STARFIELD_COUNT ||
      peri.drawnCount !== 800 ||
      peri.culledCount !== 4700
    ) {
      spatialErrors.push(
        `Mode B Skills Peripheral expected 800 drawn / 4,700 culled at ${label} (t=${t}s), got ${peri.drawnCount}/${peri.culledCount}.`
      );
    }
    if (peri.coreLeakCount !== 0) {
      spatialErrors.push(
        `Mode B central core leak detected at ${label} (t=${t}s): count=${peri.coreLeakCount}`
      );
    }
    if (
      peri.outerZones.left < 120 ||
      peri.outerZones.right < 120 ||
      peri.outerZones.top < 110 ||
      peri.outerZones.bottom < 110
    ) {
      spatialErrors.push(
        `Mode B outer zone underpopulated at ${label} (t=${t}s): ${JSON.stringify(peri.outerZones)}`
      );
    }
  }
}

const cov1440 = evaluateStarfieldCoverage(1440, 900, 0);
const cov1920 = evaluateStarfieldCoverage(1920, 1080, 0);
const cov2048 = evaluateStarfieldCoverage(2048, 1002, 0);
const covMobile = evaluateStarfieldCoverage(390, 844, 0);
const peri1440 = evaluateSkillsPeripheralCoverage(1440, 900, 0);
const periMobile = evaluateSkillsPeripheralCoverage(390, 844, 0);

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
  `Mode A (Normal):        ${cov1440.totalStars} stars (tiny=${cov1440.layerCounts.tiny}, medium=${cov1440.layerCounts.medium}, bright=${cov1440.layerCounts.bright}, accent=${cov1440.layerCounts.accent})`
);
console.log(
  `Mode B (Skills):        ${peri1440.drawnCount} drawn / ${peri1440.culledCount} culled (tiny=${peri1440.layerDrawnCounts.tiny}, medium=${peri1440.layerDrawnCounts.medium}, bright=${peri1440.layerDrawnCounts.bright}, accent=${peri1440.layerDrawnCounts.accent})`
);
console.log(
  `Mode B 1440x900 Zones:  left=${peri1440.outerZones.left}, right=${peri1440.outerZones.right}, top=${peri1440.outerZones.top}, bottom=${peri1440.outerZones.bottom}, coreLeaks=${peri1440.coreLeakCount}`
);
console.log(
  `Mode B 390x844 Zones:   left=${periMobile.outerZones.left}, right=${periMobile.outerZones.right}, top=${periMobile.outerZones.top}, bottom=${periMobile.outerZones.bottom}, coreLeaks=${periMobile.coreLeakCount}`
);
console.log(
  `Starfield 1440x900:     12x8 Grid min=${cov1440.minCellCount}, max=${cov1440.maxCellCount}, >=32=${cov1440.cellsWithAtLeast32Pct}%`
);
console.log(
  `Starfield 1920x1080:    12x8 Grid min=${cov1920.minCellCount}, max=${cov1920.maxCellCount}, >=32=${cov1920.cellsWithAtLeast32Pct}%`
);
console.log(
  `Starfield 2048x1002:    12x8 Grid min=${cov2048.minCellCount}, max=${cov2048.maxCellCount}, >=32=${cov2048.cellsWithAtLeast32Pct}%`
);
console.log(
  `Starfield 390x844:      8x12 Grid min=${covMobile.minCellCount}, max=${covMobile.maxCellCount}, >=32=${covMobile.cellsWithAtLeast32Pct}%`
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
  console.log('\n[LIVING_ORBIT_VALIDATION_SUCCESS] Dual-Mode Global Starfield (5,500 / 800) & Living Orbit verified.\n');
  process.exit(0);
}

