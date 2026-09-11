import { SiteData } from '../../types';
import { CANONICAL_SITE_DATA } from './siteData';

/**
 * Domain loader for global site metadata.
 * Returns authoritative static site data directly without unnecessary network roundtrips.
 */
export async function loadSiteData(): Promise<SiteData> {
  return CANONICAL_SITE_DATA;
}
