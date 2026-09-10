import React from 'react';
import { WorkItem, SiteData } from '../../types';
import { useRouter } from '../../router/RouterContext';
import { StudioLayout } from './layouts/StudioLayout';
import { StudioHubPage } from './pages/StudioHubPage';
import { CaseStudyPage } from './pages/CaseStudyPage';
import { EditorialPage } from './pages/EditorialPage';
import { CareerPage } from './pages/CareerPage';
import { NotFoundPage } from './pages/NotFoundPage';

export interface StudioPageResolverProps {
  workData: WorkItem[];
  siteData: SiteData | null;
}

/**
 * StudioPageResolver
 * 
 * Clean Architectural Dispatcher for the Studio universe:
 * - Maps active RouteMatch family directly to dedicated independent layout and page components
 * - Single responsibility: dispatching, zero inline markup monoliths
 * - Same-domain URL routing (/studio, /studio/:projectId, /studio/blog, /studio/career)
 */
export const StudioPageResolver: React.FC<StudioPageResolverProps> = ({ workData }) => {
  const { currentRoute } = useRouter();

  const renderPage = () => {
    switch (currentRoute.family) {
      case 'studio-hub':
        return <StudioHubPage workData={workData} />;
      case 'case-study':
        return (
          <CaseStudyPage
            projectId={currentRoute.params.projectId}
            workData={workData}
          />
        );
      case 'editorial':
        return <EditorialPage slug={currentRoute.params.slug} />;
      case 'career':
        return <CareerPage />;
      case 'not-found':
      default:
        return <NotFoundPage path={currentRoute.path} />;
    }
  };

  return <StudioLayout>{renderPage()}</StudioLayout>;
};

export default StudioPageResolver;
