export interface StudioLoopStatusInput {
  isInViewport: boolean;
  isPageVisible: boolean;
  isReducedMotion: boolean;
  isIntroPlaying: boolean;
  isInteracting: boolean;
  currentPosition: number;
  targetPosition: number;
  speed: number;
  transitionUntilMs: number;
  nowMs: number;
  positionEpsilon?: number;
  speedEpsilon?: number;
}

/**
 * Determines whether the Studio RAF + WebGL loop must continue running on the next frame.
 * Stops completely when off-screen, tab-hidden, or settled in an idle state.
 */
export function shouldStudioLoopContinue({
  isInViewport,
  isPageVisible,
  isReducedMotion,
  isIntroPlaying,
  isInteracting,
  currentPosition,
  targetPosition,
  speed,
  transitionUntilMs,
  nowMs,
  positionEpsilon = 0.05,
  speedEpsilon = 0.05,
}: StudioLoopStatusInput): boolean {
  if (!isInViewport || !isPageVisible || isReducedMotion) {
    return false;
  }

  if (isIntroPlaying || isInteracting) {
    return true;
  }

  if (nowMs < transitionUntilMs) {
    return true;
  }

  const positionDelta = Math.abs(currentPosition - targetPosition);
  const absSpeed = Math.abs(speed);

  return positionDelta > positionEpsilon || absSpeed > speedEpsilon;
}

/**
 * Computes Three.js horizontal center offset from cached zero-translate baseLeft
 * and current track translation without calling getBoundingClientRect().
 */
export function computeMeshCenterOffsetX(
  cachedBaseLeft: number,
  currentTrackX: number,
  cachedWidth: number,
  viewportWidth: number
): number {
  const effectiveLeft = cachedBaseLeft + currentTrackX;
  return effectiveLeft - viewportWidth / 2 + cachedWidth / 2;
}

export type StudioWheelIntent =
  | { mode: 'horizontal'; delta: number; shouldPreventDefault: true }
  | { mode: 'vertical-passthrough'; delta: 0; shouldPreventDefault: false };

export interface StudioWheelInput {
  deltaX: number;
  deltaY: number;
  shiftKey: boolean;
  noiseThreshold?: number;
}

/**
 * Separates genuine horizontal Studio panning (trackpad horizontal swipe or Shift+Wheel)
 * from normal vertical mouse-wheel scrolling so regular wheel input never triggers
 * simultaneous page scroll and horizontal slider movement.
 */
export function resolveStudioWheelIntent({
  deltaX,
  deltaY,
  shiftKey,
  noiseThreshold = 2,
}: StudioWheelInput): StudioWheelIntent {
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (shiftKey) {
    const primaryDelta = absY >= absX ? deltaY : deltaX;
    if (Math.abs(primaryDelta) > noiseThreshold) {
      return { mode: 'horizontal', delta: primaryDelta, shouldPreventDefault: true };
    }
    return { mode: 'vertical-passthrough', delta: 0, shouldPreventDefault: false };
  }

  // Trackpad horizontal swipe: horizontal component strictly dominates vertical scroll
  if (absX > absY * 1.05 && absX > noiseThreshold) {
    return { mode: 'horizontal', delta: deltaX, shouldPreventDefault: true };
  }

  return { mode: 'vertical-passthrough', delta: 0, shouldPreventDefault: false };
}

export type TouchAxisLock = 'none' | 'x' | 'y';

/**
 * Locks touch gesture axis once displacement passes a small deadzone so vertical
 * scrolling on mobile never accidentally drags the horizontal Studio carousel.
 */
export function resolveStudioTouchAxis(
  dx: number,
  dy: number,
  deadzonePx = 6
): TouchAxisLock {
  const absX = Math.abs(dx);
  const absY = Math.abs(dy);
  if (Math.max(absX, absY) < deadzonePx) {
    return 'none';
  }
  return absX > absY * 1.1 ? 'x' : 'y';
}

export interface StudioKeyboardStepInput {
  key: string;
  currentActive: number;
  projectCount: number;
}

export type StudioKeyboardAction =
  | { type: 'none' }
  | { type: 'close-details' }
  | { type: 'select-project'; nextIndex: number }
  | { type: 'step-track'; direction: -1 | 1 }
  | { type: 'jump-start' }
  | { type: 'jump-end' };

/**
 * Resolves accessible keyboard navigation across the Studio carousel and details modal.
 */
export function resolveStudioKeyboardAction({
  key,
  currentActive,
  projectCount,
}: StudioKeyboardStepInput): StudioKeyboardAction {
  if (projectCount <= 0) return { type: 'none' };

  if (currentActive >= 0) {
    if (key === 'Escape') {
      return { type: 'close-details' };
    }
    if (key === 'ArrowRight') {
      return {
        type: 'select-project',
        nextIndex: Math.min(projectCount - 1, currentActive + 1),
      };
    }
    if (key === 'ArrowLeft') {
      return {
        type: 'select-project',
        nextIndex: Math.max(0, currentActive - 1),
      };
    }
    return { type: 'none' };
  }

  if (key === 'ArrowRight') {
    return { type: 'step-track', direction: 1 };
  }
  if (key === 'ArrowLeft') {
    return { type: 'step-track', direction: -1 };
  }
  if (key === 'Home') {
    return { type: 'jump-start' };
  }
  if (key === 'End') {
    return { type: 'jump-end' };
  }

  return { type: 'none' };
}

/**
 * Computes the next clamped horizontal track target position (in px, negative = scrolled right)
 * for keyboard ArrowLeft / ArrowRight navigation from current track offset and card snap points.
 */
export function computeNextStudioSnapTarget(
  snapOffsets: readonly number[],
  currentTargetPosition: number,
  direction: -1 | 1,
  endPoint: number,
  tolerancePx = 12
): number {
  const safeEnd = Math.max(0, endPoint);
  const clamp = (val: number) => {
    const clamped = Math.max(-safeEnd, Math.min(0, val));
    return clamped === 0 ? 0 : clamped;
  };

  if (snapOffsets.length === 0) {
    const fallbackStep = Math.max(240, safeEnd / 4);
    return clamp(currentTargetPosition - direction * fallbackStep);
  }

  const normalizedTargets = snapOffsets
    .map((offset) => clamp(-Math.max(0, offset)))
    .filter((v, idx, arr) => idx === 0 || Math.abs(v - arr[idx - 1]) > 4);

  if (direction === 1) {
    // Move forward (target becomes more negative)
    const next = normalizedTargets.find((t) => t < currentTargetPosition - tolerancePx);
    return next !== undefined ? next : -safeEnd;
  }

  // Move backward toward 0 (target becomes less negative)
  for (let i = normalizedTargets.length - 1; i >= 0; i -= 1) {
    if (normalizedTargets[i] > currentTargetPosition + tolerancePx) {
      return normalizedTargets[i];
    }
  }
  return 0;
}

