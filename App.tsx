
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
import { ToastContainer } from './components/Toast';
import { ViewState, BlogPost, PostStatus, User, LogEntry, ToastMessage, Portfolio, Client, GhanaCardSubmission, AppData, InvestmentProduct, Transaction, Agent, SupportTicket } from './types';
import { Bell, Search } from 'lucide-react';

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
  { id: '3', name: 'Michael Brown', email: 'michael@investcorp.com', role: 'Viewer', status: 'Inactive', lastActive: '2 days ago', avatar: 'https://i.pravatar.cc/150?u=3' },
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
      walletBalance: 5000.00
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
      walletBalance: 12500.50
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
      walletBalance: 150000.00
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
    { id: 'prod1', name: '91-Day Treasury Bill', category: 'T-Bill', interestRate: 28.5, duration: '91 Days', minAmount: 100, status: 'Active' },
    { id: 'prod2', name: 'InvestCorp Balanced Fund', category: 'Mutual Fund', interestRate: 22.4, duration: 'Open', minAmount: 50, status: 'Active' },
    { id: 'prod3', name: '1-Year Fixed Note', category: 'Fixed Deposit', interestRate: 19.0, duration: '365 Days', minAmount: 5000, status: 'Active' },
];

const initialTransactions: Transaction[] = [
    { id: 'tx1', clientId: 'c1', type: 'Deposit', amount: 2000, date: '2024-10-22 10:30', status: 'Completed', reference: 'MOMO-12345' },
    { id: 'tx2', clientId: 'c2', type: 'Withdrawal', amount: 500, date: '2024-10-21 14:15', status: 'Completed', reference: 'BANK-98765' },
];

const initialAgents: Agent[] = [
    { id: 'a1', name: 'Kofi Boateng', code: 'AGT-101', region: 'Greater Accra', phone: '0241112222', email: 'kofi@agency.com', totalSales: 45000, commissionRate: 2.5, status: 'Active' },
    { id: 'a2', name: 'Esi Mansa', code: 'AGT-102', region: 'Ashanti', phone: '0203334444', email: 'esi@agency.com', totalSales: 28000, commissionRate: 2.5, status: 'Active' },
];

const initialTickets: SupportTicket[] = [
    { id: 't1', clientId: 'c1', subject: 'Unable to reset password', category: 'Technical', priority: 'High', status: 'Open', dateCreated: '2024-10-22 09:00' },
    { id: 't2', clientId: 'c3', subject: 'Inquiry about Corporate Bond rates', category: 'Investment', priority: 'Medium', status: 'In Progress', dateCreated: '2024-10-21 16:30' },
];


