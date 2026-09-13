export interface SiteData {
  availablity_date: string;
}

export interface ProjectLink {
  type: 'web' | 'github' | 'app' | 'case-study' | string;
  text: string;
  link: string;
}

export interface ProjectDetails {
  description: string;
  summary: string;
}

export interface StudioProject {
  id: string;
  title: string;
  category: string;
  year?: string;
  details: ProjectDetails;
  roles: string[];
  image: string;
  links?: ProjectLink[];
  metadata?: Record<string, string>;
}
