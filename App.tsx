
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PostList from './components/PostList';
import ContentEditor from './components/ContentEditor';
import Login from './components/Login';
import Users from './components/Users';
import ActivityLogs from './components/ActivityLogs';
import PortfolioList from './components/PortfolioList';
import ClientList from './components/ClientList';
import SplashScreen from './components/SplashScreen';
import Settings from './components/Settings';
import GhanaCardUpdate from './components/GhanaCardUpdate';
import KycUpdates from './components/KycUpdates';
import ProductManagement from './components/ProductManagement';
import Transactions from './components/Transactions';
import AgentManagement from './components/AgentManagement';
import SupportDesk from './components/SupportDesk';
import Reports from './components/Reports';
import InterestEngine from './components/InterestEngine';
import ClientPortal from './components/ClientPortal';
import BranchManagement from './components/BranchManagement';
import MarketingCRM from './components/MarketingCRM';
import DocumentsManager from './components/DocumentsManager';
import { ToastContainer } from './components/Toast';
import { ViewState, BlogPost, PostStatus, User, LogEntry, ToastMessage, Portfolio, Client, GhanaCardSubmission, AppData, InvestmentProduct, Transaction, Agent, SupportTicket, InterestRun, CommissionPayout, ClientDocument, Branch, NotificationConfig, MarketingCampaign, Lead, SystemDocument } from './types';
import { Bell, Search, Moon, Sun, Eye, EyeOff, ShieldAlert, Menu, Home, Briefcase, ArrowLeftRight, Grid } from 'lucide-react';

// Mock Data
const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Q3 2024 Market Outlook: Navigating Volatility',
    excerpt: 'An analysis of local and international market trends affecting Ghanaian portfolios.',
    content: '# Q3 Market Outlook\n\nInflation remains a key concern for investors...',
    author: 'Invest Corp Research',
    category: 'Market Insights',
    status: PostStatus.PUBLISHED,
    date: '2024-10-15',
  },
  {
    id: '2',
    title: 'Understanding Fixed Income Yields',
    excerpt: 'Why treasury bills and bonds remain a safe haven in the current climate.',
    content: 'Fixed income securities offer a predictable return...',
    author: 'Invest Corp Research',
    category: 'Investment Education',
    status: PostStatus.DRAFT,
    date: '2024-10-18',
  }
];

const initialUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@investcorp.com', role: 'Admin', status: 'Active', lastActive: '2 mins ago', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Sarah Smith', email: 'sarah@investcorp.com', role: 'Analyst', status: 'Active', lastActive: '1 hour ago', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Michael Brown', email: 'michael@investcorp.com', role: 'Branch Manager', status: 'Inactive', lastActive: '2 days ago', avatar: 'https://i.pravatar.cc/150?u=3' },
];

const initialBranches: Branch[] = [
    { id: 'b1', name: 'Head Office', location: 'Airport City', managerId: '1', clientCount: 850, aum: 25000000, status: 'Active' },
    { id: 'b2', name: 'Kumasi Branch', location: 'Adum, Kumasi', managerId: '3', clientCount: 390, aum: 12000000, status: 'Active' },
    { id: 'b3', name: 'Tema Branch', location: 'Comm 1, Tema', managerId: '2', clientCount: 0, aum: 0, status: 'Renovating' },
];

const initialLogs: LogEntry[] = [
  { id: '1', user: 'John Doe', action: 'Published Article', target: 'Q3 Market Outlook', timestamp: '2024-10-20 14:30', type: 'info' },
  { id: '2', user: 'Sarah Smith', action: 'Edited Draft', target: 'Fixed Income Yields', timestamp: '2024-10-20 12:15', type: 'info' },
  { id: '3', user: 'System', action: 'Backup Completed', target: 'Database', timestamp: '2024-10-20 00:00', type: 'info' },
  { id: '4', user: 'Michael Brown', action: 'Failed Login', target: 'Admin Panel', timestamp: '2024-10-19 18:45', type: 'warning' },
];

const initialPortfolios: Portfolio[] = [
    { id: 'p1', name: 'High Growth Fund', type: 'Personal', aum: 1500000, currency: 'GHS', ytdReturn: 12.5, riskProfile: 'Aggressive', status: 'Active' },
    { id: 'p2', name: 'Staff Provident Fund', type: 'Provident', aum: 4200000, currency: 'GHS', ytdReturn: 18.2, riskProfile: 'Balanced', status: 'Active' },
    { id: 'p3', name: 'Retirement Secure', type: 'Pension', aum: 850000, currency: 'GHS', ytdReturn: 9.4, riskProfile: 'Conservative', status: 'Active' },
];

