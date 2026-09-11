import React, { useCallback } from 'react';
import { Navbar, Footer } from '../components/layout';
import { HomeSection, WorkSection, SkillsSection } from '../components/sections';
import { useRouter } from '../router/RouterContext';
import { useScrollSpy } from '../features/scroll';
import type { SiteData, WorkItem } from '../types';

interface HomePageProps {
  workData: WorkItem[];
  siteData: SiteData | null;
}

export const HomePage: React.FC<HomePageProps> = ({ workData, siteData }) => {
  const { navigate } = useRouter();
  const { activeSection } = useScrollSpy({
    sectionIds: ['home', 'work', 'skills', 'contact'],
  });

  const handleNavigate = useCallback((target: string) => {
    if (target === 'studio') {
      navigate('/studio');
      return;
    }

    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [navigate]);

  return (
    <main className="relative z-10 w-full overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />
      <HomeSection onNavigate={handleNavigate} />
      <WorkSection workData={workData} />
      <SkillsSection />
      <Footer siteData={siteData} />
    </main>
  );
};

export default HomePage;
