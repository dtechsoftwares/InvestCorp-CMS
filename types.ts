export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  POSTS_LIST = 'POSTS_LIST',
  POST_EDITOR = 'POST_EDITOR',
  PORTFOLIOS = 'PORTFOLIOS',
  CLIENTS = 'CLIENTS',
  USERS = 'USERS',
  ACTIVITY_LOGS = 'ACTIVITY_LOGS',
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Analyst' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatar: string;
}

export interface Portfolio {
  id: string;
  name: string;
  type: 'Pension' | 'Provident' | 'Personal' | 'Corporate';
  aum: number; // In GHS
  currency: string;
  ytdReturn: number; // Percentage
  riskProfile: 'Conservative' | 'Balanced' | 'Aggressive';
  status: 'Active' | 'Pending';
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  portfolioId: string; // Link to Portfolio
  onboardingDate: string;
  status: 'Active' | 'Inactive';
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
}

export interface LogEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
}

export interface ToastMessage {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}