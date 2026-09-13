import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import { resolveSkillIcon } from '../../components/skills/iconResolver';

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  totalSkills: number;
  categoryCount: number;
  countsPerCategory: Record<string, number>;
}

export function validateSkillsDataset(): ValidationReport {
  const errors: string[] = [];
  const totalSkills = SKILLS_DATA.length;
  const categoryCount = SKILL_CATEGORIES.length;
  const countsPerCategory: Record<string, number> = {};

  // 1. Total Skills Count
  if (totalSkills !== 88) {
    errors.push(`Skills data validation failed: Expected exactly 88 skills, found ${totalSkills}.`);
  }

  // 2. Category Count
  if (categoryCount !== 8) {
    errors.push(`Skills data validation failed: Expected exactly 8 categories, found ${categoryCount}.`);
  }

  const validCategoryIds = new Set(SKILL_CATEGORIES.map((c) => c.id));
  SKILL_CATEGORIES.forEach((c) => {
    countsPerCategory[c.id] = 0;
  });

  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  SKILLS_DATA.forEach((skill: SkillItem, index: number) => {
    // 3. Unique ID
    if (seenIds.has(skill.id)) {
      errors.push(`Duplicate skill ID found: "${skill.id}" at index ${index}.`);
    }
    seenIds.add(skill.id);

    // 4. Unique Name
    const lowerName = skill.name.toLowerCase().trim();
    if (seenNames.has(lowerName)) {
      errors.push(`Duplicate skill name found: "${skill.name}" at index ${index}.`);
    }
    seenNames.add(lowerName);

    // 5. Valid Category
    if (!validCategoryIds.has(skill.categoryId)) {
      errors.push(`Invalid categoryId "${skill.categoryId}" for skill "${skill.name}".`);
    } else {
      countsPerCategory[skill.categoryId] = (countsPerCategory[skill.categoryId] || 0) + 1;
    }

    // 6. Valid Brand Color
    if (!skill.brandColor || !skill.brandColor.startsWith('#') || skill.brandColor.length < 4) {
      errors.push(`Invalid brandColor "${skill.brandColor}" for skill "${skill.name}".`);
    }

    // 7. Non-empty Insight
    if (!skill.insight || skill.insight.trim().length < 10) {
      errors.push(`Missing or inadequate insight for skill "${skill.name}".`);
    }

    // 8. Valid Icon Resolution
    const icon = resolveSkillIcon(skill.id, skill.name);
    if (!icon || !icon.kind) {
      errors.push(`Skill "${skill.name}" (${skill.id}) unresolved icon.`);
    }
  });

  // 9. Exactly 11 skills per category
  Object.entries(countsPerCategory).forEach(([catId, count]) => {
    if (count !== 11) {
      errors.push(`Category "${catId}" contains ${count} skills; expected exactly 11.`);
    }
  });

  const isValid = errors.length === 0;

  if (!isValid && process.env.NODE_ENV !== 'production') {
    console.error('[SKILLS_DATA_VALIDATION_FAILED]', errors);
  }

  return {
    isValid,
    errors,
    totalSkills,
    categoryCount,
    countsPerCategory,
  };
}
