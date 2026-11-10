import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATEGORY_CONSTELLATIONS,
  computeExpandedCategoryLayout,
} from './constellationLayout';
import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';
import { getRelatedSkillIds } from './skillRelationships';

test('Level 1: 8 organized category constellations cover all 88 skills', () => {
  assert.equal(CATEGORY_CONSTELLATIONS.length, 8);

  const seenSkillIds = new Set<string>();
  for (const cluster of CATEGORY_CONSTELLATIONS) {
    assert.equal(cluster.skills.length, 11, `Category ${cluster.id} must have 11 skills`);
    assert.ok(cluster.nucleusSkill, `Category ${cluster.id} must have a nucleus skill`);
    assert.equal(cluster.satelliteSkills.length, 3, `Category ${cluster.id} must have 3 satellite preview skills`);
    assert.equal(
      cluster.tierCounts.core + cluster.tierCounts.professional + cluster.tierCounts.ecosystem,
      11
    );

    // Verify orbital placement leaves central planet clear (r >= 24)
    const distFromCenter = Math.sqrt((cluster.x - 50) ** 2 + (cluster.y - 50) ** 2);
    assert.ok(
      distFromCenter >= 24,
      `Category ${cluster.id} at (${cluster.x}, ${cluster.y}) is too close to center: ${distFromCenter}`
    );

    for (const s of cluster.skills) {
      seenSkillIds.add(s.id);
    }
  }

  assert.equal(seenSkillIds.size, 88, 'All 88 unique skills must be preserved across the 8 categories');
});

test('Level 2: Expanded category layout enforces gravitational hierarchy (Core < Professional < Ecosystem radius)', () => {
  for (const cat of SKILL_CATEGORIES) {
    const layout = computeExpandedCategoryLayout(cat.id, null);
    assert.equal(layout.nodes.length, 11);

    const coreRadii = layout.nodes.filter((n) => n.tier === 'core').map((n) => n.radius);
    const profRadii = layout.nodes.filter((n) => n.tier === 'professional').map((n) => n.radius);
    const ecoRadii = layout.nodes.filter((n) => n.tier === 'ecosystem').map((n) => n.radius);

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

    assert.ok(coreRadii.length > 0, `Category ${cat.id} has core skills`);
    assert.ok(profRadii.length > 0, `Category ${cat.id} has professional skills`);
    assert.ok(ecoRadii.length > 0, `Category ${cat.id} has ecosystem skills`);

    const meanCore = avg(coreRadii);
    const meanProf = avg(profRadii);
    const meanEco = avg(ecoRadii);

    assert.ok(
      meanCore < meanProf,
      `Category ${cat.id}: Core mean radius (${meanCore}) must be inner to Professional (${meanProf})`
    );
    assert.ok(
      meanProf < meanEco,
      `Category ${cat.id}: Professional mean radius (${meanProf}) must be inner to Ecosystem (${meanEco})`
    );
  }
});

test('Level 3: Individual skill focus maps related technologies including cross-category satellites', () => {
  for (const skill of SKILLS_DATA) {
    const relatedIds = getRelatedSkillIds(skill.id).slice(0, 6);
    assert.ok(
      relatedIds.length >= 2 && relatedIds.length <= 6,
      `Skill ${skill.id} should have 2..6 selective related skills, got ${relatedIds.length}`
    );

    const expanded = computeExpandedCategoryLayout(skill.categoryId, skill.id);
    assert.ok(expanded.nodeMap.has(skill.id), `Focused skill ${skill.id} must be in nodeMap`);

    for (const rid of relatedIds) {
      assert.ok(
        expanded.nodeMap.has(rid),
        `Related skill ${rid} for focused skill ${skill.id} must be positioned in expanded layout`
      );
    }
  }
});
