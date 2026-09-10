import React from 'react';
import { GlobalShell } from './components/layout';
import { HomePage } from './pages/HomePage';
import { StudioPageResolver } from './pages/studio/StudioPageResolver';
import { RouterProvider, useRouter } from './router/RouterContext';
import { useIsMobile } from './hooks/useIsMobile';
import { usePreloadAssets } from './hooks/usePreloadAssets';

/**
 * PortfolioApp
 *
 * Coordinates global systems, active route family resolution, and asset preloading.
 * Decoupled from detailed component implementations and slider physics.
 */
function PortfolioApp() {
  const isMobile = useIsMobile();
  const { currentRoute } = useRouter();
  const { loadingDone, progress, siteData, workData } = usePreloadAssets();

  return (
    <GlobalShell progress={progress} loadingDone={loadingDone} isMobile={isMobile}>
      {currentRoute.family === 'exhibition' ? (
        <HomePage workData={workData} siteData={siteData} />
      ) : (
        <StudioPageResolver workData={workData} siteData={siteData} />
      )}
    </GlobalShell>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <PortfolioApp />
    </RouterProvider>
  );
}
