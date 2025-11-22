import React, { useState } from 'react';
import { Portfolio } from '../types';
import { Plus, Search, TrendingUp, TrendingDown, MoreVertical, PieChart } from 'lucide-react';

interface PortfolioListProps {
  portfolios: Portfolio[];
  onAdd: (portfolio: Partial<Portfolio>) => void;
}

const PortfolioList: React.FC<PortfolioListProps> = ({ portfolios, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState<Partial<Portfolio>>({
    name: '',
    type: 'Personal',
    aum: 0,
    currency: 'GHS',
    riskProfile: 'Balanced',
    status: 'Active',
    ytdReturn: 0
  });

  const filteredPortfolios = portfolios.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(newPortfolio);
    setShowModal(false);
    setNewPortfolio({ name: '', type: 'Personal', aum: 0, currency: 'GHS', riskProfile: 'Balanced', status: 'Active', ytdReturn: 0 });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Portfolio Management</h2>
          <p className="text-slate-500 text-sm mt-1">Overview of managed funds and performance.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} />
          New Portfolio
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="text-sm text-slate-500 mb-1">Total AUM</div>
             <div className="text-2xl font-bold text-invest-900">
                 {formatCurrency(portfolios.reduce((sum, p) => sum + p.aum, 0))}
             </div>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="text-sm text-slate-500 mb-1">Avg YTD Return</div>
             <div className="text-2xl font-bold text-green-600">
                 +{(portfolios.reduce((sum, p) => sum + p.ytdReturn, 0) / (portfolios.length || 1)).toFixed(2)}%
             </div>
         </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
             <div className="text-sm text-slate-500 mb-1">Active Portfolios</div>
             <div className="text-2xl font-bold text-invest-gold">
                 {portfolios.filter(p => p.status === 'Active').length}
             </div>
         </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search portfolios..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Portfolio Name</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium text-right">AUM (GHS)</th>
              <th className="px-6 py-4 font-medium text-center">YTD Return</th>
              <th className="px-6 py-4 font-medium">Risk Profile</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPortfolios.map((portfolio) => (
              <tr key={portfolio.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-invest-900/5 flex items-center justify-center text-invest-900">
                        <PieChart size={16} />
                    </div>
                    <div className="font-semibold text-invest-900">{portfolio.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                    {portfolio.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  {formatCurrency(portfolio.aum)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`flex items-center justify-center gap-1 font-medium ${portfolio.ytdReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolio.ytdReturn >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(portfolio.ytdReturn)}%
                  </span>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${portfolio.riskProfile === 'Aggressive' ? 'bg-red-50 text-red-700' : 
                          portfolio.riskProfile === 'Conservative' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                        {portfolio.riskProfile}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-invest-900 rounded hover:bg-slate-100">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Portfolio Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-fade-in-down">
            <h3 className="text-lg font-bold text-invest-900 mb-4">Create New Portfolio</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Portfolio Name</label>
                <input required type="text" value={newPortfolio.name} onChange={e => setNewPortfolio({...newPortfolio, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                    <select value={newPortfolio.type} onChange={e => setNewPortfolio({...newPortfolio, type: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                        <option>Personal</option>
                        <option>Corporate</option>
                        <option>Pension</option>
                        <option>Provident</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Risk Profile</label>
                    <select value={newPortfolio.riskProfile} onChange={e => setNewPortfolio({...newPortfolio, riskProfile: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                        <option>Conservative</option>
                        <option>Balanced</option>
                        <option>Aggressive</option>
                    </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Initial AUM (GHS)</label>
                    <input required type="number" value={newPortfolio.aum} onChange={e => setNewPortfolio({...newPortfolio, aum: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">YTD Return (%)</label>
                    <input required type="number" value={newPortfolio.ytdReturn} onChange={e => setNewPortfolio({...newPortfolio, ytdReturn: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Create Portfolio</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioList;
