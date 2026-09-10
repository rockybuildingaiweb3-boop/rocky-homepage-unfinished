import { WorkItem } from '../../types';

export type StudioModuleId = 'projects' | 'experiments' | 'blog' | 'life' | 'archive';

export interface StudioModuleMeta {
  id: StudioModuleId;
  label: string;
  code: string;
  description: string;
  path: string;
  status: 'active' | 'upcoming';
  count?: number | string;
}

export interface StudioProjectsProps {
  workData: WorkItem[];
  onActiveChange?: (hasActiveProject: boolean) => void;
}
