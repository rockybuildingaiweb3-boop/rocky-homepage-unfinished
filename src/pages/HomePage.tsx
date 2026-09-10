import React from 'react';
import { Navbar, Footer } from '../components/layout';
import { HomeSection, SkillsSection } from '../components/sections';
import { useRouter } from '../router/RouterContext';
import { SiteData } from '../types';

interface HomePageProps {
  siteData?: SiteData | null;
}

export const HomePage: React.FC<HomePageProps> = ({ siteData }) => {
  const { navigate } = useRouter();

  const handleNavigate = (target: string) => {
    if (target === 'studio') {
      navigate('/studio');
      return;
    }
    if (target === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (target === 'skills') {
      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="relative z-10 w-full overflow-x-hidden">
      <Navbar onNavigate={handleNavigate} />
      <HomeSection onNavigate={handleNavigate} />
      <SkillsSection />
      <Footer siteData={siteData} onNavigateRoute={navigate} />
    </main>
  );
};

export default HomePage;
