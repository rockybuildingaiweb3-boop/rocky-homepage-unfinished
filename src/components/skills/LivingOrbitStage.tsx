import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SKILLS_DATA, SKILL_CATEGORIES } from '../../data/skills';
import {
  LIVING_ORBIT_PARTICLES,
  SPATIAL_SPLINES,
  STAGE_PERSPECTIVE_PX,
  depthToZPx,
  evaluateOrbitAtArcLength,
  evaluateSculptureTrajectory,
  computeFocusedNetworkPositions,
  buildTrajectorySvgPath,
  getRelatedSkillIds,
} from '../../features/skills/livingOrbitEngine';
import { useIsMobile } from '../../hooks/useIsMobile';
import { TechLogo } from './TechLogo';
import {
  SkillFocusCard,
  computeOrbitalDossierPlacement,
  DOSSIER_ESTIMATED_HEIGHT,
  DossierPlacementResult,
} from './SkillFocusCard';
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
  zPx: number;
  scale: number;
  depth: number;
  opacity: number;
  isVisible: boolean;
}

/**
 * Tracer specifications for the 3-part SVG trajectory visualization (2 tracers per orbit = 6 total).
 */
const ORBIT_TRACER_SPECS: readonly {
  orbitIndex: number;
  phaseOffset: number;
  speedSign: 1 | -1;
  speedRate: number;
  radius: number;
  coreColor: string;
  glowColor: string;
}[] = [
  // Orbit A — Inner Celestial Flow (2 tracers)
  {
    orbitIndex: 0,
    phaseOffset: 0.14,
    speedSign: 1,
    speedRate: 0.032,
    radius: 2.3,
    coreColor: '#F3E8FF',
    glowColor: 'rgba(216, 180, 254, 0.75)',
  },
  {
    orbitIndex: 0,
    phaseOffset: 0.64,
    speedSign: 1,
    speedRate: 0.032,
    radius: 1.8,
    coreColor: '#E9D5FF',
    glowColor: 'rgba(192, 132, 252, 0.65)',
  },
  // Orbit B — Kinetic Sweep (2 counter-flowing tracers)
  {
    orbitIndex: 1,
    phaseOffset: 0.28,
    speedSign: -1,
    speedRate: 0.027,
    radius: 2.1,
    coreColor: '#EDE9FE',
    glowColor: 'rgba(168, 85, 247, 0.7)',
  },
  {
    orbitIndex: 1,
    phaseOffset: 0.78,
    speedSign: -1,
    speedRate: 0.027,
    radius: 1.7,
    coreColor: '#DDD6FE',
    glowColor: 'rgba(168, 85, 247, 0.58)',
  },
  // Orbit C — Deep Horizon (2 slow peripheral tracers)
  {
    orbitIndex: 2,
    phaseOffset: 0.21,
    speedSign: 1,
    speedRate: 0.021,
    radius: 1.7,
    coreColor: '#C4B5FD',
    glowColor: 'rgba(139, 92, 246, 0.52)',
  },
  {
    orbitIndex: 2,
    phaseOffset: 0.71,
    speedSign: 1,
    speedRate: 0.021,
    radius: 1.5,
    coreColor: '#C4B5FD',
    glowColor: 'rgba(139, 92, 246, 0.45)',
  },
];

