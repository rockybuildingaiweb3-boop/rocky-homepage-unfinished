import React from 'react';
import { GlobalShell } from './components/layout';
import { HomePage } from './pages/HomePage';
import { StudioShell } from './components/studio';
import { RouterProvider, useRouter } from './router/RouterContext';
import { useIsMobile } from './hooks/useIsMobile';
import { usePreloadAssets } from './hooks/usePreloadAssets';

function PortfolioApp() {
  const isMobile = useIsMobile();
  const { isStudio } = useRouter();
  const { loadingDone, progress, siteData, workData } = usePreloadAssets();

  return (
    <GlobalShell progress={progress} loadingDone={loadingDone} isMobile={isMobile}>
      {isStudio ? (
        <StudioShell workData={workData} siteData={siteData} />
      ) : (
        <HomePage workData={workData} siteData={siteData} />
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
