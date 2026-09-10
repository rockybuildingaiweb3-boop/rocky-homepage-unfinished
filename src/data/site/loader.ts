import { SiteData } from '../../types';
import { CANONICAL_SITE_DATA } from './siteData';

export async function loadSiteData(): Promise<SiteData> {
  return CANONICAL_SITE_DATA;
}
