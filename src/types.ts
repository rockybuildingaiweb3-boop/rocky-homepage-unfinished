export interface SiteData {
  availablity_date: string;
}

export interface WorkLink {
  type?: 'web' | 'android' | 'ios';
  text: string;
  link: string;
}

export interface WorkDetails {
  description: string;
  summary: string;
}

export type WorkItemType = 'project' | 'module';

export interface WorkItem {
  id: string;
  type?: WorkItemType;
  title: string;
  image?: string;
  destination?: string;
  route?: string;
  details: WorkDetails;
  date?: string;
  roles: string[];
  links?: WorkLink[];
}

export type StudioModuleId = 'projects' | 'experiments' | 'blog' | 'life' | 'archive';

export interface StudioModuleMeta {
  id: StudioModuleId;
  label: string;
  code: string;
  description: string;
  path: string;
  status: 'active' | 'upcoming';
  count?: string;
}
