import React from 'react';
import { WorkItem } from '../../types';
import { StudioContainer } from '../studio/StudioContainer';

export interface WorkSectionProps {
  workData: WorkItem[];
}

/**
 * WorkSection
 * Clean facade delegating to the modular StudioContainer architecture.
 * Preserves backward compatibility while enabling future modular evolution (Projects, Blog, Life, Experiments, Archive).
 */
export const WorkSection: React.FC<WorkSectionProps> = ({ workData }) => {
  return <StudioContainer workData={workData} />;
};

export default WorkSection;
