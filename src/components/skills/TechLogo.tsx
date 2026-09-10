import React, { useState } from 'react';
import { resolveSkillIcon } from './iconResolver';

export interface TechLogoProps {
  id?: string;
  slug?: string;
  className?: string;
  size?: number;
  color?: string;
  iconUrl?: string;
  name?: string;
}

/**
 * TechLogo
 * 
 * Canonical SVG-only presentation component for skills & technologies:
 * 1. Resolves verified vector paths directly from `simple-icons`.
 * 2. Resolves verified official SVG assets from `/assets/icons/`.
 * 3. Genuinely unbranded standards render a neutral technical code glyph (< / >).
 * 
 * GUARANTEES:
 * - ZERO initials / fallback letters pretending to be a logo.
 * - ZERO emoji.
 * - ZERO hand-drawn or invented SVGs.
 * - ZERO substituted logos (GLSL ≠ OpenGL, R3F ≠ React, Draco ≠ Three.js, Canvas API ≠ HTML5).
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
  const [hasError, setHasError] = useState(false);

  const resolved = resolveSkillIcon(id, slug, name);
  const displayName = name || resolved.title || id;

  // 1. Explicit iconUrl or verified local SVG asset
  const targetUrl = !hasError ? (iconUrl || (resolved.kind === 'local-svg' ? resolved.url : null)) : null;
  if (targetUrl) {
    return (
      <img
        src={targetUrl}
        alt={displayName}
        className={`object-contain pointer-events-none select-none shrink-0 transition-transform duration-200 ${className}`}
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }

  // 2. Official Simple Icons vector path
  if (resolved.kind === 'svg-path') {
    const fillColor = color
      ? (color.startsWith('#') ? color : `#${color}`)
      : `#${resolved.hex}`;

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

  // 3. Genuinely unbranded standard / specification:
  // Render a clean, neutral technical code glyph.
  // NEVER initials! NEVER letters! NEVER fake logos!
  const strokeColor = color
    ? (color.startsWith('#') ? color : `#${color}`)
    : 'rgba(255, 255, 255, 0.65)';

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strokeColor}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`object-contain pointer-events-none select-none shrink-0 opacity-80 ${className}`}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      aria-label={`Specification: ${displayName}`}
    >
      <title>{`${displayName} (Technical Standard)`}</title>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
};

export default TechLogo;
