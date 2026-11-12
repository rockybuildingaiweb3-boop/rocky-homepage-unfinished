import React, { Component, useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isWebGLAvailable } from '../../utils';

export interface ParticleBackgroundProps {
  className?: string;
}

export interface StarLayerSpec {
  id: 'tiny' | 'medium' | 'bright' | 'accent';
  label: string;
  count: number;
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
 * GLOBAL STARFIELD REFINEMENT — 6,500 Active Visible Stars
 *
 * Calibrated 4-layer cosmic particle architecture:
 * - Layer 1 (tiny — Tiny Stellar Dust):     5,000 stars
 * - Layer 2 (medium — Medium Ambient Stars): 1,250 stars
 * - Layer 3 (bright — Bright Stars):          180 stars
 * - Layer 4 (accent — Accent Glints):          70 stars
 * - Total:                                  6,500 active visible stars
 */
export const STARFIELD_LAYER_SPECS: readonly StarLayerSpec[] = [
  {
    id: 'tiny',
    label: 'Layer 1 · Tiny Stellar Dust',
    count: 5000,
    minDepth: 1.32,
    maxDepth: 2.22,
    color: '#d8b4fe',
    paletteRgb: [
      [216, 180, 254],
      [196, 181, 253],
      [233, 213, 255],
      [178, 132, 248],
    ],
    baseSizePx: 1.85,
    baseOpacity: 0.56,
    driftU: 0.0031,
    driftV: -0.0019,
    velocitySpread: 0.0011,
    swayAmp: 0.0018,
    twinkleAmp: 0.12,
    twinkleFreq: 0.95,
    isGlintLayer: 0.0,
    seed: 101,
  },
  {
    id: 'medium',
    label: 'Layer 2 · Medium Ambient Stars',
    count: 1250,
    minDepth: 0.98,
    maxDepth: 1.62,
    color: '#f3e8ff',
    paletteRgb: [
      [243, 232, 255],
      [233, 213, 255],
      [250, 245, 255],
      [216, 180, 254],
    ],
    baseSizePx: 2.75,
    baseOpacity: 0.76,
    driftU: -0.0046,
    driftV: -0.0029,
    velocitySpread: 0.0015,
    swayAmp: 0.0026,
    twinkleAmp: 0.18,
    twinkleFreq: 1.35,
    isGlintLayer: 0.0,
    seed: 202,
  },
  {
    id: 'bright',
    label: 'Layer 3 · Bright Stars',
    count: 180,
    minDepth: 0.76,
    maxDepth: 1.24,
    color: '#ffffff',
    paletteRgb: [
      [255, 255, 255],
      [245, 243, 255],
      [224, 231, 255],
    ],
    baseSizePx: 3.95,
    baseOpacity: 0.9,
    driftU: 0.0068,
    driftV: -0.0042,
    velocitySpread: 0.0019,
    swayAmp: 0.0034,
    twinkleAmp: 0.24,
    twinkleFreq: 1.85,
    isGlintLayer: 0.0,
    seed: 303,
  },
  {
    id: 'accent',
    label: 'Layer 4 · Accent Glints',
    count: 70,
    minDepth: 0.68,
    maxDepth: 1.12,
    color: '#e9d5ff',
    paletteRgb: [
      [245, 240, 255],
      [233, 213, 255],
      [255, 255, 255],
      [224, 242, 254],
    ],
    baseSizePx: 5.2,
    baseOpacity: 0.95,
    driftU: -0.0054,
    driftV: 0.0035,
    velocitySpread: 0.0017,
    swayAmp: 0.0038,
    twinkleAmp: 0.32,
    twinkleFreq: 2.4,
    isGlintLayer: 1.0,
    seed: 404,
  },
] as const;

export const TOTAL_STARFIELD_COUNT = STARFIELD_LAYER_SPECS.reduce(
  (acc, s) => acc + s.count,
  0
);

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
}

/**
 * Stratified 24×16 screen-space micro-grid + Halton quasi-random discrepancy +
 * multi-harmonic organic cosmic clustering field.
 *
 * Ensures consistent density across all four corners, screen edges, upper and
 * lower regions with natural, slightly organic clustering and zero empty zones.
 */
const STRATIFIED_MICRO_COLS = 24;
const STRATIFIED_MICRO_ROWS = 16;
const STRATIFIED_MICRO_TOTAL = STRATIFIED_MICRO_COLS * STRATIFIED_MICRO_ROWS; // 384 cells

