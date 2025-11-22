
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
import { ToastContainer } from './components/Toast';
import { ViewState, BlogPost, PostStatus, User, LogEntry, ToastMessage, Portfolio, Client } from './types';
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
    { id: 'c1', name: 'Kwame Mensah', email: 'kwame@example.com', phone: '0201234567', portfolioId: 'p1', onboardingDate: '2023-05-10', status: 'Active', kycStatus: 'Verified' },
    { id: 'c2', name: 'Ama Osei', email: 'ama@example.com', phone: '0249876543', portfolioId: 'p3', onboardingDate: '2024-01-15', status: 'Active', kycStatus: 'Verified' },
];


const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [clients, setClients] = useState<Client[]>(initialClients);
  
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
      addToast('Client Onboarded', `${client.name} has been successfully added.`, 'success');
  };


  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <Login onLogin={handleLogin} />
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
      case ViewState.USERS:
        return <Users users={users} onAddUser={handleAddUser} />;
      case ViewState.ACTIVITY_LOGS:
        return <ActivityLogs logs={logs} />;
      case ViewState.SETTINGS:
        return (
            <div className="flex items-center justify-center h-96 text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm animate-fade-in">
                <div className="text-center">
                    <div className="bg-slate-100 p-4 rounded-full inline-block mb-4">
                      <Search size={32} className="text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-invest-900 mb-2">Settings Unavailable</h2>
                    <p className="max-w-md mx-auto">System configuration is restricted to super administrators. Contact IT support for assistance.</p>
                </div>
            </div>
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
