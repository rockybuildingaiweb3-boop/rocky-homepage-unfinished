import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';
import {
  LIVING_ORBIT_PARTICLES,
  FEATURED_ANCHOR_SPECS,
  SPATIAL_SPLINES,
  ORBIT_ARC_LENGTH_TABLES,
  STAGE_PERSPECTIVE_PX,
  depthToZPx,
  mapArcLengthToParam,
  evaluateOrbitAtArcLength,
  evaluateSculptureTrajectory,
  computeFocusedNetworkPositions,
  buildTrajectorySvgPath,
  getRelatedSkillIds,
} from './livingOrbitEngine';
import {
  STARFIELD_LAYER_SPECS,
  STELLAR_TRAIL_SPECS,
  generateScreenSpaceStarLayerData,
  generateStratifiedStarLayer,
  evaluateStellarTrails,
  evaluateStarfieldCoverage,
} from '../../components/ui/ParticleBackground';

describe('Living Orbit 2.2 — Full-Screen Star Sea & Advanced Kinetic Sculpture', () => {
  it('preserves all 88 canonical skills with zero duplicates', () => {
    assert.equal(LIVING_ORBIT_PARTICLES.length, 88);
    const ids = new Set(LIVING_ORBIT_PARTICLES.map((p) => p.skill.id));
    assert.equal(ids.size, 88);

    for (const s of SKILLS_DATA) {
      assert.ok(ids.has(s.id), `Missing canonical skill ${s.id}`);
    }
  });

  it('configures Two-Level Featured Anchor Hierarchy (4 Primary 76-90px + 4 Secondary 56-68px) with true foreground zPx depth', () => {
    const anchors = LIVING_ORBIT_PARTICLES.filter((p) => p.isFeaturedAnchor);
    assert.equal(anchors.length, 8);
    assert.equal(FEATURED_ANCHOR_SPECS.length, 8);
    assert.equal(STAGE_PERSPECTIVE_PX, 1120);

    const primaryAnchors = anchors.filter((a) => a.anchorTier === 'primary');
    const secondaryAnchors = anchors.filter((a) => a.anchorTier === 'secondary');
    assert.equal(primaryAnchors.length, 4, 'Must have 4 Primary Featured Anchors');
    assert.equal(secondaryAnchors.length, 4, 'Must have 4 Secondary Featured Anchors');

    for (const p of primaryAnchors) {
      assert.ok(
        p.desktopSize >= 76 && p.desktopSize <= 90,
        `Primary Featured Anchor ${p.skill.id} size ${p.desktopSize} outside 76-90px range`
      );
      assert.ok(['openai', 'typescript', 'react', 'threedotjs'].includes(p.skill.id));
    }

    for (const s of secondaryAnchors) {
      assert.ok(
        s.desktopSize >= 56 && s.desktopSize <= 68,
        `Secondary Featured Anchor ${s.skill.id} size ${s.desktopSize} outside 56-68px range`
      );
      assert.ok(['langgraph', 'postgresql', 'fastapi', 'solidity'].includes(s.skill.id));
    }

    const uniqueYs = new Set(FEATURED_ANCHOR_SPECS.map((a) => a.y));
    assert.equal(uniqueYs.size, 8, 'Featured anchors must not align on a horizontal row');

    for (const a of anchors) {
      const state = evaluateSculptureTrajectory(a, 18.0);
      assert.ok(
        state.zPx > 25 && state.zPx <= 95,
        `Featured anchor ${a.skill.id} must reside in positive foreground zPx depth, got ${state.zPx}`
      );
      assert.ok(
        state.scale >= 0.96 && state.scale <= 1.04,
        `Featured anchor ${a.skill.id} designScale ${state.scale} should not double-apply depth`
      );
    }
  });

  it('constructs Precomputed Arc-Length Lookup Tables (140 segments per orbit) for uniform screen-space velocity', () => {
    assert.equal(SPATIAL_SPLINES.length, 3);
    assert.equal(Object.keys(ORBIT_ARC_LENGTH_TABLES).length, 3);

    for (const orbit of SPATIAL_SPLINES) {
      const lut = ORBIT_ARC_LENGTH_TABLES[orbit.id];
      assert.ok(lut, `Missing LUT for ${orbit.id}`);
      assert.equal(lut.samples, 140);
      assert.ok(lut.totalLength > 80, `Unexpected totalLength ${lut.totalLength}`);

      // Verify monotonic arc-length mapping and uniform weighted screen-space step lengths
      const stepLengths: number[] = [];
      const steps = 20;
      for (let i = 0; i < steps; i++) {
        const s0 = i / steps;
        const s1 = (i + 1) / steps;
        const u0 = mapArcLengthToParam(orbit, s0);
        const u1 = mapArcLengthToParam(orbit, s1);
        assert.ok(u1 > u0, `Non-monotonic LUT mapping on ${orbit.id}: ${u0} -> ${u1}`);

        const p0 = evaluateOrbitAtArcLength(orbit, s0);
        const p1 = evaluateOrbitAtArcLength(orbit, s1);
        stepLengths.push(Math.hypot((p1.x - p0.x) * 1.6, p1.y - p0.y));
      }

      const avgStep = stepLengths.reduce((a, b) => a + b, 0) / stepLengths.length;
      for (const d of stepLengths) {
        assert.ok(
          Math.abs(d - avgStep) / avgStep < 0.08,
          `Arc-length step ${d.toFixed(2)} deviates >8% from average ${avgStep.toFixed(2)} on ${orbit.id}`
        );
      }
    }
  });

  it('calibrates target visible pass durations (Orbit A: 26-32s, Orbit B: 30-36s, Orbit C: 38-46s) and maintains 24-28 moving visible technologies in desktop All mode', () => {
    const orbitA = SPATIAL_SPLINES[0];
    const orbitB = SPATIAL_SPLINES[1];
    const orbitC = SPATIAL_SPLINES[2];

    assert.ok(orbitA.targetPassDurationSec >= 26 && orbitA.targetPassDurationSec <= 32);
    assert.ok(orbitB.targetPassDurationSec >= 30 && orbitB.targetPassDurationSec <= 36);
    assert.ok(orbitC.targetPassDurationSec >= 38 && orbitC.targetPassDurationSec <= 46);

    const totalMovingCapacity =
      orbitA.visibleCapacity + orbitB.visibleCapacity + orbitC.visibleCapacity;
    assert.equal(totalMovingCapacity, 26);

    for (const orbit of SPATIAL_SPLINES) {
      const svgPath = buildTrajectorySvgPath(orbit);
      assert.ok(svgPath.startsWith('M '), `Invalid SVG path for ${orbit.id}`);
    }

    assert.equal(depthToZPx(0.85), 0);
    assert.ok(depthToZPx(1.05) > 65);
    assert.ok(depthToZPx(0.6) < -85);

    const seenInAperture = new Set<string>();

    for (let t = 0; t <= 240; t += 2) {
      let movingVisibleCount = 0;
      for (const p of LIVING_ORBIT_PARTICLES) {
        const state = evaluateSculptureTrajectory(p, t);
        if (state.isVisibleInAperture) {
          seenInAperture.add(p.skill.id);
          if (!p.isFeaturedAnchor) {
            movingVisibleCount++;
          }
          assert.ok(state.x >= 3 && state.x <= 97, `Invalid x=${state.x}`);
          assert.ok(state.y >= 4 && state.y <= 96, `Invalid y=${state.y}`);
          assert.ok(state.zPx >= -180 && state.zPx <= 95, `Invalid zPx=${state.zPx}`);
        }
      }
      assert.ok(
        movingVisibleCount >= 24 && movingVisibleCount <= 28,
        `Expected 24-28 moving visible technologies at t=${t}, got ${movingVisibleCount}`
      );
    }

    assert.equal(
      seenInAperture.size,
      88,
      `Expected all 88 skills to cycle through the sculpture, saw ${seenInAperture.size}`
    );
  });

  it('provides asymmetric, non-overlapping 11-skill formations with zPx depth for each of the 8 categories', () => {
    for (const cat of SKILL_CATEGORIES) {
      const catParticles = LIVING_ORBIT_PARTICLES.filter((p) => p.skill.categoryId === cat.id);
      assert.equal(catParticles.length, 11, `Category ${cat.id} should have 11 skills`);

      for (let i = 0; i < catParticles.length; i++) {
        const a = catParticles[i].categoryFormationPos;
        assert.ok(a.x >= 10 && a.x <= 90);
        assert.ok(a.y >= 10 && a.y <= 88);
        assert.ok(typeof a.zPx === 'number' && !Number.isNaN(a.zPx));
        for (let j = i + 1; j < catParticles.length; j++) {
          const b = catParticles[j].categoryFormationPos;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          assert.ok(
            dist >= 8.0,
            `Formation collision in ${cat.id} between ${catParticles[i].skill.id} and ${catParticles[j].skill.id}: dist=${dist}`
          );
        }
      }
    }
  });

  it('computes collision-free focused network coordinates for a clicked skill and its related technologies', () => {
    const currentMap = new Map<string, { x: number; y: number; isVisible: boolean }>();
    currentMap.set('typescript', { x: 24, y: 34, isVisible: true });

    const net = computeFocusedNetworkPositions('typescript', currentMap);
    assert.ok(net.has('typescript'));

    const related = getRelatedSkillIds('typescript').slice(0, 5);
    assert.ok(related.length >= 3);
    for (const relId of related) {
      const pos = net.get(relId);
      assert.ok(pos, `Missing related position for ${relId}`);
      assert.ok(pos.x >= 10 && pos.x <= 90);
      assert.ok(pos.y >= 12 && pos.y <= 57);
    }
  });

  it('calibrates the 5,500-star Global Starfield (4500 tiny, 800 medium, 150 bright, 50 accent) with 1–2 simultaneous stellar trails and full corner, edge, and grid occupancy across 1440x900, 1920x1080, 2048x1002, and 390x844 at t=0, 10, 30, 60s', () => {
    assert.equal(STARFIELD_LAYER_SPECS.length, 4);
    assert.equal(STELLAR_TRAIL_SPECS.length, 3);

    // Verify WebGL and 2D Canvas shared data parity
    for (const spec of STARFIELD_LAYER_SPECS) {
      const data = generateScreenSpaceStarLayerData(spec);
      assert.equal(data.uv0.length, spec.count * 2);
      assert.equal(data.velocity.length, spec.count * 2);
      assert.equal(data.depth.length, spec.count);
      assert.equal(data.sizePx.length, spec.count);
      assert.equal(data.baseOpacity.length, spec.count);
      assert.equal(data.twinklePhase.length, spec.count);

      const buf = generateStratifiedStarLayer(spec, 16 / 9, 0);
      assert.equal(buf.length, spec.count * 3);
      for (let i = 0; i < buf.length; i++) {
        assert.ok(Number.isFinite(buf[i]), `Non-finite star coordinate at index ${i}`);
      }
    }

    // Verify delicate stellar trails evaluation maintains 1–2 simultaneous active trails
    for (const sampleT of [0, 2.5, 4.5, 7.0, 9.5, 14.0]) {
      const trails = evaluateStellarTrails(sampleT, 1920, 1080);
      assert.ok(
        trails.length >= 1 && trails.length <= 2,
        `Expected 1–2 simultaneous stellar trails at t=${sampleT}s, got ${trails.length}`
      );
      for (const tr of trails) {
        assert.ok(Number.isFinite(tr.headU) && Number.isFinite(tr.tailU));
        assert.ok(tr.opacity >= 0 && tr.opacity <= 0.3);
      }
    }

    const viewports: readonly [number, number][] = [
      [1440, 900],
      [1920, 1080],
      [2048, 1002],
      [390, 844],
    ];
    const sampleTimes = [0, 10, 30, 60];

    for (const [w, h] of viewports) {
      for (const t of sampleTimes) {
        const cov = evaluateStarfieldCoverage(w, h, t);
        assert.equal(cov.totalStars, 5500);
        assert.equal(cov.visibleStars, 5500);
        assert.equal(cov.layerCounts.tiny, 4500);
        assert.equal(cov.layerCounts.medium, 800);
        assert.equal(cov.layerCounts.bright, 150);
        assert.equal(cov.layerCounts.accent, 50);

        // Verify 12x8 desktop (96 cells) and 8x12 mobile (96 cells) grid occupancy
        assert.equal(cov.gridCols * cov.gridRows, 96);
        assert.equal(
          cov.emptyCellCount,
          0,
          `Expected 0 empty cells at ${w}x${h} (t=${t}s), got ${cov.emptyCellCount}`
        );
        assert.ok(
          cov.cellsWithAtLeast32Pct >= 95,
          `Expected >=95% cells with >=32 stars at ${w}x${h} (t=${t}s), got ${cov.cellsWithAtLeast32Pct}%`
        );
        assert.ok(
          cov.minCellCount >= 22,
          `Expected minCellCount >= 22 at ${w}x${h} (t=${t}s), got ${cov.minCellCount}`
        );

        // Quadrants, all four corners, and all four outer edges
        assert.ok(cov.quadrants.upperLeft >= 1200);
        assert.ok(cov.quadrants.upperRight >= 1200);
        assert.ok(cov.quadrants.lowerLeft >= 1200);
        assert.ok(cov.quadrants.lowerRight >= 1200);
        assert.ok(cov.corners.topLeft >= 270);
        assert.ok(cov.corners.topRight >= 270);
        assert.ok(cov.corners.bottomLeft >= 270);
        assert.ok(cov.corners.bottomRight >= 270);
        assert.ok(cov.edges.leftEdge >= 680);
        assert.ok(cov.edges.rightEdge >= 680);
        assert.ok(cov.edges.topEdge >= 680);
        assert.ok(cov.edges.bottomEdge >= 680);
      }
    }
  });
});