const initialClients: Client[] = [
    { 
      id: 'c1', 
      accountNumber: '0041023941',
      name: 'Kwame Mensah', 
      clientType: 'Individual',
      dob: '1985-04-12',
      email: 'kwame@example.com', 
      phone: '0201234567', 
      verificationMethod: 'SMS',
      portfolioId: 'p1', 
      onboardingDate: '2023-05-10', 
      status: 'Active', 
      kycStatus: 'Verified',
      termsAccepted: true,
      walletBalance: 5000.00,
      assignedAgentId: 'a1',
      riskScore: 2,
      riskProfileCategory: 'Conservative',
      loyaltyPoints: 1250,
      referralCode: 'KWA-294'
    },
    { 
      id: 'c2', 
      accountNumber: '0041023988',
      name: 'Ama Osei', 
      clientType: 'Individual',
      dob: '1990-11-23',
      email: 'ama@example.com', 
      phone: '0249876543', 
      verificationMethod: 'EMAIL',
      portfolioId: 'p3', 
      onboardingDate: '2024-01-15', 
      status: 'Active', 
      kycStatus: 'Verified',
      termsAccepted: true,
      walletBalance: 12500.50,
      riskScore: 5,
      riskProfileCategory: 'Balanced',
      loyaltyPoints: 450
    },
    { 
      id: 'c3', 
      accountNumber: '0059923911',
      name: 'Tech Solutions Ltd', 
      clientType: 'Corporate',
      dob: '2010-02-15',
      email: 'finance@techsolutions.com', 
      phone: '0302234567', 
      verificationMethod: 'EMAIL',
      portfolioId: 'p2', 
      onboardingDate: '2024-02-20', 
      status: 'Active', 
      kycStatus: 'Verified',
      termsAccepted: true,
      walletBalance: 150000.00,
      assignedAgentId: 'a2',
      riskScore: 7,
      riskProfileCategory: 'Aggressive',
      loyaltyPoints: 5000
    },
];

const initialKycSubmissions: GhanaCardSubmission[] = [
    {
        id: 'k1',
        accountNumber: '0041023941',
        ghanaCardNumber: 'GHA-123456789-0',
        firstName: 'Kwame',
        lastName: 'Mensah',
        frontImageName: 'gh_card_front.jpg',
        backImageName: 'gh_card_back.jpg',
        submittedAt: '2024-10-21 09:30',
        status: 'Pending'
    }
];

const initialProducts: InvestmentProduct[] = [
    { 
        id: 'prod1', name: '91-Day Treasury Bill', category: 'T-Bill', interestRate: 28.5, duration: '91 Days', minAmount: 100, status: 'Active',
        interestConfig: { frequency: 'Maturity', method: 'Simple', baseDays: '365', payoutDestination: 'Wallet', formula: 'Standard' }
    },
    { 
        id: 'prod2', name: 'InvestCorp Balanced Fund', category: 'Mutual Fund', interestRate: 22.4, duration: 'Open', minAmount: 50, status: 'Active',
        interestConfig: { frequency: 'Daily', method: 'Compound', baseDays: '365', payoutDestination: 'Reinvest', formula: 'Standard' }
    },
    { 
        id: 'prod3', name: '1-Year Fixed Note', category: 'Fixed Deposit', interestRate: 19.0, duration: '365 Days', minAmount: 5000, status: 'Active',
        interestConfig: { frequency: 'Maturity', method: 'Simple', baseDays: '365', payoutDestination: 'Reinvest', formula: 'Standard' }
    },
];

const initialTransactions: Transaction[] = [
    { id: 'tx1', clientId: 'c1', type: 'Deposit', amount: 2000, date: '2024-10-22 10:30', status: 'Completed', reference: 'MOMO-12345', approvalStatus: 'Approved' },
    { id: 'tx2', clientId: 'c2', type: 'Withdrawal', amount: 500, date: '2024-10-21 14:15', status: 'Completed', reference: 'BANK-98765', approvalStatus: 'Approved' },
    { id: 'tx3', clientId: 'c3', type: 'Deposit', amount: 50000, date: '2024-10-23 09:00', status: 'Pending', reference: 'CHQ-998877', approvalStatus: 'Pending' },
];

