import { useState, useEffect } from 'react';
import { useDeviceCapabilities } from './useDeviceCapabilities';
import { isMobileViewportWidth } from '../features/device/deviceCapabilities';

/**
 * Hook to detect whether the current viewport is below the mobile breakpoint.
 * Defaults to CSS `md:` boundary (< 768px) via the shared device capabilities store.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const { viewportWidth } = useDeviceCapabilities();
  const [customMatches, setCustomMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return isMobileViewportWidth(window.innerWidth, breakpoint);
  });

  useEffect(() => {
    if (breakpoint === 768) return;
    setCustomMatches(isMobileViewportWidth(viewportWidth, breakpoint));
  }, [breakpoint, viewportWidth]);

  if (breakpoint === 768) {
    return isMobileViewportWidth(viewportWidth, 768);
  }
  return customMatches;
}
