import React from 'react';
import { GlobalShell } from './components/layout';
import { HomePage } from './pages/HomePage';
import { StudioPageResolver } from './pages/studio/StudioPageResolver';
import { RouterProvider, useRouter } from './router/RouterContext';
import { useIsMobile } from './hooks/useIsMobile';
import { usePreloadAssets } from './hooks/usePreloadAssets';

function PortfolioApp() {
  const isMobile = useIsMobile();
  const { currentRoute } = useRouter();
  const { loadingDone, progress } = usePreloadAssets();

  return (
    <GlobalShell progress={progress} loadingDone={loadingDone} isMobile={isMobile}>
      {currentRoute.family === 'exhibition' ? <HomePage /> : currentRoute.family === 'studio' ? <StudioPageResolver /> : null}
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
