import React, { useState } from 'react';
import { SKILL_ICONS } from '../../data/skillIcons';

export interface TechLogoProps {
  id?: string;
  className?: string;
  size?: number;
  color?: string; // Optional Hex color (with or without '#') for monochrome/tinted SVG
  iconUrl?: string;
  name?: string;
}

/**
 * TechLogo
 * 
 * Strict Icon Constraint Implementation:
 * 1. Prohibits hand-drawn / custom generated <svg> paths.
 * 2. Exclusively uses Simple Icons CDN standard SVGs:
 *    Format: <img src="https://cdn.simpleicons.org/[tech_slug]" alt="[Tech Name]" class="w-6 h-6" />
 * 3. Supports single-color display by appending hex color to URL (e.g. /ffffff).
 */
export const TechLogo: React.FC<TechLogoProps> = ({
  id = '',
  className = 'w-6 h-6',
  size,
  color,
  iconUrl,
  name,
}) => {
  const [imgError, setImgError] = useState(false);

  // Look up icon definition from our verified 50-skill mapping
  const iconDef = id ? SKILL_ICONS[id] : undefined;
  const techSlug = iconDef?.slug || id.toLowerCase().trim() || 'code';
  const displayName = name || iconDef?.name || techSlug;

  // Determine the exact Simple Icons CDN URL:
  // If a specific color is passed, append clean hex (e.g., 'ffffff')
  // Otherwise use the official Simple Icons SVG url
  let targetUrl = iconUrl;
  if (!targetUrl) {
    if (color) {
      const cleanHex = color.replace(/^#/, '').trim();
      targetUrl = `https://cdn.simpleicons.org/${techSlug}/${cleanHex}`;
    } else {
      targetUrl = iconDef?.cdnUrl || `https://cdn.simpleicons.org/${techSlug}`;
    }
  }

  // Graceful fallback if network drops or slug is invalid
  if (imgError || !targetUrl) {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg bg-white/10 text-white font-mono font-bold text-xs select-none shrink-0 ${className}`}
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        title={displayName}
      >
        {techSlug.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={targetUrl}
      alt={displayName}
      className={`object-contain pointer-events-none select-none shrink-0 transition-transform duration-200 ${className}`}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      loading="lazy"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
    />
  );
};
