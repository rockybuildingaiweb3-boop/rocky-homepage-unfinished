import fs from 'node:fs';
import path from 'node:path';
import { SKILLS_DATA } from '../src/data/skills';
import {
  resolveSkillIcon,
  ICON_REGISTRY,
  SkillType,
  VisualMode,
  IconSourceType,
} from '../src/components/skills/iconResolver';

interface IconAuditResult {
  num: number;
  id: string;
  name: string;
  type: SkillType;
  source: IconSourceType;
  visualMode: VisualMode;
  status: string;
  scale: number;
  brightness: number;
  error?: string;
}

function runIconAudit(): boolean {
  const errors: string[] = [];
  const results: IconAuditResult[] = [];
  const expectedCount = 88;

  const validTypes = new Set<SkillType>(['brand', 'framework', 'protocol', 'standard', 'tool']);
  const validVisualModes = new Set<VisualMode>(['logo', 'glyph', 'symbol']);
  const validSources = new Set<IconSourceType>(['tech-stack-icons', 'svgl', 'simple-icons', 'verified-local']);

  if (SKILLS_DATA.length !== expectedCount) {
    errors.push(`Expected exactly ${expectedCount} skills, but found ${SKILLS_DATA.length}.`);
  }

  let index = 1;
  for (const skill of SKILLS_DATA) {
    const resolved = resolveSkillIcon(skill.id, skill.name);
    let skillError: string | undefined;

    // 1. Missing icon check
    if (resolved.kind === 'missing') {
      skillError = `Icon for "${skill.name}" (${skill.id}) resolved to MISSING state.`;
      errors.push(skillError);
    }

    // 2. Metadata type validation
    if (!validTypes.has(resolved.type)) {
      const err = `Skill "${skill.name}" has invalid type: "${resolved.type}".`;
      skillError = skillError ? `${skillError}; ${err}` : err;
      errors.push(err);
    }

    // 3. Metadata visualMode validation
    if (!validVisualModes.has(resolved.visualMode)) {
      const err = `Skill "${skill.name}" has invalid visualMode: "${resolved.visualMode}".`;
      skillError = skillError ? `${skillError}; ${err}` : err;
      errors.push(err);
    }

    // 4. Source validation
    if (!validSources.has(resolved.source)) {
      const err = `Skill "${skill.name}" has invalid source: "${resolved.source}".`;
      skillError = skillError ? `${skillError}; ${err}` : err;
      errors.push(err);
    }

    // 5. Normalization parameters validation
    if (typeof resolved.scale !== 'number' || resolved.scale <= 0 || isNaN(resolved.scale)) {
      const err = `Skill "${skill.name}" has invalid scale factor: ${resolved.scale}.`;
      skillError = skillError ? `${skillError}; ${err}` : err;
      errors.push(err);
    }

    if (typeof resolved.brightness !== 'number' || resolved.brightness <= 0 || isNaN(resolved.brightness)) {
      const err = `Skill "${skill.name}" has invalid brightness factor: ${resolved.brightness}.`;
      skillError = skillError ? `${skillError}; ${err}` : err;
      errors.push(err);
    }

    // 6. SVG physical asset & syntax verification
    if (resolved.kind === 'local-svg' || resolved.kind === 'svgl-svg') {
      const cleanUrl = resolved.url.startsWith('/') ? resolved.url.slice(1) : resolved.url;
      const fullPath = path.resolve(process.cwd(), 'public', cleanUrl);

      if (!fs.existsSync(fullPath)) {
        const err = `Skill "${skill.name}" asset file not found on disk: "${cleanUrl}".`;
        skillError = skillError ? `${skillError}; ${err}` : err;
        errors.push(err);
      } else {
        const svgContent = fs.readFileSync(fullPath, 'utf8');

        // Text fallback check: forbid <text> and <tspan> in tech logos
        if (/<text\b/i.test(svgContent) || /<tspan\b/i.test(svgContent)) {
          const err = `Skill "${skill.name}" uses text fallback inside SVG asset "${cleanUrl}". Logos must be vector marks or intentional glyphs.`;
          skillError = skillError ? `${skillError}; ${err}` : err;
          errors.push(err);
        }

        // Invalid SVG check
        if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
          const err = `Skill "${skill.name}" SVG asset "${cleanUrl}" is malformed or missing <svg> tags.`;
          skillError = skillError ? `${skillError}; ${err}` : err;
          errors.push(err);
        }

        // ViewBox & Aspect Ratio validation
        const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/i);
        if (!viewBoxMatch) {
          const err = `Skill "${skill.name}" SVG asset "${cleanUrl}" missing viewBox attribute.`;
          skillError = skillError ? `${skillError}; ${err}` : err;
          errors.push(err);
        } else {
          const parts = viewBoxMatch[1].trim().split(/[\s,]+/).map(Number);
          if (parts.length < 4 || parts.some((n) => isNaN(n)) || parts[2] <= 0 || parts[3] <= 0) {
            const err = `Skill "${skill.name}" SVG asset "${cleanUrl}" has invalid viewBox dimensions: "${viewBoxMatch[1]}".`;
            skillError = skillError ? `${skillError}; ${err}` : err;
            errors.push(err);
          }
        }
      }
    }

    // 7. Simple-icons SVG path verification
    if (resolved.kind === 'svg-path') {
      if (!resolved.path || resolved.path.trim().length === 0) {
        const err = `Skill "${skill.name}" (simple-icons) has empty SVG path data.`;
        skillError = skillError ? `${skillError}; ${err}` : err;
        errors.push(err);
      }
    }

    results.push({
      num: index++,
      id: skill.id,
      name: skill.name,
      type: resolved.type,
      source: resolved.source,
      visualMode: resolved.visualMode,
      status: resolved.status === 'verified' ? 'VERIFIED' : resolved.status.toUpperCase(),
      scale: resolved.scale,
      brightness: resolved.brightness,
      error: skillError,
    });
  }

  // Render Canonical Audit Table
  console.log('================================================================================================');
  console.log('TECHNOLOGY ICON IDENTITY AUDIT & VISUAL NORMALIZATION REPORT');
  console.log('================================================================================================');
  console.log(
    '# '.padEnd(4) +
    'Skill'.padEnd(24) +
    'Type'.padEnd(14) +
    'Source'.padEnd(20) +
    'Visual Mode'.padEnd(16) +
    'Status'.padEnd(12)
  );
  console.log('------------------------------------------------------------------------------------------------');

  for (const r of results) {
    const line =
      String(r.num).padStart(2, ' ').padEnd(4) +
      r.name.padEnd(24) +
      r.type.padEnd(14) +
      r.source.padEnd(20) +
      r.visualMode.padEnd(16) +
      r.status.padEnd(12);
    console.log(line);
  }

  console.log('================================================================================================');
  const resolvedCount = results.filter((r) => !r.error).length;
  console.log(`Resolution: ${resolvedCount}/${expectedCount} resolved`);
  console.log('================================================================================================\n');

  if (errors.length > 0) {
    console.error('Validation FAILED with the following errors:');
    errors.forEach((e, i) => console.error(`  ${i + 1}. ${e}`));
    return false;
  }

  console.log('ALL 88 SKILL ICONS VERIFIED SUCCESSFULLY:');
  console.log('  - 0 missing icons');
  console.log('  - 0 text fallbacks');
  console.log('  - 0 invalid SVGs');
  console.log('  - 0 distorted aspect ratios');
  console.log('  - Normalized scale and brightness applied to all 88 skills\n');
  return true;
}

const success = runIconAudit();
process.exit(success ? 0 : 1);
