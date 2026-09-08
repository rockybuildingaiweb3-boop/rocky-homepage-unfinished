import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { SKILL_ICONS, SkillIconDefinition } from '../../data/skillIcons';
import { OFFICIAL_LOGOS } from '../../data/officialLogos';

export interface TechLogoProps {
  id?: string;
  className?: string;
  size?: number;
  color?: string;
  useCdn?: boolean;
  iconUrl?: string;
  iconifyId?: string;
  name?: string;
}

export const TechLogo: React.FC<TechLogoProps> = ({
  id = '',
  className = '',
  size = 28,
  color,
  useCdn = true,
  iconUrl,
  iconifyId,
  name,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  // If a direct image URL is provided (e.g. Simple Icons CDN) and hasn't failed:
  if (iconUrl && !imgFailed) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 select-none overflow-hidden ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        title={name || id}
      >
        <img
          src={iconUrl}
          alt={name || id}
          width={size}
          height={size}
          className="w-full h-full object-contain pointer-events-none transition-transform duration-200"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
        />
      </span>
    );
  }

  // If a direct iconify identifier is provided (or as image fallback)
  if (iconifyId) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 select-none transition-transform duration-200 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        title={name || id}
      >
        <Icon
          icon={iconifyId}
          width={size}
          height={size}
          style={{ color: color || '#FFFFFF' }}
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </span>
    );
  }

  const normId = id.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Normalized lookup
  let key = normId;
  if (key === 'ts') key = 'typescript';
  if (key === 'js') key = 'javascript';
  if (key === 'html') key = 'html5';
  if (key === 'node') key = 'nodejs';
  if (key === 'postgres') key = 'postgresql';
  if (key === 'three') key = 'threejs';

  const iconDef: SkillIconDefinition | undefined = SKILL_ICONS[key] || SKILL_ICONS[id];
  const localMeta = OFFICIAL_LOGOS[key] || OFFICIAL_LOGOS[id];

  const [cdnFailed, setCdnFailed] = useState(false);

  // If explicit CDN mode is requested (Scheme A) and has not failed:
  if (useCdn && iconDef?.cdnUrl && !cdnFailed) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 select-none overflow-hidden ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        title={iconDef.name}
      >
        <img
          src={iconDef.cdnUrl}
          alt={iconDef.name}
          width={size}
          height={size}
          className="w-full h-full object-contain pointer-events-none transition-transform duration-200"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setCdnFailed(true)}
        />
      </span>
    );
  }

  // Canonical Vector SVG (100% accurate, zero network latency, authentic brand paths)
  if (localMeta?.svg) {
    const brandHex = color || localMeta.brandColor || '#FFFFFF';
    // If SVG doesn't specify internal path fills, inject brandColor into root <svg>
    const processedSvg = localMeta.svg.includes('fill=')
      ? localMeta.svg
      : localMeta.svg.replace('<svg ', `<svg fill="${brandHex}" `);

    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 select-none overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:block transition-transform duration-200 ${className}`}
        style={{ width: `${size}px`, height: `${size}px`, color: brandHex }}
        title={localMeta.name}
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
    );
  }

  // Scheme B: @iconify/react dynamic vector rendering
  if (iconDef?.iconifyIcon) {
    const iconColor = color || (iconDef.isConceptual ? '#A855F7' : iconDef.brandColor);
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 select-none transition-transform duration-200 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        title={iconDef.name}
      >
        <Icon
          icon={iconDef.iconifyIcon}
          width={size}
          height={size}
          style={{ color: iconColor }}
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </span>
    );
  }

  // Fallback to local official SVG data URI
  if (localMeta?.dataUri) {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 select-none overflow-hidden ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        title={localMeta.name}
      >
        <img
          src={localMeta.dataUri}
          alt={localMeta.name}
          width={size}
          height={size}
          className="w-full h-full object-contain pointer-events-none transition-transform duration-200"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </span>
    );
  }

  // Final emergency fallback
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 text-white font-mono font-bold text-xs ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {id.slice(0, 2).toUpperCase()}
    </span>
  );
};
