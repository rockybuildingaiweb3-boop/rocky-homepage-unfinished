import React from 'react';
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

export const TechLogo: React.FC<TechLogoProps> = ({ id = '', slug, className = 'w-6 h-6', size, color, iconUrl, name }) => {
  const resolved = resolveSkillIcon(id, slug, name);
  const displayName = name || resolved.title || id;
  const targetUrl = iconUrl || (resolved.kind === 'local-svg' ? resolved.url : null);

  if (targetUrl) {
    return <img src={targetUrl} alt={displayName} className={`object-contain pointer-events-none select-none shrink-0 ${className}`} style={size ? { width: size, height: size } : undefined} loading="lazy" />;
  }

  if (resolved.kind === 'svg-path') {
    const fill = color ? (color.startsWith('#') ? color : `#${color}`) : `#${resolved.hex}`;
    return (
      <svg role="img" viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg" className={`object-contain pointer-events-none select-none shrink-0 ${className}`} style={size ? { width: size, height: size } : undefined} aria-label={displayName}>
        <title>{displayName}</title>
        <path d={resolved.path} />
      </svg>
    );
  }

  return (
    <span aria-label={displayName} title={displayName} className={`inline-flex items-center justify-center rounded-full border border-white/20 text-white/55 ${className}`} style={{ width: size, height: size }}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
};

export default TechLogo;
