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

export interface WorkItem {
  id: string;
  title: string;
  image?: string;
  destination?: string;
  details: WorkDetails;
  date?: string;
  roles: string[];
  links?: WorkLink[];
}
