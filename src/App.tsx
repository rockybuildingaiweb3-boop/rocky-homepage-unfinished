import { useState } from 'react';
import { Navbar, Footer, Loader } from './components/layout';
import { HomeSection, WorkSection, SkillsSection } from './components/sections';
import { CursorDot, ParticleBackground } from './components/ui';
import { useIsMobile } from './hooks/useIsMobile';
import { usePreloadAssets } from './hooks/usePreloadAssets';
import { useScrollSpy } from './hooks/useScrollSpy';

const SECTION_IDS = ['contact', 'skills', 'work', 'home'];

export default function App() {
  const isMobile = useIsMobile();
  const { loadingDone, progress, siteData, workData } = usePreloadAssets();
  const [ceremonyDone, setCeremonyDone] = useState<boolean>(false);

  const { scrollY, activeSection, setActiveSection } = useScrollSpy({
    sectionIds: SECTION_IDS,
  });

  const handleNavigate = (targetId: string) => {
    if (targetId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setActiveSection('home');
      return;
    }
    const resolvedId =
      targetId === 'studio' ? 'work' : targetId === 'footer' ? 'contact' : targetId;
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
  };

  return (
    <>
      {/* Interactive custom cursor */}
      <CursorDot isMobile={isMobile} />

      {/* Ceremonial Intro sequence */}
      {!ceremonyDone && (
        <Loader
          progress={progress}
          loadingDone={loadingDone}
          onFinish={() => setCeremonyDone(true)}
        />
      )}

      {/* Atmospheric 35mm Cinematic Film Grain Texture Layer */}
      <div className="cinematic-grain" aria-hidden="true" />

      {/* Main scrolling content */}
      <main className="w-full min-h-screen relative z-10 overflow-x-hidden">
        <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

        {/* Atmospheric 3D Starfield & Spatial Depth Layer */}
        <ParticleBackground />

        <HomeSection scrollY={scrollY} onNavigate={handleNavigate} />

        <WorkSection workData={workData} />

        <SkillsSection />

        <Footer siteData={siteData} />
      </main>
    </>
  );
}