// Coprime permutation strides per layer so layers never stack on the same micro-cell order
const LAYER_CELL_STRIDES: Record<StarLayerSpec['id'], number> = {
  tiny: 173,
  medium: 211,
  bright: 137,
  accent: 251,
};

const LAYER_DATA_CACHE = new Map<StarLayerSpec['id'], StarfieldLayerData>();

/**
 * Computes a bounded, divergence-free organic clustering offset in UV space
 * so stars form subtle natural cosmic filaments without creating empty voids.
 */
function computeOrganicClusterOffset(
  u: number,
  v: number,
  seed: number,
  clusterSelector: number
): { du: number; dv: number } {
  const phase = seed * 0.17;
  // Multi-harmonic curl-like wave for natural galactic clustering
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

/**
 * Builds deterministic screen-space + frustum-depth particle data shared by both the
 * WebGL renderer (`StarBackground`) and the 2D Canvas fallback (`StarBackground2D`).
 */
export function generateScreenSpaceStarLayerData(
  spec: StarLayerSpec
): StarfieldLayerData {
  const cached = LAYER_DATA_CACHE.get(spec.id);
  if (cached && cached.count === spec.count) {
    return cached;
  }

  const n = spec.count;
  const uv0 = new Float32Array(n * 2);
  const velocity = new Float32Array(n * 2);
  const depth = new Float32Array(n);
  const sizePx = new Float32Array(n);
  const baseOpacity = new Float32Array(n);
  const twinklePhase = new Float32Array(n);
  const twinkleFreq = new Float32Array(n);
  const colorNorm = new Float32Array(n * 3);
  const paletteIndex = new Uint8Array(n);

  const stride = LAYER_CELL_STRIDES[spec.id] || 173;

  for (let i = 0; i < n; i++) {
    const sampleIdx = i + 1 + spec.seed * 1009;
    const h2 = halton(sampleIdx, 2);
    const h3 = halton(sampleIdx, 3);
    const h5 = halton(sampleIdx, 5);
    const h7 = halton(sampleIdx, 7);
    const h11 = halton(sampleIdx, 11);
    const h13 = halton(sampleIdx, 13);

    // 1. Stratified 24×16 micro-cell assignment with coprime permutation
    const cellIdx = (i * stride + spec.seed) % STRATIFIED_MICRO_TOTAL;
    const cellCol = cellIdx % STRATIFIED_MICRO_COLS;
    const cellRow = Math.floor(cellIdx / STRATIFIED_MICRO_COLS);

    // Sub-cell quasi-random placement + organic cosmic clustering modulation
    const rawU = (cellCol + h2) / STRATIFIED_MICRO_COLS;
    const rawV = (cellRow + h3) / STRATIFIED_MICRO_ROWS;
    const { du, dv } = computeOrganicClusterOffset(rawU, rawV, spec.seed, h5);

    const u0 = (((rawU + du) % 1) + 1) % 1;
    const v0 = (((rawV + dv) % 1) + 1) % 1;

    uv0[i * 2] = u0;
    uv0[i * 2 + 1] = v0;

    // 2. Depth assignment within [minDepth, maxDepth]
    const d = spec.minDepth + (spec.maxDepth - spec.minDepth) * Math.pow(h5, 0.85);
    depth[i] = d;

    // 3. Depth-dependent movement velocity with subtle per-star directional variation
    const depthSpeedFactor = 1.18 / Math.pow(d, 0.58);
    const vu =
      spec.driftU * depthSpeedFactor + (h7 - 0.5) * 2.0 * spec.velocitySpread;
    const vv =
      spec.driftV * depthSpeedFactor + (h11 - 0.5) * 2.0 * spec.velocitySpread;
    velocity[i * 2] = vu;
    velocity[i * 2 + 1] = vv;

    // 4. Individual optical size and base opacity variation (natural stellar magnitude spread)
    const sizeVariation = 0.74 + Math.pow(h11, 1.3) * 0.72;
    sizePx[i] = spec.baseSizePx * sizeVariation;

    const opacityVariation = 0.66 + h7 * 0.48;
    baseOpacity[i] = Math.min(0.98, spec.baseOpacity * opacityVariation);

    // 5. Twinkle phase and frequency
    twinklePhase[i] = h13 * Math.PI * 2;
    twinkleFreq[i] = spec.twinkleFreq * (0.76 + h5 * 0.52);

    // 6. Color palette assignment
    const pIdx = (i + Math.floor(h7 * 11)) % spec.paletteRgb.length;
    paletteIndex[i] = pIdx;
    const rgb = spec.paletteRgb[pIdx];
    colorNorm[i * 3] = rgb[0] / 255;
    colorNorm[i * 3 + 1] = rgb[1] / 255;
    colorNorm[i * 3 + 2] = rgb[2] / 255;
  }

  const data: StarfieldLayerData = {
    spec,
    count: n,
    uv0,
    velocity,
    depth,
    sizePx,
    baseOpacity,
    twinklePhase,
    twinkleFreq,
    colorNorm,
    paletteIndex,
  };

  LAYER_DATA_CACHE.set(spec.id, data);
  return data;
}

/**
 * Generates a 3D world-space position Float32Array (length = spec.count * 3)
 * projected from the screen-space UV + frustum depth model at `timeSec` for `viewportAspect`.
 *
 * Uses the exact perspective projection formula:
 *   halfHeight = d * tan(fov / 2)
 *   halfWidth  = halfHeight * aspect
 *   worldX     = (2 * u - 1) * halfWidth
 *   worldY     = (1 - 2 * v) * halfHeight
 *   worldZ     = cameraZ - d
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

    // Continuous drift + subtle harmonic sway, wrapped seamlessly in [0, 1)
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
 * 5 staggered celestial streak slots so 3–5 subtle trails are visible at most.
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
    speedUv: 0.046,
    lengthPx: 46,
    periodSec: 9.5,
    activeDurationSec: 5.8,
    phaseOffsetSec: 0.4,
    maxOpacity: 0.34,
    colorRgb: [233, 213, 255],
  },
  {
    id: 1,
    startU: 0.84,
    startV: 0.2,
    dirX: -0.84,
    dirY: 0.54,
    speedUv: 0.044,
    lengthPx: 54,
    periodSec: 11.0,
    activeDurationSec: 6.4,
    phaseOffsetSec: 2.1,
    maxOpacity: 0.3,
    colorRgb: [224, 231, 255],
  },
  {
    id: 2,
    startU: 0.24,
    startV: 0.82,
    dirX: 0.91,
    dirY: -0.41,
    speedUv: 0.042,
    lengthPx: 40,
    periodSec: 10.2,
    activeDurationSec: 6.0,
    phaseOffsetSec: 4.3,
    maxOpacity: 0.3,
    colorRgb: [216, 180, 254],
  },
  {
    id: 3,
    startU: 0.78,
    startV: 0.74,
    dirX: -0.89,
    dirY: -0.45,
    speedUv: 0.048,
    lengthPx: 58,
    periodSec: 12.5,
    activeDurationSec: 7.0,
    phaseOffsetSec: 6.2,
    maxOpacity: 0.32,
    colorRgb: [243, 232, 255],
  },
  {
    id: 4,
    startU: 0.52,
    startV: 0.12,
    dirX: 0.79,
    dirY: 0.61,
    speedUv: 0.045,
    lengthPx: 44,
    periodSec: 10.8,
    activeDurationSec: 6.2,
    phaseOffsetSec: 8.0,
    maxOpacity: 0.29,
    colorRgb: [196, 181, 253],
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
 */
export function evaluateStellarTrails(
  timeSec: number,
  width = 1440,
  height = 900
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

    active.push({
      id: spec.id,
      headU,
      headV,
      tailU: headU - lenU,
      tailV: headV - lenV,
      opacity: spec.maxOpacity * envelope,
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
 * Full-Screen Occupancy & Coverage Diagnostics (6,500-Star Configuration)
 *
 * Uses the exact same screen-space UV -> 3D world coordinate -> 75° FOV camera
 * perspective projection and wrapping rules as the WebGL renderer:
 * - Desktop (`width >= height`): 12 columns × 8 rows (96 cells, mean ~67.7 stars/cell)
 * - Mobile (`width < height`):   8 columns × 12 rows (96 cells, mean ~67.7 stars/cell)
 * - Evaluates at any `timeSec` (e.g. 0s, 10s, 30s, 60s) across 1440×900,
 *   1920×1080, 2048×1002, and 390×844.
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
  let cellsWithAtLeast38Count = 0;

  for (let c = 0; c < totalCells; c++) {
    const cnt = gridCells[c];
    if (cnt < minCellCount) minCellCount = cnt;
    if (cnt > maxCellCount) maxCellCount = cnt;
    if (cnt === 0) emptyCellCount++;
    if (cnt >= 38) cellsWithAtLeast38Count++;
  }

  const totalStars =
    layerCounts.tiny + layerCounts.medium + layerCounts.bright + layerCounts.accent;
  const meanCellCount = parseFloat((visibleStars / totalCells).toFixed(2));
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
    cellsWithAtLeast38Count,
    cellsWithAtLeast38Pct,
    quadrants,
    corners,
    edges,
    centerRegion,
  };
}

/**
 * Custom GPU Shader for the 6,500-Star Full-Screen Cosmic Starfield
 * - Seamless screen-space UV drift + gentle harmonic sway
 * - Dynamic aspect ratio projection (`uAspect` updated live from `state.size`)
 * - Subtle peripheral/corner luminance compensation so outer edges, corners,
 *   and lower regions against pure `#030014` remain richly visible
 * - Delicate 4-point cross-diffraction spikes for Layer 4 Accent Glints
 */
const STARFIELD_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAspect;
  uniform float uPixelRatio;
  uniform float uViewportScale;
  uniform float uTwinkleAmp;
  uniform float uSwayAmp;
  uniform float uIsGlintLayer;

  attribute vec2 aUv0;
  attribute vec2 aVelocity;
  attribute float aDepth;
  attribute float aSizePx;
  attribute float aBaseOpacity;
  attribute float aTwinklePhase;
  attribute float aTwinkleFreq;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vIsGlint;

  void main() {
    // Continuous screen-space drift + gentle harmonic sway wrapped seamlessly in [0, 1)
    vec2 sway = vec2(
      sin(uTime * 0.42 + aTwinklePhase) * uSwayAmp,
      cos(uTime * 0.36 + aTwinklePhase * 1.3) * uSwayAmp
    );
    vec2 uv = fract(aUv0 + aVelocity * uTime + sway);

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

    // Subtle peripheral/corner/lower-region presence boost against dark #030014 margins
    vec2 centeredUv = abs(uv * 2.0 - 1.0);
    float edgePresence = smoothstep(0.45, 0.98, max(centeredUv.x, centeredUv.y));
    float lowerPresence = smoothstep(0.55, 0.98, uv.y);
    float marginBoost = 1.0 + 0.16 * max(edgePresence, lowerPresence);

    float twinkle = sin(uTime * aTwinkleFreq + aTwinklePhase) * uTwinkleAmp;
    float alphaScale = mix(0.68, 1.0, uViewportScale);
    vAlpha = clamp((aBaseOpacity + twinkle) * marginBoost * alphaScale, 0.12, 1.0);
    vColor = aColor;
    vIsGlint = uIsGlintLayer;

    float depthScale = 1.34 / pow(aDepth, 0.45);
    gl_PointSize = clamp(
      aSizePx * uViewportScale * uPixelRatio * depthScale * (1.0 + 0.08 * edgePresence),
      1.15,
      15.0
    );
  }
`;

const STARFIELD_FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  varying float vIsGlint;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r2 = dot(cxy, cxy);
    if (r2 > 1.0) discard;

    // Crisp luminous stellar core + soft atmospheric halo
    float core = exp(-r2 * 2.35);
    float halo = (1.0 - smoothstep(0.08, 1.0, r2)) * 0.52;
    float intensity = clamp(core + halo, 0.0, 1.0);

    // Delicate 4-point celestial cross-glint for Layer 4 accent stars
    if (vIsGlint > 0.5) {
      float crossX = exp(-abs(cxy.y) * 9.5) * exp(-abs(cxy.x) * 1.8);
      float crossY = exp(-abs(cxy.x) * 9.5) * exp(-abs(cxy.y) * 1.8);
      float glintSpikes = (crossX + crossY) * 0.65;
      intensity = clamp(intensity * 0.85 + glintSpikes, 0.0, 1.0);
    }

    gl_FragColor = vec4(vColor, vAlpha * intensity);
  }
`;

interface WebGLStarLayerProps {
  spec: StarLayerSpec;
}

const WebGLStarLayer: React.FC<WebGLStarLayerProps> = ({ spec }) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

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
    return geom;
  }, [layerData]);

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
    }),
    [spec.twinkleAmp, spec.swayAmp, spec.isGlintLayer]
  );

  useFrame((state) => {
    if (materialRef.current) {
      const w = state.size.width || window.innerWidth || 1440;
      const h = state.size.height || window.innerHeight || 900;
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uAspect.value = w / Math.max(1, h);
      materialRef.current.uniforms.uPixelRatio.value = Math.min(
        state.gl.getPixelRatio(),
        2
      );
      materialRef.current.uniforms.uViewportScale.value = Math.max(
        0.58,
        Math.min(1.0, Math.min(w, h) / 900)
      );
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

/**
 * WebGL Delicate Stellar Motion Trails (3–5 concurrent subtle streaks)
 */
const WebGLStellarTrails: React.FC = () => {
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

  useFrame((state) => {
    const w = state.size.width || window.innerWidth || 1440;
    const h = state.size.height || window.innerHeight || 900;
    const aspect = w / Math.max(1, h);
    const tanHalfFov = Math.tan((75 * Math.PI) / 360);
    const d = 1.05;
    const halfH = d * tanHalfFov;
    const halfW = halfH * aspect;

    const activeTrails = evaluateStellarTrails(state.clock.elapsedTime, w, h);
    posArray.fill(0);
    colArray.fill(0);

    const segmentsPerTrail = 8;
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

/**
 * StarBackground — Multi-depth 4-layer WebGL Starfield (6,500 active visible stars + delicate trails)
 */
export const StarBackground: React.FC = () => {
  return (
    <group>
      {STARFIELD_LAYER_SPECS.map((spec) => (
        <WebGLStarLayer key={spec.id} spec={spec} />
      ))}
      <WebGLStellarTrails />
    </group>
  );
};

/**
 * Fallback 2D Canvas Starfield (Full 6,500-Star Data & Motion Parity with WebGL)
 * Shares the exact same `generateScreenSpaceStarLayerData` and `evaluateStellarTrails`
 * generators as the WebGL implementation.
 */
const StarBackground2D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const layerDataList = STARFIELD_LAYER_SPECS.map((spec) =>
      generateScreenSpaceStarLayerData(spec)
    );

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let elapsedSec = 0;
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      elapsedSec += delta;

      ctx.clearRect(0, 0, width, height);

      // 1. Render all 4 star layers (6,500 active visible stars)
      for (let l = 0; l < layerDataList.length; l++) {
        const data = layerDataList[l];
        const spec = data.spec;
        const palette = spec.paletteRgb;

        for (let i = 0; i < data.count; i++) {
          const u0 = data.uv0[i * 2];
          const v0 = data.uv0[i * 2 + 1];
          const vu = data.velocity[i * 2];
          const vv = data.velocity[i * 2 + 1];
          const phase = data.twinklePhase[i];

          const swayU = Math.sin(elapsedSec * 0.42 + phase) * spec.swayAmp;
          const swayV = Math.cos(elapsedSec * 0.36 + phase * 1.3) * spec.swayAmp;

          const u = ((((u0 + vu * elapsedSec + swayU) % 1) + 1) % 1);
          const v = ((((v0 + vv * elapsedSec + swayV) % 1) + 1) % 1);

          const px = u * width;
          const py = v * height;

          const twinkle =
            i % 3 === 0
              ? Math.sin(elapsedSec * data.twinkleFreq[i] + phase) * spec.twinkleAmp
              : 0;
          const alpha = Math.max(
            0.14,
            Math.min(0.98, data.baseOpacity[i] + twinkle)
          );

          const rgb = palette[data.paletteIndex[i]];
          ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha.toFixed(2)})`;

          const drawSize = data.sizePx[i] * 0.78;
          ctx.fillRect(px, py, drawSize, drawSize);

          // Subtle cross glint for Layer 4 accent glints
          if (spec.isGlintLayer > 0.5) {
            const arm = drawSize * 1.65;
            ctx.fillRect(px - arm * 0.5, py, arm, 0.9);
            ctx.fillRect(px, py - arm * 0.5, 0.9, arm);
          }
        }
      }

      // 2. Render delicate stellar motion trails (3–5 subtle streaks)
      const activeTrails = evaluateStellarTrails(elapsedSec, width, height);
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

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  useEffect(() => {
    setCanUseWebGL(isWebGLAvailable());
  }, []);

  return (
    <div
      className="particle-background fixed inset-0 w-full h-full z-0 pointer-events-none select-none overflow-hidden"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {canUseWebGL ? (
        <WebGLErrorBoundary fallback={<StarBackground2D />}>
          <Canvas
            style={{ pointerEvents: 'none' }}
            camera={{ position: [0, 0, 1], fov: 75 }}
            gl={{
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false,
            }}
          >
            <Suspense fallback={null}>
              <StarBackground />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      ) : (
        <StarBackground2D />
      )}
    </div>
  );
};

export default ParticleBackground;
