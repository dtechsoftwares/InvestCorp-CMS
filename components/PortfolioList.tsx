
import React, { useState, useMemo } from 'react';
import { Portfolio, Asset, ProductCategory } from '../types';
import { Plus, Search, TrendingUp, TrendingDown, MoreVertical, PieChart as PieChartIcon, ArrowLeft, Calendar, DollarSign, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface PortfolioListProps {
  portfolios: Portfolio[];
  onAdd: (portfolio: Partial<Portfolio>) => void;
}

// Mock Asset Generator
const generateMockAssets = (portfolio: Portfolio): Asset[] => {
    const assets: Asset[] = [
        {
            id: '1', portfolioId: portfolio.id, productId: 'p1', productName: '91-Day Treasury Bill', type: 'T-Bill',
            investedAmount: portfolio.aum * 0.3, currentValue: portfolio.aum * 0.31, rate: 28.5, startDate: '2024-08-01', maturityDate: '2024-11-01', status: 'Active'
        },
        {
            id: '2', portfolioId: portfolio.id, productId: 'p2', productName: 'InvestCorp Balanced Fund', type: 'Mutual Fund',
            investedAmount: portfolio.aum * 0.4, currentValue: portfolio.aum * 0.45, rate: 22.4, startDate: '2024-01-15', status: 'Active'
        },
        {
            id: '3', portfolioId: portfolio.id, productId: 'p3', productName: 'Fixed Deposit (1 Year)', type: 'Fixed Deposit',
            investedAmount: portfolio.aum * 0.2, currentValue: portfolio.aum * 0.22, rate: 19.0, startDate: '2024-06-01', maturityDate: '2025-06-01', status: 'Active'
        },
        {
            id: '4', portfolioId: portfolio.id, productId: 'p4', productName: 'Cash / Money Market', type: 'Savings Plan',
            investedAmount: portfolio.aum * 0.1, currentValue: portfolio.aum * 0.1, rate: 12.0, startDate: '2024-10-01', status: 'Active'
        }
    ];
    return assets;
};

const PortfolioList: React.FC<PortfolioListProps> = ({ portfolios, onAdd }) => {
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // New Portfolio State
  const [newPortfolio, setNewPortfolio] = useState<Partial<Portfolio>>({
    name: '', type: 'Personal', aum: 0, currency: 'GHS', riskProfile: 'Balanced', status: 'Active', ytdReturn: 0
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

  // --- DASHBOARD VIEW COMPONENTS ---

  const PortfolioDashboard: React.FC<{ portfolio: Portfolio, onBack: () => void }> = ({ portfolio, onBack }) => {
      const assets = useMemo(() => generateMockAssets(portfolio), [portfolio]);

      // Calculations
      const totalInvested = assets.reduce((sum, a) => sum + a.investedAmount, 0);
      const totalCurrent = assets.reduce((sum, a) => sum + a.currentValue, 0);
      const netProfit = totalCurrent - totalInvested;
      const roi = (netProfit / totalInvested) * 100;
      
      // Chart Data: Allocation
      const allocationData = assets.map(a => ({ name: a.type, value: a.currentValue }));
      const COLORS = ['#003D69', '#d97706', '#10b981', '#64748b', '#8b5cf6'];

      // Chart Data: Performance (Mock)
      const performanceData = [
          { month: 'Jan', invested: totalInvested * 0.8, value: totalInvested * 0.82 },
          { month: 'Mar', invested: totalInvested * 0.85, value: totalInvested * 0.89 },
          { month: 'May', invested: totalInvested * 0.9, value: totalInvested * 0.95 },
          { month: 'Jul', invested: totalInvested * 0.95, value: totalInvested * 1.02 },
          { month: 'Sep', invested: totalInvested, value: totalCurrent * 0.98 },
          { month: 'Now', invested: totalInvested, value: totalCurrent },
      ];

      // Maturity Tracking
      const upcomingMaturities = assets.filter(a => a.maturityDate).sort((a, b) => new Date(a.maturityDate!).getTime() - new Date(b.maturityDate!).getTime());

      return (
          <div className="animate-fade-in space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <button onClick={onBack} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                          <ArrowLeft size={24} />
                      </button>
                      <div>
                          <h2 className="text-2xl font-bold text-invest-900">{portfolio.name}</h2>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{portfolio.type}</span>
                              <span>•</span>
                              <span className={`${portfolio.riskProfile === 'Aggressive' ? 'text-red-600' : 'text-blue-600'}`}>{portfolio.riskProfile} Profile</span>
                          </div>
                      </div>
                  </div>
                  <div className="text-right">
                      <div className="text-sm text-slate-500">Live ROI</div>
                      <div className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                      </div>
                  </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Portfolio Value</p>
                              <h3 className="text-2xl font-bold text-invest-900 mt-1">{formatCurrency(totalCurrent)}</h3>
                          </div>
                          <div className="p-2 bg-invest-900/5 text-invest-900 rounded-lg"><DollarSign size={20} /></div>
                      </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Invested</p>
                              <h3 className="text-2xl font-bold text-slate-700 mt-1">{formatCurrency(totalInvested)}</h3>
                          </div>
                          <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><PieChartIcon size={20} /></div>
                      </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Net Profit/Loss</p>
                              <h3 className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {netProfit >= 0 ? '+' : ''}{formatCurrency(netProfit)}
                              </h3>
                          </div>
                          <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              <TrendingUp size={20} />
                          </div>
                      </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Active Assets</p>
                              <h3 className="text-2xl font-bold text-invest-gold mt-1">{assets.length}</h3>
                          </div>
                          <div className="p-2 bg-amber-50 text-invest-gold rounded-lg"><Activity size={20} /></div>
                      </div>
                  </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Asset Allocation */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-invest-900 mb-4">Investment Breakup</h3>
                      <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie
                                      data={allocationData}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                  >
                                      {allocationData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                  </Pie>
                                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                  <Legend verticalAlign="bottom" height={36}/>
                              </PieChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-invest-900 mb-4">Contribution vs Returns</h3>
                      <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={performanceData}>
                                  <defs>
                                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                                          <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                                      </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                  <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                  <Legend />
                                  <Area type="monotone" name="Current Value" dataKey="value" stroke="#d97706" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                                  <Line type="monotone" name="Capital Invested" dataKey="invested" stroke="#003D69" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                              </AreaChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </div>

              {/* Bottom Section: Holdings & Maturity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Holdings Table */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-100">
                          <h3 className="font-bold text-invest-900">Current Holdings</h3>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                              <thead className="bg-slate-50 text-slate-500">
                                  <tr>
                                      <th className="px-6 py-3 font-medium">Asset</th>
                                      <th className="px-6 py-3 font-medium">Type</th>
                                      <th className="px-6 py-3 font-medium text-right">Invested</th>
                                      <th className="px-6 py-3 font-medium text-right">Current Value</th>
                                      <th className="px-6 py-3 font-medium text-right">Yield</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {assets.map(asset => {
                                      const gain = asset.currentValue - asset.investedAmount;
                                      const gainPercent = (gain / asset.investedAmount) * 100;
                                      return (
                                          <tr key={asset.id} className="hover:bg-slate-50/50">
                                              <td className="px-6 py-4">
                                                  <div className="font-medium text-invest-900">{asset.productName}</div>
                                                  <div className="text-xs text-slate-500">{asset.startDate}</div>
                                              </td>
                                              <td className="px-6 py-4">
                                                  <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">{asset.type}</span>
                                              </td>
                                              <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(asset.investedAmount)}</td>
                                              <td className="px-6 py-4 text-right font-medium text-invest-900">{formatCurrency(asset.currentValue)}</td>
                                              <td className={`px-6 py-4 text-right font-medium ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                  {gainPercent.toFixed(2)}%
                                              </td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  </div>

                  {/* Maturity Calendar */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                      <h3 className="font-bold text-invest-900 mb-4 flex items-center gap-2">
                          <Calendar size={18} className="text-invest-gold" /> Maturity Tracker
                      </h3>
                      {upcomingMaturities.length > 0 ? (
                          <div className="space-y-4">
                              {upcomingMaturities.map(asset => (
                                  <div key={asset.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-invest-gold/30 transition-colors bg-slate-50">
                                      <div className="flex-col items-center justify-center bg-white border border-slate-200 rounded p-2 text-center min-w-[50px] hidden sm:flex">
                                          <span className="text-xs text-slate-400 uppercase">{new Date(asset.maturityDate!).toLocaleString('default', { month: 'short' })}</span>
                                          <span className="text-lg font-bold text-invest-900">{new Date(asset.maturityDate!).getDate()}</span>
                                      </div>
                                      <div>
                                          <div className="text-sm font-medium text-invest-900">{asset.productName}</div>
                                          <div className="text-xs text-slate-500 mt-1">Maturing: {asset.maturityDate}</div>
                                          <div className="text-xs font-medium text-invest-gold mt-1">Value: {formatCurrency(asset.currentValue)}</div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="text-center py-8 text-slate-400">
                              <CheckCircle className="mx-auto mb-2 opacity-50" size={32} />
                              <p className="text-sm">No upcoming maturities.</p>
                          </div>
                      )}
                      
                      <div className="mt-6 pt-6 border-t border-slate-100">
                          <h4 className="font-bold text-invest-900 text-sm mb-2">Portfolio Summary</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                              This portfolio has maintained a steady growth trajectory. 
                              Recommendation: Consider diversifying into <span className="text-invest-900 font-medium">Eurobonds</span> 
                              to hedge against currency fluctuation given the high concentration in local T-Bills.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  // --- MAIN RENDER ---

  if (selectedPortfolio) {
      return <PortfolioDashboard portfolio={selectedPortfolio} onBack={() => setSelectedPortfolio(null)} />;
  }

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
            className="w-full bg-white text-invest-900 pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
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
              <tr 
                key={portfolio.id} 
                className="hover:bg-slate-50/50 transition-colors cursor-pointer group" 
                onClick={() => setSelectedPortfolio(portfolio)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-invest-900/5 flex items-center justify-center text-invest-900 group-hover:bg-invest-900 group-hover:text-white transition-colors">
                        <PieChartIcon size={16} />
                    </div>
                    <div>
                        <div className="font-semibold text-invest-900 group-hover:text-invest-gold transition-colors">{portfolio.name}</div>
                        <div className="text-[10px] text-slate-400 group-hover:text-slate-500">Click to view dashboard</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                    {portfolio.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-700">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
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
                        <option>Private Wealth</option>
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
