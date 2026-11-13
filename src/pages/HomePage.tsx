import React, { useCallback } from 'react';
import { Navbar, Footer } from '../components/layout';
import { HomeSection, StudioSection, SkillsSection } from '../components/sections';
import { useScrollSpy } from '../features/scroll';
import { getReducedMotionPreference } from '../hooks/useDeviceCapabilities';
import type { SiteData } from '../types';

interface HomePageProps {
  siteData: SiteData | null;
  isHeroAwake?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ siteData, isHeroAwake = true }) => {
  const { activeSection } = useScrollSpy({
    sectionIds: ['home', 'studio', 'skills', 'contact'],
  });

  const handleNavigate = useCallback((target: string) => {
    const behavior: ScrollBehavior = getReducedMotionPreference() ? 'instant' : 'smooth';

    if (target === 'home') {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior });
    }
  }, []);

  return (
    <main className="relative z-10 w-full overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} visible={isHeroAwake} />
      <HomeSection onNavigate={handleNavigate} isAwake={isHeroAwake} />
      <StudioSection />
      <SkillsSection />
      <Footer siteData={siteData} />
    </main>
  );
};

export default HomePage;
