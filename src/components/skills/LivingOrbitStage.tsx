import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { SKILLS_DATA, SKILL_CATEGORIES, SkillItem } from '../../data/skills';
import {
  LIVING_ORBIT_PARTICLES,
  ORBITAL_RIBBONS,
  evaluateRibbonTrajectory,
  computeFocusedNetworkPositions,
  getRelatedSkillIds,
} from '../../features/skills/livingOrbitEngine';
import { useIsMobile } from '../../hooks/useIsMobile';
import { TechLogo } from './TechLogo';
import { SkillFocusCard } from './SkillFocusCard';
import { MobileLivingOrbit } from './MobileLivingOrbit';

export interface LivingOrbitStageProps {
  selectedCategoryId: string | null;
  focusedSkillId: string | null;
  hoveredSkillId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onSelectSkill: (skillId: string) => void;
  onClearSkillFocus: () => void;
  onHoverSkill: (skillId: string) => void;
  onLeaveSkill: () => void;
}

const COMPACT_CATEGORY_TITLES: Record<string, string> = {
  frontend: 'Frontend',
  graphics: '3D & Graphics',
  backend: 'Backend & APIs',
  data: 'Data & Infra',
  web3: 'Web3',
  models: 'AI Models',
  agents: 'AI Agents',
  rag: 'RAG & Vector',
};

interface ParticleAnimState {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  isVisible: boolean;
}

/**
 * LivingOrbitStage
 *
 * A Living Field of Technologies suspended in front of the cosmic purple planet.
 * - Authentic technology logos are the primary visual heroes.
 * - 4 curved orbital streams with counter-flowing velocities, organic vertical
 *   sine oscillation, and depth-based pointer parallax.
 * - Smooth spring-like interpolation into 11-skill Category Formations or
 *   Focused Skill relationship networks at 60fps without React re-render overhead.
 */
