import { SiteData } from '../../types';
import { fetchJsonData } from '../../utils';

const SITE_DATA_URL = '/data/data.json';

/**
 * Domain loader for global site metadata (e.g. availability date)
 */
export async function loadSiteData(): Promise<SiteData> {
  try {
    const data = await fetchJsonData<SiteData>(SITE_DATA_URL);
    return data || { availablity_date: '' };
  } catch (err) {
    console.error('Failed to load site data:', err);
    return { availablity_date: '' };
  }
}