/**
 * LivingOrbitStage — LIVING ORBIT 2.2 (Expansive 2.5D Orbital Kinetic Sculpture)
 *
 * - Wide architectural stage (`width: min(94vw, 1800px)`, `height: clamp(680px, 72vh, 780px)`)
 *   with CSS 3D `perspective: 1100px` and `transform-style: preserve-3d`.
 * - Two-Level Featured Anchor Hierarchy:
 *   • 4 Primary Featured Anchors (80–88px: OpenAI, TypeScript, React, Three.js)
 *   • 4 Secondary Featured Anchors (58–66px: LangGraph, PostgreSQL, FastAPI, Solidity)
 * - 3 Arc-Length Parameterized Trajectory Systems (Orbits A, B, C) with 26 simultaneous
 *   moving technologies (34 total visible objects) and 3-part SVG trajectory visualization
 *   (continuous base path + animated luminous energy segment + 6 arc-length light tracers).
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
  const prefersReducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const stageBoundsRef = useRef<{ width: number; height: number }>({
    width: 1560,
    height: 720,
  });
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({
    width: 1560,
    height: 720,
  });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const editorialWrapRef = useRef<HTMLDivElement>(null);
  const relationPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const relationGlowPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const relationGradRefs = useRef<(SVGLinearGradientElement | null)[]>([]);
  const relationDotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const orbitPulseRefs = useRef<(SVGPathElement | null)[]>([]);
  const orbitTracerGroupRefs = useRef<(SVGGElement | null)[]>([]);

  const [isMotionPaused, setIsMotionPaused] = useState(false);
  const [measuredPanelHeight, setMeasuredPanelHeight] = useState<number>(DOSSIER_ESTIMATED_HEIGHT);

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

  // Snapshot of focused network target positions and dossier SVG/stage-percentage footprints
  const focusedNetworkMapRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  const dossierSvgRectRef = useRef<{
    left: number;
    top: number;
    right: number;
    bottom: number;
  } | null>(null);
  const editorialPctRectRef = useRef<{
    left: number;
    top: number;
    right: number;
    bottom: number;
  } | null>(null);

  // Initialize particle states deterministically at t = 18.0s
  const animStatesRef = useRef<ParticleAnimState[]>(
    LIVING_ORBIT_PARTICLES.map((p) => {
      const init = evaluateSculptureTrajectory(p, 18.0);
      return {
        x: init.x,
        y: init.y,
        zPx: init.zPx,
        scale: init.scale,
        depth: init.depth,
        opacity: init.opacity,
        isVisible: init.isVisibleInAperture,
      };
    })
  );

  // Compute collision-free satellite coordinates and collision-aware dossier placement synchronously on discrete state/resize changes
  const { focusedNetworkMap, dossierPlacement } = useMemo(() => {
    if (!focusedSkillId) {
      return {
        focusedNetworkMap: new Map<string, { x: number; y: number }>(),
        dossierPlacement: null as DossierPlacementResult | null,
      };
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

    const netMap = computeFocusedNetworkPositions(focusedSkillId, currentSnapshot);
    const selectedPos = netMap.get(focusedSkillId) ?? { x: 50, y: 50 };
    const relPositions: { x: number; y: number }[] = [];
    const relIds = getRelatedSkillIds(focusedSkillId).slice(0, 5);
    for (const rId of relIds) {
      const rp = netMap.get(rId);
      if (rp) relPositions.push(rp);
    }

    const placement = computeOrbitalDossierPlacement({
      stageWidth: stageSize.width,
      stageHeight: stageSize.height,
      selectedPos,
      relatedPositions: relPositions,
      panelHeight: measuredPanelHeight,
    });

    return {
      focusedNetworkMap: netMap,
      dossierPlacement: placement,
    };
  }, [focusedSkillId, selectedCategoryId, stageSize, measuredPanelHeight]);

  // Measure rendered editorial block height on discrete skill selection changes
  useEffect(() => {
    if (!focusedSkillId || isMobile) return;
    const el = editorialWrapRef.current;
    if (!el) return;

    const measure = () => {
      if (!editorialWrapRef.current) return;
      const h = Math.round(editorialWrapRef.current.getBoundingClientRect().height);
      if (h > 80) {
        setMeasuredPanelHeight((prev) => (Math.abs(prev - h) >= 2 ? h : prev));
      }
    };

    const rafId = requestAnimationFrame(measure);
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null;
    observer?.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [focusedSkillId, isMobile]);

  useEffect(() => {
    focusedNetworkMapRef.current = focusedNetworkMap;
    if (dossierPlacement && stageSize.width > 0 && stageSize.height > 0) {
      const sx = 1000 / stageSize.width;
      const sy = 620 / stageSize.height;
      dossierSvgRectRef.current = {
        left: dossierPlacement.left * sx,
        top: dossierPlacement.top * sy,
        right: (dossierPlacement.left + dossierPlacement.width) * sx,
        bottom: (dossierPlacement.top + dossierPlacement.height) * sy,
      };
      const pxToPctX = 100 / stageSize.width;
      const pxToPctY = 100 / stageSize.height;
      editorialPctRectRef.current = {
        left: dossierPlacement.left * pxToPctX - 4.5,
        top: dossierPlacement.top * pxToPctY - 5.0,
        right: (dossierPlacement.left + dossierPlacement.width) * pxToPctX + 4.5,
        bottom: (dossierPlacement.top + dossierPlacement.height) * pxToPctY + 5.0,
      };
    } else {
      dossierSvgRectRef.current = null;
      editorialPctRectRef.current = null;
    }
  }, [focusedNetworkMap, dossierPlacement, stageSize]);

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
      x: Math.max(-1, Math.min(1, nx)) * 2.15,
      y: Math.max(-1, Math.min(1, ny)) * 1.5,
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
        const roundedW = Math.round(rect.width);
        const roundedH = Math.round(rect.height);
        setStageSize((prev) =>
          Math.abs(prev.width - roundedW) >= 2 || Math.abs(prev.height - roundedH) >= 2
            ? { width: roundedW, height: roundedH }
            : prev
        );
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

    // Reusable pre-filtered index buffer for visible particles
    const visibleIndices: number[] = [];

    const tick = (now: number) => {
      if (!isInViewport || !isDocumentVisible) {
        rafId = null;
        return;
      }

      const rawDt = Math.max(0.001, (now - lastTime) / 1000);
      const dt = Math.min(0.05, rawDt);
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
        // Focus Dilation:
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

      const focusDt = Math.min(0.14, rawDt);
      const posLerp = focusId
        ? 1 - Math.exp(-13.5 * focusDt)
        : 1 - Math.exp(-7.2 * dt);
      const opacityLerp = focusId
        ? 1 - Math.exp(-15.0 * focusDt)
        : 1 - Math.exp(-10.5 * dt);
      const cursor = cursorStagePosRef.current;
      const { width: stageW, height: stageH } = stageBoundsRef.current;
      const isCompactDesktop = stageW < 1160;

      // Update 3-part SVG Trajectory Luminous Segments & Arc-Length Light Tracers
      if (!catId) {
        for (let oIdx = 0; oIdx < SPATIAL_SPLINES.length; oIdx++) {
          const pulseEl = orbitPulseRefs.current[oIdx];
          if (pulseEl) {
            const dir = oIdx === 1 ? 1 : -1;
            const rate = oIdx === 0 ? 34 : oIdx === 1 ? 28 : 22;
            const offset = (sculptureTimeSec * rate * dir) % 1100;
            pulseEl.style.strokeDashoffset = offset.toFixed(1);
          }
        }

        for (let tIdx = 0; tIdx < ORBIT_TRACER_SPECS.length; tIdx++) {
          const spec = ORBIT_TRACER_SPECS[tIdx];
          const groupEl = orbitTracerGroupRefs.current[tIdx];
          const orbit = SPATIAL_SPLINES[spec.orbitIndex];
          if (groupEl && orbit) {
            const rawArc =
              spec.phaseOffset + sculptureTimeSec * spec.speedRate * spec.speedSign;
            const s = ((rawArc % 1) + 1) % 1;
            const pt = evaluateOrbitAtArcLength(orbit, s);
            const svgX = pt.x * 10;
            const svgY = pt.y * 6.2;
            // Smooth fade near far-side wrap
            const edgeFade =
              s < 0.08
                ? s / 0.08
                : s > 0.92
                ? (1 - s) / 0.08
                : 1.0;
            groupEl.setAttribute('transform', `translate(${svgX.toFixed(1)}, ${svgY.toFixed(1)})`);
            groupEl.style.opacity = (edgeFade * (focusId ? 0.25 : 0.88)).toFixed(2);
          }
        }
      }

      for (let i = 0; i < LIVING_ORBIT_PARTICLES.length; i++) {
        const p = LIVING_ORBIT_PARTICLES[i];
        const st = animStatesRef.current[i];

        let targetX = st.x;
        let targetY = st.y;
        let targetZPx = st.zPx;
        let targetScale = 1.0;
        let targetDepth = 0.9;
        let targetOpacity = 1.0;

        // Multi-harmonic organic floating per logo
        const gentleBobY =
          prefersReducedMotion || paused
            ? 0
            : Math.sin(breathTimeSec * p.floatFreq + p.oscillationPhase) * 0.62 +
              Math.cos(breathTimeSec * (p.floatFreq * 0.57) + p.secondaryPhase) * 0.24;
        const gentleBobX =
          prefersReducedMotion || paused
            ? 0
            : Math.cos(breathTimeSec * (p.floatFreq * 0.82) + p.oscillationPhase) * 0.38 +
              Math.sin(breathTimeSec * (p.floatFreq * 0.51) + p.secondaryPhase) * 0.18;

        if (catId) {
          // ─── ASYMMETRIC CATEGORY SCULPTURE MODE (11 Featured Category Technologies + Soft Peripheral Context) ───
          const isInSelectedCategory = p.skill.categoryId === catId;
          const isFocusNetworkMember = Boolean(
            focusId && (p.skill.id === focusId || focusedRelSet?.has(p.skill.id))
          );

          if (isFocusNetworkMember && focusedNetworkMapRef.current.has(p.skill.id)) {
            const netPos = focusedNetworkMapRef.current.get(p.skill.id)!;
            targetX = netPos.x + pointerCurrentRef.current.x * 0.45;
            targetY = netPos.y + (p.skill.id === focusId ? 0 : gentleBobY * 0.52);
            targetDepth = p.skill.id === focusId ? 1.08 : 1.02;
            targetZPx = depthToZPx(targetDepth);
            targetOpacity = p.skill.id === focusId ? 1.0 : 0.96;
          } else if (isInSelectedCategory) {
            targetX =
              p.categoryFormationPos.x +
              gentleBobX +
              pointerCurrentRef.current.x * p.categoryFormationPos.depth * 0.82;
            targetY =
              p.categoryFormationPos.y +
              gentleBobY +
              pointerCurrentRef.current.y * p.categoryFormationPos.depth * 0.82;
            targetDepth = p.categoryFormationPos.depth;
            targetZPx = p.categoryFormationPos.zPx;
            targetScale = p.categoryFormationPos.scale;
            targetOpacity = focusId ? 0.21 : 1.0;
          } else if (p.isFeaturedAnchor) {
            targetX = p.recessedPos.x + gentleBobX * 0.25;
            targetY = p.recessedPos.y + gentleBobY * 0.25;
            targetDepth = 0.52;
            targetZPx = depthToZPx(targetDepth);
            targetScale = 0.64;
            targetOpacity = focusId ? 0.13 : 0.06;
          } else {
            targetX = p.recessedPos.x;
            targetY = p.recessedPos.y;
            targetDepth = 0.5;
            targetZPx = depthToZPx(targetDepth);
            targetScale = 0.6;
            targetOpacity = 0.0;
          }
        } else {
          // ─── FULL LIVING ORBIT 2.2 SCULPTURE MODE (8 Two-Tier Anchors + 26 Arc-Length Moving Marks) ───
          const evalState = evaluateSculptureTrajectory(
            p,
            sculptureTimeSec,
            pointerCurrentRef.current
          );

          targetX = evalState.x;
          targetY = evalState.y;
          targetZPx = evalState.zPx;
          targetScale = evalState.scale;
          targetDepth = evalState.depth;
          targetOpacity = evalState.opacity;

          // Responsive density control on narrower desktop viewports (768–1160px)
          if (isCompactDesktop && !p.isFeaturedAnchor && p.slotIndex % 5 === 4) {
            targetOpacity *= 0.25;
          }

          if (focusId && (p.skill.id === focusId || focusedRelSet?.has(p.skill.id))) {
            const netPos = focusedNetworkMapRef.current.get(p.skill.id);
            if (netPos) {
              targetX = netPos.x + pointerCurrentRef.current.x * 0.45;
              targetY =
                netPos.y +
                (p.skill.id === focusId ? 0 : gentleBobY * 0.55) +
                pointerCurrentRef.current.y * 0.45;
              targetDepth = p.skill.id === focusId ? 1.08 : 1.02;
              targetZPx = depthToZPx(targetDepth);
              targetOpacity = p.skill.id === focusId ? 1.0 : 0.96;
            }
          }

          // Invisible wrap snap on far side of orbit
          if (evalState.opacity === 0 && st.opacity < 0.03 && !focusId) {
            st.x = targetX;
            st.y = targetY;
            st.zPx = targetZPx;
          }
        }

        // Localized Magnetic Response when pointer approaches a technology logo
        if (cursor.active && targetOpacity > 0.2 && !focusId) {
          const mdx = cursor.x - targetX;
          const mdy = cursor.y - targetY;
          const dist = Math.hypot(mdx, mdy);
          const magRadius = 17.5;
          if (dist < magRadius && dist > 0.1) {
            const pull = (1 - dist / magRadius) ** 2 * 0.22;
            targetX += mdx * pull;
            targetY += mdy * pull;
            targetZPx += (1 - dist / magRadius) * 24;
            targetScale *= 1 + (1 - dist / magRadius) * 0.05;
          }
        }

        // Focus Dilation & Hover visual hierarchy (88–96px optical selected hero, 44–48px spatial satellites, soft background context)
        if (focusId) {
          const heroTargetPx = isCompactDesktop ? 84 : 92;
          const satTargetPx = isCompactDesktop ? 42 : 46;
          if (p.skill.id === focusId) {
            targetScale = Math.max(1.06, Math.min(2.25, heroTargetPx / p.desktopSize));
            targetZPx = Math.max(targetZPx, 78);
            targetOpacity = 1.0;
          } else if (focusedRelSet?.has(p.skill.id)) {
            targetScale = Math.max(0.56, Math.min(1.32, satTargetPx / p.desktopSize));
            targetZPx = Math.max(targetZPx, 48);
            targetOpacity = 0.96;
          } else {
            if (!catId) {
              if (p.isFeaturedAnchor) {
                targetOpacity = p.anchorTier === 'primary' ? 0.22 : 0.17;
              } else {
                targetOpacity =
                  targetOpacity > 0.05
                    ? Math.max(0.09, Math.min(0.15, targetOpacity * 0.16))
                    : 0;
              }
            }
            const edRect = editorialPctRectRef.current;
            if (
              edRect &&
              targetX >= edRect.left &&
              targetX <= edRect.right &&
              targetY >= edRect.top &&
              targetY <= edRect.bottom
            ) {
              targetOpacity = Math.min(targetOpacity, 0.03);
            }
            targetZPx = Math.min(targetZPx - 36, -48);
            targetScale *= 0.92;
          }
        } else if (hoverId) {
          if (p.skill.id === hoverId) {
            targetScale *= 1.12;
            targetZPx += 36;
            targetOpacity = 1.0;
          } else if (hoveredRelSet?.has(p.skill.id)) {
            targetScale *= 1.05;
            targetZPx += 18;
            targetOpacity = Math.max(targetOpacity, 0.93);
          } else if (targetOpacity > 0.05) {
            targetOpacity *= 0.64;
          }
        }

        st.x += (targetX - st.x) * posLerp;
        st.y += (targetY - st.y) * posLerp;
        st.zPx += (targetZPx - st.zPx) * posLerp;
        st.scale += (targetScale - st.scale) * posLerp;
        st.depth += (targetDepth - st.depth) * posLerp;
        st.opacity += (targetOpacity - st.opacity) * opacityLerp;
        st.isVisible = st.opacity > 0.04;
      }

      // Optimized inter-particle spatial separation over visible particles only
      if (!catId && !focusId) {
        visibleIndices.length = 0;
        for (let i = 0; i < LIVING_ORBIT_PARTICLES.length; i++) {
          if (animStatesRef.current[i].opacity >= 0.15) {
            visibleIndices.push(i);
          }
        }

        const visCount = visibleIndices.length;

        for (let a = 0; a < visCount; a++) {
          const idxA = visibleIndices[a];
          const stA = animStatesRef.current[idxA];
          const pA = LIVING_ORBIT_PARTICLES[idxA];

          for (let b = a + 1; b < visCount; b++) {
            const idxB = visibleIndices[b];
            const stB = animStatesRef.current[idxB];
            const pB = LIVING_ORBIT_PARTICLES[idxB];

            const involvesPrimary =
              pA.anchorTier === 'primary' || pB.anchorTier === 'primary';
            const involvesAnchor = pA.isFeaturedAnchor || pB.isFeaturedAnchor;
            const minDx = involvesPrimary ? 10.4 : involvesAnchor ? 9.4 : 7.8;
            const minDy = involvesPrimary ? 14.5 : involvesAnchor ? 13.2 : 10.6;

            const anchorShiftA = pA.isFeaturedAnchor ? 1.5 : 0;
            const anchorShiftB = pB.isFeaturedAnchor ? 1.5 : 0;
            const dx = stB.x - stA.x;
            const dy = stB.y + anchorShiftB - (stA.y + anchorShiftA);
            const normDistSq = (dx / minDx) ** 2 + (dy / minDy) ** 2;
            if (normDistSq < 1.0 && normDistSq > 0.0001) {
              const normDist = Math.sqrt(normDistSq);
              const overlap = (1.0 - normDist) * 0.52;
              const ux = dx / normDist;
              const uy = dy / normDist;

              // Featured anchors remain stable while trajectory travelers deflect around them
              if (pA.isFeaturedAnchor && !pB.isFeaturedAnchor) {
                stB.x = Math.max(4.0, Math.min(96.0, stB.x + ux * overlap * 1.75));
                stB.y = Math.max(6.0, Math.min(93.0, stB.y + uy * overlap * 1.75));
              } else if (!pA.isFeaturedAnchor && pB.isFeaturedAnchor) {
                stA.x = Math.max(4.0, Math.min(96.0, stA.x - ux * overlap * 1.75));
                stA.y = Math.max(6.0, Math.min(93.0, stA.y - uy * overlap * 1.75));
              } else if (!pA.isFeaturedAnchor && !pB.isFeaturedAnchor) {
                stA.x = Math.max(4.0, Math.min(96.0, stA.x - ux * overlap * 0.85));
                stA.y = Math.max(6.0, Math.min(93.0, stA.y - uy * overlap * 0.85));
                stB.x = Math.max(4.0, Math.min(96.0, stB.x + ux * overlap * 0.85));
                stB.y = Math.max(6.0, Math.min(93.0, stB.y + uy * overlap * 0.85));
              }
            }
          }
        }
      }

      // Apply GPU-composited 3D transform (`translate3d(px, py, zPx)`) and dynamic depth zIndex
      for (let i = 0; i < LIVING_ORBIT_PARTICLES.length; i++) {
        const st = animStatesRef.current[i];
        const p = LIVING_ORBIT_PARTICLES[i];
        const el = buttonRefs.current[i];
        if (el) {
          const px = (st.x / 100) * stageW;
          const py = (st.y / 100) * stageH;

          el.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(
            2
          )}px, ${st.zPx.toFixed(1)}px) translate(-50%, -50%) scale(${st.scale.toFixed(3)})`;
          el.style.opacity = st.opacity.toFixed(3);
          el.style.pointerEvents = st.opacity > 0.24 ? 'auto' : 'none';
          el.style.visibility = st.opacity > 0.02 ? 'visible' : 'hidden';

          // Dynamic depth-coherent zIndex ordering
          const isFocused = focusId === p.skill.id;
          const isHovered = hoverId === p.skill.id;
          const isRelated = Boolean(
            focusedRelSet?.has(p.skill.id) || hoveredRelSet?.has(p.skill.id)
          );
          const dynamicZ = isFocused
            ? 68
            : isHovered
            ? 64
            : isRelated
            ? 56
            : Math.round(12 + Math.max(0, Math.min(1.15, st.depth)) * 34);
          el.style.zIndex = String(dynamicZ);
        }
      }

      // Update selective relationship filaments (continuous gradient-tinted Bézier curves curving around planet & dossier)
      const activeId = focusId || hoverId;
      if (activeId) {
        const srcIdx = particleIndexById.get(activeId);
        const srcState = srcIdx !== undefined ? animStatesRef.current[srcIdx] : null;
        const relIds = getRelatedSkillIds(activeId).slice(0, 5);
        const dossierRect = focusId ? dossierSvgRectRef.current : null;

        for (let r = 0; r < 5; r++) {
          const pathEl = relationPathRefs.current[r];
          const glowEl = relationGlowPathRefs.current[r];
          const gradEl = relationGradRefs.current[r];
          const dotEl = relationDotRefs.current[r];
          const relId = relIds[r];
          const dstIdx = relId ? particleIndexById.get(relId) : undefined;
          const dstState = dstIdx !== undefined ? animStatesRef.current[dstIdx] : null;

          if (pathEl && srcState && dstState && srcState.opacity > 0.1 && dstState.opacity > 0.1) {
            const x1 = srcState.x * 10;
            const y1 = srcState.y * 6.2;
            const x2 = dstState.x * 10;
            const y2 = dstState.y * 6.2;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dist = Math.max(1, Math.hypot(dx, dy));
            const mx = (x1 + x2) * 0.5;
            const my = (y1 + y2) * 0.5;
            const nx = -dy / dist;
            const ny = dx / dist;
            const arcOffset = Math.min(54, Math.max(16, dist * 0.18));

            // Evaluate +1 and -1 perpendicular arc directions and choose the path avoiding planet center and editorial zone
            let bestCx = mx;
            let bestCy = my - arcOffset;
            let bestCurveScore = -Infinity;

            for (const sign of [-1, 1]) {
              const candCx = Math.max(24, Math.min(976, mx + nx * arcOffset * sign));
              const candCy = Math.max(24, Math.min(596, my + ny * arcOffset * sign));
              const midCurveX = 0.25 * x1 + 0.5 * candCx + 0.25 * x2;
              const midCurveY = 0.25 * y1 + 0.5 * candCy + 0.25 * y2;

              // Prefer curving away from central planetary core (500, 270)
              const distPlanet = Math.hypot(midCurveX - 500, midCurveY - 270);
              let score = distPlanet;

              // Also prefer curving away from open Orbital Editorial rect
              if (dossierRect) {
                const dRectX = Math.max(dossierRect.left, Math.min(midCurveX, dossierRect.right));
                const dRectY = Math.max(dossierRect.top, Math.min(midCurveY, dossierRect.bottom));
                const distDossier = Math.hypot(midCurveX - dRectX, midCurveY - dRectY);
                score += distDossier * 1.4;
              }

              // Subtle upward preference when equidistant
              score += (candCy < my ? 10 : 0);

              if (score > bestCurveScore) {
                bestCurveScore = score;
                bestCx = candCx;
                bestCy = candCy;
              }
            }

            if (gradEl) {
              gradEl.setAttribute('x1', x1.toFixed(1));
              gradEl.setAttribute('y1', y1.toFixed(1));
              gradEl.setAttribute('x2', x2.toFixed(1));
              gradEl.setAttribute('y2', y2.toFixed(1));
            }

            const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${bestCx.toFixed(1)} ${bestCy.toFixed(
              1
            )} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
            pathEl.setAttribute('d', d);
            pathEl.style.opacity = focusId ? '0.48' : '0.26';
            if (glowEl) {
              glowEl.setAttribute('d', d);
              glowEl.style.opacity = focusId ? '0.11' : '0.06';
            }
            if (dotEl) {
              dotEl.setAttribute('cx', x2.toFixed(1));
              dotEl.setAttribute('cy', y2.toFixed(1));
              dotEl.style.opacity = focusId ? '0.50' : '0.30';
            }
          } else if (pathEl) {
            pathEl.style.opacity = '0';
            if (glowEl) glowEl.style.opacity = '0';
            if (dotEl) dotEl.style.opacity = '0';
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
    <div className="w-[min(94vw,1800px)] max-w-[1800px] mx-auto px-2 sm:px-4 lg:px-6 flex flex-col items-center">
      {/* ─── 1. SUBTLE EDITORIAL TYPOGRAPHIC CATEGORY NAVIGATION ─── */}
      <nav
        className="relative z-30 flex flex-wrap items-center justify-center gap-x-3.5 xl:gap-x-5 gap-y-1.5 py-1.5 mb-2 border-b border-white/[0.06] px-3"
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

      {/* ─── 2. EXPANSIVE 2.5D ORBITAL KINETIC SCULPTURE STAGE ─── */}
      <div
        ref={stageRef}
        onMouseMove={handleStageMouseMove}
        onMouseLeave={handleStageMouseLeave}
        onClick={() => {
          if (focusedSkillId) onClearSkillFocus();
        }}
        className="relative w-full select-none overflow-visible"
        style={{
          height: 'clamp(680px, 72vh, 780px)',
          perspective: `${STAGE_PERSPECTIVE_PX}px`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* 3-Part Expressive Trajectory Visualization (Base Path + Luminous Pulse + Light Tracers) */}
        <svg
          viewBox="0 0 1000 620"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {/* Orbit A: Inner Celestial Flow gradient */}
            <linearGradient id="orbitInnerCelestialGrad" x1="12%" y1="78%" x2="88%" y2="18%">
              <stop offset="0%" stopColor="rgba(192, 132, 252, 0)" />
              <stop offset="18%" stopColor="rgba(216, 180, 254, 0.16)" />
              <stop offset="52%" stopColor="rgba(233, 213, 255, 0.22)" />
              <stop offset="84%" stopColor="rgba(192, 132, 252, 0.15)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
            </linearGradient>
            {/* Orbit B: Kinetic Sweep gradient */}
            <linearGradient id="orbitKineticSweepGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
              <stop offset="22%" stopColor="rgba(168, 85, 247, 0.13)" />
              <stop offset="68%" stopColor="rgba(192, 132, 252, 0.17)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </linearGradient>
            {/* Orbit C: Deep Horizon gradient */}
            <linearGradient id="orbitDeepHorizonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
              <stop offset="30%" stopColor="rgba(147, 51, 234, 0.09)" />
              <stop offset="72%" stopColor="rgba(168, 85, 247, 0.11)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </linearGradient>
            {/* Luminous Pulse Segment Gradients */}
            <linearGradient id="orbitPulseGradA" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(216, 180, 254, 0)" />
              <stop offset="50%" stopColor="rgba(243, 232, 255, 0.42)" />
              <stop offset="100%" stopColor="rgba(192, 132, 252, 0)" />
            </linearGradient>
            <linearGradient id="orbitPulseGradB" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(192, 132, 252, 0)" />
              <stop offset="50%" stopColor="rgba(216, 180, 254, 0.34)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
            </linearGradient>
            <linearGradient id="orbitPulseGradC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
              <stop offset="50%" stopColor="rgba(192, 132, 252, 0.24)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </linearGradient>
          </defs>

          {/* 3-Part Orbital Trajectory System (Active in All mode) */}
          {!selectedCategoryId && (
            <g
              className="transition-opacity duration-700"
              style={{ opacity: focusedSkillId ? 0.14 : 0.85 }}
            >
              {/* Part 1: Subtle Continuous Base Paths */}
              {trajectoryPaths.map((tp, idx) => (
                <path
                  key={`${tp.id}-base`}
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
                  strokeDasharray={idx === 2 ? '3 9' : idx === 1 ? '6 8' : undefined}
                />
              ))}

              {/* Part 2: Restrained Luminous Moving Segments */}
              {trajectoryPaths.map((tp, idx) => (
                <path
                  key={`${tp.id}-pulse`}
                  ref={(el) => {
                    orbitPulseRefs.current[idx] = el;
                  }}
                  d={tp.d}
                  fill="none"
                  stroke={
                    idx === 0
                      ? 'url(#orbitPulseGradA)'
                      : idx === 1
                      ? 'url(#orbitPulseGradB)'
                      : 'url(#orbitPulseGradC)'
                  }
                  strokeWidth={idx === 0 ? '1.85' : idx === 1 ? '1.45' : '1.15'}
                  strokeLinecap="round"
                  strokeDasharray={
                    idx === 0 ? '170 920' : idx === 1 ? '145 960' : '120 980'
                  }
                />
              ))}

              {/* Part 3: Moving Arc-Length Light Tracer Points (2 per orbit = 6 total) */}
              {ORBIT_TRACER_SPECS.map((spec, tIdx) => {
                const initPt = evaluateOrbitAtArcLength(
                  SPATIAL_SPLINES[spec.orbitIndex],
                  spec.phaseOffset
                );
                return (
                  <g
                    key={`orbit-tracer-${tIdx}`}
                    ref={(el) => {
                      orbitTracerGroupRefs.current[tIdx] = el;
                    }}
                    transform={`translate(${(initPt.x * 10).toFixed(1)}, ${(
                      initPt.y * 6.2
                    ).toFixed(1)})`}
                  >
                    <circle
                      r={spec.radius * 2.8}
                      fill={spec.glowColor}
                      style={{ filter: 'blur(2.5px)' }}
                    />
                    <circle r={spec.radius} fill={spec.coreColor} />
                  </g>
                );
              })}
            </g>
          )}

          {/* Selective Relationship Filaments (Continuous brand-tinted curved Bézier hairlines) */}
          {activeSkill &&
            activeRelatedIds.map((relId, idx) => {
              const dstSkill = SKILLS_DATA.find((s) => s.id === relId);
              const dstColor = dstSkill?.brandColor || '#C084FC';
              const gradId = `rel-filament-grad-${idx}`;
              return (
                <g key={`${activeSkill.id}-${relId}`}>
                  <defs>
                    <linearGradient
                      id={gradId}
                      ref={(el) => {
                        relationGradRefs.current[idx] = el;
                      }}
                      gradientUnits="userSpaceOnUse"
                      x1="0"
                      y1="0"
                      x2="100"
                      y2="100"
                    >
                      <stop offset="0%" stopColor={activeSkill.brandColor} stopOpacity={0.82} />
                      <stop offset="52%" stopColor="#E9D5FF" stopOpacity={0.56} />
                      <stop offset="100%" stopColor={dstColor} stopOpacity={0.78} />
                    </linearGradient>
                  </defs>
                  <path
                    ref={(el) => {
                      relationGlowPathRefs.current[idx] = el;
                    }}
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    style={{
                      opacity: 0,
                      filter: 'blur(2.5px)',
                      transition: 'opacity 200ms ease-out',
                    }}
                  />
                  <path
                    ref={(el) => {
                      relationPathRefs.current[idx] = el;
                    }}
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth="1.05"
                    strokeLinecap="round"
                    style={{ opacity: 0, transition: 'opacity 200ms ease-out' }}
                  />
                  <circle
                    ref={(el) => {
                      relationDotRefs.current[idx] = el;
                    }}
                    r="2"
                    fill={dstColor}
                    style={{ opacity: 0, transition: 'opacity 200ms ease-out' }}
                  />
                </g>
              );
            })}
        </svg>

        {/* 88 Floating Technology Objects in True 2.5D Perspective Space */}
        {LIVING_ORBIT_PARTICLES.map((particle, idx) => {
          const { skill, tier, isFeaturedAnchor, anchorTier, desktopSize } = particle;
          const isPrimaryAnchor = anchorTier === 'primary';
          const isFocused = focusedSkillId === skill.id;
          const isHovered = hoveredSkillId === skill.id;
          const isRelated = activeRelatedSet.has(skill.id);
          const isSelectedCatMember =
            Boolean(selectedCategoryId) && skill.categoryId === selectedCategoryId;

          // Restrained label discipline:
          // - In default ALL view, only the 8 Featured Technology Anchors (4 Primary + 4 Secondary) display quiet captions
          // - Moving orbit technologies reveal labels only on hover, focus, related highlight, or category filter
          const showLabel =
            isFocused ||
            isHovered ||
            isRelated ||
            isSelectedCatMember ||
            (!selectedCategoryId && isFeaturedAnchor);

          const st = animStatesRef.current[idx];
          const zLayer = isFocused
            ? 68
            : isHovered
            ? 64
            : isRelated
            ? 56
            : Math.round(12 + Math.max(0, Math.min(1.15, st.depth)) * 34);

          const initX = (st.x / 100) * stageBoundsRef.current.width;
          const initY = (st.y / 100) * stageBoundsRef.current.height;

          return (
            <button
              key={skill.id}
              ref={(el) => {
                buttonRefs.current[idx] = el;
              }}
              type="button"
              aria-label={`${skill.name} (${tier} tier)`}
              aria-pressed={isFocused}
              data-anchor-tier={anchorTier ?? undefined}
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
                )}px, ${st.zPx.toFixed(1)}px) translate(-50%, -50%) scale(${st.scale.toFixed(3)})`,
                opacity: st.opacity,
                zIndex: zLayer,
                willChange: 'transform, opacity',
              }}
            >
              {/* Authentic Floating Brand Mark with Restrained Orbital Selection Halo */}
              <div
                className="relative flex items-center justify-center transition-transform duration-300 ease-out"
                style={{
                  width: desktopSize,
                  height: desktopSize,
                  filter: isFocused
                    ? `drop-shadow(0 0 18px ${skill.brandColor}99) drop-shadow(0 3px 10px rgba(0,0,0,0.88))`
                    : isHovered
                    ? `drop-shadow(0 0 16px ${skill.brandColor}b3) drop-shadow(0 2px 6px rgba(0,0,0,0.78))`
                    : isRelated
                    ? `drop-shadow(0 0 14px ${skill.brandColor}88) drop-shadow(0 2px 6px rgba(0,0,0,0.78))`
                    : isPrimaryAnchor
                    ? `drop-shadow(0 10px 24px rgba(0,0,0,0.82)) drop-shadow(0 0 18px ${skill.brandColor}58)`
                    : isFeaturedAnchor
                    ? `drop-shadow(0 7px 18px rgba(0,0,0,0.76)) drop-shadow(0 0 13px ${skill.brandColor}42)`
                    : `drop-shadow(0 4px 12px rgba(0,0,0,0.68)) drop-shadow(0 0 8px ${skill.brandColor}28)`,
                }}
              >
                {isFocused && (
                  <>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-4 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${skill.brandColor}26 0%, ${skill.brandColor}0a 52%, transparent 74%)`,
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -inset-2 rounded-full border"
                      style={{
                        borderColor: `${skill.brandColor}55`,
                        boxShadow: `0 0 16px ${skill.brandColor}24`,
                      }}
                    />
                  </>
                )}
                <TechLogo id={skill.id} name={skill.name} size={desktopSize} />
              </div>

              {/* Refined Typographic Label (Omitted while focused so Dossier owns the title) */}
              {!isFocused && (
                <span
                  className={`mt-1.5 font-mono whitespace-nowrap pointer-events-none transition-opacity duration-200 ${
                    isHovered
                      ? 'text-[10.5px] font-medium tracking-[0.14em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.98)] opacity-100'
                      : isRelated
                      ? 'text-[10px] font-medium tracking-[0.13em] text-purple-100/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.98)] opacity-100'
                      : isSelectedCatMember
                      ? 'text-[10px] tracking-[0.12em] text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] opacity-95'
                      : showLabel && isPrimaryAnchor
                      ? 'text-[10px] font-medium tracking-[0.15em] uppercase text-white/85 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] opacity-95 group-hover:text-white'
                      : showLabel
                      ? 'text-[9.5px] tracking-[0.13em] uppercase text-white/68 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] opacity-90 group-hover:text-white'
                      : 'text-[9.5px] tracking-[0.12em] text-white/0 opacity-0'
                  }`}
                >
                  {skill.name}
                </span>
              )}
            </button>
          );
        })}

        {/* ─── 3. ORBITAL EDITORIAL 3.0 (BORDERLESS FLOATING ANNOTATION) ─── */}
        <AnimatePresence>
          {focusedSkill && dossierPlacement && (
            <motion.div
              key="orbital-dossier-shell"
              ref={editorialWrapRef}
              data-anchor-side={dossierPlacement.anchorSide}
              initial={
                prefersReducedMotion
                  ? { opacity: 0, x: dossierPlacement.left, y: dossierPlacement.top }
                  : {
                      opacity: 0,
                      x: dossierPlacement.left,
                      y: dossierPlacement.top + 10,
                    }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1, x: dossierPlacement.left, y: dossierPlacement.top }
                  : {
                      opacity: 1,
                      x: dossierPlacement.left,
                      y: dossierPlacement.top,
                    }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: dossierPlacement.top + 8,
                    }
              }
              transition={{
                duration: prefersReducedMotion ? 0.12 : 0.24,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute left-0 top-0 z-[72] pointer-events-auto"
              style={{ width: dossierPlacement.width }}
            >
              <SkillFocusCard
                skill={focusedSkill}
                widthPx={dossierPlacement.width}
                anchorSide={dossierPlacement.anchorSide}
                onSelectSkill={onSelectSkill}
                onClose={onClearSkillFocus}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LivingOrbitStage;
