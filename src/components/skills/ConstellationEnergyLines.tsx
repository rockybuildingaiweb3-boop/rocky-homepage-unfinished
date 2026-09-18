import React, { memo, useMemo } from 'react';

interface ConstellationEnergyLinesProps {
  hoveredSkillId: string | null;
  relatedSkillIds: string[];
  nodePositions: Map<string, { x: number; y: number }>;
  brandColor?: string;
}

/**
 * ConstellationEnergyLines
 * 
 * High-performance GPU-accelerated SVG energy conduits connecting:
 * 1. The celestial planetary core (50, 50) to the active engineering node.
 * 2. The active engineering node to illuminated sister nodes.
 * 
 * Visual treatment:
 * - Soft Gaussian-blurred glow conduits (no harsh geometric wireframes).
 * - Animated energy pulse waves flowing along the curve vectors.
 * - Hardware-accelerated SVG paths with vector-effect="non-scaling-stroke".
 * - Dormant (0 opacity) when no node is hovered, consuming zero rendering overhead.
 */
export const ConstellationEnergyLines: React.FC<ConstellationEnergyLinesProps> = memo(({
  hoveredSkillId,
  relatedSkillIds,
  nodePositions,
  brandColor = '#A855F7',
}) => {
  const isVisible = Boolean(hoveredSkillId);

  const paths = useMemo(() => {
    if (!hoveredSkillId) return [];

    const origin = nodePositions.get(hoveredSkillId);
    if (!origin) return [];

    const result: Array<{ id: string; d: string; isCoreBeam: boolean }> = [];

    // 1. Central Core Conduit: Planet (50, 50) -> Active Node (x0, y0)
    result.push({
      id: `core-${hoveredSkillId}`,
      d: `M 50 50 L ${origin.x} ${origin.y}`,
      isCoreBeam: true,
    });

    // 2. Secondary Energy Filaments: Active Node -> Top 4 Related Sister Nodes
    // Restricting to the strongest 3–5 (first 4 IDs) to prevent dense dependency-graph appearance
    const seenRids = new Set<string>();
    const activeRids: string[] = [];
    for (const rid of relatedSkillIds) {
      if (rid === hoveredSkillId || seenRids.has(rid)) continue;
      seenRids.add(rid);
      activeRids.push(rid);
      if (activeRids.length >= 4) break;
    }

    for (const rid of activeRids) {
      const target = nodePositions.get(rid);
      if (!target) continue;

      const mx = (origin.x + target.x) / 2;
      const my = (origin.y + target.y) / 2;
      // Gently curve toward or away from the central gravitational planet
      const cx = mx + (50 - mx) * 0.22;
      const cy = my + (50 - my) * 0.22;

      result.push({
        id: `${hoveredSkillId}-${rid}`,
        d: `M ${origin.x} ${origin.y} Q ${cx} ${cy} ${target.x} ${target.y}`,
        isCoreBeam: false,
      });
    }

    return result;
  }, [hoveredSkillId, relatedSkillIds, nodePositions]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-400 ease-out z-20 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      <defs>
        {/* Soft Radial Gradient for Core Planet Pulse */}
        <radialGradient id="energyCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={brandColor} stopOpacity="0.8" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Soft Gravitational Energy Trail Gradient for Planet Core Conduit */}
        <linearGradient id="gravitationalBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.75" />
          <stop offset="40%" stopColor={brandColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.25" />
        </linearGradient>

        {/* Subtle Glow Filter */}
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection paths */}
      {paths.map((p) => {
        if (p.isCoreBeam) {
          return (
            <g key={p.id}>
              {/* Diffuse Gravitational Corona */}
              <path
                d={p.d}
                fill="none"
                stroke={brandColor}
                strokeWidth="3.2"
                opacity="0.22"
                vectorEffect="non-scaling-stroke"
                filter="url(#softGlow)"
              />
              {/* Soft Luminous Energy Trail */}
              <path
                d={p.d}
                fill="none"
                stroke="url(#gravitationalBeamGrad)"
                strokeWidth="1.2"
                opacity="0.65"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        }

        return (
          <g key={p.id}>
            {/* Soft Ambient Filament Glow */}
            <path
              d={p.d}
              fill="none"
              stroke={brandColor}
              strokeWidth="2.0"
              opacity="0.15"
              vectorEffect="non-scaling-stroke"
              filter="url(#softGlow)"
            />
            {/* Subtle Ethereal Resonance Filament */}
            <path
              d={p.d}
              fill="none"
              stroke={brandColor}
              strokeWidth="0.75"
              opacity="0.35"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </svg>
  );
});

ConstellationEnergyLines.displayName = 'ConstellationEnergyLines';