const initialAgents: Agent[] = [
    { id: 'a1', name: 'Kofi Boateng', code: 'AGT-101', region: 'Greater Accra', phone: '0241112222', email: 'kofi@agency.com', totalSales: 45000, commissionRate: 2.5, commissionType: 'Percentage', status: 'Active', walletBalance: 1200, assignedClientCount: 15 },
    { id: 'a2', name: 'Esi Mansa', code: 'AGT-102', region: 'Ashanti', phone: '0203334444', email: 'esi@agency.com', totalSales: 28000, commissionRate: 2.5, commissionType: 'Percentage', status: 'Active', walletBalance: 850, assignedClientCount: 8 },
];

const initialPayouts: CommissionPayout[] = [
    { id: 'pay1', agentId: 'a1', amount: 500, date: '2024-10-01', status: 'Paid' },
    { id: 'pay2', agentId: 'a2', amount: 200, date: '2024-10-15', status: 'Pending' }
];

const initialTickets: SupportTicket[] = [
    { 
        id: 't1', clientId: 'c1', subject: 'Unable to reset password', category: 'Technical', priority: 'High', status: 'Open', dateCreated: '2024-10-22 09:00',
        slaDeadline: '2024-10-22T13:00:00', 
        messages: [
            { id: 'm1', sender: 'Client', text: 'Hi, I cannot reset my password via email.', timestamp: '2024-10-22 09:00' }
        ]
    },
    { 
        id: 't2', clientId: 'c3', subject: 'Inquiry about Corporate Bond rates', category: 'Investment', priority: 'Medium', status: 'In Progress', dateCreated: '2024-10-21 16:30',
        slaDeadline: '2024-10-22T16:30:00',
        assignedTo: '2', // Sarah
        messages: [
            { id: 'm2', sender: 'Client', text: 'What are the current rates for 3-year bonds?', timestamp: '2024-10-21 16:30' },
            { id: 'm3', sender: 'Support', text: 'Hello, the current rate is 21.5%.', timestamp: '2024-10-21 17:00' }
        ]
    },
];

const initialInterestRuns: InterestRun[] = [
    { id: 'run_101', runDate: '2024-10-22', productsProcessed: 1450, totalInterestPosted: 24500.50, status: 'Success', initiatedBy: 'System', type: 'Daily Accrual' },
    { id: 'run_100', runDate: '2024-10-21', productsProcessed: 1448, totalInterestPosted: 23900.20, status: 'Success', initiatedBy: 'System', type: 'Daily Accrual' }
];

const initialClientDocs: ClientDocument[] = [
    { id: 'd1', clientId: 'c1', name: 'Investment_Agreement_2024.pdf', type: 'Contract', date: '2024-05-10', status: 'Signed', url: '#' },
    { id: 'd2', clientId: 'c1', name: 'Welcome_Letter.pdf', type: 'Statement', date: '2024-05-10', status: 'Available', url: '#' }
];

const initialCampaigns: MarketingCampaign[] = [
    { id: 'cmp1', name: 'October Rates Promo', type: 'SMS', status: 'Sent', audience: 'All Clients', content: 'InvestCorp: New 22% rate on FDs available now! Call 0302-123-456.', sentCount: 1200, date: '2024-10-01' },
    { id: 'cmp2', name: 'Q4 Investment Strategy', type: 'Email', status: 'Draft', audience: 'High Net Worth', content: 'Dear Investor, Our Q4 outlook is positive...', date: '2024-10-25' },
];

const initialLeads: Lead[] = [
    { id: 'ld1', name: 'Emmanuel Darko', email: 'e.darko@gmail.com', phone: '0555112233', source: 'Website', status: 'New' },
    { id: 'ld2', name: 'Sarah Konadu', email: 'sk@yahoo.com', phone: '0204455666', source: 'Referral', status: 'Interested' },
    { id: 'ld3', name: 'BlueChip Ltd', email: 'info@bluechip.gh', phone: '0302998877', source: 'LinkedIn', status: 'Contacted' },
];

const initialSystemDocs: SystemDocument[] = [
    { id: 'sd1', name: 'Client_Service_Agreement_V2.pdf', category: 'Contract', size: '1.2 MB', uploadDate: '2024-01-10', requiresSignature: true, isSigned: false },
    { id: 'sd2', name: 'AML_Policy_2024.pdf', category: 'Policy', size: '2.5 MB', uploadDate: '2024-01-15', requiresSignature: false, isSigned: false },
];


