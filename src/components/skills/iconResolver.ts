import {
  siTypescript,
  siJavascript,
  siReact,
  siNextdotjs,
  siSvelte,
  siTailwindcss,
  siFramer,
  siGreensock,
  siHtml5,
  siVite,
  siThreedotjs,
  siWebgl,
  siWebgpu,
  siBlender,
  siBabylondotjs,
  siNodedotjs,
  siExpress,
  siFastapi,
  siPostgresql,
  siSupabase,
  siPrisma,
  siDrizzle,
  siRedis,
  siTrpc,
  siGraphql,
  siSolidity,
  siWagmi,
  siEthers,
  siIpfs,
  siAnthropic,
  siGooglegemini,
  siDeepseek,
  siQwen,
  siVercel,
  siOllama,
  siHuggingface,
  siLangchain,
  siLanggraph,
  siCrewai,
  siDify,
  siCoze,
  siHaystack,
  siMilvus,
  siQdrant,
  siDocker,
  siKubernetes,
  siGithubactions,
  siPrometheus,
  siGrafana,
  siSentry,
  siPytest,
  siCelery,
  siOpentelemetry,
} from 'simple-icons';

import { ICON_REGISTRY } from './iconRegistry.ts';
import type { IconRegistryEntry } from './iconRegistry.ts';

export interface SimpleIconData {
  title: string;
  slug: string;
  path: string;
  hex: string;
}

export interface ResolvedIcon {
  kind: 'svg-path' | 'local-svg' | 'neutral' | 'fallback';
  path?: string;
  hex?: string;
  title?: string;
  url?: string;
  fallbackText: string;
  neutralReason?: string;
}

/**
 * Package icon mapping table connecting registry packageKeys to imported Simple Icons
 */
const PACKAGE_ICONS: Record<string, SimpleIconData> = {
  siTypescript,
  siJavascript,
  siReact,
  siNextdotjs,
  siSvelte,
  siTailwindcss,
  siFramer,
  siGreensock,
  siHtml5,
  siVite,
  siThreedotjs,
  siWebgl,
  siWebgpu,
  siBlender,
  siBabylondotjs,
  siNodedotjs,
  siExpress,
  siFastapi,
  siPostgresql,
  siSupabase,
  siPrisma,
  siDrizzle,
  siRedis,
  siTrpc,
  siGraphql,
  siSolidity,
  siWagmi,
  siEthers,
  siIpfs,
  siAnthropic,
  siGooglegemini,
  siDeepseek,
  siQwen,
  siVercel,
  siOllama,
  siHuggingface,
  siLangchain,
  siLanggraph,
  siCrewai,
  siDify,
  siCoze,
  siHaystack,
  siMilvus,
  siQdrant,
  siDocker,
  siKubernetes,
  siGithubactions,
  siPrometheus,
  siGrafana,
  siSentry,
  siPytest,
  siCelery,
  siOpentelemetry,
};

/**
 * Deterministic Icon Resolver
 * Resolves a technical skill ID to its verified vector or approved neutral specification.
 */
export function resolveSkillIcon(
  id: string,
  slug?: string,
  name?: string
): ResolvedIcon {
  const cleanId = (id || '').toLowerCase().trim();
  const cleanSlug = (slug || cleanId).toLowerCase().trim();

  // Find registry entry by ID or fallback to slug
  const entry: IconRegistryEntry | undefined = ICON_REGISTRY[cleanId] || ICON_REGISTRY[cleanSlug];

  if (entry) {
    // 1. Local verified official SVG asset (stored in /public/assets/icons/)
    if (entry.sourceType === 'local-svg' && entry.localPath) {
      return {
        kind: 'local-svg',
        url: entry.localPath,
        title: name || id,
        fallbackText: entry.fallbackText,
      };
    }

    // 2. Package-backed vector directly from simple-icons npm package
    if (entry.sourceType === 'package' && entry.packageKey) {
      const icon = PACKAGE_ICONS[entry.packageKey];
      if (icon) {
        return {
          kind: 'svg-path',
          path: icon.path,
          hex: icon.hex,
          title: icon.title,
          fallbackText: entry.fallbackText,
        };
      }
    }

    // 3. Approved neutral specification / conceptual representation
    if (entry.sourceType === 'neutral') {
      return {
        kind: 'neutral',
        title: name || id,
        fallbackText: entry.fallbackText,
        neutralReason: entry.neutralReason,
      };
    }
  }

  // Defensive fallback for unknown or unregistered skills
  const raw = (name || id || 'SK').replace(/[^a-zA-Z0-9]/g, '');
  const fallbackText = (raw.length >= 2 ? raw.slice(0, 2) : raw.padEnd(2, 'X')).toUpperCase();

  return {
    kind: 'fallback',
    title: name || id,
    fallbackText,
  };
}

export interface IconValidationResult {
  valid: boolean;
  kind: 'svg-path' | 'local-svg' | 'neutral' | 'fallback';
  error?: string;
}

/**
 * Diagnostic validator to verify that an icon identifier resolves cleanly
 */
export function validateSkillIcon(
  id: string,
  slug?: string,
  name?: string
): IconValidationResult {
  if (!id) {
    return { valid: false, kind: 'fallback', error: 'Skill ID is required' };
  }
  const resolved = resolveSkillIcon(id, slug, name);
  if (resolved.kind === 'svg-path') {
    if (!resolved.path || resolved.path.length < 10) {
      return { valid: false, kind: resolved.kind, error: 'Empty or invalid SVG path' };
    }
    return { valid: true, kind: resolved.kind };
  }
  if (resolved.kind === 'local-svg') {
    if (!resolved.url) {
      return { valid: false, kind: resolved.kind, error: 'Missing local SVG url' };
    }
    return { valid: true, kind: resolved.kind };
  }
  if (resolved.kind === 'neutral') {
    if (!resolved.fallbackText || resolved.fallbackText.length < 2) {
      return { valid: false, kind: resolved.kind, error: 'Invalid neutral monogram' };
    }
    return { valid: true, kind: resolved.kind };
  }
  return { valid: false, kind: 'fallback', error: 'Unregistered skill falling back to default' };
}
