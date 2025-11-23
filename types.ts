

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
  INTEREST_ENGINE = 'INTEREST_ENGINE',
  CLIENT_PORTAL = 'CLIENT_PORTAL',
  BRANCHES = 'BRANCHES',
  MARKETING = 'MARKETING',
  DOCUMENTS = 'DOCUMENTS',
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
  role: 'Admin' | 'Analyst' | 'Viewer' | 'Branch Manager';
  status: 'Active' | 'Inactive';
  lastActive: string;
  avatar: string;
  branchId?: string;
}

export interface Branch {
    id: string;
    name: string;
    location: string;
    managerId: string;
    clientCount: number;
    aum: number;
    status: 'Active' | 'Renovating' | 'Closed';
}

export interface NotificationConfig {
    enableSMS: boolean;
    enableEmail: boolean;
    enablePush: boolean;
    triggers: {
        deposits: boolean;
        withdrawals: boolean;
        maturity: boolean;
        statements: boolean;
        commissions: boolean;
    };
}

export interface AIInsight {
    id: string;
    type: 'Prediction' | 'Fraud' | 'Opportunity';
    message: string;
    score: number; // Confidence or Risk score (0-100)
    timestamp: string;
    details?: string;
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

export interface Asset {
  id: string;
  portfolioId: string;
  productId: string;
  productName: string;
  type: ProductCategory;
  investedAmount: number;
  currentValue: number;
  rate: number;
  startDate: string;
  maturityDate?: string;
  status: 'Active' | 'Matured' | 'Liquidated';
  accruedInterest?: number;
}

export interface Beneficiary {
  id: string;
  name: string;
  relation: string;
  dob: string;
  percentage: number;
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
  walletBalance: number;
  branchId?: string;
  
  // Enhanced KYC Fields
  registrationSource?: 'Online' | 'Offline';
  ghanaCardNumber?: string;
  tin?: string;
  residentialAddress?: string;
  digitalAddress?: string; // GPS Address
  
  // Employment & Financials
  employerName?: string;
  occupation?: string;
  annualIncomeRange?: string;
  sourceOfFunds?: string;
  
  // Risk Profile
  riskScore?: number; // 0-100
  riskProfileCategory?: 'Conservative' | 'Balanced' | 'Aggressive';
  
  // Relationships
  beneficiaries?: Beneficiary[];
  assignedAgentId?: string;
  
  // Documents (Mock paths/names)
  documents?: {
      ghanaCardFront?: string;
      ghanaCardBack?: string;
      passport?: string;
      selfie?: string;
      proofOfAddress?: string;
  };
  faceMatchScore?: number;
  
  // Loyalty
  loyaltyPoints?: number;
  referralCode?: string;
  referredBy?: string;
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

export type ProductCategory = 'T-Bill' | 'Bond' | 'Mutual Fund' | 'Fixed Deposit' | 'Savings Plan' | 'Asset Management';

export interface InterestConfig {
    frequency: 'Daily' | 'Monthly' | 'Quarterly' | 'Annually' | 'Maturity';
    method: 'Simple' | 'Compound';
    baseDays: '360' | '365' | '366';
    payoutDestination: 'Wallet' | 'Reinvest';
    formula: 'Standard' | 'Amortized' | 'Custom Script';
}

export interface InvestmentProduct {
  id: string;
  name: string;
  category: ProductCategory;
  status: 'Active' | 'Inactive';
  minAmount: number;
  description?: string;
  
  // Interest Engine Config
  interestConfig?: InterestConfig;

  // Fixed Deposit & Savings
  interestRate?: number;
  duration?: string; // e.g., "91 Days", "Open"
  penaltyRate?: number; // For premature withdrawal
  allowRollover?: boolean;
  
  // T-Bills
  discountRate?: number;
  maturityDate?: string;
  
  // Mutual Funds
  currentNav?: number;
  navHistory?: { date: string; value: number }[]; // For charts
  
