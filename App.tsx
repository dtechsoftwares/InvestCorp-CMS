import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PostList from './components/PostList';
import ContentEditor from './components/ContentEditor';
import { ViewState, BlogPost, PostStatus } from './types';

// Mock Initial Data
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

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Routing Logic
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
                setPosts(posts.filter(p => p.id !== id));
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
              } else {
                setPosts([savedPost, ...posts]);
              }
              setCurrentView(ViewState.POSTS_LIST);
            }}
            onCancel={() => setCurrentView(ViewState.POSTS_LIST)}
          />
        );
      case ViewState.SETTINGS:
        return (
            <div className="flex items-center justify-center h-96 text-slate-400">
                <div>
                    <h2 className="text-xl font-bold text-invest-900 mb-2">Settings</h2>
                    <p>User management and system configuration would go here.</p>
                </div>
            </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 relative">
        {/* Top Bar / Header Mock */}
        <div className="absolute top-0 right-0 p-6 flex items-center gap-4">
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500"></span>
             <span className="text-xs font-medium text-slate-500">System Operational</span>
           </div>
           <div className="h-8 w-8 rounded-full bg-invest-gold flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm">
             JD
           </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;