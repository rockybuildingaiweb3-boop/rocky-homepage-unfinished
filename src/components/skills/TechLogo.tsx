import React from 'react';
import StackIcon from 'tech-stack-icons';
import { resolveSkillIcon } from './iconResolver';

export interface TechLogoProps {
  id: string;
  name?: string;
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Optical Mass Normalization Multipliers
 *
 * Compensates for ink-density and bounding-box fill differences across brand SVGs:
 * - Dense solid square/shield marks (TypeScript, JS, HTML5, Unstructured) are tempered (< 1.0)
 *   so they don't overpower neighboring marks.
 * - Thin-line wireframe, circular, or wide marks (Three.js, React, GraphQL, WebGL, LangChain,
 *   MCP, ERC-4337) receive a calibrated optical boost (> 1.0).
 */
const OPTICAL_MASS_MULTIPLIER: Record<string, number> = {
  // Dense solid squares / blocks -> tempered optical scale
  typescript: 0.86,
  javascript: 0.86,
  html5: 0.88,
  unstructured: 0.84,
  css3: 0.88,
  // Intricate wireframe / thin-stroke / open-geometry marks -> boosted optical scale
  threedotjs: 1.12,
  react: 1.08,
  openai: 1.06,
  langgraph: 1.1,
  langchain: 1.08,
  llamaindex: 1.08,
  solidity: 1.08,
  postgresql: 1.05,
  graphql: 1.1,
  webgl: 1.12,
  glsl: 1.1,
  r3f: 1.1,
  mcp: 1.08,
  erc4337: 1.08,
  siwe: 1.08,
  viem: 1.08,
  wagmi: 1.08,
  express: 1.08,
  flask: 1.08,
  vercel: 1.05,
  ollama: 1.06,
  kafka: 1.08,
  thegraph: 1.08,
};

/**
 * Normalizes brand hex values so that dark/black brand logos
 * (e.g., wagmi, Next.js, Ollama, Vercel) remain crisp and legible
 * on dark atmospheric substrates.
 */
function getNormalizedFill(hex: string, overrideColor?: string): string {
  if (overrideColor) {
    return overrideColor.startsWith('#') ? overrideColor : `#${overrideColor}`;
  }
  const cleanHex = hex.replace('#', '').toLowerCase();
  if (
    [
      '000000',
      '000',
      '111111',
      '1a1b1f',
      '18181b',
      '09090b',
      '141414',
      '171717',
      '1c3c3c',
      '0f172a',
      '1e293b',
      '231f20',
      '2d3748',
    ].includes(cleanHex)
  ) {
    return '#F8FAFC';
  }
  return `#${cleanHex}`;
}

/**
 * Standardized Technology Logo Rendering Pipeline:
 * 1. Metadata-driven scale + optical visual mass normalization
 * 2. Contrast & brightness adjustment for cosmic dark-substrate legibility
 * 3. Strict aspect ratio preservation (xMidYMid meet & object-contain)
 * 4. Deterministic multi-source resolution
 */
export const TechLogo: React.FC<TechLogoProps> = ({
  id,
  name,
  className = 'w-6 h-6',
  size,
  color,
}) => {
  const resolved = resolveSkillIcon(id, name);
  const displayName = name || resolved.title || id;

  if (resolved.kind === 'missing') {
    return (
      <div
        className={`flex items-center justify-center rounded border border-dashed border-white/20 text-white/40 font-mono text-[9px] select-none ${className}`}
        style={size ? { width: size, height: size } : undefined}
        title={`${displayName} (missing icon)`}
        aria-label={`${displayName} (missing icon)`}
      >
        ?
      </div>
    );
  }

  const normalizedId = id.toLowerCase();
  const opticalMultiplier = OPTICAL_MASS_MULTIPLIER[normalizedId] ?? 1.0;
  const scale = parseFloat(((resolved.scale ?? 1.0) * opticalMultiplier).toFixed(3));
  const brightness = resolved.brightness ?? 1.0;

  const containerStyle: React.CSSProperties = {
    ...(size ? { width: size, height: size } : {}),
    transform: scale !== 1.0 ? `scale(${scale})` : undefined,
    filter: brightness !== 1.0 ? `brightness(${brightness})` : undefined,
    transformOrigin: 'center center',
  };

  // Priority 1: Tech Stack Icons
  if (resolved.kind === 'tech-stack-icon') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 pointer-events-none select-none ${className}`}
        style={containerStyle}
        title={displayName}
        aria-label={displayName}
        data-visual-mode={resolved.visualMode}
        data-skill-type={resolved.type}
      >
        <StackIcon
          name={resolved.key}
          variant="dark"
          className="w-full h-full object-contain flex items-center justify-center pointer-events-none"
        />
      </span>
    );
  }

  // Priority 2 & 4: SVGL and Verified Local SVG assets
  if (resolved.kind === 'svgl-svg' || resolved.kind === 'local-svg') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 pointer-events-none select-none ${className}`}
        style={containerStyle}
        title={displayName}
        aria-label={displayName}
        data-visual-mode={resolved.visualMode}
        data-skill-type={resolved.type}
      >
        <img
          src={resolved.url}
          alt={displayName}
          className="w-full h-full object-contain pointer-events-none select-none"
          loading="lazy"
          draggable={false}
        />
      </span>
    );
  }

  // Priority 3: Simple Icons SVG path
  const fill = getNormalizedFill(resolved.hex, color);

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 pointer-events-none select-none ${className}`}
      style={containerStyle}
      title={displayName}
      aria-label={displayName}
      data-visual-mode={resolved.visualMode}
      data-skill-type={resolved.type}
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        preserveAspectRatio="xMidYMid meet"
        fill={fill}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain pointer-events-none select-none"
        aria-label={displayName}
      >
        <title>{displayName}</title>
        <path d={resolved.path} />
      </svg>
    </span>
  );
};

export default TechLogo;
