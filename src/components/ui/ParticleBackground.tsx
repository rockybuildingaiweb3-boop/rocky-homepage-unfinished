import React, { Component, useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { isWebGLAvailable } from '../../utils';

export interface ParticleBackgroundProps {
  className?: string;
}

export type ParticleRenderMode = 'normal' | 'skills';

export interface StarLayerSpec {
  id: 'tiny' | 'medium' | 'bright' | 'accent';
  label: string;
  count: number;
  /** Dedicated outer-perimeter subset count from this layer's global budget */
  peripheralCount: number;
  /** Camera distance range [minDepth, maxDepth] along the view frustum */
  minDepth: number;
  maxDepth: number;
  color: string;
  /** RGB palette tuples (0..255) for per-star color variation */
  paletteRgb: readonly [number, number, number][];
  /** Base point size in CSS pixels (used by both WebGL shader and 2D Canvas) */
  baseSizePx: number;
  /** Base alpha/opacity before per-star modulation and twinkle */
  baseOpacity: number;
  /** Screen-space normalized UV drift velocity per second (du/dt, dv/dt) */
  driftU: number;
  driftV: number;
  /** Per-star velocity dispersion around the layer drift vector */
  velocitySpread: number;
  /** Gentle harmonic lateral sway amplitude in UV units */
  swayAmp: number;
  twinkleAmp: number;
  twinkleFreq: number;
  /** 1.0 for 4-point celestial glint shader profile, 0.0 for soft radial star */
  isGlintLayer: number;
  seed: number;
}

/**
 * LIVING ORBIT 2.3 + SMART PARTICLE OCCLUSION — 5,500 Global / 800 Skills Peripheral
 *
 * Calibrated 4-layer cosmic particle architecture sharing a single 5,500-star budget:
 * - Layer 1 (tiny — Tiny Stellar Dust):     4,500 global | 620 Skills outer-perimeter
 * - Layer 2 (medium — Medium Ambient Stars):  800 global | 128 Skills outer-perimeter
 * - Layer 3 (bright — Bright Stars):          150 global |  36 Skills outer-perimeter
 * - Layer 4 (accent — Accent Glints):          50 global |  16 Skills outer-perimeter
 * - Total:                                  5,500 global | 800 Skills outer-perimeter
 */
export const STARFIELD_LAYER_SPECS: readonly StarLayerSpec[] = [
  {
    id: 'tiny',
    label: 'Layer 1 · Tiny Stellar Dust',
    count: 4500,
    peripheralCount: 620,
    minDepth: 1.34,
    maxDepth: 2.24,
    color: '#d8b4fe',
    paletteRgb: [
      [216, 180, 254],
      [196, 181, 253],
      [233, 213, 255],
      [178, 132, 248],
    ],
    baseSizePx: 1.55,
    baseOpacity: 0.48,
    driftU: 0.0028,
    driftV: -0.0017,
    velocitySpread: 0.00095,
    swayAmp: 0.0016,
    twinkleAmp: 0.1,
    twinkleFreq: 0.88,
    isGlintLayer: 0.0,
    seed: 101,
  },
  {
    id: 'medium',
    label: 'Layer 2 · Medium Ambient Stars',
    count: 800,
    peripheralCount: 128,
    minDepth: 1.0,
    maxDepth: 1.66,
    color: '#f3e8ff',
    paletteRgb: [
      [243, 232, 255],
      [233, 213, 255],
      [250, 245, 255],
      [216, 180, 254],
    ],
    baseSizePx: 2.25,
    baseOpacity: 0.64,
    driftU: -0.0041,
    driftV: -0.0025,
    velocitySpread: 0.0013,
    swayAmp: 0.0022,
    twinkleAmp: 0.14,
    twinkleFreq: 1.22,
    isGlintLayer: 0.0,
    seed: 202,
  },
  {
    id: 'bright',
    label: 'Layer 3 · Bright Stars',
    count: 150,
    peripheralCount: 36,
    minDepth: 0.78,
    maxDepth: 1.26,
    color: '#ffffff',
    paletteRgb: [
      [255, 255, 255],
      [245, 243, 255],
      [224, 231, 255],
    ],
    baseSizePx: 3.35,
    baseOpacity: 0.82,
    driftU: 0.0058,
    driftV: -0.0036,
    velocitySpread: 0.0016,
    swayAmp: 0.0029,
    twinkleAmp: 0.2,
    twinkleFreq: 1.65,
    isGlintLayer: 0.0,
    seed: 303,
  },
  {
    id: 'accent',
    label: 'Layer 4 · Accent Glints',
    count: 50,
    peripheralCount: 16,
    minDepth: 0.7,
    maxDepth: 1.14,
    color: '#e9d5ff',
    paletteRgb: [
      [245, 240, 255],
      [233, 213, 255],
      [255, 255, 255],
      [224, 242, 254],
    ],
    baseSizePx: 4.35,
    baseOpacity: 0.88,
    driftU: -0.0048,
    driftV: 0.0031,
    velocitySpread: 0.0014,
    swayAmp: 0.0032,
    twinkleAmp: 0.26,
    twinkleFreq: 2.1,
    isGlintLayer: 1.0,
    seed: 404,
  },
] as const;

export const TOTAL_STARFIELD_COUNT = STARFIELD_LAYER_SPECS.reduce(
  (acc, s) => acc + s.count,
  0
);

export const TOTAL_PERIPHERAL_STARFIELD_COUNT = STARFIELD_LAYER_SPECS.reduce(
  (acc, s) => acc + s.peripheralCount,
  0
);

/** Mix threshold above which central interior stars are fully culled via drawRange */
export const SKILLS_CULL_MIX_THRESHOLD = 0.86;

export interface SkillsRegionMetrics {
  centerU: number;
  centerV: number;
  radiusU: number;
  radiusV: number;
  mix: number;
}

export interface SkillsRegionRectTarget extends SkillsRegionMetrics {
  targetMix: number;
}

export function clamp01(val: number): number {
  return val < 0 ? 0 : val > 1 ? 1 : val;
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / Math.max(1e-5, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Computes normalized Skills atmospheric occlusion bounds and transition target mix
 * from a live DOM bounding rect (`SkillsAtmosphere` / `#skills`).
 */
export function computeSkillsRegionFromRect(
  rect: { left: number; top: number; width: number; height: number } | null,
  viewportWidth = 1440,
  viewportHeight = 900
): SkillsRegionRectTarget {
  const safeW = Math.max(1, viewportWidth);
  const safeH = Math.max(1, viewportHeight);

  if (!rect || rect.width <= 0 || rect.height <= 0) {
    return {
      centerU: 0.5,
      centerV: 0.5,
      radiusU: 0.36,
      radiusV: 0.36,
      mix: 0,
      targetMix: 0,
    };
  }

  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(safeH, rect.top + rect.height);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);

  const visibleLeft = Math.max(0, rect.left);
  const visibleRight = Math.min(safeW, rect.left + rect.width);
  const visibleWidth = Math.max(0, visibleRight - visibleLeft);

  if (visibleHeight <= 0 || visibleWidth <= 0) {
    return {
      centerU: (rect.left + rect.width * 0.5) / safeW,
      centerV: (rect.top + rect.height * 0.52) / safeH,
      radiusU: 0.36,
      radiusV: 0.36,
      mix: 0,
      targetMix: 0,
    };
  }

  const vpFraction = visibleHeight / safeH;
  const secFraction = visibleHeight / rect.height;
  const presence = Math.max(vpFraction, secFraction * 0.9);
  const targetMix = smoothstep(0.14, 0.52, presence);

  const centerU = (rect.left + rect.width * 0.5) / safeW;
  const centerV = (rect.top + rect.height * 0.52) / safeH;

  const isMobile = safeW < 768;
  const radiusU = (rect.width * (isMobile ? 0.39 : 0.35)) / safeW;
  const radiusV = (rect.height * (isMobile ? 0.32 : 0.36)) / safeH;

  return {
    centerU,
    centerV,
    radiusU: Math.max(0.18, radiusU),
    radiusV: Math.max(0.18, radiusV),
    mix: targetMix,
    targetMix,
  };
}

/**
 * Evaluates per-star visibility attenuation factor [0..1] for Mode A, Mode B,
 * and smooth scroll transitions. Matches `STARFIELD_VERTEX_SHADER` identically.
 */
export function computeStarVisibilityFactor(
  u: number,
  v: number,
  isPeripheral: boolean,
  region: SkillsRegionMetrics
): number {
  if (region.mix <= 0.0001) return 1.0;

  const dx = (u - region.centerU) / Math.max(0.05, region.radiusU);
  const dy = (v - region.centerV) / Math.max(0.05, region.radiusV);
  const eDist = Math.hypot(dx, dy);

  // Inside 0.74: completely suppressed behind central planet & radial vortex
  // 0.74 .. 1.14: soft outer-orbital boundary feathering
  // >= 1.14: outer cosmic perimeter
  const coreMask = smoothstep(0.74, 1.14, eDist);

  if (isPeripheral) {
    return 1.0 + (coreMask * 0.88 - 1.0) * region.mix;
  }

  const interiorFade = clamp01(1.0 - region.mix / SKILLS_CULL_MIX_THRESHOLD);
  const earlyCoreSuppression =
    1.0 + (coreMask - 1.0) * smoothstep(0.0, 0.5, region.mix);
  return interiorFade * earlyCoreSuppression;
}

/**
 * Deterministic Halton sequence generator for low-discrepancy quasi-random sampling.
 */
export function halton(index: number, base: number): number {
  let result = 0;
  let f = 1 / base;
  let i = index;
  while (i > 0) {
    result += f * (i % base);
    i = Math.floor(i / base);
    f /= base;
  }
  return result;
}

export interface StarfieldLayerData {
  spec: StarLayerSpec;
  count: number;
  /** Number of pre-partitioned outer-perimeter stars stored in indices [0 .. peripheralCount - 1] */
  peripheralCount: number;
  /** Normalized initial screen coordinates u0, v0 in [0, 1) (length = count * 2) */
  uv0: Float32Array;
  /** Screen-space UV velocity du/dt, dv/dt per second (length = count * 2) */
  velocity: Float32Array;
  /** Camera depth distance d in [minDepth, maxDepth] (length = count) */
  depth: Float32Array;
  /** Per-star pixel size (length = count) */
  sizePx: Float32Array;
  /** Per-star base opacity (length = count) */
  baseOpacity: Float32Array;
  /** Per-star twinkle phase in [0, 2*PI) (length = count) */
  twinklePhase: Float32Array;
  /** Per-star twinkle frequency in rad/s (length = count) */
  twinkleFreq: Float32Array;
  /** Per-star normalized RGB [0..1] for WebGL attributes (length = count * 3) */
  colorNorm: Float32Array;
  /** Per-star palette index for 2D Canvas rendering (length = count) */
  paletteIndex: Uint8Array;
  /** 1.0 for pre-partitioned peripheral stars [0 .. peripheralCount - 1], 0.0 otherwise */
  isPeripheral: Float32Array;
}

/**
 * Stratified 24×16 screen-space micro-grid + Halton quasi-random discrepancy +
 * multi-harmonic organic cosmic clustering field.
 */
const STRATIFIED_MICRO_COLS = 24;
const STRATIFIED_MICRO_ROWS = 16;
const STRATIFIED_MICRO_TOTAL = STRATIFIED_MICRO_COLS * STRATIFIED_MICRO_ROWS; // 384 cells

const LAYER_CELL_STRIDES: Record<StarLayerSpec['id'], number> = {
  tiny: 173,
  medium: 211,
  bright: 137,
  accent: 251,
};

const LAYER_DATA_CACHE = new Map<StarLayerSpec['id'], StarfieldLayerData>();

function computeOrganicClusterOffset(
  u: number,
  v: number,
  seed: number,
  clusterSelector: number
): { du: number; dv: number } {
  const phase = seed * 0.17;
  const waveU =
    Math.sin(v * Math.PI * 4.0 + phase) * 0.011 +
    Math.cos((u * 1.5 + v) * Math.PI * 6.0 - phase) * 0.0065 +
    Math.sin((u - v * 1.3) * Math.PI * 10.0 + clusterSelector * 6.28) * 0.0045;
  const waveV =
    Math.cos(u * Math.PI * 4.0 + phase * 1.3) * 0.011 +
    Math.sin((u - v * 1.5) * Math.PI * 6.0 + phase) * 0.0065 +
    Math.cos((u * 1.3 + v) * Math.PI * 10.0 + clusterSelector * 6.28) * 0.0045;

  return { du: waveU, dv: waveV };
}

type OuterZone = 'left' | 'right' | 'top' | 'bottom' | 'boundary' | 'interior';

function classifyOuterZone(u: number, v: number): OuterZone {
  const dx = (u - 0.5) / 0.35;
  const dy = (v - 0.5) / 0.36;
  const eDist = Math.hypot(dx, dy);

  if (u < 0.19) return 'left';
  if (u > 0.81) return 'right';
  if (v < 0.18) return 'top';
  if (v > 0.82) return 'bottom';
  if (eDist >= 0.88 && eDist <= 1.24) return 'boundary';
  return 'interior';
}

/**
 * Builds deterministic screen-space + frustum-depth particle data shared by both the
 * WebGL renderer (`StarBackground`) and the 2D Canvas fallback (`StarBackground2D`).
 *
 * Pre-partitions `spec.peripheralCount` outer-perimeter stars into the contiguous
 * prefix `[0 .. spec.peripheralCount - 1]` so Skills mode can draw ONLY the peripheral
 * subset via `geometry.setDrawRange(0, peripheralCount)`.
 */
export function generateScreenSpaceStarLayerData(
  spec: StarLayerSpec
): StarfieldLayerData {
  const cached = LAYER_DATA_CACHE.get(spec.id);
  if (
    cached &&
    cached.count === spec.count &&
    cached.peripheralCount === spec.peripheralCount
  ) {
    return cached;
  }

  const n = spec.count;
  const pCount = Math.min(n, spec.peripheralCount);

  const rawUv0 = new Float32Array(n * 2);
  const rawVelocity = new Float32Array(n * 2);
  const rawDepth = new Float32Array(n);
  const rawSizePx = new Float32Array(n);
  const rawBaseOpacity = new Float32Array(n);
  const rawTwinklePhase = new Float32Array(n);
  const rawTwinkleFreq = new Float32Array(n);
  const rawColorNorm = new Float32Array(n * 3);
  const rawPaletteIndex = new Uint8Array(n);

  const zoneBuckets: Record<OuterZone, number[]> = {
    left: [],
    right: [],
    top: [],
    bottom: [],
    boundary: [],
    interior: [],
  };

  const stride = LAYER_CELL_STRIDES[spec.id] || 173;

  for (let i = 0; i < n; i++) {
    const sampleIdx = i + 1 + spec.seed * 1009;
    const h2 = halton(sampleIdx, 2);
    const h3 = halton(sampleIdx, 3);
    const h5 = halton(sampleIdx, 5);
    const h7 = halton(sampleIdx, 7);
    const h11 = halton(sampleIdx, 11);
    const h13 = halton(sampleIdx, 13);

    const cellIdx = (i * stride + spec.seed) % STRATIFIED_MICRO_TOTAL;
    const cellCol = cellIdx % STRATIFIED_MICRO_COLS;
    const cellRow = Math.floor(cellIdx / STRATIFIED_MICRO_COLS);

    const rawU = (cellCol + h2) / STRATIFIED_MICRO_COLS;
    const rawV = (cellRow + h3) / STRATIFIED_MICRO_ROWS;
    const { du, dv } = computeOrganicClusterOffset(rawU, rawV, spec.seed, h5);

    const u0 = (((rawU + du) % 1) + 1) % 1;
    const v0 = (((rawV + dv) % 1) + 1) % 1;

    rawUv0[i * 2] = u0;
    rawUv0[i * 2 + 1] = v0;

    const d = spec.minDepth + (spec.maxDepth - spec.minDepth) * Math.pow(h5, 0.85);
    rawDepth[i] = d;

    const depthSpeedFactor = 1.18 / Math.pow(d, 0.58);
    const vu =
      spec.driftU * depthSpeedFactor + (h7 - 0.5) * 2.0 * spec.velocitySpread;
    const vv =
      spec.driftV * depthSpeedFactor + (h11 - 0.5) * 2.0 * spec.velocitySpread;
    rawVelocity[i * 2] = vu;
    rawVelocity[i * 2 + 1] = vv;

    const sizeVariation = 0.74 + Math.pow(h11, 1.3) * 0.72;
    rawSizePx[i] = spec.baseSizePx * sizeVariation;

    const opacityVariation = 0.66 + h7 * 0.48;
    rawBaseOpacity[i] = Math.min(0.98, spec.baseOpacity * opacityVariation);

    rawTwinklePhase[i] = h13 * Math.PI * 2;
    rawTwinkleFreq[i] = spec.twinkleFreq * (0.76 + h5 * 0.52);

    const pIdx = (i + Math.floor(h7 * 11)) % spec.paletteRgb.length;
    rawPaletteIndex[i] = pIdx;
    const rgb = spec.paletteRgb[pIdx];
    rawColorNorm[i * 3] = rgb[0] / 255;
    rawColorNorm[i * 3 + 1] = rgb[1] / 255;
    rawColorNorm[i * 3 + 2] = rgb[2] / 255;

    zoneBuckets[classifyOuterZone(u0, v0)].push(i);
  }

  // Balanced selection of `pCount` outer-perimeter stars across Left, Right, Top, Bottom & Boundary
  const selectedPeripheral = new Uint8Array(n);
  const peripheralOrder: number[] = [];

  const zoneTargets: readonly [OuterZone, number][] = [
    ['left', Math.round(pCount * 0.24)],
    ['right', Math.round(pCount * 0.24)],
    ['top', Math.round(pCount * 0.21)],
    ['bottom', Math.round(pCount * 0.21)],
    ['boundary', pCount],
  ];

  for (const [zone, quota] of zoneTargets) {
    if (peripheralOrder.length >= pCount) break;
    const bucket = zoneBuckets[zone];
    if (bucket.length === 0) continue;
    const takeCount = Math.min(quota, pCount - peripheralOrder.length, bucket.length);
    for (let k = 0; k < takeCount; k++) {
      // Deterministic stratified pick across the zone bucket
      const pickPos = Math.floor(((k + 0.5) * bucket.length) / takeCount);
      const rawIdx = bucket[pickPos];
      if (!selectedPeripheral[rawIdx]) {
        selectedPeripheral[rawIdx] = 1;
        peripheralOrder.push(rawIdx);
      }
    }
  }

  // Fallback fill from remaining outer zones if rounding left any slack
  const fillZones: readonly OuterZone[] = ['left', 'right', 'top', 'bottom', 'boundary', 'interior'];
  for (const zone of fillZones) {
    if (peripheralOrder.length >= pCount) break;
    for (const rawIdx of zoneBuckets[zone]) {
      if (peripheralOrder.length >= pCount) break;
      if (!selectedPeripheral[rawIdx]) {
        selectedPeripheral[rawIdx] = 1;
        peripheralOrder.push(rawIdx);
      }
    }
  }

  const reorderedIndices: number[] = [...peripheralOrder];
  for (let i = 0; i < n; i++) {
    if (!selectedPeripheral[i]) {
      reorderedIndices.push(i);
    }
  }

  const uv0 = new Float32Array(n * 2);
  const velocity = new Float32Array(n * 2);
  const depth = new Float32Array(n);
  const sizePx = new Float32Array(n);
  const baseOpacity = new Float32Array(n);
  const twinklePhase = new Float32Array(n);
  const twinkleFreq = new Float32Array(n);
  const colorNorm = new Float32Array(n * 3);
  const paletteIndex = new Uint8Array(n);
  const isPeripheral = new Float32Array(n);

  for (let dst = 0; dst < n; dst++) {
    const src = reorderedIndices[dst];
    const isPeriph = dst < pCount;
    isPeripheral[dst] = isPeriph ? 1.0 : 0.0;

    const u = rawUv0[src * 2];
    const v = rawUv0[src * 2 + 1];
    uv0[dst * 2] = u;
    uv0[dst * 2 + 1] = v;

    // Guide outer-margin peripheral stars smoothly along their outer band so
    // Mode B maintains clean dark-margin framing over long sessions while Mode A stays rich
    if (isPeriph) {
      const zone = classifyOuterZone(u, v);
      const speedMag = Math.max(
        0.0014,
        Math.hypot(rawVelocity[src * 2], rawVelocity[src * 2 + 1])
      );
      if (zone === 'left' || zone === 'right') {
        const signV = rawVelocity[src * 2 + 1] >= 0 ? 1 : -1;
        velocity[dst * 2] = (rawVelocity[src * 2] * 0.12);
        velocity[dst * 2 + 1] = signV * speedMag * 0.85;
      } else if (zone === 'top' || zone === 'bottom') {
        const signU = rawVelocity[src * 2] >= 0 ? 1 : -1;
        velocity[dst * 2] = signU * speedMag * 0.85;
        velocity[dst * 2 + 1] = rawVelocity[src * 2 + 1] * 0.12;
      } else {
        // Gentle tangent flow along the outer orbital boundary
        const rx = u - 0.5;
        const ry = v - 0.5;
        const rLen = Math.max(0.05, Math.hypot(rx, ry));
        velocity[dst * 2] = (-ry / rLen) * speedMag * 0.65;
        velocity[dst * 2 + 1] = (rx / rLen) * speedMag * 0.65;
      }
    } else {
      velocity[dst * 2] = rawVelocity[src * 2];
      velocity[dst * 2 + 1] = rawVelocity[src * 2 + 1];
    }

    depth[dst] = rawDepth[src];
    sizePx[dst] = rawSizePx[src];
    baseOpacity[dst] = rawBaseOpacity[src];
    twinklePhase[dst] = rawTwinklePhase[src];
    twinkleFreq[dst] = rawTwinkleFreq[src];
    paletteIndex[dst] = rawPaletteIndex[src];
    colorNorm[dst * 3] = rawColorNorm[src * 3];
    colorNorm[dst * 3 + 1] = rawColorNorm[src * 3 + 1];
    colorNorm[dst * 3 + 2] = rawColorNorm[src * 3 + 2];
  }

  const data: StarfieldLayerData = {
    spec,
    count: n,
    peripheralCount: pCount,
    uv0,
    velocity,
    depth,
    sizePx,
    baseOpacity,
    twinklePhase,
    twinkleFreq,
    colorNorm,
    paletteIndex,
    isPeripheral,
  };

  LAYER_DATA_CACHE.set(spec.id, data);
  return data;
}

/**
 * Generates a 3D world-space position Float32Array (length = spec.count * 3)
 * projected from the screen-space UV + frustum depth model at `timeSec` for `viewportAspect`.
 */
export function generateStratifiedStarLayer(
  spec: StarLayerSpec,
  viewportAspect = 16 / 9,
  timeSec = 0
): Float32Array {
  const data = generateScreenSpaceStarLayerData(spec);
  const positions = new Float32Array(spec.count * 3);
  const tanHalfFov = Math.tan((75 * Math.PI) / 360);
  const cameraZ = 1.0;
  const clampedAspect = Math.max(0.35, Math.min(3.5, viewportAspect));

  for (let i = 0; i < data.count; i++) {
    const u0 = data.uv0[i * 2];
    const v0 = data.uv0[i * 2 + 1];
    const vu = data.velocity[i * 2];
    const vv = data.velocity[i * 2 + 1];
    const d = data.depth[i];
    const phase = data.twinklePhase[i];

    const swayU = Math.sin(timeSec * 0.42 + phase) * spec.swayAmp;
    const swayV = Math.cos(timeSec * 0.36 + phase * 1.3) * spec.swayAmp;

    const u = ((((u0 + vu * timeSec + swayU) % 1) + 1) % 1);
    const v = ((((v0 + vv * timeSec + swayV) % 1) + 1) % 1);

    const halfHeight = d * tanHalfFov;
    const halfWidth = halfHeight * clampedAspect;

    positions[i * 3] = (2 * u - 1) * halfWidth;
    positions[i * 3 + 1] = (1 - 2 * v) * halfHeight;
    positions[i * 3 + 2] = cameraZ - d;
  }

  return positions;
}

/**
 * Delicate Stellar Motion Trails Specification
 * 3 staggered celestial streak slots calibrated so strictly 1–2 subtle trails
 * are visible simultaneously at any moment.
 */
export interface StellarTrailSpec {
  id: number;
  startU: number;
  startV: number;
  dirX: number;
  dirY: number;
  speedUv: number;
  lengthPx: number;
  periodSec: number;
  activeDurationSec: number;
  phaseOffsetSec: number;
  maxOpacity: number;
  colorRgb: [number, number, number];
}

export const STELLAR_TRAIL_SPECS: readonly StellarTrailSpec[] = [
  {
    id: 0,
    startU: 0.16,
    startV: 0.14,
    dirX: 0.88,
    dirY: 0.47,
    speedUv: 0.042,
    lengthPx: 42,
    periodSec: 10.5,
    activeDurationSec: 5.6,
    phaseOffsetSec: 0.5,
    maxOpacity: 0.26,
    colorRgb: [233, 213, 255],
  },
  {
    id: 1,
    startU: 0.84,
    startV: 0.2,
    dirX: -0.84,
    dirY: 0.54,
    speedUv: 0.04,
    lengthPx: 48,
    periodSec: 10.5,
    activeDurationSec: 5.6,
    phaseOffsetSec: 4.0,
    maxOpacity: 0.24,
    colorRgb: [224, 231, 255],
  },
  {
    id: 2,
    startU: 0.24,
    startV: 0.82,
    dirX: 0.91,
    dirY: -0.41,
    speedUv: 0.039,
    lengthPx: 38,
    periodSec: 10.5,
    activeDurationSec: 5.6,
    phaseOffsetSec: 7.5,
    maxOpacity: 0.23,
    colorRgb: [216, 180, 254],
  },
] as const;

export interface ActiveStellarTrailState {
  id: number;
  headU: number;
  headV: number;
  tailU: number;
  tailV: number;
  opacity: number;
  colorRgb: [number, number, number];
}

/**
 * Evaluates active stellar motion trails at `timeSec` for a given viewport `(width, height)`.
 * In Skills mode, trails intersecting the bright central planetary area are cleanly suppressed.
 */
export function evaluateStellarTrails(
  timeSec: number,
  width = 1440,
  height = 900,
  skillsRegion?: SkillsRegionMetrics
): ActiveStellarTrailState[] {
  const active: ActiveStellarTrailState[] = [];
  const safeW = Math.max(320, width);
  const safeH = Math.max(320, height);

  for (let i = 0; i < STELLAR_TRAIL_SPECS.length; i++) {
    const spec = STELLAR_TRAIL_SPECS[i];
    const tCycle = (timeSec + spec.phaseOffsetSec) % spec.periodSec;
    if (tCycle > spec.activeDurationSec) continue;

    const progress = tCycle / spec.activeDurationSec;
    const envelope = Math.sin(progress * Math.PI);
    if (envelope <= 0.02) continue;

    const cycleIndex = Math.floor((timeSec + spec.phaseOffsetSec) / spec.periodSec);
    const cycleShiftU = (cycleIndex * 0.173) % 0.6;
    const cycleShiftV = (cycleIndex * 0.127) % 0.5;

    const baseU = 0.1 + ((spec.startU + cycleShiftU) % 0.8);
    const baseV = 0.1 + ((spec.startV + cycleShiftV) % 0.8);

    const distUv = tCycle * spec.speedUv;
    const headU = baseU + spec.dirX * distUv;
    const headV = baseV + spec.dirY * distUv;

    const lenU = (spec.dirX * spec.lengthPx) / safeW;
    const lenV = (spec.dirY * spec.lengthPx) / safeH;
    const tailU = headU - lenU;
    const tailV = headV - lenV;

    let skillsAttenuation = 1.0;
    if (skillsRegion && skillsRegion.mix > 0.01) {
      const midU = (headU + tailU) * 0.5;
      const midV = (headV + tailV) * 0.5;
      const eDist = Math.hypot(
        (midU - skillsRegion.centerU) / Math.max(0.05, skillsRegion.radiusU),
        (midV - skillsRegion.centerV) / Math.max(0.05, skillsRegion.radiusV)
      );
      const trailMask = smoothstep(0.95, 1.25, eDist);
      skillsAttenuation =
        1.0 + (trailMask * 0.55 - 1.0) * skillsRegion.mix;
      if (skillsAttenuation <= 0.02) continue;
    }

    active.push({
      id: spec.id,
      headU,
      headV,
      tailU,
      tailV,
      opacity: spec.maxOpacity * envelope * skillsAttenuation,
      colorRgb: spec.colorRgb,
    });
  }

  return active;
}

export interface StarfieldCoverageReport {
  layerCounts: Record<StarLayerSpec['id'], number>;
  totalStars: number;
  visibleStars: number;
  gridCols: number;
  gridRows: number;
  gridCells: number[];
  minCellCount: number;
  maxCellCount: number;
  meanCellCount: number;
  emptyCellCount: number;
  cellsWithAtLeast32Count: number;
  cellsWithAtLeast32Pct: number;
  cellsWithAtLeast38Count: number;
  cellsWithAtLeast38Pct: number;
  quadrants: {
    upperLeft: number;
    upperRight: number;
    lowerLeft: number;
    lowerRight: number;
  };
  corners: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
  edges: {
    leftEdge: number;
    rightEdge: number;
    topEdge: number;
    bottomEdge: number;
  };
  centerRegion: number;
}

/**
 * Mode A Diagnostics — Full-Screen 5,500-Star Global Environment
 */
export function evaluateStarfieldCoverage(
  width = 1440,
  height = 900,
  timeSec = 0
): StarfieldCoverageReport {
  const aspect = width / height;
  const isPortrait = width < height;
  const gridCols = isPortrait ? 8 : 12;
  const gridRows = isPortrait ? 12 : 8;
  const totalCells = gridCols * gridRows;
  const gridCells = new Array<number>(totalCells).fill(0);

  const tanHalfFov = Math.tan((75 * Math.PI) / 360);
  const cameraZ = 1.0;

  const layerCounts: Record<StarLayerSpec['id'], number> = {
    tiny: 0,
    medium: 0,
    bright: 0,
    accent: 0,
  };
  const quadrants = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
  const corners = { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 };
  const edges = { leftEdge: 0, rightEdge: 0, topEdge: 0, bottomEdge: 0 };
  let centerRegion = 0;
  let visibleStars = 0;

  for (const spec of STARFIELD_LAYER_SPECS) {
    const worldPositions = generateStratifiedStarLayer(spec, aspect, timeSec);
    layerCounts[spec.id] = worldPositions.length / 3;

    for (let i = 0; i < worldPositions.length; i += 3) {
      const worldX = worldPositions[i];
      const worldY = worldPositions[i + 1];
      const worldZ = worldPositions[i + 2];

      const dist = cameraZ - worldZ;
      if (dist <= 0.05) continue;

      const halfHeight = dist * tanHalfFov;
      const halfWidth = halfHeight * aspect;

      const ndcX = worldX / halfWidth;
      const ndcY = worldY / halfHeight;

      if (ndcX < -1.0 || ndcX > 1.0 || ndcY < -1.0 || ndcY > 1.0) continue;

      const nx = Math.min(0.999999, Math.max(0, (ndcX + 1.0) * 0.5));
      const ny = Math.min(0.999999, Math.max(0, (1.0 - ndcY) * 0.5));

      visibleStars++;

      const col = Math.min(gridCols - 1, Math.floor(nx * gridCols));
      const row = Math.min(gridRows - 1, Math.floor(ny * gridRows));
      gridCells[row * gridCols + col]++;

      if (nx < 0.5 && ny < 0.5) quadrants.upperLeft++;
      else if (nx >= 0.5 && ny < 0.5) quadrants.upperRight++;
      else if (nx < 0.5 && ny >= 0.5) quadrants.lowerLeft++;
      else quadrants.lowerRight++;

      if (nx < 0.25 && ny < 0.25) corners.topLeft++;
      if (nx >= 0.75 && ny < 0.25) corners.topRight++;
      if (nx < 0.25 && ny >= 0.75) corners.bottomLeft++;
      if (nx >= 0.75 && ny >= 0.75) corners.bottomRight++;

      if (nx < 0.15) edges.leftEdge++;
      if (nx >= 0.85) edges.rightEdge++;
      if (ny < 0.15) edges.topEdge++;
      if (ny >= 0.85) edges.bottomEdge++;

      if (nx >= 0.3 && nx <= 0.7 && ny >= 0.3 && ny <= 0.7) centerRegion++;
    }
  }

  let minCellCount = Infinity;
  let maxCellCount = 0;
  let emptyCellCount = 0;
  let cellsWithAtLeast32Count = 0;
  let cellsWithAtLeast38Count = 0;

  for (let c = 0; c < totalCells; c++) {
    const cnt = gridCells[c];
    if (cnt < minCellCount) minCellCount = cnt;
    if (cnt > maxCellCount) maxCellCount = cnt;
    if (cnt === 0) emptyCellCount++;
    if (cnt >= 32) cellsWithAtLeast32Count++;
    if (cnt >= 38) cellsWithAtLeast38Count++;
  }

  const totalStars =
    layerCounts.tiny + layerCounts.medium + layerCounts.bright + layerCounts.accent;
  const meanCellCount = parseFloat((visibleStars / totalCells).toFixed(2));
  const cellsWithAtLeast32Pct = parseFloat(
    ((cellsWithAtLeast32Count / totalCells) * 100).toFixed(2)
  );
  const cellsWithAtLeast38Pct = parseFloat(
    ((cellsWithAtLeast38Count / totalCells) * 100).toFixed(2)
  );

  return {
    layerCounts,
    totalStars,
    visibleStars,
    gridCols,
    gridRows,
    gridCells,
    minCellCount: minCellCount === Infinity ? 0 : minCellCount,
    maxCellCount,
    meanCellCount,
    emptyCellCount,
    cellsWithAtLeast32Count,
    cellsWithAtLeast32Pct,
    cellsWithAtLeast38Count,
    cellsWithAtLeast38Pct,
    quadrants,
    corners,
    edges,
    centerRegion,
  };
}

export interface SkillsPeripheralCoverageReport {
  drawnCount: number;
  culledCount: number;
  visibleOuterCount: number;
  coreLeakCount: number;
  layerDrawnCounts: Record<StarLayerSpec['id'], number>;
  outerZones: {
    left: number;
    right: number;
    top: number;
    bottom: number;
    boundary: number;
  };
}

/**
 * Mode B Diagnostics — Skills Peripheral Particle Mode (Precomputed 800-star subset via drawRange)
 */
export function evaluateSkillsPeripheralCoverage(
  width = 1440,
  height = 900,
  timeSec = 0,
  customRegion?: SkillsRegionMetrics
): SkillsPeripheralCoverageReport {
  const isMobile = width < 768;
  const region: SkillsRegionMetrics = customRegion ?? {
    centerU: 0.5,
    centerV: 0.51,
    radiusU: isMobile ? 0.39 : 0.35,
    radiusV: isMobile ? 0.32 : 0.36,
    mix: 1.0,
  };

  let drawnCount = 0;
  let visibleOuterCount = 0;
  let coreLeakCount = 0;

  const layerDrawnCounts: Record<StarLayerSpec['id'], number> = {
    tiny: 0,
    medium: 0,
    bright: 0,
    accent: 0,
  };
  const outerZones = { left: 0, right: 0, top: 0, bottom: 0, boundary: 0 };

  for (const spec of STARFIELD_LAYER_SPECS) {
    const data = generateScreenSpaceStarLayerData(spec);
    const activeLimit = data.peripheralCount;
    layerDrawnCounts[spec.id] = activeLimit;
    drawnCount += activeLimit;

    for (let i = 0; i < activeLimit; i++) {
      const u0 = data.uv0[i * 2];
      const v0 = data.uv0[i * 2 + 1];
      const vu = data.velocity[i * 2];
      const vv = data.velocity[i * 2 + 1];
      const phase = data.twinklePhase[i];

      const swayU = Math.sin(timeSec * 0.42 + phase) * spec.swayAmp;
      const swayV = Math.cos(timeSec * 0.36 + phase * 1.3) * spec.swayAmp;

      const u = ((((u0 + vu * timeSec + swayU) % 1) + 1) % 1);
      const v = ((((v0 + vv * timeSec + swayV) % 1) + 1) % 1);

      const vis = computeStarVisibilityFactor(u, v, true, region);
      const eDist = Math.hypot(
        (u - region.centerU) / Math.max(0.05, region.radiusU),
        (v - region.centerV) / Math.max(0.05, region.radiusV)
      );

      if (eDist <= 0.72 && vis > 0.01) {
        coreLeakCount++;
      }

      if (vis > 0.05) {
        visibleOuterCount++;
        if (u < 0.22) outerZones.left++;
        if (u > 0.78) outerZones.right++;
        if (v < 0.22) outerZones.top++;
        if (v > 0.78) outerZones.bottom++;
        if (eDist >= 0.76 && eDist <= 1.2) outerZones.boundary++;
      }
    }
  }

  return {
    drawnCount,
    culledCount: TOTAL_STARFIELD_COUNT - drawnCount,
    visibleOuterCount,
    coreLeakCount,
    layerDrawnCounts,
    outerZones,
  };
}

/**
 * Custom GPU Shader for the Dual-Mode Global Cosmic Starfield
 * - Mode A (uSkillsMix = 0): Full 5,500-star screen-space field
 * - Mode B (uSkillsMix = 1): 800-star peripheral subset via drawRange, with
 *   real-time elliptical occlusion tracking the actual Skills atmospheric region
 */
const STARFIELD_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform float uPixelRatio;
  uniform float uViewportScale;
  uniform float uTwinkleAmp;
  uniform float uSwayAmp;
  uniform float uIsGlintLayer;
  uniform vec4 uSkillsRectUv;
  uniform float uSkillsMix;

  attribute vec2 aUv0;
  attribute vec2 aVelocity;
  attribute float aDepth;
  attribute float aSizePx;
  attribute float aBaseOpacity;
  attribute float aTwinklePhase;
  attribute float aTwinkleFreq;
  attribute vec3 aColor;
  attribute float aIsPeripheral;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vIsGlint;

  void main() {
    vec2 sway = vec2(
      sin(uTime * 0.42 + aTwinklePhase) * uSwayAmp,
      cos(uTime * 0.36 + aTwinklePhase * 1.3) * uSwayAmp
    );
    vec2 uv = fract(aUv0 + aVelocity * uTime + sway);

    // Dynamic Skills Atmospheric Occlusion & Mode Blend
    float skillsVisibility = 1.0;
    if (uSkillsMix > 0.0005) {
      vec2 deltaSkills = (uv - uSkillsRectUv.xy) / max(uSkillsRectUv.zw, vec2(0.05));
      float eDist = length(deltaSkills);
      float coreMask = smoothstep(0.74, 1.14, eDist);
      float interiorFade = clamp(1.0 - uSkillsMix / 0.86, 0.0, 1.0);
      float earlyCoreSuppression = mix(1.0, coreMask, smoothstep(0.0, 0.5, uSkillsMix));
      skillsVisibility = mix(
        interiorFade * earlyCoreSuppression,
        mix(1.0, coreMask * 0.88, uSkillsMix),
        aIsPeripheral
      );
    }

    // Cull occluded vertices outside clip space before fragment stage
    if (skillsVisibility <= 0.005) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vAlpha = 0.0;
      vColor = aColor;
      vIsGlint = uIsGlintLayer;
      return;
    }

    float tanHalfFov = 0.767326988; // tan(75 deg / 2)
    float overscan = 1.015;

    float halfHeight = aDepth * tanHalfFov * overscan;
    float halfWidth = halfHeight * uAspect;

    vec3 worldPos = vec3(
      (2.0 * uv.x - 1.0) * halfWidth,
      (1.0 - 2.0 * uv.y) * halfHeight,
      1.0 - aDepth
    );

    vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vec2 centeredUv = abs(uv * 2.0 - 1.0);
    float edgePresence = smoothstep(0.48, 0.98, max(centeredUv.x, centeredUv.y));
    float lowerPresence = smoothstep(0.58, 0.98, uv.y);
    float marginBoost = 1.0 + 0.12 * max(edgePresence, lowerPresence);

    float twinkle = sin(uTime * aTwinkleFreq + aTwinklePhase) * uTwinkleAmp;
    float alphaScale = mix(0.68, 1.0, uViewportScale);
    vAlpha = clamp((aBaseOpacity + twinkle) * marginBoost * alphaScale * skillsVisibility, 0.0, 0.96);
    vColor = aColor;
    vIsGlint = uIsGlintLayer;

    float depthScale = 1.28 / pow(aDepth, 0.44);
    gl_PointSize = clamp(
      aSizePx * uViewportScale * uPixelRatio * depthScale * (1.0 + 0.06 * edgePresence),
      1.1,
      12.5
    );
  }
`;

const STARFIELD_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vIsGlint;

  void main() {
    if (vAlpha <= 0.005) discard;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r2 = dot(cxy, cxy);
    if (r2 > 1.0) discard;

    float core = exp(-r2 * 2.55);
    float halo = (1.0 - smoothstep(0.08, 1.0, r2)) * 0.44;
    float intensity = clamp(core + halo, 0.0, 1.0);

    if (vIsGlint > 0.5) {
      float crossX = exp(-abs(cxy.y) * 10.5) * exp(-abs(cxy.x) * 2.0);
      float crossY = exp(-abs(cxy.x) * 10.5) * exp(-abs(cxy.y) * 2.0);
      float glintSpikes = (crossX + crossY) * 0.58;
      intensity = clamp(intensity * 0.82 + glintSpikes, 0.0, 1.0);
    }

    gl_FragColor = vec4(vColor, vAlpha * intensity);
  }
`;

interface MutableSkillsTrackingState {
  centerU: number;
  centerV: number;
  radiusU: number;
  radiusV: number;
  targetMix: number;
  currentMix: number;
  mode: ParticleRenderMode;
  activeStars: number;
  prefersReducedMotion: boolean;
  isLowPerfDevice: boolean;
}

interface SkillsTrackerHandle {
  stateRef: React.MutableRefObject<MutableSkillsTrackingState>;
  prefersReducedMotion: boolean;
  isPageVisible: boolean;
  subscribeStaticRedraw: (cb: () => void) => () => void;
}

/**
 * Shared Skills Atmospheric Region Tracker
 * Combines IntersectionObserver, ResizeObserver, passive scroll listening, and
 * rAF-throttled layout measurement so DOM geometry is never read per animation frame.
 * Also tracks page visibility and reduced-motion state so callers can halt RAF/WebGL cleanly.
 */
function useSkillsAtmosphereTracker(
  containerRef: React.RefObject<HTMLDivElement | null>
): SkillsTrackerHandle {
  const initialReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const initialPageVisible =
    typeof document !== 'undefined' ? document.visibilityState !== 'hidden' : true;

  const initialLowPerf =
    typeof navigator !== 'undefined' &&
    ((typeof navigator.hardwareConcurrency === 'number' &&
      navigator.hardwareConcurrency <= 2) ||
      (typeof (navigator as unknown as { deviceMemory?: number }).deviceMemory ===
        'number' &&
        ((navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8) <= 2));

  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState<boolean>(initialReducedMotion);
  const [isPageVisible, setIsPageVisible] = useState<boolean>(initialPageVisible);
  const staticRedrawListenersRef = useRef<Set<() => void>>(new Set());

  const stateRef = useRef<MutableSkillsTrackingState>({
    centerU: 0.5,
    centerV: 0.5,
    radiusU: 0.36,
    radiusV: 0.36,
    targetMix: 0,
    currentMix: 0,
    mode: 'normal',
    activeStars: TOTAL_STARFIELD_COUNT,
    prefersReducedMotion: initialReducedMotion,
    isLowPerfDevice: initialLowPerf,
  });

  const subscribeStaticRedraw = React.useCallback((cb: () => void) => {
    staticRedrawListenersRef.current.add(cb);
    return () => {
      staticRedrawListenersRef.current.delete(cb);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const notifyStaticRedraw = () => {
      if (document.visibilityState === 'hidden') return;
      staticRedrawListenersRef.current.forEach((cb) => cb());
    };

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    stateRef.current.prefersReducedMotion = mq.matches;
    setPrefersReducedMotion(mq.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      stateRef.current.prefersReducedMotion = e.matches;
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        stateRef.current.currentMix = stateRef.current.targetMix;
        notifyStaticRedraw();
      }
    };
    mq.addEventListener('change', handleMotionChange);

    const handleVisibilityChange = () => {
      const visible = document.visibilityState !== 'hidden';
      setIsPageVisible(visible);
      if (visible && stateRef.current.prefersReducedMotion) {
        notifyStaticRedraw();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let skillsEl: HTMLElement | null = null;
    let isIntersecting = false;
    let measureRafId: number | null = null;
    let intersectionObserver: IntersectionObserver | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const syncDomDiagnostics = () => {
      const host = containerRef.current;
      if (!host) return;
      const st = stateRef.current;
      if (host.dataset.particleMode !== st.mode) {
        host.dataset.particleMode = st.mode;
      }
      const nextCountStr = String(st.activeStars);
      if (host.dataset.activeStars !== nextCountStr) {
        host.dataset.activeStars = nextCountStr;
      }
    };

    const measureSkillsBounds = () => {
      measureRafId = null;
      if (!skillsEl) {
        stateRef.current.targetMix = 0;
        return;
      }

      const rect = skillsEl.getBoundingClientRect();
      const vw = window.innerWidth || 1440;
      const vh = window.innerHeight || 900;
      const computed = computeSkillsRegionFromRect(rect, vw, vh);

      stateRef.current.centerU = computed.centerU;
      stateRef.current.centerV = computed.centerV;
      stateRef.current.radiusU = computed.radiusU;
      stateRef.current.radiusV = computed.radiusV;
      stateRef.current.targetMix = computed.targetMix;

      if (stateRef.current.prefersReducedMotion) {
        stateRef.current.currentMix = computed.targetMix;
        const isSkillsMode = computed.targetMix >= SKILLS_CULL_MIX_THRESHOLD;
        stateRef.current.mode = isSkillsMode ? 'skills' : 'normal';
        stateRef.current.activeStars = isSkillsMode
          ? TOTAL_PERIPHERAL_STARFIELD_COUNT
          : TOTAL_STARFIELD_COUNT;
        syncDomDiagnostics();
        notifyStaticRedraw();
      }
    };

    const scheduleMeasure = () => {
      if (measureRafId !== null) return;
      measureRafId = window.requestAnimationFrame(measureSkillsBounds);
    };

    const attachToSkillsElement = (el: HTMLElement) => {
      if (skillsEl === el) return;
      skillsEl = el;

      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isIntersecting = entry.isIntersecting;
          if (!isIntersecting) {
            stateRef.current.targetMix = 0;
          }
          scheduleMeasure();
        },
        { threshold: [0, 0.05, 0.15, 0.25, 0.4, 0.6, 0.8, 1.0] }
      );
      intersectionObserver.observe(el);

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          scheduleMeasure();
        });
        resizeObserver.observe(el);
      }

      scheduleMeasure();
    };

    const findSkillsElement = (): HTMLElement | null => {
      return (
        document.querySelector<HTMLElement>('[data-skills-atmosphere="true"]') ||
        document.getElementById('skills')
      );
    };

    const initialEl = findSkillsElement();
    if (initialEl) {
      attachToSkillsElement(initialEl);
    } else if (typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        const found = findSkillsElement();
        if (found) {
          attachToSkillsElement(found);
          mutationObserver?.disconnect();
          mutationObserver = null;
        }
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    const handleScroll = () => {
      if (!skillsEl) {
        const found = findSkillsElement();
        if (found) attachToSkillsElement(found);
      }
      scheduleMeasure();
    };

    const handleResize = () => {
      scheduleMeasure();
      if (stateRef.current.prefersReducedMotion) {
        notifyStaticRedraw();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    syncDomDiagnostics();

    return () => {
      mq.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      if (measureRafId !== null) window.cancelAnimationFrame(measureRafId);
    };
  }, [containerRef]);

  return {
    stateRef,
    prefersReducedMotion,
    isPageVisible,
    subscribeStaticRedraw,
  };
}

interface WebGLStarLayerProps {
  spec: StarLayerSpec;
  skillsTrackerRef: React.MutableRefObject<MutableSkillsTrackingState>;
}

const WebGLStarLayer: React.FC<WebGLStarLayerProps> = ({ spec, skillsTrackerRef }) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const lastDrawCountRef = useRef<number>(-1);

  const layerData = useMemo(() => generateScreenSpaceStarLayerData(spec), [spec]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const dummyPositions = new Float32Array(layerData.count * 3);
    geom.setAttribute('position', new THREE.BufferAttribute(dummyPositions, 3));
    geom.setAttribute('aUv0', new THREE.BufferAttribute(layerData.uv0, 2));
    geom.setAttribute('aVelocity', new THREE.BufferAttribute(layerData.velocity, 2));
    geom.setAttribute('aDepth', new THREE.BufferAttribute(layerData.depth, 1));
    geom.setAttribute('aSizePx', new THREE.BufferAttribute(layerData.sizePx, 1));
    geom.setAttribute(
      'aBaseOpacity',
      new THREE.BufferAttribute(layerData.baseOpacity, 1)
    );
    geom.setAttribute(
      'aTwinklePhase',
      new THREE.BufferAttribute(layerData.twinklePhase, 1)
    );
    geom.setAttribute(
      'aTwinkleFreq',
      new THREE.BufferAttribute(layerData.twinkleFreq, 1)
    );
    geom.setAttribute('aColor', new THREE.BufferAttribute(layerData.colorNorm, 3));
    geom.setAttribute(
      'aIsPeripheral',
      new THREE.BufferAttribute(layerData.isPeripheral, 1)
    );
    geom.setDrawRange(0, layerData.count);
    return geom;
  }, [layerData]);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: {
        value:
          typeof window !== 'undefined' && window.innerHeight > 0
            ? window.innerWidth / window.innerHeight
            : 16 / 9,
      },
      uPixelRatio: {
        value:
          typeof window !== 'undefined'
            ? Math.min(window.devicePixelRatio || 1, 2)
            : 1,
      },
      uViewportScale: {
        value:
          typeof window !== 'undefined'
            ? Math.max(0.58, Math.min(1.0, Math.min(window.innerWidth, window.innerHeight) / 900))
            : 1.0,
      },
      uTwinkleAmp: { value: spec.twinkleAmp },
      uSwayAmp: { value: spec.swayAmp },
      uIsGlintLayer: { value: spec.isGlintLayer },
      uSkillsRectUv: { value: new THREE.Vector4(0.5, 0.5, 0.36, 0.36) },
      uSkillsMix: { value: 0 },
    }),
    [spec.twinkleAmp, spec.swayAmp, spec.isGlintLayer]
  );

  useFrame((state) => {
    const tracker = skillsTrackerRef.current;
    const isSkillsDrawRange = tracker.currentMix >= SKILLS_CULL_MIX_THRESHOLD;
    const desiredCount = isSkillsDrawRange
      ? layerData.peripheralCount
      : layerData.count;

    if (lastDrawCountRef.current !== desiredCount) {
      geometry.setDrawRange(0, desiredCount);
      lastDrawCountRef.current = desiredCount;
    }

    if (materialRef.current) {
      const w = state.size.width || window.innerWidth || 1440;
      const h = state.size.height || window.innerHeight || 900;
      materialRef.current.uniforms.uTime.value = tracker.prefersReducedMotion
        ? 0
        : state.clock.elapsedTime;
      materialRef.current.uniforms.uAspect.value = w / Math.max(1, h);
      materialRef.current.uniforms.uPixelRatio.value = tracker.isLowPerfDevice
        ? 1
        : Math.min(state.gl.getPixelRatio(), 2);
      materialRef.current.uniforms.uViewportScale.value = Math.max(
        0.58,
        Math.min(1.0, Math.min(w, h) / 900)
      );
      materialRef.current.uniforms.uSkillsRectUv.value.set(
        tracker.centerU,
        tracker.centerV,
        tracker.radiusU,
        tracker.radiusV
      );
      materialRef.current.uniforms.uSkillsMix.value = tracker.currentMix;
    }
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={STARFIELD_VERTEX_SHADER}
        fragmentShader={STARFIELD_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

interface WebGLSkillsCoordinatorProps {
  skillsTrackerRef: React.MutableRefObject<MutableSkillsTrackingState>;
  hostContainerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Advances `currentMix` exponentially once per WebGL frame and syncs `data-particle-mode`
 * & `data-active-stars` on the container only when discrete mode flips.
 */
const WebGLSkillsCoordinator: React.FC<WebGLSkillsCoordinatorProps> = ({
  skillsTrackerRef,
  hostContainerRef,
}) => {
  const lastModeRef = useRef<ParticleRenderMode>('normal');
  const lastActiveCountRef = useRef<number>(TOTAL_STARFIELD_COUNT);

  useFrame((_, delta) => {
    const tracker = skillsTrackerRef.current;
    if (tracker.prefersReducedMotion) {
      tracker.currentMix = tracker.targetMix;
    } else {
      const dt = Math.min(delta, 0.25);
      const damp = 1 - Math.exp(-10.0 * dt);
      tracker.currentMix += (tracker.targetMix - tracker.currentMix) * damp;
      if (Math.abs(tracker.targetMix - tracker.currentMix) < 0.002) {
        tracker.currentMix = tracker.targetMix;
      }
    }

    const isSkills = tracker.currentMix >= SKILLS_CULL_MIX_THRESHOLD;
    const nextMode: ParticleRenderMode = isSkills ? 'skills' : 'normal';
    const nextActiveCount = isSkills
      ? TOTAL_PERIPHERAL_STARFIELD_COUNT
      : TOTAL_STARFIELD_COUNT;

    if (
      lastModeRef.current !== nextMode ||
      lastActiveCountRef.current !== nextActiveCount
    ) {
      lastModeRef.current = nextMode;
      lastActiveCountRef.current = nextActiveCount;
      tracker.mode = nextMode;
      tracker.activeStars = nextActiveCount;

      const host = hostContainerRef.current;
      if (host) {
        host.dataset.particleMode = nextMode;
        host.dataset.activeStars = String(nextActiveCount);
      }
    }
  });

  return null;
};

/**
 * WebGL Delicate Stellar Motion Trails (1–2 concurrent subtle streaks)
 */
const WebGLStellarTrails: React.FC<{
  skillsTrackerRef: React.MutableRefObject<MutableSkillsTrackingState>;
}> = ({ skillsTrackerRef }) => {
  const lineRef = useRef<THREE.LineSegments | null>(null);

  const { geometry, posArray, colArray } = useMemo(() => {
    const maxTrails = STELLAR_TRAIL_SPECS.length;
    const segmentsPerTrail = 8;
    const totalVertices = maxTrails * segmentsPerTrail * 2;
    const positions = new Float32Array(totalVertices * 3);
    const colors = new Float32Array(totalVertices * 3);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return { geometry: geom, posArray: positions, colArray: colors };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    const tracker = skillsTrackerRef.current;
    if (tracker.prefersReducedMotion) {
      geometry.setDrawRange(0, 0);
      return;
    }

    const w = state.size.width || window.innerWidth || 1440;
    const h = state.size.height || window.innerHeight || 900;
    const aspect = w / Math.max(1, h);
    const tanHalfFov = Math.tan((75 * Math.PI) / 360);
    const d = 1.05;
    const halfH = d * tanHalfFov;
    const halfW = halfH * aspect;

    const activeTrails = evaluateStellarTrails(state.clock.elapsedTime, w, h, {
      centerU: tracker.centerU,
      centerV: tracker.centerV,
      radiusU: tracker.radiusU,
      radiusV: tracker.radiusV,
      mix: tracker.currentMix,
    });

    const segmentsPerTrail = 8;
    const activeVerts = activeTrails.length * segmentsPerTrail * 2;
    geometry.setDrawRange(0, activeVerts);
    if (activeVerts === 0) return;

    for (let tIdx = 0; tIdx < activeTrails.length; tIdx++) {
      const tr = activeTrails[tIdx];
      const r = tr.colorRgb[0] / 255;
      const g = tr.colorRgb[1] / 255;
      const b = tr.colorRgb[2] / 255;

      for (let s = 0; s < segmentsPerTrail; s++) {
        const f0 = s / segmentsPerTrail;
        const f1 = (s + 1) / segmentsPerTrail;

        const u0 = tr.tailU + (tr.headU - tr.tailU) * f0;
        const v0 = tr.tailV + (tr.headV - tr.tailV) * f0;
        const u1 = tr.tailU + (tr.headU - tr.tailU) * f1;
        const v1 = tr.tailV + (tr.headV - tr.tailV) * f1;

        const baseVert = (tIdx * segmentsPerTrail + s) * 2;

        posArray[baseVert * 3] = (2 * u0 - 1) * halfW;
        posArray[baseVert * 3 + 1] = (1 - 2 * v0) * halfH;
        posArray[baseVert * 3 + 2] = 1.0 - d;

        posArray[(baseVert + 1) * 3] = (2 * u1 - 1) * halfW;
        posArray[(baseVert + 1) * 3 + 1] = (1 - 2 * v1) * halfH;
        posArray[(baseVert + 1) * 3 + 2] = 1.0 - d;

        const a0 = tr.opacity * Math.pow(f0, 1.6);
        const a1 = tr.opacity * Math.pow(f1, 1.6);

        colArray[baseVert * 3] = r * a0;
        colArray[baseVert * 3 + 1] = g * a0;
        colArray[baseVert * 3 + 2] = b * a0;

        colArray[(baseVert + 1) * 3] = r * a1;
        colArray[(baseVert + 1) * 3 + 1] = g * a1;
        colArray[(baseVert + 1) * 3 + 2] = b * a1;
      }
    }

    if (lineRef.current) {
      const posAttr = lineRef.current.geometry.getAttribute(
        'position'
      ) as THREE.BufferAttribute;
      const colAttr = lineRef.current.geometry.getAttribute(
        'color'
      ) as THREE.BufferAttribute;
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

interface StarBackgroundProps {
  skillsTrackerRef: React.MutableRefObject<MutableSkillsTrackingState>;
  hostContainerRef: React.RefObject<HTMLDivElement | null>;
  subscribeStaticRedraw: (cb: () => void) => () => void;
  prefersReducedMotion: boolean;
  isPageVisible: boolean;
}

const WebGLStaticInvalidator: React.FC<{
  subscribeStaticRedraw: (cb: () => void) => () => void;
  prefersReducedMotion: boolean;
  isPageVisible: boolean;
}> = ({ subscribeStaticRedraw, prefersReducedMotion, isPageVisible }) => {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (isPageVisible) {
      invalidate();
    }
    return subscribeStaticRedraw(() => {
      invalidate();
    });
  }, [invalidate, subscribeStaticRedraw, prefersReducedMotion, isPageVisible]);

  return null;
};

/**
 * StarBackground — Dual-Mode 4-Layer WebGL Starfield
 */
export const StarBackground: React.FC<StarBackgroundProps> = ({
  skillsTrackerRef,
  hostContainerRef,
  subscribeStaticRedraw,
  prefersReducedMotion,
  isPageVisible,
}) => {
  return (
    <group>
      <WebGLStaticInvalidator
        subscribeStaticRedraw={subscribeStaticRedraw}
        prefersReducedMotion={prefersReducedMotion}
        isPageVisible={isPageVisible}
      />
      <WebGLSkillsCoordinator
        skillsTrackerRef={skillsTrackerRef}
        hostContainerRef={hostContainerRef}
      />
      {STARFIELD_LAYER_SPECS.map((spec) => (
        <WebGLStarLayer
          key={spec.id}
          spec={spec}
          skillsTrackerRef={skillsTrackerRef}
        />
      ))}
      <WebGLStellarTrails skillsTrackerRef={skillsTrackerRef} />
    </group>
  );
};

interface StarBackground2DProps {
  skillsTrackerRef: React.MutableRefObject<MutableSkillsTrackingState>;
  hostContainerRef: React.RefObject<HTMLDivElement | null>;
  subscribeStaticRedraw: (cb: () => void) => () => void;
  prefersReducedMotion: boolean;
  isPageVisible: boolean;
}

/**
 * Fallback 2D Canvas Starfield (Full Dual-Mode Parity with WebGL)
 * - Normal Mode: iterates all 5,500 stars
 * - Skills Mode: iterates ONLY the precomputed 800-star outer-perimeter subset
 *   using the exact same `computeStarVisibilityFactor` mask and motion rules.
 * - True static rendering when `prefersReducedMotion` is active, pauses when hidden,
 *   and scales canvas backing store cleanly with capped devicePixelRatio.
 */
const StarBackground2D: React.FC<StarBackground2DProps> = ({
  skillsTrackerRef,
  hostContainerRef,
  subscribeStaticRedraw,
  prefersReducedMotion,
  isPageVisible,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;
    let width = window.innerWidth || 1440;
    let height = window.innerHeight || 900;

    const getCappedDpr = () => {
      const rawDpr = window.devicePixelRatio || 1;
      const cap = skillsTrackerRef.current.isLowPerfDevice ? 1 : 2;
      return Math.min(rawDpr, cap);
    };

    const syncCanvasSize = () => {
      width = window.innerWidth || 1440;
      height = window.innerHeight || 900;
      const dpr = getCappedDpr();
      const targetW = Math.max(1, Math.round(width * dpr));
      const targetH = Math.max(1, Math.round(height * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncCanvasSize();

    const layerDataList = STARFIELD_LAYER_SPECS.map((spec) =>
      generateScreenSpaceStarLayerData(spec)
    );
    const layerPaletteCss = layerDataList.map((d) =>
      d.spec.paletteRgb.map((rgb) => `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`)
    );

    let elapsedSec = 0;
    let lastTime = performance.now();
    let lastMode: ParticleRenderMode = 'normal';
    let lastActiveCount = TOTAL_STARFIELD_COUNT;

    const drawFrame = (time: number, isStatic: boolean) => {
      const rawDelta = Math.max(0.001, (time - lastTime) / 1000);
      const delta = Math.min(rawDelta, 0.25);
      lastTime = time;

      const tracker = skillsTrackerRef.current;
      if (isStatic || tracker.prefersReducedMotion) {
        tracker.currentMix = tracker.targetMix;
      } else {
        elapsedSec += Math.min(rawDelta, 0.1);
        const damp = 1 - Math.exp(-10.0 * delta);
        tracker.currentMix += (tracker.targetMix - tracker.currentMix) * damp;
        if (Math.abs(tracker.targetMix - tracker.currentMix) < 0.002) {
          tracker.currentMix = tracker.targetMix;
        }
      }

      const isSkillsMode = tracker.currentMix >= SKILLS_CULL_MIX_THRESHOLD;
      const nextMode: ParticleRenderMode = isSkillsMode ? 'skills' : 'normal';
      const nextActiveCount = isSkillsMode
        ? TOTAL_PERIPHERAL_STARFIELD_COUNT
        : TOTAL_STARFIELD_COUNT;

      if (lastMode !== nextMode || lastActiveCount !== nextActiveCount) {
        lastMode = nextMode;
        lastActiveCount = nextActiveCount;
        tracker.mode = nextMode;
        tracker.activeStars = nextActiveCount;
        if (hostContainerRef.current) {
          hostContainerRef.current.dataset.particleMode = nextMode;
          hostContainerRef.current.dataset.activeStars = String(nextActiveCount);
        }
      }

      const region: SkillsRegionMetrics = {
        centerU: tracker.centerU,
        centerV: tracker.centerV,
        radiusU: tracker.radiusU,
        radiusV: tracker.radiusV,
        mix: tracker.currentMix,
      };
      const evalTime = isStatic || tracker.prefersReducedMotion ? 0 : elapsedSec;

      ctx.clearRect(0, 0, width, height);

      // 1. Render active subset: 5,500 stars in Normal mode, 800 peripheral stars in Skills mode
      for (let l = 0; l < layerDataList.length; l++) {
        const data = layerDataList[l];
        const spec = data.spec;
        const paletteCss = layerPaletteCss[l];
        const activeLimit = isSkillsMode ? data.peripheralCount : data.count;

        for (let i = 0; i < activeLimit; i++) {
          const u0 = data.uv0[i * 2];
          const v0 = data.uv0[i * 2 + 1];
          const vu = data.velocity[i * 2];
          const vv = data.velocity[i * 2 + 1];
          const phase = data.twinklePhase[i];

          const swayU = Math.sin(evalTime * 0.42 + phase) * spec.swayAmp;
          const swayV = Math.cos(evalTime * 0.36 + phase * 1.3) * spec.swayAmp;

          const u = ((((u0 + vu * evalTime + swayU) % 1) + 1) % 1);
          const v = ((((v0 + vv * evalTime + swayV) % 1) + 1) % 1);

          const skillsVisibility = computeStarVisibilityFactor(
            u,
            v,
            data.isPeripheral[i] > 0.5,
            region
          );
          if (skillsVisibility <= 0.01) continue;

          const px = u * width;
          const py = v * height;

          const twinkle =
            !isStatic && !tracker.prefersReducedMotion && i % 3 === 0
              ? Math.sin(evalTime * data.twinkleFreq[i] + phase) * spec.twinkleAmp
              : 0;
          const alpha = Math.max(
            0,
            Math.min(0.96, (data.baseOpacity[i] + twinkle) * skillsVisibility)
          );
          if (alpha <= 0.01) continue;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = paletteCss[data.paletteIndex[i]];

          const drawSize = data.sizePx[i] * 0.78;
          ctx.fillRect(px, py, drawSize, drawSize);

          if (spec.isGlintLayer > 0.5) {
            const arm = drawSize * 1.65;
            ctx.fillRect(px - arm * 0.5, py, arm, 0.9);
            ctx.fillRect(px, py - arm * 0.5, 0.9, arm);
          }
        }
      }
      ctx.globalAlpha = 1;

      // 2. Render delicate stellar motion trails (disabled when reduced motion is active)
      if (!isStatic && !tracker.prefersReducedMotion) {
        const activeTrails = evaluateStellarTrails(evalTime, width, height, region);
        for (let tIdx = 0; tIdx < activeTrails.length; tIdx++) {
          const tr = activeTrails[tIdx];
          const x0 = tr.tailU * width;
          const y0 = tr.tailV * height;
          const x1 = tr.headU * width;
          const y1 = tr.headV * height;

          const grad = ctx.createLinearGradient(x0, y0, x1, y1);
          const [r, g, b] = tr.colorRgb;
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${tr.opacity.toFixed(3)})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }
    };

    const stopLoop = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const renderLoop = (time: number) => {
      animId = null;
      if (!isPageVisible || prefersReducedMotion || skillsTrackerRef.current.prefersReducedMotion) {
        return;
      }
      drawFrame(time, false);
      animId = requestAnimationFrame(renderLoop);
    };

    const handleResize = () => {
      syncCanvasSize();
      if (isPageVisible && (prefersReducedMotion || skillsTrackerRef.current.prefersReducedMotion)) {
        drawFrame(performance.now(), true);
      }
    };

    window.addEventListener('resize', handleResize);
    const unsubscribeRedraw = subscribeStaticRedraw(() => {
      if (isPageVisible && (prefersReducedMotion || skillsTrackerRef.current.prefersReducedMotion)) {
        drawFrame(performance.now(), true);
      }
    });

    if (isPageVisible) {
      if (prefersReducedMotion || skillsTrackerRef.current.prefersReducedMotion) {
        drawFrame(performance.now(), true);
      } else {
        lastTime = performance.now();
        animId = requestAnimationFrame(renderLoop);
      }
    }

    return () => {
      stopLoop();
      unsubscribeRedraw();
      window.removeEventListener('resize', handleResize);
    };
  }, [skillsTrackerRef, hostContainerRef, subscribeStaticRedraw, prefersReducedMotion, isPageVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block pointer-events-none"
      style={{ pointerEvents: 'none' }}
    />
  );
};

interface WebGLErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
  onFallback?: () => void;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  override state: WebGLErrorBoundaryState = { hasError: false };

  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown) {
    console.warn('WebGL not available or disabled, using 2D canvas fallback:', error);
    this.props.onFallback?.();
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = () => {
  const [canUseWebGL, setCanUseWebGL] = useState<boolean>(() => isWebGLAvailable());
  const hostContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    stateRef: skillsTrackerRef,
    prefersReducedMotion,
    isPageVisible,
    subscribeStaticRedraw,
  } = useSkillsAtmosphereTracker(hostContainerRef);

  useEffect(() => {
    setCanUseWebGL(isWebGLAvailable());
  }, []);

  const dprMax = skillsTrackerRef.current.isLowPerfDevice ? 1 : 2;
  const shouldAnimate = isPageVisible && !prefersReducedMotion;

  return (
    <div
      ref={hostContainerRef}
      className="particle-background fixed inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden"
      style={{ pointerEvents: 'none' }}
      data-particle-mode="normal"
      data-active-stars={String(TOTAL_STARFIELD_COUNT)}
      data-total-budget={String(TOTAL_STARFIELD_COUNT)}
      data-peripheral-budget={String(TOTAL_PERIPHERAL_STARFIELD_COUNT)}
      data-renderer={canUseWebGL ? 'webgl' : '2d'}
      data-motion-paused={shouldAnimate ? 'false' : 'true'}
      aria-hidden="true"
    >
      {canUseWebGL ? (
        <WebGLErrorBoundary
          onFallback={() => setCanUseWebGL(false)}
          fallback={
            <StarBackground2D
              skillsTrackerRef={skillsTrackerRef}
              hostContainerRef={hostContainerRef}
              subscribeStaticRedraw={subscribeStaticRedraw}
              prefersReducedMotion={prefersReducedMotion}
              isPageVisible={isPageVisible}
            />
          }
        >
          <Canvas
            frameloop={shouldAnimate ? 'always' : 'demand'}
            dpr={[1, dprMax]}
            style={{ pointerEvents: 'none' }}
            camera={{ position: [0, 0, 1], fov: 75 }}
            gl={{
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false,
            }}
          >
            <Suspense fallback={null}>
              <StarBackground
                skillsTrackerRef={skillsTrackerRef}
                hostContainerRef={hostContainerRef}
                subscribeStaticRedraw={subscribeStaticRedraw}
                prefersReducedMotion={prefersReducedMotion}
                isPageVisible={isPageVisible}
              />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      ) : (
        <StarBackground2D
          skillsTrackerRef={skillsTrackerRef}
          hostContainerRef={hostContainerRef}
          subscribeStaticRedraw={subscribeStaticRedraw}
          prefersReducedMotion={prefersReducedMotion}
          isPageVisible={isPageVisible}
        />
      )}
    </div>
  );
};

export default ParticleBackground;

