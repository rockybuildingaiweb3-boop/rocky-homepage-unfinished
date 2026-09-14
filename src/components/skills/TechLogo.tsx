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
 * Normalizes brand hex values so that dark/black brand logos
 * (e.g., wagmi, Next.js, Ollama) remain crisp and legible
 * on dark atmospheric substrates.
 */
function getNormalizedFill(hex: string, overrideColor?: string): string {
  if (overrideColor) {
    return overrideColor.startsWith('#') ? overrideColor : `#${overrideColor}`;
  }
  const cleanHex = hex.replace('#', '').toLowerCase();
  if (['000000', '000', '111111', '1a1b1f', '18181b', '09090b', '141414'].includes(cleanHex)) {
    return '#F1F5F9';
  }
  return `#${cleanHex}`;
}

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

  // Priority 1: Tech Stack Icons
  if (resolved.kind === 'tech-stack-icon') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 pointer-events-none select-none max-w-full max-h-full ${className}`}
        style={size ? { width: size, height: size } : undefined}
        title={displayName}
        aria-label={displayName}
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
      <img
        src={resolved.url}
        alt={displayName}
        className={`object-contain pointer-events-none select-none shrink-0 max-w-full max-h-full ${className}`}
        style={size ? { width: size, height: size } : undefined}
        loading="lazy"
        draggable={false}
      />
    );
  }

  // Priority 3: Simple Icons SVG path
  const fill = getNormalizedFill(resolved.hex, color);

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={`object-contain pointer-events-none select-none shrink-0 max-w-full max-h-full ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label={displayName}
    >
      <title>{displayName}</title>
      <path d={resolved.path} />
    </svg>
  );
};

export default TechLogo;
