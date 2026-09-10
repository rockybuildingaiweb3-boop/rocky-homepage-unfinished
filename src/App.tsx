import React from 'react';
import { GlobalShell } from './components/layout';
import { HomePage } from './pages/HomePage';
import { StudioPageResolver } from './pages/studio/StudioPageResolver';
import { RouterProvider, useRouter } from './router/RouterContext';
import { useIsMobile } from './hooks/useIsMobile';
import { usePreloadAssets } from './hooks/usePreloadAssets';
import { loadSiteData } from './data/site/loader';

function PortfolioApp() {
  const isMobile = useIsMobile();
  const { currentRoute } = useRouter();
  const { loadingDone, progress } = usePreloadAssets();
  const [siteData, setSiteData] = React.useState<Awaited<ReturnType<typeof loadSiteData>> | null>(null);

  React.useEffect(() => {
    let mounted = true;
    loadSiteData().then((data) => {
      if (mounted) setSiteData(data);
    });
    return () => { mounted = false; };
  }, []);

  return (
    <GlobalShell progress={progress} loadingDone={loadingDone} isMobile={isMobile}>
      {currentRoute.family === 'exhibition' ? (
        <HomePage siteData={siteData} />
      ) : currentRoute.family === 'studio' ? (
        <StudioPageResolver />
      ) : null}
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
