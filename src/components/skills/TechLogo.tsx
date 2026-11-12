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
 * Optical Mass Normalization Multipliers (Living Orbit 2.1)
 *
 * Calibrates perceived visual weight across all 88 technology marks so a 48px React
 * orbital atom, a 48px dense TypeScript square, and a 48px thin Three.js wireframe
 * feel optically balanced without placing icons inside generic circles:
 * - Dense solid square/shield marks (TypeScript, JS, HTML5, Unstructured) are tempered (< 1.0).
 * - Thin-stroke wireframe, open-lattice, or wide horizontal marks (Three.js, React, GraphQL,
 *   WebGL, LangGraph, Solidity, Express, Docker, Kubernetes, Rust, PyTorch) receive a calibrated boost (> 1.0).
 */
export const OPTICAL_MASS_MULTIPLIER: Record<string, number> = {
  // Dense solid squares / heavy shields -> tempered optical scale
  typescript: 0.85,
  javascript: 0.85,
  html5: 0.88,
  css3: 0.89,
  unstructured: 0.84,
  dify: 0.92,
  coze: 0.92,
  privy: 0.93,
  // Intricate wireframe / thin-stroke / open-geometry / wide marks -> boosted optical scale
  threedotjs: 1.15,
  react: 1.09,
  openai: 1.07,
  langgraph: 1.12,
  langchain: 1.1,
  llamaindex: 1.08,
  llamaparse: 1.06,
  solidity: 1.12,
  postgresql: 1.06,
  fastapi: 1.06,
  graphql: 1.12,
  webgl: 1.14,
  webgpu: 1.08,
  glsl: 1.1,
  r3f: 1.1,
  draco: 1.06,
  spline: 1.05,
  canvasapi: 1.05,
  mcp: 1.1,
  erc4337: 1.09,
  siwe: 1.08,
  viem: 1.08,
  wagmi: 1.09,
  ethers: 1.06,
  hardhat: 1.05,
  foundry: 1.06,
  express: 1.12,
  flask: 1.1,
  vercel: 1.04,
  ollama: 1.06,
  kafka: 1.1,
  thegraph: 1.08,
  pinecone: 1.08,
  chroma: 1.05,
  docker: 1.07,
  kubernetes: 1.06,
  tailwindcss: 1.08,
  nodedotjs: 1.04,
  rust: 1.06,
  go: 1.06,
  redis: 1.04,
  mongodb: 1.06,
  supabase: 1.05,
  anthropic: 1.06,
  pytorch: 1.06,
  cohere: 1.06,
  groq: 1.06,
  togetherai: 1.06,
  prisma: 1.08,
  trpc: 1.06,
  qdrant: 1.05,
  weaviate: 1.06,
  milvus: 1.06,
  pgvector: 1.07,
  semantickernel: 1.08,
  autogen: 1.06,
  crewai: 1.05,
  langsmith: 1.06,
};

/**
 * Brand-specific dark-substrate contrast enhancement filters for marks whose
 * native SVG paths use dark slate, charcoal, or low-luminance strokes on `#030014`.
 */
const DARK_SUBSTRATE_FILTER_OVERRIDES: Record<string, string> = {
  solidity: 'brightness(2.35) contrast(1.15)',
  langchain: 'brightness(2.2) contrast(1.15)',
  langgraph: 'brightness(2.25) contrast(1.15)',
  langsmith: 'brightness(1.95) contrast(1.12)',
  prisma: 'brightness(1.85) contrast(1.12)',
  llamaindex: 'brightness(1.55) saturate(1.2)',
  express: 'brightness(1.45) contrast(1.1)',
  flask: 'brightness(1.4) contrast(1.1)',
  threedotjs: 'brightness(1.35) contrast(1.1)',
  pinecone: 'brightness(1.15)',
  kafka: 'brightness(1.35)',
  cohere: 'brightness(1.45) saturate(1.2)',
  sentry: 'brightness(1.65) saturate(1.25)',
};

/**
 * Normalizes brand hex values so that dark/black Simple Icons paths
 * (e.g., wagmi, Next.js, Vercel, Haystack) remain crisp and legible
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
      '0b2c4a',
      '362d59',
    ].includes(cleanHex)
  ) {
    return '#F8FAFC';
  }
  return `#${cleanHex}`;
}

/**
 * Standardized Technology Logo Rendering Pipeline (Living Orbit 2.0):
 * 1. Metadata-driven scale + optical visual mass normalization
 * 2. Brand-specific contrast & brightness calibration for dark-substrate legibility
 * 3. Strict aspect ratio preservation (xMidYMid meet & object-contain)
 * 4. Deterministic multi-source resolution without generic circular containers
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
  const customFilter = DARK_SUBSTRATE_FILTER_OVERRIDES[normalizedId];

  const containerStyle: React.CSSProperties = {
    ...(size ? { width: size, height: size } : {}),
    transform: scale !== 1.0 ? `scale(${scale})` : undefined,
    filter: customFilter || (brightness !== 1.0 ? `brightness(${brightness})` : undefined),
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
    // Use dark-background optimized SVGL variant when available on disk
    const assetUrl =
      normalizedId === 'kafka'
        ? '/assets/icons/svgl/kafka_dark.svg'
        : resolved.url;

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
          src={assetUrl}
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
