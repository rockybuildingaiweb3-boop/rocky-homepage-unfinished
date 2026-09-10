import React, { useState } from 'react';
import { resolveSkillIcon } from './iconResolver';

export interface TechLogoProps {
  id?: string;
  slug?: string;
  className?: string;
  size?: number;
  color?: string; // Optional Hex color (with or without '#') for monochrome/tinted SVG
  iconUrl?: string;
  name?: string;
}

/**
 * TechLogo
 * 
 * Clean Presentation Component for Technical Skill Logos:
 * 1. Resolves icons via local package simple-icons & verified local SVGs (no flaky CDN dependency).
 * 2. Strictly adheres to official brand paths without custom hand-drawn/hallucinated SVGs.
 * 3. Supports controlled monochrome tinting via `color` prop or uses official brand hex.
 * 4. Gracefully displays standardized monogram badge for conceptual/unbranded skills.
 */
export const TechLogo: React.FC<TechLogoProps> = ({
  id = '',
  slug,
  className = 'w-6 h-6',
  size,
  color,
  iconUrl,
  name,
}) => {
  const [imgError, setImgError] = useState(false);

  const resolved = resolveSkillIcon(id, slug, name);
  const displayName = name || resolved.title || id;

  // 1. Explicit iconUrl or local verified SVG asset
  const targetUrl = !imgError ? (iconUrl || resolved.url) : null;
  if (targetUrl) {
    return (
      <img
        src={targetUrl}
        alt={displayName}
        className={`object-contain pointer-events-none select-none shrink-0 transition-transform duration-200 ${className}`}
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        loading="lazy"
        onError={() => setImgError(true)}
      />
    );
  }

  // 2. Official verified SVG vector directly from simple-icons package
  if (resolved.kind === 'svg-path' && resolved.path) {
    const fillColor = color
      ? (color.startsWith('#') ? color : `#${color}`)
      : (resolved.hex ? `#${resolved.hex}` : 'currentColor');

    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill={fillColor}
        xmlns="http://www.w3.org/2000/svg"
        className={`object-contain pointer-events-none select-none shrink-0 transition-transform duration-200 ${className}`}
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        aria-label={displayName}
      >
        <title>{displayName}</title>
        <path d={resolved.path} />
      </svg>
    );
  }

  // 3. Controlled fallback: clean standardized monogram badge without fabricating fake logos
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg bg-white/10 text-white/90 font-mono font-bold text-xs select-none shrink-0 border border-white/10 ${className}`}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      title={displayName}
    >
      {resolved.fallbackText}
    </span>
  );
};

export default TechLogo;
