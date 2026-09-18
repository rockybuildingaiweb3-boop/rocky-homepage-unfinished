import React, { useState } from 'react';
import { GlobalShell } from './components/layout';
import { HomePage } from './pages/HomePage';
import { useIsMobile } from './hooks/useIsMobile';
import { usePreloadAssets } from './hooks/usePreloadAssets';

function PortfolioApp() {
  const isMobile = useIsMobile();
  const { loadingDone, progress, siteData } = usePreloadAssets();
  const [heroAwake, setHeroAwake] = useState(false);

  return (
    <GlobalShell
      progress={progress}
      loadingDone={loadingDone}
      isMobile={isMobile}
      onAwakenHero={() => setHeroAwake(true)}
    >
      <HomePage siteData={siteData} isHeroAwake={heroAwake} />
    </GlobalShell>
  );
}

export default function App() {
  return <PortfolioApp />;
}
