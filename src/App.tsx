import React, { useState, useCallback } from 'react';
import { Navbar, Footer, Loader } from './components/layout';
import { HomeSection, WorkSection, SkillsSection } from './components/sections';
import { CursorDot, ParticleBackground } from './components/ui';
import { StudioShell } from './components/studio';
import { RouterProvider, useRouter } from './router/RouterContext';
import { useIsMobile } from './hooks/useIsMobile';
import { usePreloadAssets } from './hooks/usePreloadAssets';
import { useScrollSpy } from './hooks/useScrollSpy';

const SECTION_IDS = ['contact', 'skills', 'work', 'home'];

function PortfolioContent() {
  const isMobile = useIsMobile();
  const { currentPath, isStudio, navigate } = useRouter();
  const { loadingDone, progress, siteData, workData } = usePreloadAssets();
  const [ceremonyDone, setCeremonyDone] = useState<boolean>(false);

  const { scrollY, activeSection, setActiveSection } = useScrollSpy({
    sectionIds: SECTION_IDS,
  });

  const handleNavigate = useCallback(
    (targetId: string) => {
      // If user wants to enter studio route directly
      if (targetId === 'studio' || targetId === '/studio' || targetId === '/studio/projects') {
        navigate('/studio/projects');
        return;
      }
      if (targetId.startsWith('/')) {
        navigate(targetId);
        return;
      }

      // If currently inside studio route and user clicked a homepage section
      if (isStudio) {
        navigate('/');
        setTimeout(() => {
          if (targetId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 100);
        return;
      }

      // On homepage one-page scroll navigation
      if (targetId === 'home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        setActiveSection('home');
        return;
      }

      const resolvedId =
        targetId === 'footer' ? 'contact' : targetId;
      const targetEl = document.getElementById(resolvedId);
      if (targetEl) {
        const headerOffset10vh = window.innerHeight * 0.1;
        const targetY = Math.max(0, targetEl.offsetTop - headerOffset10vh);
        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });
        setActiveSection(resolvedId);
      }
    },
    [isStudio, navigate, setActiveSection]
  );

  return (
    <>
      {/* Interactive custom cursor - global across all routes */}
      <CursorDot isMobile={isMobile} />

      {/* Ceremonial Intro sequence - single session playback */}
      {!ceremonyDone && (
        <Loader
          progress={progress}
          loadingDone={loadingDone}
          onFinish={() => setCeremonyDone(true)}
        />
      )}

      {/* Atmospheric 35mm Cinematic Film Grain Texture Layer */}
      <div className="cinematic-grain" aria-hidden="true" />

      {/* Atmospheric 3D Starfield & Spatial Depth Layer - persists across routes */}
      <ParticleBackground />

      {/* Route Switcher: Studio Shell vs Homepage Exhibition */}
      {isStudio ? (
        <StudioShell workData={workData} siteData={siteData} />
      ) : (
        <main className="w-full min-h-screen relative z-10 overflow-x-hidden">
          <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

          <HomeSection scrollY={scrollY} onNavigate={handleNavigate} />

          <WorkSection workData={workData} />

          <SkillsSection />

          <Footer siteData={siteData} onNavigateRoute={navigate} />
        </main>
      )}
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <PortfolioContent />
    </RouterProvider>
  );
}
