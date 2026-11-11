import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';
import {
  LIVING_ORBIT_PARTICLES,
  SPATIAL_SPLINES,
  evaluateSculptureTrajectory,
  computeFocusedNetworkPositions,
  buildTrajectorySvgPath,
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

const EDITORIAL_CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  graphics: 'Spatial & 3D',
  backend: 'Backend',
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
  depth: number;
  opacity: number;
  isVisible: boolean;
}

/**
 * LivingOrbitStage — LIVING ORBIT 2.0 (Orbital Kinetic Sculpture)
 *
 * - 8 verified Featured Technology Anchors with art-directed optical scales (58–76px)
 *   and multi-harmonic zero-G organic floating.
 * - 3 distinct trajectory systems:
 *   • Orbit A (Inner Celestial Flow): Tilted asymmetric elliptical arc framing the planet
 *   • Orbit B (Kinetic Sweep): Diagonal counter-flowing cubic Bézier sweep
 *   • Orbit C (Deep Horizon): Wide peripheral deep-space trajectory
 * - GPU-composited `transform: translate3d(...)` animation loop (measured via ResizeObserver,
 *   zero per-frame `left`/`top` layout thrashing, auto-paused offscreen or when tab hidden).
 * - Focus Dilation: Selecting a skill stabilizes its network while the surrounding orbital
 *   universe continues drifting gently in dilated time.
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
  const stageBoundsRef = useRef<{ width: number; height: number }>({
    width: 1360,
    height: 630,
  });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const relationPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const relationGlowPathRefs = useRef<(SVGPathElement | null)[]>([]);

  const [isMotionPaused, setIsMotionPaused] = useState(false);

  // Pre-compute related sets outside the 60fps loop to avoid per-frame allocations
  const focusedRelSetMemo = useMemo(
    () => (focusedSkillId ? new Set(getRelatedSkillIds(focusedSkillId).slice(0, 5)) : null),
    [focusedSkillId]
  );
  const hoveredRelSetMemo = useMemo(
    () =>
      !focusedSkillId && hoveredSkillId
        ? new Set(getRelatedSkillIds(hoveredSkillId).slice(0, 5))
        : null,
    [focusedSkillId, hoveredSkillId]
  );

  const stateRef = useRef({
    selectedCategoryId,
    focusedSkillId,
    hoveredSkillId,
    isMotionPaused,
    focusedRelSet: focusedRelSetMemo,
    hoveredRelSet: hoveredRelSetMemo,
  });
  useEffect(() => {
    stateRef.current = {
      selectedCategoryId,
      focusedSkillId,
      hoveredSkillId,
      isMotionPaused,
      focusedRelSet: focusedRelSetMemo,
      hoveredRelSet: hoveredRelSetMemo,
    };
  }, [
    selectedCategoryId,
    focusedSkillId,
    hoveredSkillId,
    isMotionPaused,
    focusedRelSetMemo,
    hoveredRelSetMemo,
  ]);

  // Global parallax offset (-1..1) + local cursor position in stage % (0..100) for magnetic pull
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const cursorStagePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 50,
    y: 50,
    active: false,
  });

  // Snapshot of focused network target positions when a skill is clicked
  const focusedNetworkMapRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Initialize particle states deterministically at t = 18.0s
  const animStatesRef = useRef<ParticleAnimState[]>(
    LIVING_ORBIT_PARTICLES.map((p) => {
      const init = evaluateSculptureTrajectory(p, 18.0);
      return {
        x: init.x,
        y: init.y,
        scale: init.scale,
        depth: init.depth,
        opacity: init.opacity,
        isVisible: init.isVisibleInAperture,
      };
    })
  );

  // Recompute collision-free satellite coordinates whenever focusedSkillId or selectedCategoryId changes
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

  // Active skill (focused takes priority over hovered)
  const activeSkillId = focusedSkillId || hoveredSkillId;
  const activeSkill = useMemo(
    () => (activeSkillId ? SKILLS_DATA.find((s) => s.id === activeSkillId) || null : null),
    [activeSkillId]
  );

  const focusedSkill = useMemo(
    () => (focusedSkillId ? SKILLS_DATA.find((s) => s.id === focusedSkillId) || null : null),
    [focusedSkillId]
  );

  const selectedCategory = useMemo(
    () =>
      selectedCategoryId
        ? SKILL_CATEGORIES.find((c) => c.id === selectedCategoryId) || null
        : null,
    [selectedCategoryId]
  );

  // Highlight 3–5 explicitly mapped related technologies
  const activeRelatedIds = useMemo(() => {
    if (!activeSkillId) return [];
    return getRelatedSkillIds(activeSkillId).slice(0, 5);
  }, [activeSkillId]);

  const activeRelatedSet = useMemo(() => new Set(activeRelatedIds), [activeRelatedIds]);

  // Pre-build SVG trajectory paths for Orbit A, Orbit B, and Orbit C
  const trajectoryPaths = useMemo(
    () =>
      SPATIAL_SPLINES.map((orbit) => ({
        id: orbit.id,
        d: buildTrajectorySvgPath(orbit, 10, 6.2),
      })),
    []
  );

  const particleIndexById = useMemo(() => {
    const map = new Map<string, number>();
    LIVING_ORBIT_PARTICLES.forEach((p, idx) => map.set(p.skill.id, idx));
    return map;
  }, []);

  const handleStageMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      stageBoundsRef.current = { width: rect.width, height: rect.height };
    }
    const pctX = ((e.clientX - rect.left) / (rect.width || 1)) * 100;
    const pctY = ((e.clientY - rect.top) / (rect.height || 1)) * 100;
    const nx = (pctX / 100) * 2 - 1;
    const ny = (pctY / 100) * 2 - 1;

    pointerTargetRef.current = {
      x: Math.max(-1, Math.min(1, nx)) * 2.1,
      y: Math.max(-1, Math.min(1, ny)) * 1.45,
    };
    cursorStagePosRef.current = {
      x: pctX,
      y: pctY,
      active: true,
    };
  }, []);

  const handleStageMouseLeave = useCallback(() => {
    pointerTargetRef.current = { x: 0, y: 0 };
    cursorStagePosRef.current.active = false;
  }, []);

  // Measure stage dimensions once and on resize, and run GPU-composited 60fps animation loop
  useEffect(() => {
    if (isMobile) return;

    const stageEl = stageRef.current;
    if (!stageEl) return;

    const updateStageBounds = () => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        stageBoundsRef.current = { width: rect.width, height: rect.height };
      }
    };
    updateStageBounds();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateStageBounds())
        : null;
    resizeObserver?.observe(stageEl);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId: number | null = null;
    let isInViewport = true;
    let isDocumentVisible = typeof document !== 'undefined' ? !document.hidden : true;
    let lastTime = performance.now();
    let sculptureTimeSec = 18.0;
    let breathTimeSec = 0;

    const tick = (now: number) => {
      if (!isInViewport || !isDocumentVisible) {
        rafId = null;
        return;
      }

      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const {
        selectedCategoryId: catId,
        focusedSkillId: focusId,
        hoveredSkillId: hoverId,
        isMotionPaused: paused,
        focusedRelSet,
        hoveredRelSet,
      } = stateRef.current;

      // Smooth global parallax interpolation
      const ptrLerp = 1 - Math.exp(-4.5 * dt);
      pointerCurrentRef.current.x +=
        (pointerTargetRef.current.x - pointerCurrentRef.current.x) * ptrLerp;
      pointerCurrentRef.current.y +=
        (pointerTargetRef.current.y - pointerCurrentRef.current.y) * ptrLerp;

      if (!prefersReducedMotion && !paused) {
        breathTimeSec += dt;
        // Focus Dilation (Section 8.E):
        // When a skill is focused, slow the orbital universe down gently (0.22x)
        // rather than freezing the entire cosmos to 0.
        const speedMultiplier = focusId
          ? 0.22
          : catId
          ? 0.18
          : hoverId
          ? 0.38
          : 1.0;
        sculptureTimeSec += dt * speedMultiplier;
      }

      const posLerp = 1 - Math.exp(-7.2 * dt);
      const opacityLerp = 1 - Math.exp(-10.5 * dt);
      const cursor = cursorStagePosRef.current;
      const { width: stageW, height: stageH } = stageBoundsRef.current;

      for (let i = 0; i < LIVING_ORBIT_PARTICLES.length; i++) {
        const p = LIVING_ORBIT_PARTICLES[i];
        const st = animStatesRef.current[i];

        let targetX = st.x;
        let targetY = st.y;
        let targetScale = 1.0;
        let targetDepth = 0.9;
        let targetOpacity = 1.0;

        // Multi-harmonic organic floating per logo (Section 8.B)
        const gentleBobY =
          prefersReducedMotion || paused
            ? 0
            : Math.sin(breathTimeSec * p.floatFreq + p.oscillationPhase) * 0.72 +
              Math.cos(breathTimeSec * (p.floatFreq * 0.57) + p.secondaryPhase) * 0.28;
        const gentleBobX =
          prefersReducedMotion || paused
            ? 0
            : Math.cos(breathTimeSec * (p.floatFreq * 0.82) + p.oscillationPhase) * 0.44 +
              Math.sin(breathTimeSec * (p.floatFreq * 0.51) + p.secondaryPhase) * 0.2;

        if (catId) {
          // ─── ASYMMETRIC CATEGORY SCULPTURE MODE (11 Featured Category Technologies + Soft Peripheral Context) ───
          const isInSelectedCategory = p.skill.categoryId === catId;
          const isFocusNetworkMember = Boolean(
            focusId && (p.skill.id === focusId || focusedRelSet?.has(p.skill.id))
          );

          if (isFocusNetworkMember && focusedNetworkMapRef.current.has(p.skill.id)) {
            const netPos = focusedNetworkMapRef.current.get(p.skill.id)!;
            targetX = netPos.x + pointerCurrentRef.current.x * 0.5;
            targetY = netPos.y + (p.skill.id === focusId ? 0 : gentleBobY * 0.6);
            targetScale = p.skill.id === focusId ? 1.2 : 1.02;
            targetDepth = 1.04;
            targetOpacity = 1.0;
          } else if (isInSelectedCategory) {
            targetX =
              p.categoryFormationPos.x +
              gentleBobX +
              pointerCurrentRef.current.x * p.categoryFormationPos.depth * 0.82;
            targetY =
              p.categoryFormationPos.y +
              gentleBobY +
              pointerCurrentRef.current.y * p.categoryFormationPos.depth * 0.82;
            targetScale = p.categoryFormationPos.scale;
            targetDepth = p.categoryFormationPos.depth;
            targetOpacity = 1.0;
          } else if (p.isFeaturedAnchor) {
            // Keep Featured Anchors softly visible in deep peripheral space so unrelated elements
            // reduce without disappearing abruptly (Section 7)
            targetX = p.recessedPos.x + gentleBobX * 0.35;
            targetY = p.recessedPos.y + gentleBobY * 0.35;
            targetScale = 0.62;
            targetDepth = 0.55;
            targetOpacity = focusId ? 0.06 : 0.14;
          } else {
            targetX = p.recessedPos.x;
            targetY = p.recessedPos.y;
            targetScale = 0.48;
            targetDepth = 0.5;
            targetOpacity = 0.0;
          }
        } else {
          // ─── FULL LIVING ORBIT 2.0 SCULPTURE MODE (8 Featured Anchors + Orbits A, B, C) ───
          const evalState = evaluateSculptureTrajectory(
            p,
            sculptureTimeSec,
            pointerCurrentRef.current
          );

          targetX = evalState.x;
          targetY = evalState.y;
          targetScale = evalState.scale;
          targetDepth = evalState.depth;
          targetOpacity = evalState.opacity;

          if (focusId && (p.skill.id === focusId || focusedRelSet?.has(p.skill.id))) {
            const netPos = focusedNetworkMapRef.current.get(p.skill.id);
            if (netPos) {
              targetX = netPos.x + pointerCurrentRef.current.x * 0.5;
              targetY =
                netPos.y +
                (p.skill.id === focusId ? 0 : gentleBobY * 0.65) +
                pointerCurrentRef.current.y * 0.5;
              targetScale = p.skill.id === focusId ? 1.2 : 1.04;
              targetDepth = 1.05;
              targetOpacity = 1.0;
            }
          }

          // Invisible wrap snap on far side of orbit
          if (evalState.opacity === 0 && st.opacity < 0.03 && !focusId) {
            st.x = targetX;
            st.y = targetY;
          }
        }

        // Localized Magnetic Response when pointer approaches a technology logo (Section 8.D)
        if (cursor.active && targetOpacity > 0.2 && !focusId) {
          const mdx = cursor.x - targetX;
          const mdy = cursor.y - targetY;
          const dist = Math.hypot(mdx, mdy);
          const magRadius = 18.5;
          if (dist < magRadius && dist > 0.1) {
            const pull = (1 - dist / magRadius) ** 2 * 0.24;
            targetX += mdx * pull;
            targetY += mdy * pull;
            targetScale *= 1 + (1 - dist / magRadius) * 0.065;
          }
        }

        // Focus Dilation & Hover visual hierarchy (Section 8.E)
        if (focusId) {
          if (p.skill.id === focusId) {
            targetScale = Math.max(targetScale * 1.16, 1.22);
            targetOpacity = 1.0;
          } else if (focusedRelSet?.has(p.skill.id)) {
            targetScale = Math.max(targetScale * 1.04, 1.02);
            targetOpacity = Math.max(targetOpacity, 0.95);
          } else {
            // Keep surrounding universe gently visible & drifting in dilated background
            targetOpacity *= 0.18;
            targetScale *= 0.88;
          }
        } else if (hoverId) {
          if (p.skill.id === hoverId) {
            targetScale *= 1.16;
            targetOpacity = 1.0;
          } else if (hoveredRelSet?.has(p.skill.id)) {
            targetScale *= 1.05;
            targetOpacity = Math.max(targetOpacity, 0.93);
          } else if (targetOpacity > 0.05) {
            targetOpacity *= 0.62;
          }
        }

        st.x += (targetX - st.x) * posLerp;
        st.y += (targetY - st.y) * posLerp;
        st.scale += (targetScale - st.scale) * posLerp;
        st.depth += (targetDepth - st.depth) * posLerp;
        st.opacity += (targetOpacity - st.opacity) * opacityLerp;
        st.isVisible = st.opacity > 0.04;
      }

      // Smooth inter-particle spatial separation so crossing trajectories never overlap logos
      if (!catId && !focusId) {
        const minDx = 8.2;
        const minDy = 11.2;
        for (let i = 0; i < LIVING_ORBIT_PARTICLES.length; i++) {
          const stA = animStatesRef.current[i];
          if (stA.opacity < 0.15) continue;
          const pA = LIVING_ORBIT_PARTICLES[i];

          for (let j = i + 1; j < LIVING_ORBIT_PARTICLES.length; j++) {
            const stB = animStatesRef.current[j];
            if (stB.opacity < 0.15) continue;
            const pB = LIVING_ORBIT_PARTICLES[j];

            const dx = stB.x - stA.x;
            const dy = stB.y - stA.y;
            const normDistSq = (dx / minDx) ** 2 + (dy / minDy) ** 2;
            if (normDistSq < 1.0 && normDistSq > 0.0001) {
              const normDist = Math.sqrt(normDistSq);
              const overlap = (1.0 - normDist) * 0.45;
              const ux = dx / normDist;
              const uy = dy / normDist;

              // Featured anchors remain stable while trajectory travelers deflect around them
              if (pA.isFeaturedAnchor && !pB.isFeaturedAnchor) {
                stB.x = Math.max(5, Math.min(95, stB.x + ux * overlap * 1.6));
                stB.y = Math.max(7, Math.min(92, stB.y + uy * overlap * 1.6));
              } else if (!pA.isFeaturedAnchor && pB.isFeaturedAnchor) {
                stA.x = Math.max(5, Math.min(95, stA.x - ux * overlap * 1.6));
                stA.y = Math.max(7, Math.min(92, stA.y - uy * overlap * 1.6));
              } else if (!pA.isFeaturedAnchor && !pB.isFeaturedAnchor) {
                stA.x = Math.max(5, Math.min(95, stA.x - ux * overlap * 0.8));
                stA.y = Math.max(7, Math.min(92, stA.y - uy * overlap * 0.8));
                stB.x = Math.max(5, Math.min(95, stB.x + ux * overlap * 0.8));
                stB.y = Math.max(7, Math.min(92, stB.y + uy * overlap * 0.8));
              }
            }
          }
        }
      }

      // Apply GPU-composited transform and opacity to DOM elements
      for (let i = 0; i < LIVING_ORBIT_PARTICLES.length; i++) {
        const st = animStatesRef.current[i];
        const el = buttonRefs.current[i];
        if (el) {
          const px = (st.x / 100) * stageW;
          const py = (st.y / 100) * stageH;
          // GPU-composited transform-only position + scale update (no per-frame left/top layout reflow)
          el.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(
            2
          )}px, 0) translate(-50%, -50%) scale(${st.scale.toFixed(3)})`;
          el.style.opacity = st.opacity.toFixed(3);
          el.style.pointerEvents = st.opacity > 0.24 ? 'auto' : 'none';
          el.style.visibility = st.opacity > 0.02 ? 'visible' : 'hidden';
        }
      }

      // Update selective relationship filaments
      const activeId = focusId || hoverId;
      if (activeId) {
        const srcIdx = particleIndexById.get(activeId);
        const srcState = srcIdx !== undefined ? animStatesRef.current[srcIdx] : null;
        const relIds = getRelatedSkillIds(activeId).slice(0, 5);

        for (let r = 0; r < 5; r++) {
          const pathEl = relationPathRefs.current[r];
          const glowEl = relationGlowPathRefs.current[r];
          const relId = relIds[r];
          const dstIdx = relId ? particleIndexById.get(relId) : undefined;
          const dstState = dstIdx !== undefined ? animStatesRef.current[dstIdx] : null;

          if (pathEl && srcState && dstState && srcState.opacity > 0.1 && dstState.opacity > 0.1) {
            const x1 = srcState.x * 10;
            const y1 = srcState.y * 6.2;
            const x2 = dstState.x * 10;
            const y2 = dstState.y * 6.2;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.12;
            const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
            pathEl.setAttribute('d', d);
            pathEl.style.opacity = focusId ? '0.8' : '0.44';
            if (glowEl) {
              glowEl.setAttribute('d', d);
              glowEl.style.opacity = focusId ? '0.28' : '0.14';
            }
          } else if (pathEl) {
            pathEl.style.opacity = '0';
            if (glowEl) glowEl.style.opacity = '0';
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const startLoopIfEligible = () => {
      if (rafId === null && isInViewport && isDocumentVisible) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const viewportObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              isInViewport = entry.isIntersecting;
              if (isInViewport) {
                updateStageBounds();
                startLoopIfEligible();
              } else if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
              }
            },
            { threshold: 0.02 }
          )
        : null;
    viewportObserver?.observe(stageEl);

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      if (isDocumentVisible) {
        startLoopIfEligible();
      } else if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startLoopIfEligible();

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      viewportObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
      {/* ─── 1. SUBTLE EDITORIAL TYPOGRAPHIC CATEGORY NAVIGATION ─── */}
      <nav
        className="relative z-30 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 py-1.5 mb-2 border-b border-white/[0.06] px-4"
        role="tablist"
        aria-label="Technology disciplines"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategoryId === null}
          onClick={() => onSelectCategory(null)}
          className={`relative py-1 font-mono text-[10.5px] tracking-[0.2em] uppercase transition-colors duration-200 cursor-pointer ${
            selectedCategoryId === null
              ? 'text-white after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-[7px] after:h-[1.5px] after:bg-purple-400 after:shadow-[0_0_10px_rgba(168,85,247,0.8)]'
              : 'text-white/40 hover:text-white/80'
          }`}
        >
          All
        </button>

        {SKILL_CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`relative py-1 font-mono text-[10.5px] tracking-[0.16em] uppercase transition-colors duration-200 cursor-pointer ${
                isSelected
                  ? 'text-white after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-[7px] after:h-[1.5px] after:bg-purple-400 after:shadow-[0_0_10px_rgba(168,85,247,0.8)]'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              <span className="text-purple-300/45 mr-1 text-[9.5px]">{cat.number}</span>
              <span>{EDITORIAL_CATEGORY_LABELS[cat.id] || cat.title}</span>
            </button>
          );
        })}

        {/* Discreet icon-only motion toggle */}
        <button
          type="button"
          onClick={() => setIsMotionPaused((prev) => !prev)}
          aria-label={isMotionPaused ? 'Resume orbital motion' : 'Pause orbital motion'}
          title={isMotionPaused ? 'Resume motion' : 'Pause motion'}
          className="ml-1 w-5 h-5 flex items-center justify-center rounded-full text-[9px] text-white/30 hover:text-white/75 transition-colors cursor-pointer"
        >
          {isMotionPaused ? '▶' : '❚❚'}
        </button>
      </nav>

      {/* Subtle Category Subtitle & Return to All Action when Filtering */}
      {selectedCategory && (
        <div className="relative z-30 flex items-center gap-3 mb-1 text-xs text-white/60">
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-purple-200/80">
            {selectedCategory.number} · {selectedCategory.title}
          </span>
          <span aria-hidden="true" className="text-white/25">
            ·
          </span>
          <span className="hidden sm:inline text-[11px] text-white/50">
            {selectedCategory.subtitle}
          </span>
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="ml-1 font-mono text-[10px] tracking-[0.14em] uppercase text-purple-300/80 hover:text-white transition-colors cursor-pointer underline underline-offset-4 decoration-purple-400/40"
          >
            ← Return to All
          </button>
        </div>
      )}

      {/* ─── 2. ORBITAL KINETIC SCULPTURE STAGE ─── */}
      <div
        ref={stageRef}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
        onClick={() => {
          if (focusedSkillId) onClearSkillFocus();
        }}
        className="relative w-full h-[580px] lg:h-[630px] select-none overflow-visible"
      >
        {/* Whisper-faint 3 Trajectory System Filaments (Orbit A, B, C) & Selective Focus Connections */}
        <svg
          viewBox="0 0 1000 620"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Orbit A: Inner Celestial Flow gradient */}
            <linearGradient id="orbitInnerCelestialGrad" x1="15%" y1="75%" x2="85%" y2="20%">
              <stop offset="0%" stopColor="rgba(192, 132, 252, 0)" />
              <stop offset="22%" stopColor="rgba(216, 180, 254, 0.18)" />
              <stop offset="55%" stopColor="rgba(233, 213, 255, 0.24)" />
              <stop offset="82%" stopColor="rgba(192, 132, 252, 0.16)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
            </linearGradient>
            {/* Orbit B: Kinetic Sweep gradient */}
            <linearGradient id="orbitKineticSweepGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
              <stop offset="28%" stopColor="rgba(168, 85, 247, 0.14)" />
              <stop offset="70%" stopColor="rgba(192, 132, 252, 0.17)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </linearGradient>
            {/* Orbit C: Deep Horizon gradient */}
            <linearGradient id="orbitDeepHorizonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
              <stop offset="35%" stopColor="rgba(147, 51, 234, 0.09)" />
              <stop offset="70%" stopColor="rgba(168, 85, 247, 0.11)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </linearGradient>
          </defs>

          {/* 3 Distinct Spatial Trajectory Traces: Orbit A (Inner Celestial), Orbit B (Kinetic Sweep), Orbit C (Deep Horizon) */}
          {!selectedCategoryId && (
            <g
              className="transition-opacity duration-700"
              style={{ opacity: focusedSkillId ? 0.22 : 0.78 }}
            >
              {trajectoryPaths.map((tp, idx) => (
                <path
                  key={tp.id}
                  d={tp.d}
                  fill="none"
                  stroke={
                    idx === 0
                      ? 'url(#orbitInnerCelestialGrad)'
                      : idx === 1
                      ? 'url(#orbitKineticSweepGrad)'
                      : 'url(#orbitDeepHorizonGrad)'
                  }
                  strokeWidth={idx === 0 ? '1.25' : idx === 1 ? '0.95' : '0.75'}
                  strokeDasharray={idx === 2 ? '2 10' : idx === 1 ? '5 8' : undefined}
                />
              ))}
            </g>
          )}

          {/* Selective Relationship Filaments (Rendered only when a skill is focused or hovered) */}
          {activeSkill &&
            activeRelatedIds.map((relId, idx) => (
              <g key={`${activeSkill.id}-${relId}`}>
                <path
                  ref={(el) => {
                    relationGlowPathRefs.current[idx] = el;
                  }}
                  fill="none"
                  stroke={activeSkill.brandColor}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  style={{ opacity: 0, filter: 'blur(4px)', transition: 'opacity 180ms ease-out' }}
                />
                <path
                  ref={(el) => {
                    relationPathRefs.current[idx] = el;
                  }}
                  fill="none"
                  stroke="rgba(243, 232, 255, 0.82)"
                  strokeWidth="1.2"
                  strokeDasharray="4 5"
                  strokeLinecap="round"
                  style={{ opacity: 0, transition: 'opacity 180ms ease-out' }}
                />
              </g>
            ))}
        </svg>

        {/* 88 Floating Technology Objects in GPU-Composited 2.5D Space */}
        {LIVING_ORBIT_PARTICLES.map((particle, idx) => {
          const { skill, tier, isFeaturedAnchor, desktopSize } = particle;
          const isFocused = focusedSkillId === skill.id;
          const isHovered = hoveredSkillId === skill.id;
          const isRelated = activeRelatedSet.has(skill.id);
          const isSelectedCatMember =
            Boolean(selectedCategoryId) && skill.categoryId === selectedCategoryId;

          // Restrained label discipline:
          // - In default ALL view, only the 8 Featured Technology Anchors display quiet captions
          // - Hovered, focused, related, or active category items reveal refined labels
          const showLabel =
            isFocused ||
            isHovered ||
            isRelated ||
            isSelectedCatMember ||
            (!selectedCategoryId && isFeaturedAnchor);

          const zLayer = isFocused
            ? 65
            : isHovered
            ? 60
            : isRelated
            ? 50
            : isFeaturedAnchor
            ? 40
            : tier === 'core'
            ? 32
            : tier === 'professional'
            ? 22
            : 14;

          const initX = (animStatesRef.current[idx].x / 100) * stageBoundsRef.current.width;
          const initY = (animStatesRef.current[idx].y / 100) * stageBoundsRef.current.height;

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
              className="group absolute left-0 top-0 flex flex-col items-center justify-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 rounded-xl"
              style={{
                transform: `translate3d(${initX.toFixed(1)}px, ${initY.toFixed(
                  1
                )}px, 0) translate(-50%, -50%) scale(${animStatesRef.current[idx].scale})`,
                opacity: animStatesRef.current[idx].opacity,
                zIndex: zLayer,
                willChange: 'transform, opacity',
              }}
            >
              {/* Authentic Floating Brand Mark (No generic circular wrapper) */}
              <div
                className="relative flex items-center justify-center transition-transform duration-300 ease-out"
                style={{
                  width: desktopSize,
                  height: desktopSize,
                  filter: isFocused
                    ? `drop-shadow(0 0 22px ${skill.brandColor}) drop-shadow(0 2px 8px rgba(0,0,0,0.85))`
                    : isHovered
                    ? `drop-shadow(0 0 18px ${skill.brandColor}bb) drop-shadow(0 2px 6px rgba(0,0,0,0.78))`
                    : isRelated
                    ? `drop-shadow(0 0 14px ${skill.brandColor}88) drop-shadow(0 2px 6px rgba(0,0,0,0.78))`
                    : isFeaturedAnchor
                    ? `drop-shadow(0 8px 20px rgba(0,0,0,0.78)) drop-shadow(0 0 14px ${skill.brandColor}48)`
                    : `drop-shadow(0 4px 12px rgba(0,0,0,0.68)) drop-shadow(0 0 8px ${skill.brandColor}28)`,
                }}
              >
                <TechLogo id={skill.id} name={skill.name} size={desktopSize} />
              </div>

              {/* Refined Typographic Label */}
              <span
                className={`mt-1.5 font-mono whitespace-nowrap pointer-events-none transition-all duration-200 ${
                  isFocused || isHovered
                    ? 'text-[10.5px] font-medium tracking-[0.14em] text-white px-2 py-0.5 rounded bg-[#050214]/90 border border-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.7)] opacity-100'
                    : isRelated
                    ? 'text-[10px] tracking-[0.12em] text-purple-100 px-2 py-0.5 rounded bg-[#050214]/80 border border-purple-400/25 opacity-100'
                    : isSelectedCatMember
                    ? 'text-[10px] tracking-[0.12em] text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] opacity-95'
                    : showLabel
                    ? 'text-[9.5px] tracking-[0.14em] uppercase text-white/68 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] opacity-88 group-hover:text-white'
                    : 'text-[9.5px] tracking-[0.12em] text-white/0 opacity-0'
                }`}
              >
                {skill.name}
              </span>
            </button>
          );
        })}

        {/* ─── 3. COMPACT CONTEXTUAL FOCUS INSPECTOR (ONLY ON CLICK) ─── */}
        {focusedSkill && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-full max-w-[640px] px-4 z-[70]">
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
