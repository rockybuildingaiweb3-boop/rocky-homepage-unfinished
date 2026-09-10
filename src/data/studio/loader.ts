import { WorkItem } from '../../types';
import { fetchJsonData } from '../../utils';

const WORK_DATA_URL = '/data/work-data.json';

/**
 * Domain loader for Studio projects and modules
 * Encapsulates raw storage endpoints and guarantees typed WorkItem data
 */
export async function loadStudioData(): Promise<WorkItem[]> {
  try {
    const data = await fetchJsonData<WorkItem[]>(WORK_DATA_URL);
    return data || [];
  } catch (err) {
    console.error('Failed to load studio data:', err);
    return [];
  }
}
