import React from 'react';
import { GlobalShell } from './components/layout';
import { HomePage } from './pages/HomePage';
import { useIsMobile } from './hooks/useIsMobile';
import { usePreloadAssets } from './hooks/usePreloadAssets';

function PortfolioApp() {
  const isMobile = useIsMobile();
  const { loadingDone, progress, siteData, workData } = usePreloadAssets();

  return (
    <GlobalShell progress={progress} loadingDone={loadingDone} isMobile={isMobile}>
      <HomePage workData={workData} siteData={siteData} />
    </GlobalShell>
  );
}

export default function App() {
  return <PortfolioApp />;
}
