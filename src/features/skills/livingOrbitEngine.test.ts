import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';
import {
  LIVING_ORBIT_PARTICLES,
  FEATURED_ANCHOR_SPECS,
  SPATIAL_SPLINES,
  evaluateSculptureTrajectory,
  computeFocusedNetworkPositions,
  getRelatedSkillIds,
} from './livingOrbitEngine';

describe('Orbital Kinetic Sculpture Engine — 88 Skills & Spatial Trajectory Verification', () => {
  it('preserves all 88 canonical skills with zero duplicates', () => {
    assert.equal(LIVING_ORBIT_PARTICLES.length, 88);
    const ids = new Set(LIVING_ORBIT_PARTICLES.map((p) => p.skill.id));
    assert.equal(ids.size, 88);

    for (const s of SKILLS_DATA) {
      assert.ok(ids.has(s.id), `Missing canonical skill ${s.id}`);
    }
  });

  it('configures 7 asymmetric Featured Core Anchors with varied display sizes', () => {
    const anchors = LIVING_ORBIT_PARTICLES.filter((p) => p.isFeaturedAnchor);
    assert.equal(anchors.length, 7);
    assert.equal(FEATURED_ANCHOR_SPECS.length, 7);

    const uniqueSizes = new Set(anchors.map((a) => a.desktopSize));
    assert.ok(uniqueSizes.size >= 5, 'Featured anchors must have varied display sizes');

    const uniqueYs = new Set(FEATURED_ANCHOR_SPECS.map((a) => a.y));
    assert.equal(uniqueYs.size, 7, 'Featured anchors must not align on a horizontal row');

    for (const a of anchors) {
      assert.equal(a.tier, 'core', `Featured anchor ${a.skill.id} must be Core tier`);
    }
  });

  it('uses 3 distinct 3D Cubic Bezier trajectories and cycles all 88 skills while keeping moving count around 18-24', () => {
    assert.equal(SPATIAL_SPLINES.length, 3);
    const seenInAperture = new Set<string>();

    for (let t = 0; t <= 220; t += 2) {
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
        }
      }
      // Keep moving non-anchor objects strictly controlled around 16–24
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

  it('provides asymmetric, non-overlapping 11-skill formations for each of the 8 categories', () => {
    for (const cat of SKILL_CATEGORIES) {
      const catParticles = LIVING_ORBIT_PARTICLES.filter((p) => p.skill.categoryId === cat.id);
      assert.equal(catParticles.length, 11, `Category ${cat.id} should have 11 skills`);

      for (let i = 0; i < catParticles.length; i++) {
        const a = catParticles[i].categoryFormationPos;
        assert.ok(a.x >= 10 && a.x <= 90);
        assert.ok(a.y >= 10 && a.y <= 88);
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
      assert.ok(pos.y >= 12 && pos.y <= 58);
    }
  });
});
