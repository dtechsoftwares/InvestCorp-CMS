export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  POSTS_LIST = 'POSTS_LIST',
  POST_EDITOR = 'POST_EDITOR',
  SETTINGS = 'SETTINGS',
}

export enum PostStatus {
  DRAFT = 'Draft',
  PUBLISHED = 'Published',
  ARCHIVED = 'Archived',
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  status: PostStatus;
  date: string;
  imageUrl?: string;
}

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
}