import React, { useRef, useState } from 'react';
import { Navbar, Footer, Loader } from './components/layout';
import { HomeSection, WorkSection, SkillsSection } from './components/sections';
import { CursorDot, ParticleBackground } from './components/ui';
import { useIsMobile } from './hooks/useIsMobile';
import { usePreloadAssets } from './hooks/usePreloadAssets';
import { useScrollSpy } from './hooks/useScrollSpy';

const SECTION_IDS = ['footer', 'skills', 'work', 'home'];

export default function App() {
  const isMobile = useIsMobile();
  const { loadingDone, progress, siteData, workData } = usePreloadAssets();
  const [ceremonyDone, setCeremonyDone] = useState<boolean>(false);
  const scrollFrameRef = useRef<HTMLDivElement>(null);

  const { scrollY, setScrollY, activeSection, setActiveSection } = useScrollSpy({
    sectionIds: SECTION_IDS,
    scrollContainerRef: scrollFrameRef,
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const handleNavigate = (targetId: string) => {
    if (targetId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      scrollFrameRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setActiveSection('home');
      return;
    }
    const resolvedId =
      targetId === 'studio' ? 'work' : targetId === 'contact' ? 'footer' : targetId;
    const targetEl = document.getElementById(resolvedId);
    if (targetEl) {
      // Smooth momentum scrolling with header offset of offsetTop - 10vh
      const headerOffset10vh = window.innerHeight * 0.1;
      const targetY = Math.max(0, targetEl.offsetTop - headerOffset10vh);
      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
      scrollFrameRef.current?.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
      setActiveSection(resolvedId);
    }
  };

  const handleDestination = (destination: string) => {
    const lower = destination.toLowerCase().trim();
    if (lower === 'about' || lower === 'skills') {
      handleNavigate('skills');
    } else if (lower === 'work' || lower === 'home') {
      handleNavigate(lower);
    } else if (lower === 'contact' || lower === 'footer') {
      handleNavigate('footer');
    }
  };

  return (
    <>
      {/* Interactive custom cursor */}
      <CursorDot isMobile={isMobile} />

      {/* Ceremonial Intro sequence (Blackout → Signature stroke → Tulip blossom → Name drop) */}
      {!ceremonyDone && (
        <Loader
          progress={progress}
          loadingDone={loadingDone}
          onFinish={() => setCeremonyDone(true)}
        />
      )}

      {/* Atmospheric 35mm Cinematic Film Grain Texture Layer */}
      <div className="cinematic-grain" aria-hidden="true" />

      {/* Main scrolling viewport container */}
      <div
        id="scroll-frame"
        ref={scrollFrameRef}
        onScroll={handleScroll}
        className="w-full min-h-screen relative z-10 overflow-x-hidden"
      >
        <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

        {/* Atmospheric 3D Starfield & Spatial Depth Layer (Layer 2 depth across hero & sections) */}
        <ParticleBackground scrollY={scrollY} />

        <HomeSection scrollY={scrollY} onNavigate={handleNavigate} />

        <WorkSection
          workData={workData}
          onSelectDestination={handleDestination}
        />

        <SkillsSection onSelectProject={() => handleNavigate('work')} />

        <Footer siteData={siteData} />
      </div>
    </>
  );
}
