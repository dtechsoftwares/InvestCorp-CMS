import React from 'react';
import { LayoutDashboard, FileText, Users, Settings, Briefcase, PieChart, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.POSTS_LIST, label: 'Market Insights', icon: FileText },
    { id: 'PORTFOLIO', label: 'Portfolios', icon: PieChart }, // Mock placeholder
    { id: 'CLIENTS', label: 'Clients', icon: Users }, // Mock placeholder
    { id: ViewState.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-invest-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-10 transition-all duration-300">
      <div className="p-6 border-b border-invest-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-invest-gold rounded-sm flex items-center justify-center text-invest-900 font-bold text-lg">
          I
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide text-white">INVEST CORP</h1>
          <p className="text-xs text-invest-gold">Asset Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => item.id === 'PORTFOLIO' || item.id === 'CLIENTS' ? null : onChangeView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-invest-gold text-invest-900 shadow-md'
                  : 'text-slate-300 hover:bg-invest-800 hover:text-white'
              } ${ (item.id === 'PORTFOLIO' || item.id === 'CLIENTS') ? 'opacity-50 cursor-not-allowed' : '' }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-invest-800">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;