export const LivingOrbitStage: React.FC<LivingOrbitStageProps> = ({
  selectedCategoryId,
  focusedSkillId,
  hoveredSkillId,
  onSelectCategory,
  onSelectSkill,
  onClearSkillFocus,
  onHoverSkill,
  onLeaveSkill,
}) => {
  const isMobile = useIsMobile(768);
  const stageRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const relationPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const relationGlowPathRefs = useRef<(SVGPathElement | null)[]>([]);

  const [isMotionPaused, setIsMotionPaused] = useState(false);

  // Latest reactive props stored in ref so the 60fps rAF loop always reads fresh state
  const stateRef = useRef({
    selectedCategoryId,
    focusedSkillId,
    hoveredSkillId,
    isMotionPaused,
  });
  useEffect(() => {
    stateRef.current = {
      selectedCategoryId,
      focusedSkillId,
      hoveredSkillId,
      isMotionPaused,
    };
  }, [selectedCategoryId, focusedSkillId, hoveredSkillId, isMotionPaused]);

  // Pointer parallax ref (-1..1 normalized stage coordinates)
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });

  // Snapshot of focused network target positions when a skill is clicked
  const focusedNetworkMapRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Initialize particle states deterministically at t = 0
  const animStatesRef = useRef<ParticleAnimState[]>(
    LIVING_ORBIT_PARTICLES.map((p) => {
      const ribbon = ORBITAL_RIBBONS[p.ribbonIndex];
      const init = evaluateRibbonTrajectory(p, ribbon, 0);
      return {
        x: init.x,
        y: init.y,
        scale: init.scale,
        opacity: init.opacity,
        isVisible: init.isVisibleInAperture,
      };
    })
  );

  // Recompute focused satellite coordinates whenever focusedSkillId or selectedCategoryId changes
  useEffect(() => {
    if (!focusedSkillId) {
      focusedNetworkMapRef.current.clear();
      return;
    }

    const currentSnapshot = new Map<string, { x: number; y: number; isVisible: boolean }>();
    LIVING_ORBIT_PARTICLES.forEach((p, idx) => {
      if (selectedCategoryId) {
        const isInCat = p.skill.categoryId === selectedCategoryId;
        currentSnapshot.set(p.skill.id, {
          x: isInCat ? p.categoryFormationPos.x : p.recessedPos.x,
          y: isInCat ? p.categoryFormationPos.y : p.recessedPos.y,
          isVisible: isInCat,
        });
      } else {
        const st = animStatesRef.current[idx];
        if (st) {
          currentSnapshot.set(p.skill.id, {
            x: st.x,
            y: st.y,
            isVisible: st.opacity > 0.25,
          });
        }
      }
    });

    focusedNetworkMapRef.current = computeFocusedNetworkPositions(
      focusedSkillId,
      currentSnapshot
    );
  }, [focusedSkillId, selectedCategoryId]);

  // Active skill (focused takes priority over hovered for relationship filaments)
  const activeSkillId = focusedSkillId || hoveredSkillId;
  const activeSkill = useMemo(
    () => (activeSkillId ? SKILLS_DATA.find((s) => s.id === activeSkillId) || null : null),
    [activeSkillId]
  );

  const focusedSkill = useMemo(
    () => (focusedSkillId ? SKILLS_DATA.find((s) => s.id === focusedSkillId) || null : null),
    [focusedSkillId]
  );

  const activeRelatedIds = useMemo(() => {
    if (!activeSkillId) return [];
    return getRelatedSkillIds(activeSkillId);
  }, [activeSkillId]);

  const activeRelatedSet = useMemo(() => new Set(activeRelatedIds), [activeRelatedIds]);

  const particleIndexById = useMemo(() => {
    const map = new Map<string, number>();
    LIVING_ORBIT_PARTICLES.forEach((p, idx) => map.set(p.skill.id, idx));
    return map;
  }, []);

  // Active category metadata when a category pill is selected
  const selectedCategoryMeta = useMemo(
    () =>
      selectedCategoryId
        ? SKILL_CATEGORIES.find((c) => c.id === selectedCategoryId) || null
        : null,
    [selectedCategoryId]
  );

  // Pointer move handler on the desktop stage
  const handleStageMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    pointerTargetRef.current = {
      x: Math.max(-1, Math.min(1, nx)) * 2.2,
      y: Math.max(-1, Math.min(1, ny)) * 1.5,
    };
  }, []);

  const handleStageMouseLeave = useCallback(() => {
    pointerTargetRef.current = { x: 0, y: 0 };
  }, []);

  // 60fps continuous Living Orbit animation & spring interpolation loop
  useEffect(() => {
    if (isMobile) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId: number | null = null;
    let lastTime = performance.now();
    let orbitalTimeSec = 14.5; // Rich initial phase with balanced Core & Professional distribution
    let floatTimeSec = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const {
        selectedCategoryId: catId,
        focusedSkillId: focusId,
        hoveredSkillId: hoverId,
        isMotionPaused: paused,
      } = stateRef.current;

      // Smooth pointer parallax interpolation
      const ptrLerp = 1 - Math.exp(-5.0 * dt);
      pointerCurrentRef.current.x +=
        (pointerTargetRef.current.x - pointerCurrentRef.current.x) * ptrLerp;
      pointerCurrentRef.current.y +=
        (pointerTargetRef.current.y - pointerCurrentRef.current.y) * ptrLerp;

      // Advance orbital time with smooth time-dilation on hover/focus
      if (!prefersReducedMotion && !paused) {
        floatTimeSec += dt;
        const speedMultiplier = focusId
          ? 0.0
          : catId
          ? 0.0
          : hoverId
          ? 0.12
          : 1.0;
        orbitalTimeSec += dt * speedMultiplier;
      }

      const focusedRelSet = focusId ? new Set(getRelatedSkillIds(focusId)) : null;
      const hoveredRelSet =
        !focusId && hoverId ? new Set(getRelatedSkillIds(hoverId)) : null;

      const posLerp = 1 - Math.exp(-7.5 * dt);
      const opacityLerp = 1 - Math.exp(-12.0 * dt);

      // Update all 88 particles
      for (let i = 0; i < LIVING_ORBIT_PARTICLES.length; i++) {
        const p = LIVING_ORBIT_PARTICLES[i];
        const ribbon = ORBITAL_RIBBONS[p.ribbonIndex];
        const st = animStatesRef.current[i];

        let targetX = st.x;
        let targetY = st.y;
        let targetScale = 1.0;
        let targetOpacity = 1.0;

        // Vertical micro-oscillation so logos always feel gently suspended in zero-G
        const gentleBobY = prefersReducedMotion || paused
          ? 0
          : Math.sin(floatTimeSec * 1.45 + p.oscillationPhase) * 0.85;

        if (catId) {
          // ─── MODE B: CATEGORY FORMATION (11 skills of selected category) ───
          const isInSelectedCategory = p.skill.categoryId === catId;
          const isSummonedRelated = Boolean(focusId && focusedRelSet?.has(p.skill.id));

          if (isInSelectedCategory) {
            targetX =
              p.categoryFormationPos.x +
              pointerCurrentRef.current.x * ribbon.parallaxFactor;
            targetY =
              p.categoryFormationPos.y +
              gentleBobY +
              pointerCurrentRef.current.y * ribbon.parallaxFactor;
            targetScale = p.categoryFormationPos.scale;
            targetOpacity = 1.0;
          } else if (isSummonedRelated && focusedNetworkMapRef.current.has(p.skill.id)) {
            const netPos = focusedNetworkMapRef.current.get(p.skill.id)!;
            targetX = netPos.x + pointerCurrentRef.current.x * 0.5;
            targetY = netPos.y + gentleBobY;
            targetScale = 1.0;
            targetOpacity = 0.96;
          } else {
            // Unrelated categories smoothly recede into deep peripheral space
            targetX = p.recessedPos.x;
            targetY = p.recessedPos.y;
            targetScale = 0.45;
            targetOpacity = 0.0;
          }
        } else {
          // ─── MODE A: ALL 88 LIVING ORBIT STREAMS ───
          const ribbonEval = evaluateRibbonTrajectory(
            p,
            ribbon,
            orbitalTimeSec,
            pointerCurrentRef.current
          );

          targetX = ribbonEval.x;
          targetY = ribbonEval.y;
          targetScale = ribbonEval.scale;
          targetOpacity = ribbonEval.opacity;

          // If a skill is locked in Focus and this particle is the focused skill or one of its related skills,
          // ensure it is brought into clear stage view even if it was on the back side of the orbit!
          if (focusId && (p.skill.id === focusId || focusedRelSet?.has(p.skill.id))) {
            const netPos = focusedNetworkMapRef.current.get(p.skill.id);
            if (netPos) {
              targetX = netPos.x + pointerCurrentRef.current.x * 0.55;
              targetY = netPos.y + gentleBobY + pointerCurrentRef.current.y * 0.55;
              targetScale = p.skill.id === focusId ? 1.24 : 1.06;
              targetOpacity = 1.0;
            }
          }

          // When wrapping behind the planet (opacity === 0), snap coordinates while invisible
          // so the particle never flies backward across the visible stage
          if (ribbonEval.opacity === 0 && st.opacity < 0.03 && !focusId) {
            st.x = targetX;
            st.y = targetY;
          }
        }

        // Apply focus / hover emphasis & dimming rules
        if (focusId) {
          if (p.skill.id === focusId) {
            targetScale = Math.max(targetScale * 1.18, 1.24);
            targetOpacity = 1.0;
          } else if (focusedRelSet?.has(p.skill.id)) {
            targetScale = Math.max(targetScale * 1.04, 1.04);
            targetOpacity = Math.max(targetOpacity, 0.96);
          } else {
            targetOpacity *= 0.14;
            targetScale *= 0.9;
          }
        } else if (hoverId) {
          if (p.skill.id === hoverId) {
            targetScale *= 1.22;
            targetOpacity = 1.0;
          } else if (hoveredRelSet?.has(p.skill.id)) {
            targetScale *= 1.06;
            targetOpacity = Math.max(targetOpacity, 0.95);
          } else if (targetOpacity > 0.05) {
            targetOpacity *= 0.52;
          }
        }

        // Interpolate state
        st.x += (targetX - st.x) * posLerp;
        st.y += (targetY - st.y) * posLerp;
        st.scale += (targetScale - st.scale) * posLerp;
        st.opacity += (targetOpacity - st.opacity) * opacityLerp;
        st.isVisible = st.opacity > 0.04;

        // Write directly to DOM button element for 60fps zero-re-render smoothness
        const el = buttonRefs.current[i];
        if (el) {
          el.style.left = `${st.x.toFixed(3)}%`;
          el.style.top = `${st.y.toFixed(3)}%`;
          el.style.transform = `translate(-50%, -50%) scale(${st.scale.toFixed(3)})`;
          el.style.opacity = st.opacity.toFixed(3);
          el.style.pointerEvents = st.opacity > 0.2 ? 'auto' : 'none';
          el.style.visibility = st.opacity > 0.02 ? 'visible' : 'hidden';
        }
      }

      // Update curved SVG relationship filaments if a skill is focused or hovered
      const activeId = focusId || hoverId;
      if (activeId) {
        const srcIdx = particleIndexById.get(activeId);
        const srcState = srcIdx !== undefined ? animStatesRef.current[srcIdx] : null;
        const relIds = getRelatedSkillIds(activeId);

        for (let r = 0; r < relIds.length; r++) {
          const pathEl = relationPathRefs.current[r];
          const glowEl = relationGlowPathRefs.current[r];
          const dstIdx = particleIndexById.get(relIds[r]);
          const dstState = dstIdx !== undefined ? animStatesRef.current[dstIdx] : null;

          if (pathEl && srcState && dstState && srcState.opacity > 0.1 && dstState.opacity > 0.1) {
            // Convert percentage coordinates (0..100) to SVG viewBox (1000 x 600)
            const x1 = srcState.x * 10;
            const y1 = srcState.y * 6;
            const x2 = dstState.x * 10;
            const y2 = dstState.y * 6;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.14;
            const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
            pathEl.setAttribute('d', d);
            pathEl.style.opacity = focusId ? '0.85' : '0.55';
            if (glowEl) {
              glowEl.setAttribute('d', d);
              glowEl.style.opacity = focusId ? '0.35' : '0.18';
            }
          } else if (pathEl) {
            pathEl.style.opacity = '0';
            if (glowEl) glowEl.style.opacity = '0';
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isMobile, particleIndexById]);

  if (isMobile) {
    return (
      <MobileLivingOrbit
        selectedCategoryId={selectedCategoryId}
        focusedSkillId={focusedSkillId}
        onSelectCategory={onSelectCategory}
        onSelectSkill={onSelectSkill}
        onClearSkillFocus={onClearSkillFocus}
      />
    );
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* ─── 1. MINIMAL INTEGRATED CATEGORY SELECTOR BAR ─── */}
      <div
        className="relative z-30 flex flex-wrap items-center justify-center gap-1 px-2.5 py-1.5 rounded-2xl bg-[#060218]/65 border border-white/[0.08] backdrop-blur-md mb-2 max-w-full"
        role="tablist"
        aria-label="Filter technologies by category"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategoryId === null}
          onClick={() => onSelectCategory(null)}
          className={`px-2.5 py-1 rounded-xl font-mono text-[10px] tracking-[0.09em] uppercase whitespace-nowrap transition-all duration-200 cursor-pointer border ${
            selectedCategoryId === null
              ? 'bg-purple-500/25 border-purple-400/60 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
              : 'bg-transparent border-transparent text-white/55 hover:text-white/90 hover:bg-white/[0.04]'
          }`}
        >
          All 88 · Orbit
        </button>

        <span className="h-3.5 w-[1px] bg-white/10 hidden sm:inline-block" aria-hidden="true" />

        {SKILL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`px-2 py-1 rounded-xl font-mono text-[10px] tracking-[0.08em] uppercase whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? 'bg-purple-500/25 border-purple-400/60 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]'
                  : 'bg-transparent border-transparent text-white/55 hover:text-white/90 hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-purple-300/65 mr-1">{cat.number}</span>
              <span>{COMPACT_CATEGORY_TITLES[cat.id] || cat.title}</span>
            </button>
          );
        })}

        <span className="h-3.5 w-[1px] bg-white/10 hidden lg:inline-block" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setIsMotionPaused((prev) => !prev)}
          aria-label={isMotionPaused ? 'Resume orbital motion' : 'Pause orbital motion'}
          className="px-2 py-1 rounded-xl font-mono text-[10px] tracking-[0.1em] uppercase whitespace-nowrap text-white/45 hover:text-white/85 hover:bg-white/[0.04] transition-colors cursor-pointer"
          title={isMotionPaused ? 'Resume orbital flow' : 'Pause orbital flow'}
        >
          {isMotionPaused ? '▶ Flow' : '❚❚ Pause'}
        </button>
      </div>

      {/* ─── 2. SUBTLE CONTEXTUAL SUBLINE WHEN A CATEGORY IS SELECTED ─── */}
      <div className="h-6 flex items-center justify-center text-center mb-1">
        {selectedCategoryMeta ? (
          <div className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-purple-200/80">
            <span>
              {selectedCategoryMeta.number} · {selectedCategoryMeta.title} —{' '}
              <span className="text-white/50">{selectedCategoryMeta.subtitle}</span>
            </span>
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className="text-[10px] text-purple-300 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Restore Full Orbit
            </button>
          </div>
        ) : (
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/35 select-none">
            {focusedSkill
              ? `Focused: ${focusedSkill.name} · Click any connected technology or press Esc to release`
              : '4 Counter-Flowing Orbital Streams · Click any technology logo to lock focus & inspect connections'}
          </p>
        )}
      </div>

      {/* ─── 3. LIVING ORBIT SPATIAL STAGE (IN FRONT OF THE PURPLE PLANET) ─── */}
      <div
        ref={stageRef}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
        onClick={() => {
          if (focusedSkillId) onClearSkillFocus();
        }}
        className="relative w-full h-[560px] lg:h-[610px] select-none overflow-visible"
      >
        {/* Subtle Curved Orbital Ribbon Guides & Selective Relationship Filaments */}
        <svg
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="livingOrbitArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
              <stop offset="18%" stopColor="rgba(168, 85, 247, 0.16)" />
              <stop offset="50%" stopColor="rgba(216, 180, 254, 0.24)" />
              <stop offset="82%" stopColor="rgba(168, 85, 247, 0.16)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
            </linearGradient>
          </defs>

          {/* Whisper-subtle curved orbital trajectory arcs */}
          {!selectedCategoryId && (
            <g className="transition-opacity duration-700" style={{ opacity: focusedSkillId ? 0.25 : 0.75 }}>
              {/* Upper Professional Arc */}
              <path
                d="M 40 174 Q 500 72 960 174"
                fill="none"
                stroke="url(#livingOrbitArcGrad)"
                strokeWidth="1"
                strokeDasharray="3 7"
              />
              {/* Primary Core Equatorial Arc */}
              <path
                d="M 40 219 Q 500 273 960 219"
                fill="none"
                stroke="url(#livingOrbitArcGrad)"
                strokeWidth="1.25"
              />
              {/* Lower Professional Arc */}
              <path
                d="M 40 330 Q 500 408 960 330"
                fill="none"
                stroke="url(#livingOrbitArcGrad)"
                strokeWidth="1"
                strokeDasharray="3 7"
              />
              {/* Deep Ecosystem Horizon Arc */}
              <path
                d="M 60 429 Q 500 519 940 429"
                fill="none"
                stroke="url(#livingOrbitArcGrad)"
                strokeWidth="0.85"
                strokeDasharray="2 8"
              />
            </g>
          )}

          {/* Selective Relationship Filaments (Only rendered when a skill is focused or hovered) */}
          {activeSkill &&
            activeRelatedIds.map((relId, idx) => (
              <g key={`${activeSkill.id}-${relId}`}>
                <path
                  ref={(el) => {
                    relationGlowPathRefs.current[idx] = el;
                  }}
                  fill="none"
                  stroke={activeSkill.brandColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{ opacity: 0, filter: 'blur(4px)', transition: 'opacity 180ms ease-out' }}
                />
                <path
                  ref={(el) => {
                    relationPathRefs.current[idx] = el;
                  }}
                  fill="none"
                  stroke="rgba(243, 232, 255, 0.85)"
                  strokeWidth="1.35"
                  strokeDasharray="5 5"
                  strokeLinecap="round"
                  style={{ opacity: 0, transition: 'opacity 180ms ease-out' }}
                />
              </g>
            ))}
        </svg>

        {/* 88 Floating Technology Logos (The Visual Heroes) */}
        {LIVING_ORBIT_PARTICLES.map((particle, idx) => {
          const { skill, tier, desktopSize } = particle;
          const isFocused = focusedSkillId === skill.id;
          const isHovered = hoveredSkillId === skill.id;
          const isRelated = activeRelatedSet.has(skill.id);

          // Show label when:
          // - hovered or focused
          // - related to focused/hovered skill
          // - in Category Formation mode (11 skills on stage)
          // - Core tier in Living Orbit mode (subtle caption under flagship marks)
          const showLabel =
            isFocused ||
            isHovered ||
            isRelated ||
            Boolean(selectedCategoryId) ||
            tier === 'core';

          const zLayer = isFocused
            ? 60
            : isHovered
            ? 55
            : isRelated
            ? 45
            : tier === 'core'
            ? 30
            : tier === 'professional'
            ? 20
            : 12;

          return (
            <button
              key={skill.id}
              ref={(el) => {
                buttonRefs.current[idx] = el;
              }}
              type="button"
              aria-label={`${skill.name} (${tier} tier)`}
              aria-pressed={isFocused}
              onClick={(e) => {
                e.stopPropagation();
                if (isFocused) {
                  onClearSkillFocus();
                } else {
                  onSelectSkill(skill.id);
                }
              }}
              onMouseEnter={() => onHoverSkill(skill.id)}
              onMouseLeave={onLeaveSkill}
              onFocus={() => onHoverSkill(skill.id)}
              onBlur={onLeaveSkill}
              className="group absolute flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/80 rounded-2xl"
              style={{
                left: `${animStatesRef.current[idx].x}%`,
                top: `${animStatesRef.current[idx].y}%`,
                transform: `translate(-50%, -50%) scale(${animStatesRef.current[idx].scale})`,
                opacity: animStatesRef.current[idx].opacity,
                zIndex: zLayer,
                willChange: 'left, top, transform, opacity',
              }}
            >
              {/* Pure Floating Brand Mark with Restrained Branded Aura */}
              <div
                className="relative flex items-center justify-center transition-transform duration-300 ease-out"
                style={{
                  width: desktopSize,
                  height: desktopSize,
                  filter: isFocused
                    ? `drop-shadow(0 0 24px ${skill.brandColor}) drop-shadow(0 0 10px rgba(255,255,255,0.55))`
                    : isHovered
                    ? `drop-shadow(0 0 20px ${skill.brandColor}cc) drop-shadow(0 0 6px rgba(255,255,255,0.4))`
                    : isRelated
                    ? `drop-shadow(0 0 16px ${skill.brandColor}99)`
                    : tier === 'core'
                    ? `drop-shadow(0 6px 18px ${skill.brandColor}60)`
                    : `drop-shadow(0 4px 12px ${skill.brandColor}40)`,
                }}
              >
                {/* Subtle focus/hover ambient halo behind the authentic SVG mark (not a generic circle container) */}
                {(isFocused || isHovered) && (
                  <span
                    className="absolute -inset-2.5 rounded-full pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle, ${skill.brandColor}35 0%, transparent 70%)`,
                    }}
                  />
                )}

                <TechLogo id={skill.id} name={skill.name} size={desktopSize} />
              </div>

              {/* Clean, Restrained Floating Technology Label */}
              <span
                className={`mt-1.5 font-mono whitespace-nowrap pointer-events-none transition-all duration-200 ${
                  isFocused || isHovered
                    ? 'text-[11px] font-semibold tracking-wider text-white px-2.5 py-0.5 rounded-md bg-[#060218]/90 border border-white/20 shadow-[0_4px_14px_rgba(0,0,0,0.65)] opacity-100'
                    : isRelated
                    ? 'text-[10px] tracking-wider text-purple-100 px-2 py-0.5 rounded-md bg-[#060218]/80 border border-purple-400/30 opacity-100'
                    : selectedCategoryId
                    ? 'text-[10.5px] tracking-wider text-white/90 px-2 py-0.5 rounded-md bg-[#060218]/65 border border-white/10 opacity-95'
                    : showLabel
                    ? 'text-[10px] tracking-wider text-white/80 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] opacity-85 group-hover:opacity-100'
                    : 'text-[10px] tracking-wider text-white/0 opacity-0'
                }`}
              >
                {skill.name}
              </span>
            </button>
          );
        })}

        {/* ─── 4. COMPACT FLOATING INSPECTOR CARD (ONLY WHEN A SKILL IS FOCUSED) ─── */}
        {focusedSkill && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-full max-w-[660px] px-4 z-[70]">
            <SkillFocusCard
              skill={focusedSkill}
              onSelectSkill={onSelectSkill}
              onClose={onClearSkillFocus}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LivingOrbitStage;