const DEFAULT_BG = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGhanaCardView, setIsGhanaCardView] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State Modules
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [kycUpdates, setKycUpdates] = useState<GhanaCardSubmission[]>(initialKycSubmissions);
  const [products, setProducts] = useState<InvestmentProduct[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [commissionPayouts, setCommissionPayouts] = useState<CommissionPayout[]>(initialPayouts);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [interestRuns, setInterestRuns] = useState<InterestRun[]>(initialInterestRuns);
  const [clientDocs, setClientDocs] = useState<ClientDocument[]>(initialClientDocs);
  
  // New Modules State
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(initialCampaigns);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [systemDocs, setSystemDocs] = useState<SystemDocument[]>(initialSystemDocs);

  // Settings
  const [loginBg, setLoginBg] = useState(localStorage.getItem('investcorp_login_bg') || DEFAULT_BG);
  const [loginOpacity, setLoginOpacity] = useState(parseFloat(localStorage.getItem('investcorp_login_opacity') || '0.8'));
  const [loginBlur, setLoginBlur] = useState(parseFloat(localStorage.getItem('investcorp_login_blur') || '4'));
  
  // Advanced Features State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
      enableSMS: true, enableEmail: true, enablePush: true,
      triggers: { deposits: true, withdrawals: true, maturity: true, statements: true, commissions: true }
  });

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark Mode Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    addToast('Welcome Back', 'You have successfully logged in.', 'success');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(ViewState.DASHBOARD);
    addToast('Logged Out', 'See you next time.', 'info');
  };

  const handleSaveSettings = (url: string, opacity: number, blur: number) => {
      setLoginBg(url);
      setLoginOpacity(opacity);
      setLoginBlur(blur);
      localStorage.setItem('investcorp_login_bg', url);
      localStorage.setItem('investcorp_login_opacity', opacity.toString());
      localStorage.setItem('investcorp_login_blur', blur.toString());
      addToast('Settings Saved', 'Login appearance updated successfully.', 'success');
  };

  // ... (Keep all other handler functions from original App.tsx) ...
  const handleAddUser = (newUser: Partial<User>) => {
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name!,
      email: newUser.email!,
      role: newUser.role as any,
      status: 'Active',
      lastActive: 'Just now',
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    setUsers([...users, user]);
    addToast('User Added', `${user.name} has been added to the team.`, 'success');
    setLogs([{ id: Date.now().toString(), user: 'Current User', action: 'Added User', target: user.name, timestamp: new Date().toLocaleString(), type: 'info' }, ...logs]);
  };

  const handleToggleUserStatus = (id: string) => {
      setUsers(users.map(u => {
          if (u.id === id) {
              const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
              setLogs([{ id: Date.now().toString(), user: 'Current User', action: `Changed Status to ${newStatus}`, target: u.name, timestamp: new Date().toLocaleString(), type: 'warning' }, ...logs]);
              return { ...u, status: newStatus };
          }
          return u;
      }));
      addToast('User Updated', 'Staff status has been changed.', 'info');
  };
  
  const handleAddPortfolio = (newPortfolio: Partial<Portfolio>) => {
      const portfolio: Portfolio = {
          ...newPortfolio as Portfolio,
          id: Date.now().toString(),
          status: 'Active'
      };
      setPortfolios([portfolio, ...portfolios]);
      addToast('Portfolio Created', `${portfolio.name} is now active.`, 'success');
  };

  const handleAddClient = (newClient: Partial<Client>) => {
      const client: Client = {
          ...newClient as Client,
          id: Date.now().toString(),
          status: 'Active'
      };
      setClients([client, ...clients]);
      addToast('Client Account Created', `Account ${client.accountNumber} for ${client.name} is ready.`, 'success');
      
      // Simulate Alerts
      if(notificationConfig.enableSMS) addToast('SMS Sent', `Welcome SMS sent to ${client.phone}`, 'info');
      if(notificationConfig.enableEmail) addToast('Email Sent', `Onboarding pack sent to ${client.email}`, 'info');
  };

  const handleKycSubmission = (submission: GhanaCardSubmission) => {
      setKycUpdates([submission, ...kycUpdates]);
      setLogs([{ id: Date.now().toString(), user: 'Public Portal', action: 'KYC Submission', target: submission.accountNumber, timestamp: new Date().toLocaleString(), type: 'info' }, ...logs]);
  };
  
  const handleAddProduct = (product: InvestmentProduct) => {
      setProducts([product, ...products]);
      addToast('Product Added', `${product.name} is now available.`, 'success');
  };

  const handleUpdateProduct = (updatedProduct: InvestmentProduct) => {
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      addToast('Product Updated', `${updatedProduct.name} configuration saved.`, 'success');
      setLogs([{ id: Date.now().toString(), user: 'Admin User', action: 'Updated Product', target: updatedProduct.name, timestamp: new Date().toLocaleString(), type: 'warning' }, ...logs]);
  };

  const handleAddTransaction = (tx: Partial<Transaction>) => {
      const newTx: Transaction = {
          ...tx as Transaction,
          id: Date.now().toString(),
      };
      setTransactions([newTx, ...transactions]);
      
      // Notification Logic
      const client = clients.find(c => c.id === newTx.clientId);
      if (client) {
          if (newTx.type === 'Deposit' && notificationConfig.triggers.deposits && notificationConfig.enableSMS) {
               addToast('Auto-Alert', `SMS Receipt sent to ${client.name}`, 'info');
          }
          if (newTx.type === 'Withdrawal' && notificationConfig.triggers.withdrawals && notificationConfig.enableSMS) {
               addToast('Auto-Alert', `Withdrawal Alert sent to ${client.name}`, 'info');
          }
      }

      if(newTx.type === 'Reversal') {
          addToast('Transaction Reversed', `Contra-entry created for ${newTx.reference}`, 'info');
      } else if (newTx.status === 'Pending') {
          addToast('Transaction Queued', `Sent for approval: ${newTx.reference}`, 'info');
      } else {
          addToast('Transaction Processed', `${newTx.type} of GHS ${newTx.amount} completed.`, 'success');
      }
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
      setTransactions(transactions.map(t => t.id === updatedTx.id ? updatedTx : t));
      if (updatedTx.approvalStatus === 'Approved') {
          addToast('Transaction Approved', `Tx ${updatedTx.reference} has been posted to ledger.`, 'success');
          setLogs([{ id: Date.now().toString(), user: 'Admin User', action: 'Approved Transaction', target: updatedTx.reference, timestamp: new Date().toLocaleString(), type: 'info' }, ...logs]);
      }
      if (updatedTx.isFlagged) {
         setLogs([{ id: Date.now().toString(), user: 'Compliance Officer', action: 'Flagged Transaction (AML)', target: updatedTx.reference, timestamp: new Date().toLocaleString(), type: 'error' }, ...logs]);
      }
  };

  const handleAddAgent = (agent: Agent) => {
      setAgents([agent, ...agents]);
      addToast('Agent Registered', `${agent.name} added to sales force.`, 'success');
  };
  
  const handlePayoutAction = (id: string, action: 'Paid' | 'Rejected') => {
      setCommissionPayouts(commissionPayouts.map(p => p.id === id ? { ...p, status: action } : p));
      addToast('Payout Updated', `Request marked as ${action}.`, action === 'Paid' ? 'success' : 'info');
  };

  const handleTicketUpdate = (updatedTicket: SupportTicket) => {
      setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };
  
  const handleAddTicket = (newTicket: SupportTicket) => {
      setTickets([newTicket, ...tickets]);
      addToast('Ticket Created', `Support ticket #${newTicket.id} logged.`, 'success');
  };

  const handleAddBranch = (branch: Branch) => {
      setBranches([branch, ...branches]);
      addToast('Branch Added', `${branch.name} is now part of the network.`, 'success');
  };
  
  const handleInterestRun = (type: 'Daily Accrual' | 'Monthly Posting') => {
      const newRun: InterestRun = {
          id: `run_${Date.now()}`,
          runDate: new Date().toISOString().split('T')[0],
          productsProcessed: products.length,
          totalInterestPosted: Math.floor(Math.random() * 50000) + 10000,
          status: 'Success',
          initiatedBy: 'Admin User',
          type: type
      };
      setInterestRuns([newRun, ...interestRuns]);
      addToast('Interest Engine', `${type} executed successfully.`, 'success');
  };

  // --- Marketing & Documents Handlers ---
  const handleAddCampaign = (camp: MarketingCampaign) => {
      setCampaigns([camp, ...campaigns]);
      addToast('Campaign Created', `${camp.name} saved as ${camp.status}.`, 'success');
  };

  const handleUpdateLead = (lead: Lead) => {
      setLeads(leads.map(l => l.id === lead.id ? lead : l));
  };

  const handleAddLead = (lead: Lead) => {
      setLeads([lead, ...leads]);
      addToast('Lead Added', `${lead.name} added to CRM.`, 'success');
  };

  const handleUploadDoc = (doc: SystemDocument) => {
      setSystemDocs([doc, ...systemDocs]);
      addToast('File Uploaded', `${doc.name} added to repository.`, 'success');
  };

  const handleSignDoc = (id: string) => {
      setSystemDocs(systemDocs.map(d => d.id === id ? { ...d, isSigned: true } : d));
      addToast('Document Signed', 'E-Signature applied successfully.', 'success');
  };

  const handleDeleteDoc = (id: string) => {
      if(confirm('Delete this file?')) {
          setSystemDocs(systemDocs.filter(d => d.id !== id));
          addToast('File Deleted', 'Document removed.', 'info');
      }
  };

  // Intelligent Import/Export Logic
  const handleExportData = (selectedSections: string[]) => {
    const exportData: AppData = {};
    
    if (selectedSections.includes('posts')) exportData.posts = posts;
    if (selectedSections.includes('users')) exportData.users = users;
    if (selectedSections.includes('logs')) exportData.logs = logs;
    if (selectedSections.includes('portfolios')) exportData.portfolios = portfolios;
    if (selectedSections.includes('clients')) exportData.clients = clients;
    if (selectedSections.includes('kycUpdates')) exportData.kycUpdates = kycUpdates;
    if (selectedSections.includes('products')) exportData.products = products;
    if (selectedSections.includes('transactions')) exportData.transactions = transactions;
    if (selectedSections.includes('agents')) exportData.agents = agents;
    if (selectedSections.includes('tickets')) exportData.tickets = tickets;
    if (selectedSections.includes('interestRuns')) exportData.interestRuns = interestRuns;
    if (selectedSections.includes('branches')) exportData.branches = branches;
    if (selectedSections.includes('marketing')) {
        exportData.marketingCampaigns = campaigns;
        exportData.leads = leads;
    }
    if (selectedSections.includes('documents')) exportData.systemDocuments = systemDocs;

    if (selectedSections.includes('settings')) {
        exportData.settings = { bg: loginBg, opacity: loginOpacity, blur: loginBlur, darkMode: isDarkMode, notifications: notificationConfig };
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investcorp_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addToast('Export Successful', 'Your backup file has been downloaded.', 'success');
    setLogs([{ id: Date.now().toString(), user: 'Current User', action: 'Data Export', target: 'System', timestamp: new Date().toLocaleString(), type: 'warning' }, ...logs]);
  };

  const handleImportData = (data: AppData, selectedSections: string[]) => {
     let count = 0;
     if (selectedSections.includes('posts') && data.posts) { setPosts(data.posts); count++; }
     if (selectedSections.includes('users') && data.users) { setUsers(data.users); count++; }
     if (selectedSections.includes('logs') && data.logs) { setLogs(data.logs); count++; }
     if (selectedSections.includes('portfolios') && data.portfolios) { setPortfolios(data.portfolios); count++; }
     if (selectedSections.includes('clients') && data.clients) { setClients(data.clients); count++; }
     if (selectedSections.includes('kycUpdates') && data.kycUpdates) { setKycUpdates(data.kycUpdates); count++; }
     if (selectedSections.includes('products') && data.products) { setProducts(data.products); count++; }
     if (selectedSections.includes('transactions') && data.transactions) { setTransactions(data.transactions); count++; }
     if (selectedSections.includes('agents') && data.agents) { setAgents(data.agents); count++; }
     if (selectedSections.includes('tickets') && data.tickets) { setTickets(data.tickets); count++; }
     if (selectedSections.includes('branches') && data.branches) { setBranches(data.branches); count++; }
     if (selectedSections.includes('marketing') && data.marketingCampaigns) { setCampaigns(data.marketingCampaigns); count++; }
     if (selectedSections.includes('marketing') && data.leads) { setLeads(data.leads); count++; }

     if (selectedSections.includes('settings') && data.settings) {
         handleSaveSettings(data.settings.bg, data.settings.opacity, data.settings.blur);
         setIsDarkMode(data.settings.darkMode);
         setNotificationConfig(data.settings.notifications);
         count++;
     }

     if (count > 0) {
         addToast('Import Successful', `Successfully restored ${count} data modules.`, 'success');
         setLogs([{ id: Date.now().toString(), user: 'Current User', action: 'Data Import', target: 'System', timestamp: new Date().toLocaleString(), type: 'warning' }, ...logs]);
     } else {
         addToast('Import Cancelled', 'No data modules were selected for import.', 'info');
     }
  };


  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    if (isGhanaCardView) {
      return (
        <GhanaCardUpdate 
          onBack={() => setIsGhanaCardView(false)}
          onSubmit={handleKycSubmission}
          backgroundImage={loginBg}
          overlayOpacity={loginOpacity}
          blurLevel={loginBlur}
        />
      );
    }
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <Login 
          onLogin={handleLogin} 
          onUpdateGhanaCard={() => setIsGhanaCardView(true)}
          backgroundImage={loginBg} 
          overlayOpacity={loginOpacity} 
          blurLevel={loginBlur}
        />
      </>
    );
  }

  // Client Portal Full Screen View
  if (currentView === ViewState.CLIENT_PORTAL) {
      return (
          <>
            <button 
                onClick={() => setCurrentView(ViewState.DASHBOARD)}
                className="fixed bottom-4 right-4 z-50 bg-invest-900 text-white px-4 py-2 rounded-full shadow-lg hover:bg-invest-800 text-xs font-bold"
            >
                Exit Demo
            </button>
            <ClientPortal 
                clients={clients}
                portfolios={portfolios}
                transactions={transactions}
                documents={clientDocs}
            />
          </>
      );
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard isPrivacyMode={isPrivacyMode} />;
      case ViewState.POSTS_LIST:
        return (
          <PostList 
            posts={posts} 
            onEdit={(post) => {
              setEditingPost(post);
              setCurrentView(ViewState.POST_EDITOR);
            }}
            onCreate={() => {
              setEditingPost(null);
              setCurrentView(ViewState.POST_EDITOR);
            }}
            onDelete={(id) => {
              if (confirm('Are you sure you want to delete this article?')) {
                const post = posts.find(p => p.id === id);
                setPosts(posts.filter(p => p.id !== id));
                addToast('Article Deleted', `"${post?.title}" has been removed.`, 'info');
                setLogs([{ id: Date.now().toString(), user: 'Current User', action: 'Deleted Article', target: post?.title || 'Unknown', timestamp: new Date().toLocaleString(), type: 'warning' }, ...logs]);
              }
            }}
          />
        );
      case ViewState.POST_EDITOR:
        return (
          <ContentEditor 
            post={editingPost}
            onSave={(savedPost) => {
              if (editingPost) {
                setPosts(posts.map(p => p.id === savedPost.id ? savedPost : p));
                addToast('Changes Saved', `"${savedPost.title}" has been updated.`, 'success');
                setLogs([{ id: Date.now().toString(), user: 'Current User', action: 'Updated Article', target: savedPost.title, timestamp: new Date().toLocaleString(), type: 'info' }, ...logs]);
              } else {
                setPosts([savedPost, ...posts]);
                addToast('Article Created', `"${savedPost.title}" has been created.`, 'success');
                setLogs([{ id: Date.now().toString(), user: 'Current User', action: 'Created Article', target: savedPost.title, timestamp: new Date().toLocaleString(), type: 'info' }, ...logs]);
              }
              setCurrentView(ViewState.POSTS_LIST);
            }}
            onCancel={() => setCurrentView(ViewState.POSTS_LIST)}
          />
        );
      case ViewState.PORTFOLIOS:
          return <PortfolioList portfolios={portfolios} onAdd={handleAddPortfolio} />;
      case ViewState.CLIENTS:
          return <ClientList clients={clients} portfolios={portfolios} onAdd={handleAddClient} isPrivacyMode={isPrivacyMode} />;
      case ViewState.KYC_UPDATES:
          return <KycUpdates submissions={kycUpdates} />;
      case ViewState.PRODUCTS:
          return <ProductManagement products={products} onAdd={handleAddProduct} onUpdate={handleUpdateProduct} />;
      case ViewState.INTEREST_ENGINE:
          return <InterestEngine runs={interestRuns} onRun={handleInterestRun} products={products} />;
      case ViewState.TRANSACTIONS:
          return <Transactions transactions={transactions} clients={clients} products={products} onAddTransaction={handleAddTransaction} onUpdateTransaction={handleUpdateTransaction} isPrivacyMode={isPrivacyMode} />;
      case ViewState.AGENTS:
          return <AgentManagement agents={agents} payouts={commissionPayouts} onAdd={handleAddAgent} onPayoutAction={handlePayoutAction} />;
      case ViewState.SUPPORT:
          return <SupportDesk tickets={tickets} clients={clients} users={users} onTicketUpdate={handleTicketUpdate} onTicketAdd={handleAddTicket} />;
      case ViewState.REPORTS:
          return <Reports clients={clients} transactions={transactions} agents={agents} portfolios={portfolios} />;
      case ViewState.USERS:
        return <Users users={users} onAddUser={handleAddUser} onToggleStatus={handleToggleUserStatus} />;
      case ViewState.ACTIVITY_LOGS:
        return <ActivityLogs logs={logs} />;
      case ViewState.BRANCHES:
        return <BranchManagement branches={branches} users={users} onAddBranch={handleAddBranch} />;
      case ViewState.MARKETING:
        return <MarketingCRM campaigns={campaigns} leads={leads} clients={clients} onAddCampaign={handleAddCampaign} onUpdateLead={handleUpdateLead} onAddLead={handleAddLead} />;
      case ViewState.DOCUMENTS:
        return <DocumentsManager documents={systemDocs} onUpload={handleUploadDoc} onSign={handleSignDoc} onDelete={handleDeleteDoc} />;
      case ViewState.SETTINGS:
        return (
          <Settings 
            currentBg={loginBg} 
            currentOpacity={loginOpacity} 
            currentBlur={loginBlur}
            onSave={handleSaveSettings} 
            onExportData={handleExportData}
            onImportData={handleImportData}
            isDarkMode={isDarkMode}
            toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            notificationConfig={notificationConfig}
            onUpdateNotifications={setNotificationConfig}
          />
        );
      default:
        return <Dashboard isPrivacyMode={isPrivacyMode} />;
    }
  };

  // Bottom Navigation Component
  const BottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 px-6 py-3 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <button 
        onClick={() => { setCurrentView(ViewState.DASHBOARD); setIsSidebarOpen(false); }}
        className={`flex flex-col items-center gap-1 ${currentView === ViewState.DASHBOARD ? 'text-invest-900 dark:text-invest-gold' : 'text-slate-400'}`}
      >
        <Home size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button 
        onClick={() => { setCurrentView(ViewState.CLIENTS); setIsSidebarOpen(false); }}
        className={`flex flex-col items-center gap-1 ${currentView === ViewState.CLIENTS ? 'text-invest-900 dark:text-invest-gold' : 'text-slate-400'}`}
      >
        <Briefcase size={20} />
        <span className="text-[10px] font-medium">Clients</span>
      </button>
      
      {/* Floating Action Button for Transactions */}
      <div className="relative -top-6">
        <button 
            onClick={() => { setCurrentView(ViewState.TRANSACTIONS); setIsSidebarOpen(false); }}
            className="w-14 h-14 bg-invest-gold rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/40 transform hover:scale-105 transition-all"
        >
            <ArrowLeftRight size={24} />
        </button>
      </div>

      <button 
        onClick={() => { setCurrentView(ViewState.PORTFOLIOS); setIsSidebarOpen(false); }}
        className={`flex flex-col items-center gap-1 ${currentView === ViewState.PORTFOLIOS ? 'text-invest-900 dark:text-invest-gold' : 'text-slate-400'}`}
      >
        <Grid size={20} />
        <span className="text-[10px] font-medium">Funds</span>
      </button>
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`flex flex-col items-center gap-1 ${isSidebarOpen ? 'text-invest-900 dark:text-invest-gold' : 'text-slate-400'}`}
      >
        <Menu size={20} />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans text-slate-800 transition-colors duration-300 overflow-hidden">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Sidebar - Responsive Drawer */}
      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
        }} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 lg:ml-64 flex flex-col h-screen relative">
        {/* Top Bar */}
        <div className="px-4 py-4 lg:px-8 lg:py-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-30 flex justify-between items-center">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-500">
                 <Menu size={24} />
             </button>
             <div className="lg:hidden font-bold text-invest-900 dark:text-white text-lg">InvestCorp</div>
           </div>
           
           <div className="flex items-center gap-3 lg:gap-6">
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input 
                    type="text" 
                    placeholder="Global search..." 
                    className="pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-invest-gold outline-none w-64 transition-all dark:text-white" 
                 />
              </div>
              
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>
              
              <button 
                onClick={() => setIsPrivacyMode(!isPrivacyMode)} 
                className={`text-slate-500 hover:text-invest-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-2 ${isPrivacyMode ? 'text-invest-gold dark:text-invest-gold' : ''}`}
              >
                  {isPrivacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-slate-500 hover:text-invest-900 dark:text-slate-400 dark:hover:text-white">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button className="relative text-slate-500 hover:text-invest-900 dark:text-slate-400 dark:hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              </button>
              
              <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-invest-gold flex items-center justify-center text-white font-bold text-sm ring-2 lg:ring-4 ring-white dark:ring-slate-800 shadow-sm cursor-pointer hover:bg-amber-600 transition-colors">
                  JD
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto">
            {isPrivacyMode && (
                <div className="bg-invest-900/5 border border-invest-900/10 rounded-lg p-3 mb-6 flex items-center gap-3 text-sm text-invest-900">
                    <ShieldAlert size={18} />
                    <span className="font-bold hidden sm:inline">Privacy Mode Enabled:</span>
                    <span>Sensitive data is masked.</span>
                </div>
            )}
            {renderContent()}
            </div>
        </div>

        <BottomNav />
      </main>
    </div>
  );
};

export default App;
