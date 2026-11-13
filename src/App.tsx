import React, { useState, useCallback } from 'react';
import { GlobalShell } from './components/layout';
import { HomePage } from './pages/HomePage';
import { useDeviceCapabilities } from './hooks/useDeviceCapabilities';
import { usePreloadAssets } from './hooks/usePreloadAssets';

function PortfolioApp() {
  const { isMobile } = useDeviceCapabilities();
  const { loadingDone, progress, siteData } = usePreloadAssets();
  const [heroAwake, setHeroAwake] = useState(false);

  const handleAwakenHero = useCallback(() => {
    setHeroAwake(true);
  }, []);

  return (
    <GlobalShell
      progress={progress}
      loadingDone={loadingDone}
      isMobile={isMobile}
      onAwakenHero={handleAwakenHero}
    >
      <HomePage siteData={siteData} isHeroAwake={heroAwake} />
    </GlobalShell>
  );
}

export default function App() {
  return <PortfolioApp />;
}

