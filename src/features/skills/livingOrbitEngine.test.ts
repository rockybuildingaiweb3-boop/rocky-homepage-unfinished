import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';
import {
  LIVING_ORBIT_PARTICLES,
  FEATURED_ANCHOR_SPECS,
  SPATIAL_SPLINES,
  STAGE_PERSPECTIVE_PX,
  depthToZPx,
  evaluateSculptureTrajectory,
  computeFocusedNetworkPositions,
  buildTrajectorySvgPath,
  getRelatedSkillIds,
} from './livingOrbitEngine';
import {
  STARFIELD_LAYER_SPECS,
  generateStratifiedStarLayer,
  evaluateStarfieldCoverage,
} from '../../components/ui/ParticleBackground';

describe('Living Orbit 2.1 — True 2.5D Orbital Kinetic Sculpture & Starfield Engine', () => {
  it('preserves all 88 canonical skills with zero duplicates', () => {
    assert.equal(LIVING_ORBIT_PARTICLES.length, 88);
    const ids = new Set(LIVING_ORBIT_PARTICLES.map((p) => p.skill.id));
    assert.equal(ids.size, 88);

    for (const s of SKILLS_DATA) {
      assert.ok(ids.has(s.id), `Missing canonical skill ${s.id}`);
    }
  });

  it('configures 8 verified Featured Technology Anchors (58-76px) in an expansive asymmetric arrangement with true foreground zPx depth', () => {
    const anchors = LIVING_ORBIT_PARTICLES.filter((p) => p.isFeaturedAnchor);
    assert.equal(anchors.length, 8);
    assert.equal(FEATURED_ANCHOR_SPECS.length, 8);
    assert.equal(STAGE_PERSPECTIVE_PX, 1100);

    const uniqueSizes = new Set(anchors.map((a) => a.desktopSize));
    assert.ok(uniqueSizes.size >= 6, 'Featured anchors must have varied display sizes');

    const uniqueYs = new Set(FEATURED_ANCHOR_SPECS.map((a) => a.y));
    assert.equal(uniqueYs.size, 8, 'Featured anchors must not align on a horizontal row');

    for (const a of anchors) {
      assert.ok(
        a.desktopSize >= 54 && a.desktopSize <= 76,
        `Featured anchor ${a.skill.id} size ${a.desktopSize} outside 54-76px art direction range`
      );
      assert.ok(
        SKILLS_DATA.some((s) => s.id === a.skill.id),
        `Featured anchor ${a.skill.id} must exist in canonical registry`
      );

      const state = evaluateSculptureTrajectory(a, 18.0);
      assert.ok(
        state.zPx > 20 && state.zPx <= 88,
        `Featured anchor ${a.skill.id} must reside in positive foreground zPx depth, got ${state.zPx}`
      );
      // Pure designScale must stay near 1.0 (not multiplied by depth a second time)
      assert.ok(
        state.scale >= 0.97 && state.scale <= 1.03,
        `Featured anchor ${a.skill.id} designScale ${state.scale} should not double-apply depth`
      );
    }
  });

  it('defines 3 distinct trajectory systems (Orbit A, Orbit B, Orbit C) with true 2.5D zPx depth separation and cycles all 88 skills', () => {
    assert.equal(SPATIAL_SPLINES.length, 3);
    assert.equal(SPATIAL_SPLINES[0].id, 'orbit-inner-celestial');
    assert.equal(SPATIAL_SPLINES[1].id, 'orbit-kinetic-sweep');
    assert.equal(SPATIAL_SPLINES[2].id, 'orbit-deep-horizon');

    for (const orbit of SPATIAL_SPLINES) {
      const svgPath = buildTrajectorySvgPath(orbit);
      assert.ok(svgPath.startsWith('M '), `Invalid SVG path for ${orbit.id}`);
    }

    // Verify depthToZPx maps foreground (>0.85) to positive Z and deep horizon (<0.85) to negative Z
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
          assert.ok(state.x >= 4 && state.x <= 96, `Invalid x=${state.x}`);
          assert.ok(state.y >= 5 && state.y <= 95, `Invalid y=${state.y}`);
          assert.ok(state.zPx >= -170 && state.zPx <= 88, `Invalid zPx=${state.zPx}`);
        }
      }
      assert.ok(
        movingVisibleCount >= 14 && movingVisibleCount <= 25,
        `Unexpected moving visible count ${movingVisibleCount} at t=${t}`
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

  it('reconstructs the 4-layer Global Starfield with +13% richness (5,725 stars) and full quadrant/corner coverage across 1440x900, 1920x1080, and 390x844', () => {
    assert.equal(STARFIELD_LAYER_SPECS.length, 4);

    for (const spec of STARFIELD_LAYER_SPECS) {
      const buf = generateStratifiedStarLayer(spec, 16 / 9);
      assert.equal(buf.length, spec.count * 3);
      for (let i = 0; i < buf.length; i++) {
        assert.ok(Number.isFinite(buf[i]), `Non-finite star coordinate at index ${i}`);
      }
    }

    const viewports: readonly [number, number][] = [
      [1440, 900],
      [1920, 1080],
      [390, 844],
    ];

    for (const [w, h] of viewports) {
      const cov = evaluateStarfieldCoverage(w, h);
      assert.equal(cov.totalStars, 5725);
      assert.equal(cov.layerCounts.tiny, 4400);
      assert.equal(cov.layerCounts.medium, 1080);
      assert.equal(cov.layerCounts.bright, 170);
      assert.equal(cov.layerCounts.accent, 75);

      // Every quadrant must be richly populated
      assert.ok(cov.quadrants.upperLeft > 400, `Sparse UL quadrant at ${w}x${h}`);
      assert.ok(cov.quadrants.upperRight > 400, `Sparse UR quadrant at ${w}x${h}`);
      assert.ok(cov.quadrants.lowerLeft > 400, `Sparse LL quadrant at ${w}x${h}`);
      assert.ok(cov.quadrants.lowerRight > 400, `Sparse LR quadrant at ${w}x${h}`);

      // All four outer corners and center must have stars
      assert.ok(cov.corners.topLeft > 40, `Sparse topLeft corner at ${w}x${h}: ${cov.corners.topLeft}`);
      assert.ok(cov.corners.topRight > 40, `Sparse topRight corner at ${w}x${h}: ${cov.corners.topRight}`);
      assert.ok(cov.corners.bottomLeft > 40, `Sparse bottomLeft corner at ${w}x${h}: ${cov.corners.bottomLeft}`);
      assert.ok(cov.corners.bottomRight > 40, `Sparse bottomRight corner at ${w}x${h}: ${cov.corners.bottomRight}`);
      assert.ok(cov.centerRegion > 220, `Sparse center region at ${w}x${h}: ${cov.centerRegion}`);
    }
  });
});
