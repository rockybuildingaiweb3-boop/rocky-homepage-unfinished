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
