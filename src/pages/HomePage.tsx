import React, { useCallback } from 'react';
import { Navbar, Footer } from '../components/layout';
import { HomeSection, SkillsSection } from '../components/sections';
import { useScrollSpy } from '../features/scroll';
import type { SiteData } from '../types';

interface HomePageProps {
  siteData: SiteData | null;
}

export const HomePage: React.FC<HomePageProps> = ({ siteData }) => {
  const { scrollY, activeSection } = useScrollSpy({
    sectionIds: ['home', 'studio', 'skills', 'contact'],
  });

  const handleNavigate = useCallback((target: string) => {
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <main className="relative z-10 w-full overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />
      <HomeSection scrollY={scrollY} onNavigate={handleNavigate} />
      <SkillsSection />
      <Footer siteData={siteData} />
    </main>
  );
};

export default HomePage;
