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
  TOTAL_STARFIELD_COUNT,
  TOTAL_PERIPHERAL_STARFIELD_COUNT,
  SKILLS_CULL_MIX_THRESHOLD,
  generateScreenSpaceStarLayerData,
  generateStratifiedStarLayer,
  evaluateStellarTrails,
  evaluateStarfieldCoverage,
  evaluateSkillsPeripheralCoverage,
  computeSkillsRegionFromRect,
  computeStarVisibilityFactor,
} from '../../components/ui/ParticleBackground';
import {
  computeOrbitalDossierPlacement,
  DOSSIER_DESKTOP_WIDTH,
} from '../../components/skills/SkillFocusCard';

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

  it('computes collision-free LOCAL spatial constellation coordinates around a clicked skill outside the planet core', () => {
    const cases = [
      { id: 'typescript', x: 20.5, y: 27.5 },
      { id: 'postgresql', x: 45.5, y: 82.0 },
      { id: 'threedotjs', x: 24.5, y: 66.0 },
      { id: 'fastapi', x: 10.5, y: 51.0 },
      { id: 'langgraph', x: 86.5, y: 52.0 },
    ];

    for (const c of cases) {
      const currentMap = new Map<string, { x: number; y: number; isVisible: boolean }>();
      currentMap.set(c.id, { x: c.x, y: c.y, isVisible: true });

      const net = computeFocusedNetworkPositions(c.id, currentMap);
      const anchor = net.get(c.id);
      assert.ok(anchor, `Missing anchor for ${c.id}`);

      const related = getRelatedSkillIds(c.id).slice(0, 5);
      assert.ok(related.length >= 3);
      for (const relId of related) {
        const pos = net.get(relId);
        assert.ok(pos, `Missing related position for ${relId}`);
        assert.ok(pos.x >= 8 && pos.x <= 92, `${relId} x=${pos.x} out of bounds`);
        assert.ok(pos.y >= 12 && pos.y <= 88, `${relId} y=${pos.y} out of bounds`);

        // Local spatial clustering: stays in same local region rather than scattering across stage
        const radialDist = Math.hypot(pos.x - anchor.x, pos.y - anchor.y);
        assert.ok(
          radialDist <= 40,
          `${c.id} -> ${relId} radial distance ${radialDist.toFixed(1)} too scattered for local constellation`
        );

        // Keeps central planetary sphere unobstructed
        const planetNorm = ((pos.x - 50) / 19.5) ** 2 + ((pos.y - 43.5) / 21.0) ** 2;
        assert.ok(planetNorm >= 0.98, `${c.id} -> ${relId} overlaps planet core`);
      }

      // Verify satellites do not collide with one another
      for (let i = 0; i < related.length; i++) {
        for (let j = i + 1; j < related.length; j++) {
          const a = net.get(related[i])!;
          const b = net.get(related[j])!;
          const sep = Math.hypot((a.x - b.x) / 11.5, (a.y - b.y) / 15.0);
          assert.ok(
            sep >= 0.98,
            `${c.id} satellites ${related[i]} & ${related[j]} overlap (sep=${sep.toFixed(2)})`
          );
        }
      }
    }
  });

  it('calibrates the 5,500-star Global Starfield (4500 tiny, 800 medium, 150 bright, 50 accent) with 1–2 simultaneous stellar trails and full corner, edge, and grid occupancy across 1440x900, 1920x1080, 2048x1002, and 390x844 at t=0, 10, 30, 60s', () => {
    assert.equal(STARFIELD_LAYER_SPECS.length, 4);
    assert.equal(STELLAR_TRAIL_SPECS.length, 3);
    assert.equal(TOTAL_STARFIELD_COUNT, 5500);

    // Verify WebGL and 2D Canvas shared data parity
    for (const spec of STARFIELD_LAYER_SPECS) {
      const data = generateScreenSpaceStarLayerData(spec);
      assert.equal(data.uv0.length, spec.count * 2);
      assert.equal(data.velocity.length, spec.count * 2);
      assert.equal(data.depth.length, spec.count);
      assert.equal(data.sizePx.length, spec.count);
      assert.equal(data.baseOpacity.length, spec.count);
      assert.equal(data.twinklePhase.length, spec.count);
      assert.equal(data.peripheralCount, spec.peripheralCount);
      assert.equal(data.isPeripheral.length, spec.count);

      for (let i = 0; i < spec.count; i++) {
        const expectedFlag = i < spec.peripheralCount ? 1.0 : 0.0;
        assert.equal(
          data.isPeripheral[i],
          expectedFlag,
          `Pre-partitioned isPeripheral mismatch at ${spec.id}[${i}]`
        );
      }

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

  it('implements Mode B (Skills Peripheral Particle Mode) with 800 active draw-range stars, 4,700 culled stars, zero central core leaks, and dynamic viewport region tracking', () => {
    assert.equal(TOTAL_PERIPHERAL_STARFIELD_COUNT, 800);
    assert.ok(SKILLS_CULL_MIX_THRESHOLD >= 0.8 && SKILLS_CULL_MIX_THRESHOLD <= 0.95);

    // 1. Dynamic region calculation across offscreen, scrolled partial entry, centered desktop, and mobile rects
    const hiddenRegion = computeSkillsRegionFromRect(null, 1440, 900);
    assert.equal(hiddenRegion.targetMix, 0);

    const zeroRect = computeSkillsRegionFromRect(
      { left: 0, top: 0, width: 0, height: 0 },
      1440,
      900
    );
    assert.equal(zeroRect.targetMix, 0);

    const offscreenBelow = computeSkillsRegionFromRect(
      { left: 0, top: 1200, width: 1440, height: 960 },
      1440,
      900
    );
    assert.equal(offscreenBelow.targetMix, 0);

    const offscreenAbove = computeSkillsRegionFromRect(
      { left: 0, top: -1100, width: 1440, height: 960 },
      1440,
      900
    );
    assert.equal(offscreenAbove.targetMix, 0);

    const enteringSkills = computeSkillsRegionFromRect(
      { left: 0, top: 680, width: 1440, height: 960 },
      1440,
      900
    );
    assert.ok(
      enteringSkills.targetMix > 0.05 && enteringSkills.targetMix < 0.85,
      `Expected smooth partial transition on entry, got ${enteringSkills.targetMix}`
    );

    const centeredDesktop = computeSkillsRegionFromRect(
      { left: 0, top: -30, width: 1440, height: 960 },
      1440,
      900
    );
    assert.equal(centeredDesktop.targetMix, 1);
    assert.ok(Math.abs(centeredDesktop.centerU - 0.5) < 0.01);

    // Non-centered scrolled position should track actual rect center dynamically (never hardcoded)
    const shiftedSkills = computeSkillsRegionFromRect(
      { left: 0, top: 260, width: 1440, height: 960 },
      1440,
      900
    );
    assert.ok(
      shiftedSkills.centerV > centeredDesktop.centerV + 0.15,
      `Expected live centerV tracking when Skills shifts downward (${centeredDesktop.centerV} -> ${shiftedSkills.centerV})`
    );

    // 2. Per-star visibility attenuation parity
    // In Mode A (mix = 0), center stars and outer stars both have visibility 1.0
    const modeARegion = { ...centeredDesktop, mix: 0 };
    assert.equal(computeStarVisibilityFactor(0.5, 0.51, false, modeARegion), 1);
    assert.equal(computeStarVisibilityFactor(0.05, 0.5, true, modeARegion), 1);

    // In Mode B (mix = 1), center interior stars are suppressed to 0 while outer margins remain crisp
    const modeBRegion = { ...centeredDesktop, mix: 1 };
    assert.equal(computeStarVisibilityFactor(0.5, 0.51, false, modeBRegion), 0);
    assert.equal(computeStarVisibilityFactor(0.5, 0.51, true, modeBRegion), 0);
    assert.ok(computeStarVisibilityFactor(0.04, 0.5, true, modeBRegion) >= 0.8);
    assert.ok(computeStarVisibilityFactor(0.96, 0.5, true, modeBRegion) >= 0.8);
    assert.ok(computeStarVisibilityFactor(0.5, 0.03, true, modeBRegion) >= 0.8);
    assert.ok(computeStarVisibilityFactor(0.5, 0.97, true, modeBRegion) >= 0.8);

    // 3. Verify 800-star peripheral drawRange subset & perimeter distribution across viewports and times
    const viewports: readonly [number, number][] = [
      [1440, 900],
      [1920, 1080],
      [390, 844],
    ];
    for (const [w, h] of viewports) {
      for (const t of [0, 10, 30, 60]) {
        const peri = evaluateSkillsPeripheralCoverage(w, h, t);
        assert.equal(peri.drawnCount, 800);
        assert.equal(peri.culledCount, 4700);
        assert.equal(peri.layerDrawnCounts.tiny, 620);
        assert.equal(peri.layerDrawnCounts.medium, 128);
        assert.equal(peri.layerDrawnCounts.bright, 36);
        assert.equal(peri.layerDrawnCounts.accent, 16);
        assert.equal(
          peri.coreLeakCount,
          0,
          `Expected 0 core leaks in Skills mode at ${w}x${h} (t=${t}s), got ${peri.coreLeakCount}`
        );
        assert.ok(
          peri.visibleOuterCount >= 650 && peri.visibleOuterCount <= 800,
          `Expected 650-800 visible peripheral stars at ${w}x${h} (t=${t}s), got ${peri.visibleOuterCount}`
        );
        assert.ok(peri.outerZones.left >= 120);
        assert.ok(peri.outerZones.right >= 120);
        assert.ok(peri.outerZones.top >= 110);
        assert.ok(peri.outerZones.bottom >= 110);
      }
    }
  });

  it('places the Orbital Editorial 3.0 annotation cleanly in opposite-hemisphere negative space without overlapping planet core, selected node, or local satellites', () => {
    const viewports: readonly { w: number; h: number }[] = [
      { w: 1350, h: 700 }, // 1440x900 desktop stage
      { w: 1800, h: 780 }, // 1920x1080 wide stage
    ];

    for (const { w, h } of viewports) {
      // 1. PostgreSQL focused (left-of-center constellation -> open right negative space)
      const pgMap = new Map<string, { x: number; y: number; isVisible: boolean }>([
        ['postgresql', { x: 45.5, y: 82, isVisible: true }],
      ]);
      const pgNet = computeFocusedNetworkPositions('postgresql', pgMap);
      const pgAnchor = pgNet.get('postgresql')!;
      const pgRelated = getRelatedSkillIds('postgresql')
        .slice(0, 5)
        .map((id) => pgNet.get(id)!);
      const pgRes = computeOrbitalDossierPlacement({
        stageWidth: w,
        stageHeight: h,
        selectedPos: pgAnchor,
        relatedPositions: pgRelated,
      });
      assert.equal(pgRes.width, DOSSIER_DESKTOP_WIDTH);
      assert.equal(pgRes.planetOverlap, 0, `Planet overlap for PostgreSQL at ${w}x${h}`);
      assert.equal(pgRes.selectedOverlap, 0, `Selected overlap for PostgreSQL at ${w}x${h}`);
      assert.equal(pgRes.relatedOverlap, 0, `Related overlap for PostgreSQL at ${w}x${h}`);
      assert.ok(pgRes.left >= 20 && pgRes.left + pgRes.width <= w - 20);
      assert.ok(pgRes.top >= 20 && pgRes.top + pgRes.height <= h - 16);
      assert.equal(pgRes.anchorSide, 'right');

      // 2. Left-side technology focused (FastAPI / Three.js) -> right negative space
      for (const leftCase of [
        { id: 'fastapi', x: 10.5, y: 51 },
        { id: 'threedotjs', x: 24.5, y: 66 },
        { id: 'react', x: 36.5, y: 14 },
      ]) {
        const net = computeFocusedNetworkPositions(
          leftCase.id,
          new Map<string, { x: number; y: number; isVisible: boolean }>([
            [leftCase.id, { x: leftCase.x, y: leftCase.y, isVisible: true }],
          ])
        );
        const anchor = net.get(leftCase.id)!;
        const rels = getRelatedSkillIds(leftCase.id)
          .slice(0, 5)
          .map((id) => net.get(id)!);
        const res = computeOrbitalDossierPlacement({
          stageWidth: w,
          stageHeight: h,
          selectedPos: anchor,
          relatedPositions: rels,
        });
        assert.equal(res.anchorSide, 'right', `Expected right flank for ${leftCase.id}`);
        assert.equal(res.planetOverlap, 0);
        assert.equal(res.selectedOverlap, 0);
        assert.equal(res.relatedOverlap, 0);
      }

      // 3. Right-side technology focused (LangGraph / OpenAI) -> left negative space
      for (const rightCase of [
        { id: 'langgraph', x: 86.5, y: 52 },
        { id: 'openai', x: 73.5, y: 20.5 },
      ]) {
        const net = computeFocusedNetworkPositions(
          rightCase.id,
          new Map<string, { x: number; y: number; isVisible: boolean }>([
            [rightCase.id, { x: rightCase.x, y: rightCase.y, isVisible: true }],
          ])
        );
        const anchor = net.get(rightCase.id)!;
        const rels = getRelatedSkillIds(rightCase.id)
          .slice(0, 5)
          .map((id) => net.get(id)!);
        const res = computeOrbitalDossierPlacement({
          stageWidth: w,
          stageHeight: h,
          selectedPos: anchor,
          relatedPositions: rels,
        });
        assert.equal(res.anchorSide, 'left', `Expected left flank for ${rightCase.id}`);
        assert.equal(res.planetOverlap, 0);
        assert.equal(res.selectedOverlap, 0);
        assert.equal(res.relatedOverlap, 0);
      }
    }

    // 4. Narrow desktop stage stays safely within horizontal & vertical bounds
    const narrow = computeOrbitalDossierPlacement({
      stageWidth: 820,
      stageHeight: 680,
      selectedPos: { x: 22, y: 30 },
      relatedPositions: [{ x: 30, y: 45 }],
    });
    assert.ok(narrow.width <= 440);
    assert.ok(narrow.left >= 16 && narrow.left + narrow.width <= 820 - 16);
    assert.ok(narrow.top >= 16 && narrow.top + narrow.height <= 680 - 16);
  });
});


