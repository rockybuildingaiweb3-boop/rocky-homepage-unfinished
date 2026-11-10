import React, { memo, useMemo } from 'react';

interface ConstellationEnergyLinesProps {
  /** Active skill ID (locked focus or hover preview) */
  hoveredSkillId: string | null;
  /** Whether the active skill is persistently locked in Level 3 */
  isLockedFocus?: boolean;
  /** Related skill IDs from authoritative relationship registry */
  relatedSkillIds: string[];
  /** Node coordinate lookup map (percentage 0..100) */
  nodePositions: Map<string, { x: number; y: number }>;
  /** Brand color of active node or category */
  brandColor?: string;
  /** Optional tier orbital radii when a category is expanded (Level 2/3) */
  tierRings?: {
    core: { rx: number; ry: number };
    professional: { rx: number; ry: number };
    ecosystem: { rx: number; ry: number };
  } | null;
  /** Hovered category coordinates in Level 1 overview */
  hoveredCategoryPos?: { x: number; y: number; color: string } | null;
}

/**
 * ConstellationEnergyLines
 *
 * Selective, restrained SVG relationship & orbital geometry layer:
 * - Never connects all 88 nodes simultaneously.
 * - Level 1: Renders a delicate cosmic orbital ellipse and a subtle resonance tether
 *            when a category nucleus is hovered.
 * - Level 2: Renders the 3 gravitational tier orbital rings (Core, Professional, Ecosystem)
 *            so the spatial hierarchy around the planet is immediately legible.
 * - Level 3: Renders luminous quadratic Bezier energy curves strictly between the
 *            focused/active technology and its 3–6 genuinely related technologies.
 */
export const ConstellationEnergyLines: React.FC<ConstellationEnergyLinesProps> = memo(({
  hoveredSkillId,
  isLockedFocus = false,
  relatedSkillIds,
  nodePositions,
  brandColor = '#A855F7',
  tierRings = null,
  hoveredCategoryPos = null,
}) => {
  const paths = useMemo(() => {
    if (!hoveredSkillId) return [];

    const origin = nodePositions.get(hoveredSkillId);
    if (!origin) return [];

    const result: Array<{ id: string; d: string; isCoreBeam: boolean }> = [];

    // 1. Subtle Gravitational Anchor: Planetary Core (50, 50) -> Focused/Active Skill Node
    result.push({
      id: `core-${hoveredSkillId}`,
      d: `M 50 50 L ${origin.x} ${origin.y}`,
      isCoreBeam: true,
    });

    // 2. Selective Relationship Filaments: Focused Skill -> 3 to 6 Related Technologies
    const seenRids = new Set<string>();
    const activeRids: string[] = [];
    for (const rid of relatedSkillIds) {
      if (rid === hoveredSkillId || seenRids.has(rid)) continue;
      if (!nodePositions.has(rid)) continue;
      seenRids.add(rid);
      activeRids.push(rid);
      if (activeRids.length >= 6) break;
    }

    for (const rid of activeRids) {
      const target = nodePositions.get(rid);
      if (!target) continue;

      const mx = (origin.x + target.x) / 2;
      const my = (origin.y + target.y) / 2;
      // Curve gently around the central gravitational field
      const cx = mx + (50 - mx) * 0.24;
      const cy = my + (50 - my) * 0.24;

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
      className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gravitationalBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.65" />
          <stop offset="50%" stopColor={brandColor} stopOpacity="0.55" />
          <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.25" />
        </linearGradient>

        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ─── LEVEL 1: CONSTELLATION OVERVIEW ORBITAL RING & HOVER TETHER ─── */}
      {!tierRings && (
        <g>
          <ellipse
            cx="50"
            cy="49"
            rx="34"
            ry="33"
            fill="none"
            stroke="rgba(192, 132, 252, 0.14)"
            strokeWidth="0.7"
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
          />
          {hoveredCategoryPos && (
            <path
              d={`M 50 50 L ${hoveredCategoryPos.x} ${hoveredCategoryPos.y}`}
              fill="none"
              stroke={hoveredCategoryPos.color}
              strokeWidth="1.2"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
              filter="url(#softGlow)"
            />
          )}
        </g>
      )}

      {/* ─── LEVEL 2 & 3: THREE-TIER GRAVITATIONAL ORBITAL BANDS ─── */}
      {tierRings && (
        <g className="transition-opacity duration-500">
          {/* Tier 1: Core Inner Gravity Band */}
          <ellipse
            cx="50"
            cy="50"
            rx={tierRings.core.rx}
            ry={tierRings.core.ry}
            fill="none"
            stroke="rgba(216, 180, 254, 0.24)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {/* Tier 2: Professional Secondary Orbital Band */}
          <ellipse
            cx="50"
            cy="50"
            rx={tierRings.professional.rx}
            ry={tierRings.professional.ry}
            fill="none"
            stroke="rgba(168, 85, 247, 0.16)"
            strokeWidth="0.85"
            strokeDasharray="3 3"
            vectorEffect="non-scaling-stroke"
          />
          {/* Tier 3: Ecosystem Outer Orbital Band */}
          <ellipse
            cx="50"
            cy="50"
            rx={tierRings.ecosystem.rx}
            ry={tierRings.ecosystem.ry}
            fill="none"
            stroke="rgba(147, 51, 234, 0.11)"
            strokeWidth="0.75"
            strokeDasharray="1.5 3.5"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      )}

      {/* ─── SELECTIVE SKILL RELATIONSHIP PATHS (3–6 GENUINE CONNECTIONS) ─── */}
      {paths.map((p) => {
        if (p.isCoreBeam) {
          return (
            <g key={p.id}>
              <path
                d={p.d}
                fill="none"
                stroke={brandColor}
                strokeWidth={isLockedFocus ? '2.6' : '2.0'}
                opacity={isLockedFocus ? '0.28' : '0.18'}
                vectorEffect="non-scaling-stroke"
                filter="url(#softGlow)"
              />
              <path
                d={p.d}
                fill="none"
                stroke="url(#gravitationalBeamGrad)"
                strokeWidth={isLockedFocus ? '1.2' : '0.9'}
                opacity={isLockedFocus ? '0.75' : '0.5'}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        }

        return (
          <g key={p.id}>
            {/* Diffuse Luminous Aura */}
            <path
              d={p.d}
              fill="none"
              stroke={brandColor}
              strokeWidth={isLockedFocus ? '2.4' : '1.6'}
              opacity={isLockedFocus ? '0.28' : '0.16'}
              vectorEffect="non-scaling-stroke"
              filter="url(#softGlow)"
            />
            {/* Crisp Relationship Energy Path */}
            <path
              d={p.d}
              fill="none"
              stroke="#E9D5FF"
              strokeWidth={isLockedFocus ? '1.25' : '0.85'}
              opacity={isLockedFocus ? '0.78' : '0.45'}
              strokeDasharray={isLockedFocus ? undefined : '3 2'}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </svg>
  );
});

ConstellationEnergyLines.displayName = 'ConstellationEnergyLines';
export default ConstellationEnergyLines;
