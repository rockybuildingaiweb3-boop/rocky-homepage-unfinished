import React from 'react';
import { resolveSkillIcon } from './iconResolver';

export interface TechLogoProps {
  id: string;
  name?: string;
  className?: string;
  size?: number;
  color?: string;
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

  if (resolved.kind === 'local-svg') {
    return (
      <img
        src={resolved.url}
        alt={displayName}
        className={`object-contain pointer-events-none select-none shrink-0 ${className}`}
        style={size ? { width: size, height: size } : undefined}
        loading="lazy"
        draggable={false}
      />
    );
  }

  const fill = color
    ? color.startsWith('#')
      ? color
      : `#${color}`
    : `#${resolved.hex}`;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={`object-contain pointer-events-none select-none shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label={displayName}
    >
      <title>{displayName}</title>
      <path d={resolved.path} />
    </svg>
  );
};

export default TechLogo;
