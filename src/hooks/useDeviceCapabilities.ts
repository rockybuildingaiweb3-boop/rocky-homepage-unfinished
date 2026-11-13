import { useEffect, useState } from 'react';
import { getGPUTier } from 'detect-gpu';
import {
  classifyViewportWidth,
  computeStudioWebGLEligibility,
  isMobileViewportWidth,
  type ViewportCategory,
} from '../features/device/deviceCapabilities';

export interface DeviceCapabilitiesSnapshot {
  viewportWidth: number;
  viewportCategory: ViewportCategory;
  isMobile: boolean;
  isTablet: boolean;
  prefersReducedMotion: boolean;
  hasCoarsePointer: boolean;
}

export interface GpuCapabilityResult {
  tier: number;
  fps: number;
  isMobileGpu: boolean;
  canUseStudioWebGL: boolean;
}

function readSnapshot(): DeviceCapabilitiesSnapshot {
  if (typeof window === 'undefined') {
    return {
      viewportWidth: 1440,
      viewportCategory: 'desktop',
      isMobile: false,
      isTablet: false,
      prefersReducedMotion: false,
      hasCoarsePointer: false,
    };
  }

  const width = window.innerWidth;
  const viewportCategory = classifyViewportWidth(width);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  return {
    viewportWidth: width,
    viewportCategory,
    isMobile: isMobileViewportWidth(width),
    isTablet: viewportCategory === 'tablet',
    prefersReducedMotion,
    hasCoarsePointer,
  };
}

let currentSnapshot: DeviceCapabilitiesSnapshot = readSnapshot();
const listeners = new Set<() => void>();
let isListening = false;
let resizeRafId: number | null = null;

function notifySubscribers() {
  const next = readSnapshot();
  const changed =
    next.viewportWidth !== currentSnapshot.viewportWidth ||
    next.viewportCategory !== currentSnapshot.viewportCategory ||
    next.isMobile !== currentSnapshot.isMobile ||
    next.prefersReducedMotion !== currentSnapshot.prefersReducedMotion ||
    next.hasCoarsePointer !== currentSnapshot.hasCoarsePointer;

  if (!changed) return;
  currentSnapshot = next;
  listeners.forEach((listener) => listener());
}

function ensureGlobalListeners() {
  if (isListening || typeof window === 'undefined') return;
  isListening = true;

  const handleResize = () => {
    if (resizeRafId !== null) return;
    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = null;
      notifySubscribers();
    });
  };

  window.addEventListener('resize', handleResize, { passive: true });
  const mobileMq = window.matchMedia('(max-width: 767px)');
  const tabletMq = window.matchMedia('(max-width: 1023px)');
  const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointerMq = window.matchMedia('(pointer: coarse)');
  mobileMq.addEventListener?.('change', notifySubscribers);
  tabletMq.addEventListener?.('change', notifySubscribers);
  reducedMotionMq.addEventListener?.('change', notifySubscribers);
  pointerMq.addEventListener?.('change', notifySubscribers);
}

export function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getDeviceCapabilitiesSnapshot(): DeviceCapabilitiesSnapshot {
  if (typeof window !== 'undefined' && !isListening) {
    currentSnapshot = readSnapshot();
  }
  return currentSnapshot;
}

let gpuProbePromise: Promise<GpuCapabilityResult> | null = null;

/**
 * Probes GPU capabilities once per session and shares the cached result across modules.
 */
export function probeGpuCapabilities(): Promise<GpuCapabilityResult> {
  if (typeof window === 'undefined') {
    return Promise.resolve({
      tier: 0,
      fps: 0,
      isMobileGpu: false,
      canUseStudioWebGL: false,
    });
  }

  if (!gpuProbePromise) {
    gpuProbePromise = (async () => {
      try {
        const prefersReducedMotion = getReducedMotionPreference();
        const gpuTier = await getGPUTier();
        const fps = gpuTier.fps ?? 60;
        const isMobileGpu = Boolean(gpuTier.isMobile);
        return {
          tier: gpuTier.tier,
          fps,
          isMobileGpu,
          canUseStudioWebGL: computeStudioWebGLEligibility({
            tier: gpuTier.tier,
            isMobile: isMobileGpu,
            fps,
            prefersReducedMotion,
          }),
        };
      } catch {
        return {
          tier: 0,
          fps: 0,
          isMobileGpu: false,
          canUseStudioWebGL: false,
        };
      }
    })();
  }

  return gpuProbePromise;
}

/**
 * Shared React hook backed by a single global resize/media listener for viewport
 * breakpoints, reduced-motion preference, and pointer type.
 */
export function useDeviceCapabilities(): DeviceCapabilitiesSnapshot {
  const [snapshot, setSnapshot] = useState<DeviceCapabilitiesSnapshot>(() =>
    getDeviceCapabilitiesSnapshot()
  );

  useEffect(() => {
    ensureGlobalListeners();
    notifySubscribers();
    setSnapshot(currentSnapshot);

    const onUpdate = () => setSnapshot(currentSnapshot);
    listeners.add(onUpdate);
    return () => {
      listeners.delete(onUpdate);
    };
  }, []);

  return snapshot;
}
