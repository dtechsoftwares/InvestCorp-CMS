
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
  KYC_UPDATES = 'KYC_UPDATES',
  PRODUCTS = 'PRODUCTS',
  TRANSACTIONS = 'TRANSACTIONS',
  AGENTS = 'AGENTS',
  SUPPORT = 'SUPPORT',
  REPORTS = 'REPORTS',
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
  type: 'Pension' | 'Provident' | 'Personal' | 'Corporate' | 'Private Wealth';
  aum: number; // In GHS
  currency: string;
  ytdReturn: number; // Percentage
  riskProfile: 'Conservative' | 'Balanced' | 'Aggressive';
  status: 'Active' | 'Pending';
}

export interface Client {
  id: string;
  accountNumber: string;
  name: string;
  clientType: 'Individual' | 'Corporate';
  dob: string;
  email: string;
  phone: string;
  verificationMethod: 'SMS' | 'EMAIL';
  portfolioId: string;
  onboardingDate: string;
  status: 'Active' | 'Inactive';
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  termsAccepted: boolean;
  initialPin?: string;
  walletBalance: number; // Added for Wallet Management
}

export interface GhanaCardSubmission {
  id: string;
  accountNumber: string;
  ghanaCardNumber: string;
  firstName: string;
  lastName: string;
  frontImageName: string;
  backImageName: string;
  submittedAt: string;
  status: 'Pending' | 'Processed';
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

// --- New Modules Types ---

export interface InvestmentProduct {
  id: string;
  name: string;
  category: 'T-Bill' | 'Bond' | 'Mutual Fund' | 'Fixed Deposit' | 'Savings Plan';
  interestRate: number;
  duration: string; // e.g., "91 Days", "Open"
  minAmount: number;
  status: 'Active' | 'Inactive';
}

export interface Transaction {
  id: string;
  clientId: string;
  type: 'Deposit' | 'Withdrawal' | 'Top-up' | 'Transfer';
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  reference: string;
}

export interface Agent {
  id: string;
  name: string;
  code: string;
  region: string;
  phone: string;
  email: string;
  totalSales: number;
  commissionRate: number; // Percentage
  status: 'Active' | 'Suspended';
}

export interface SupportTicket {
  id: string;
  clientId: string; // Link to client
  subject: string;
  category: 'Technical' | 'Account' | 'Investment' | 'Other';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  dateCreated: string;
}

export interface AppData {
  posts?: BlogPost[];
  users?: User[];
  logs?: LogEntry[];
  portfolios?: Portfolio[];
  clients?: Client[];
  kycUpdates?: GhanaCardSubmission[];
  products?: InvestmentProduct[];
  transactions?: Transaction[];
  agents?: Agent[];
  tickets?: SupportTicket[];
  settings?: {
      bg: string;
      opacity: number;
      blur: number;
  };
}