const DEFAULT_BG = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGhanaCardView, setIsGhanaCardView] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // State Modules
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [kycUpdates, setKycUpdates] = useState<GhanaCardSubmission[]>(initialKycSubmissions);
  const [products, setProducts] = useState<InvestmentProduct[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  
  // Load background settings from LocalStorage
  const [loginBg, setLoginBg] = useState(localStorage.getItem('investcorp_login_bg') || DEFAULT_BG);
  const [loginOpacity, setLoginOpacity] = useState(parseFloat(localStorage.getItem('investcorp_login_opacity') || '0.8'));
  const [loginBlur, setLoginBlur] = useState(parseFloat(localStorage.getItem('investcorp_login_blur') || '4'));

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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
  };

  const handleKycSubmission = (submission: GhanaCardSubmission) => {
      setKycUpdates([submission, ...kycUpdates]);
      setLogs([{ id: Date.now().toString(), user: 'Public Portal', action: 'KYC Submission', target: submission.accountNumber, timestamp: new Date().toLocaleString(), type: 'info' }, ...logs]);
  };
  
  // Handlers for New Modules
  const handleAddProduct = (product: InvestmentProduct) => {
      setProducts([product, ...products]);
      addToast('Product Added', `${product.name} is now available.`, 'success');
  };

  const handleAddTransaction = (tx: Partial<Transaction>) => {
      const newTx: Transaction = {
          ...tx as Transaction,
          id: Date.now().toString(),
      };
      setTransactions([newTx, ...transactions]);
      addToast('Transaction Processed', `${newTx.type} of GHS ${newTx.amount} completed.`, 'success');
  };

  const handleAddAgent = (agent: Agent) => {
      setAgents([agent, ...agents]);
      addToast('Agent Registered', `${agent.name} added to sales force.`, 'success');
  };

  const handleUpdateTicket = (id: string, status: 'Resolved') => {
      setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
      addToast('Ticket Updated', 'Support ticket marked as resolved.', 'success');
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
    // New Modules
    if (selectedSections.includes('products')) exportData.products = products;
    if (selectedSections.includes('transactions')) exportData.transactions = transactions;
    if (selectedSections.includes('agents')) exportData.agents = agents;
    if (selectedSections.includes('tickets')) exportData.tickets = tickets;

    if (selectedSections.includes('settings')) {
        exportData.settings = { bg: loginBg, opacity: loginOpacity, blur: loginBlur };
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
  };

  const handleImportData = (data: AppData, selectedSections: string[]) => {
     let count = 0;
     if (selectedSections.includes('posts') && data.posts) { setPosts(data.posts); count++; }
     if (selectedSections.includes('users') && data.users) { setUsers(data.users); count++; }
     if (selectedSections.includes('logs') && data.logs) { setLogs(data.logs); count++; }
     if (selectedSections.includes('portfolios') && data.portfolios) { setPortfolios(data.portfolios); count++; }
     if (selectedSections.includes('clients') && data.clients) { setClients(data.clients); count++; }
     if (selectedSections.includes('kycUpdates') && data.kycUpdates) { setKycUpdates(data.kycUpdates); count++; }
     // New Modules Import
     if (selectedSections.includes('products') && data.products) { setProducts(data.products); count++; }
     if (selectedSections.includes('transactions') && data.transactions) { setTransactions(data.transactions); count++; }
     if (selectedSections.includes('agents') && data.agents) { setAgents(data.agents); count++; }
     if (selectedSections.includes('tickets') && data.tickets) { setTickets(data.tickets); count++; }

     if (selectedSections.includes('settings') && data.settings) {
         handleSaveSettings(data.settings.bg, data.settings.opacity, data.settings.blur);
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

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard />;
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
          return <ClientList clients={clients} portfolios={portfolios} onAdd={handleAddClient} />;
      case ViewState.KYC_UPDATES:
          return <KycUpdates submissions={kycUpdates} />;
      case ViewState.PRODUCTS:
          return <ProductManagement products={products} onAdd={handleAddProduct} />;
      case ViewState.TRANSACTIONS:
          return <Transactions transactions={transactions} clients={clients} onAddTransaction={handleAddTransaction} />;
      case ViewState.AGENTS:
          return <AgentManagement agents={agents} onAdd={handleAddAgent} />;
      case ViewState.SUPPORT:
          return <SupportDesk tickets={tickets} clients={clients} onUpdateStatus={handleUpdateTicket} />;
      case ViewState.REPORTS:
          return <Reports />;
      case ViewState.USERS:
        return <Users users={users} onAddUser={handleAddUser} />;
      case ViewState.ACTIVITY_LOGS:
        return <ActivityLogs logs={logs} />;
      case ViewState.SETTINGS:
        return (
          <Settings 
            currentBg={loginBg} 
            currentOpacity={loginOpacity} 
            currentBlur={loginBlur}
            onSave={handleSaveSettings} 
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Sidebar currentView={currentView} onChangeView={setCurrentView} onLogout={handleLogout} />
      
      <main className="flex-1 ml-64 p-8 relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-4">
             {/* Breadcrumb or Title could go here */}
           </div>
           <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="text" placeholder="Global search..." className="pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-invest-gold outline-none w-64 transition-all" />
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <button className="relative text-slate-500 hover:text-invest-900 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-invest-900">Admin User</div>
                  <div className="text-xs text-slate-500">Super Admin</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-invest-gold flex items-center justify-center text-white font-bold text-sm ring-4 ring-white shadow-sm cursor-pointer hover:bg-amber-600 transition-colors">
                  JD
                </div>
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
