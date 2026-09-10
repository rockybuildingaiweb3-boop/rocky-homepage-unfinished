import { WorkItem } from '../../types';

export interface WorkSliderProps {
  workData: WorkItem[];
  onActiveChange?: (hasActiveProject: boolean) => void;
}
