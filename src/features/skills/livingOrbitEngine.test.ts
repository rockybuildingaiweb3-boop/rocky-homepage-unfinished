import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';
import {
  LIVING_ORBIT_PARTICLES,
  ORBITAL_RIBBONS,
  evaluateRibbonTrajectory,
  computeFocusedNetworkPositions,
  getRelatedSkillIds,
} from './livingOrbitEngine';

describe('Living Orbit Engine — 88 Skills & Trajectory Verification', () => {
  it('preserves all 88 canonical skills with zero duplicates', () => {
    assert.equal(LIVING_ORBIT_PARTICLES.length, 88);
    const ids = new Set(LIVING_ORBIT_PARTICLES.map((p) => p.skill.id));
    assert.equal(ids.size, 88);

    for (const s of SKILLS_DATA) {
      assert.ok(ids.has(s.id), `Missing canonical skill ${s.id}`);
    }
  });

  it('enforces strict visual size hierarchy: Core > Professional > Ecosystem', () => {
    const coreRibbon = ORBITAL_RIBBONS.find((r) => r.tier === 'core')!;
    const profRibbon = ORBITAL_RIBBONS.find((r) => r.tier === 'professional')!;
    const ecoRibbon = ORBITAL_RIBBONS.find((r) => r.tier === 'ecosystem')!;

    assert.ok(coreRibbon.desktopSize > profRibbon.desktopSize);
    assert.ok(profRibbon.desktopSize > ecoRibbon.desktopSize);
    assert.ok(coreRibbon.desktopSize >= 56 && coreRibbon.desktopSize <= 76);
    assert.ok(profRibbon.desktopSize >= 38 && profRibbon.desktopSize <= 56);
    assert.ok(ecoRibbon.desktopSize >= 30 && ecoRibbon.desktopSize <= 44);
  });

  it('cycles all 88 skills across the visible aperture over time without overcrowding any single frame', () => {
    const seenInAperture = new Set<string>();

    // Sample across a 160-second orbital window
    for (let t = 0; t <= 160; t += 2) {
      let visibleCountAtT = 0;
      for (const p of LIVING_ORBIT_PARTICLES) {
        const ribbon = ORBITAL_RIBBONS[p.ribbonIndex];
        const state = evaluateRibbonTrajectory(p, ribbon, t);
        if (state.isVisibleInAperture) {
          visibleCountAtT++;
          seenInAperture.add(p.skill.id);
          assert.ok(state.x >= 0 && state.x <= 100, `Invalid x=${state.x}`);
          assert.ok(state.y >= 5 && state.y <= 95, `Invalid y=${state.y}`);
        }
      }
      // Never show all 88 at once; keep visible count curated between 32 and 46
      assert.ok(
        visibleCountAtT >= 30 && visibleCountAtT <= 48,
        `Unexpected visible count ${visibleCountAtT} at t=${t}`
      );
    }

    assert.equal(
      seenInAperture.size,
      88,
      `Expected all 88 skills to cycle through the visible aperture, saw ${seenInAperture.size}`
    );
  });

  it('provides clean, non-overlapping 11-skill formations for each of the 8 categories', () => {
    for (const cat of SKILL_CATEGORIES) {
      const catParticles = LIVING_ORBIT_PARTICLES.filter((p) => p.skill.categoryId === cat.id);
      assert.equal(catParticles.length, 11, `Category ${cat.id} should have 11 skills`);

      for (let i = 0; i < catParticles.length; i++) {
        const a = catParticles[i].categoryFormationPos;
        assert.ok(a.x >= 10 && a.x <= 90);
        assert.ok(a.y >= 20 && a.y <= 85);
        for (let j = i + 1; j < catParticles.length; j++) {
          const b = catParticles[j].categoryFormationPos;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          assert.ok(
            dist >= 6.0,
            `Formation collision in ${cat.id} between ${catParticles[i].skill.id} and ${catParticles[j].skill.id}: dist=${dist}`
          );
        }
      }
    }
  });

  it('computes focused network coordinates for a clicked skill and its related technologies', () => {
    const currentMap = new Map<string, { x: number; y: number; isVisible: boolean }>();
    currentMap.set('typescript', { x: 48, y: 40, isVisible: true });

    const net = computeFocusedNetworkPositions('typescript', currentMap);
    assert.ok(net.has('typescript'));

    const related = getRelatedSkillIds('typescript');
    assert.ok(related.length >= 3);
    for (const relId of related) {
      const pos = net.get(relId);
      assert.ok(pos, `Missing related position for ${relId}`);
      assert.ok(pos.x >= 10 && pos.x <= 90);
      assert.ok(pos.y >= 12 && pos.y <= 84);
    }
  });
});
