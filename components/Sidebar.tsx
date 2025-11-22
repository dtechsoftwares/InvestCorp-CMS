
import React from 'react';
import { LayoutDashboard, FileText, Users, Settings, PieChart, LogOut, ShieldCheck, Briefcase } from 'lucide-react';
import { ViewState } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.POSTS_LIST, label: 'Market Insights', icon: FileText },
    { id: ViewState.PORTFOLIOS, label: 'Portfolios', icon: PieChart },
    { id: ViewState.CLIENTS, label: 'Clients', icon: Briefcase },
    { id: ViewState.USERS, label: 'Team', icon: Users },
    { id: ViewState.ACTIVITY_LOGS, label: 'Activity Logs', icon: ShieldCheck },
    { id: ViewState.SETTINGS, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-invest-900 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-40 transition-all duration-300">
      <div className="p-6 border-b border-invest-800 flex items-center gap-3">
        <div className="transform scale-75 origin-left">
          <Logo variant="light" size="sm" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="px-4 mb-2 text-xs font-bold text-invest-700 uppercase tracking-wider">Main Menu</div>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-invest-gold text-invest-900 shadow-md translate-x-1'
                  : 'text-slate-300 hover:bg-invest-800 hover:text-white hover:translate-x-1'
              }`}
            >
              <item.icon size={18} className={isActive ? 'text-invest-900' : 'text-slate-400 group-hover:text-white'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-invest-800 bg-invest-900">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors group"
        >
          <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