  // Savings / Target Plans
  isRecurring?: boolean;
  autoDebitSupported?: boolean;
  
  // Asset Management
  managementFee?: number;
  assignedManager?: string;
}

export type PaymentChannel = 'MTN MoMo' | 'Vodafone Cash' | 'AirtelTigo' | 'Visa/Mastercard' | 'Bank Transfer';

export interface Transaction {
  id: string;
  clientId: string;
  type: 'Deposit' | 'Withdrawal' | 'Top-up' | 'Transfer' | 'Reversal' | 'Interest Payout';
  amount: number;
  fee?: number;
  netAmount?: number;
  paymentChannel?: PaymentChannel;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Reversed';
  reference: string;
  ledgerStatus?: 'Posted' | 'Pending';
  
  // Transaction Workflows
  approvalStatus?: 'Approved' | 'Pending' | 'Rejected';
  approvedBy?: string;
  isReversal?: boolean;
  reversedTxId?: string; // If this transaction is a reversal of another
  
  // Transfers
  targetProductId?: string; // For transfers/top-ups
  sourceProductId?: string;

  // Fraud Detection
  riskScore?: number; // 0-100 (100 is fraud)
  isFlagged?: boolean;
}

export interface InterestRun {
    id: string;
    runDate: string;
    productsProcessed: number;
    totalInterestPosted: number;
    status: 'Success' | 'Failed' | 'Partial';
    initiatedBy: string; // 'System' or Admin User
    type: 'Daily Accrual' | 'Monthly Posting' | 'Ad-hoc Correction';
}

export interface Agent {
  id: string;
  name: string;
  code: string;
  region: string;
  phone: string;
  email: string;
  totalSales: number;
  commissionRate: number; // Percentage or Flat Value based on type
  commissionType: 'Percentage' | 'Flat';
  walletBalance: number;
  status: 'Active' | 'Suspended';
  assignedClientCount: number;
}

export interface CommissionPayout {
  id: string;
  agentId: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Paid' | 'Rejected';
}

export interface ClientDocument {
    id: string;
    clientId: string;
    name: string;
    type: 'Contract' | 'Statement' | 'ID' | 'Receipt';
    date: string;
    status: 'Signed' | 'Pending' | 'Available';
    url: string;
}

export interface TicketMessage {
  id: string;
  sender: 'Client' | 'Support' | 'System' | 'AI';
  text?: string;
  attachmentType?: 'Image' | 'Document' | 'Voice';
  attachmentUrl?: string; // Mock URL or Base64
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  clientId: string; // Link to client
  subject: string;
  category: 'Technical' | 'Account' | 'Investment' | 'Other';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  dateCreated: string;
  
  // Advanced Support Features
  assignedTo?: string; // User ID of staff member
  slaDeadline?: string; // ISO String for SLA countdown
  messages: TicketMessage[];
}

// --- Marketing & Extras ---

export interface MarketingCampaign {
    id: string;
    name: string;
    type: 'SMS' | 'Email';
    status: 'Draft' | 'Scheduled' | 'Sent';
    audience: 'All Clients' | 'High Net Worth' | 'Leads';
    content: string;
    sentCount?: number;
    date: string;
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    status: 'New' | 'Contacted' | 'Interested' | 'Converted';
    notes?: string;
    assignedTo?: string;
}

export interface SystemDocument {
    id: string;
    name: string;
    category: 'Contract' | 'Policy' | 'Report' | 'Marketing';
    size: string;
    uploadDate: string;
    requiresSignature: boolean;
    isSigned: boolean;
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
  commissionPayouts?: CommissionPayout[];
  clientDocuments?: ClientDocument[];
  tickets?: SupportTicket[];
  interestRuns?: InterestRun[];
  branches?: Branch[];
  marketingCampaigns?: MarketingCampaign[];
  leads?: Lead[];
  systemDocuments?: SystemDocument[];
  settings?: {
      bg: string;
      opacity: number;
      blur: number;
      darkMode: boolean;
      notifications: NotificationConfig;
  };
}