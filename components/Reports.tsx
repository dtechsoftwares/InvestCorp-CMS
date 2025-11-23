

import React, { useMemo, useState } from 'react';
import { FileText, Download, BarChart as BarChartIcon, PieChart as PieChartIcon, Calendar, TrendingUp, Users, ShieldCheck, DollarSign, Activity, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Client, Transaction, Agent, Portfolio } from '../types';

interface ReportsProps {
  clients?: Client[];
  transactions?: Transaction[];
  agents?: Agent[];
  portfolios?: Portfolio[];
}

const Reports: React.FC<ReportsProps> = ({ clients = [], transactions = [], agents = [], portfolios = [] }) => {
  const [activeTab, setActiveTab] = useState<'Financial' | 'Regulatory' | 'Analytics'>('Financial');

  const financialReports = [
      { id: 1, title: 'Profit & Loss Statement', desc: 'Comprehensive income vs expense analysis.', icon: TrendingUp, type: 'Financial' },
      { id: 2, title: 'Interest Expense Summary', desc: 'Accrued interest payouts to clients.', icon: DollarSign, type: 'Financial' },
      { id: 3, title: 'Product Performance', desc: 'Yield analysis per investment product.', icon: BarChartIcon, type: 'Financial' },
      { id: 4, title: 'Agent Commission Report', desc: 'Monthly sales and commission payouts.', icon: Users, type: 'Financial' },
      { id: 5, title: 'Transaction Journal', desc: 'Detailed log of all system transactions.', icon: FileSpreadsheet, type: 'Financial' },
  ];

  const regulatoryReports = [
      { id: 6, title: 'SEC Monthly Return', desc: 'Standard regulatory filing format for SEC.', icon: ShieldCheck, type: 'Regulatory' },
      { id: 7, title: 'FIC Suspicious Activity Report (STR)', desc: 'AML/CFT transaction flags log.', icon: ShieldCheck, type: 'Regulatory' },
      { id: 8, title: 'Client KYC Status Report', desc: 'Identity verification compliance audit.', icon: Users, type: 'Regulatory' },
      { id: 9, title: 'Data Protection Audit', desc: 'Access logs and PII processing record.', icon: FileText, type: 'Regulatory' },
  ];

  const handleDownload = (title: string) => {
      alert(`Generating ${title}... (Mock Download)`);
  };

  // --- ANALYTICS DATA PREP ---

  // 1. Client Growth (Line Chart)
  const clientGrowthData = useMemo(() => {
      const months: Record<string, number> = {};
      clients.forEach(c => {
          const date = new Date(c.onboardingDate);
          const month = date.toLocaleString('default', { month: 'short' });
          months[month] = (months[month] || 0) + 1;
      });
      return Object.keys(months).map(m => ({ name: m, clients: months[m] }));
  }, [clients]);

  // 2. Transaction Volume (Bar Chart)
  const transactionVolumeData = useMemo(() => {
      const deposits = transactions.filter(t => t.type === 'Deposit' || t.type === 'Top-up').reduce((sum, t) => sum + t.amount, 0);
      const withdrawals = transactions.filter(t => t.type === 'Withdrawal').reduce((sum, t) => sum + t.amount, 0);
      return [
          { name: 'Deposits', amount: deposits },
          { name: 'Withdrawals', amount: withdrawals }
      ];
  }, [transactions]);

  // 3. Customer Demographics (Pie Chart)
  const demographicData = useMemo(() => {
      const corporate = clients.filter(c => c.clientType === 'Corporate').length;
      const individual = clients.filter(c => c.clientType === 'Individual').length;
      return [
          { name: 'Corporate', value: corporate },
          { name: 'Individual', value: individual },
      ];
  }, [clients]);
  
  const DEMO_COLORS = ['#003D69', '#d97706'];

  // 4. Revenue Mock Data (Area Chart)
  const revenueData = [
      { name: 'Jan', revenue: 45000 },
      { name: 'Feb', revenue: 52000 },
      { name: 'Mar', revenue: 48000 },
      { name: 'Apr', revenue: 61000 },
      { name: 'May', revenue: 55000 },
      { name: 'Jun', revenue: 67000 },
      { name: 'Jul', revenue: 72000 },
  ];

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-invest-900">Reports & Analytics</h2>
           <p className="text-slate-500 text-sm mt-1">Financial statements, regulatory filings, and visual insights.</p>
        </div>
        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
            <button 
                onClick={() => setActiveTab('Financial')}
                className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'Financial' ? 'bg-invest-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >Financial</button>
            <button 
                onClick={() => setActiveTab('Regulatory')}
                className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'Regulatory' ? 'bg-invest-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >Regulatory (SEC/FIC)</button>
            <button 
                onClick={() => setActiveTab('Analytics')}
                className={`px-4 py-1.5 text-sm font-medium rounded flex items-center gap-2 ${activeTab === 'Analytics' ? 'bg-invest-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                <BarChartIcon size={16} /> Visual Analytics
            </button>
        </div>
      </div>

      {/* Financial Reports Tab */}
      {activeTab === 'Financial' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {financialReports.map(report => (
                  <div key={report.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer" onClick={() => handleDownload(report.title)}>
                      <div className="flex justify-between items-start">
                          <div className="p-3 bg-slate-50 text-invest-900 rounded-lg group-hover:bg-invest-900 group-hover:text-white transition-colors">
                              <report.icon size={24} />
                          </div>
                          <button className="p-2 text-slate-400 hover:text-invest-gold">
                              <Download size={20} />
                          </button>
                      </div>
                      <h3 className="font-bold text-invest-900 text-sm mt-4">{report.title}</h3>
                      <p className="text-slate-500 text-xs mt-1">{report.desc}</p>
                  </div>
              ))}
         </div>
      )}

      {/* Regulatory Reports Tab */}
      {activeTab === 'Regulatory' && (
          <div className="space-y-6 animate-fade-in">
               <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                   <ShieldCheck className="text-amber-600 mt-0.5" size={20} />
                   <div>
                       <h4 className="font-bold text-amber-800 text-sm">Compliance Notice</h4>
                       <p className="text-xs text-amber-700 mt-1">Reports generated here follow the strict formatting guidelines of the Securities and Exchange Commission (SEC) and Financial Intelligence Centre (FIC). Ensure all transactions are reconciled before generation.</p>
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {regulatoryReports.map(report => (
                      <div key={report.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer border-l-4 border-l-invest-gold" onClick={() => handleDownload(report.title)}>
                          <div className="flex justify-between items-start">
                              <div className="flex items-center gap-4">
                                  <div className="p-3 bg-invest-900/5 text-invest-900 rounded-lg">
                                      <report.icon size={24} />
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-invest-900 text-sm">{report.title}</h3>
                                      <p className="text-slate-500 text-xs mt-1">{report.desc}</p>
                                  </div>
                              </div>
                              <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-invest-900 hover:text-white transition-colors">
                                  Generate PDF
                              </button>
                          </div>
                      </div>
                  ))}
               </div>
          </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'Analytics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                      <div>
                          <h3 className="font-bold text-invest-900">Revenue Trends</h3>
                          <p className="text-xs text-slate-500">Monthly gross revenue (GHS)</p>
                      </div>
                  </div>
                  <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} formatter={(val: number) => `₵${val.toLocaleString()}`} />
                              <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={3} fill="url(#colorRev)" />
                          </AreaChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Demographics Chart */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                      <div>
                          <h3 className="font-bold text-invest-900">Customer Demographics</h3>
                          <p className="text-xs text-slate-500">Portfolio distribution by client type</p>
                      </div>
                  </div>
                  <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                              <Pie
                                  data={demographicData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                              >
                                  {demographicData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={DEMO_COLORS[index % DEMO_COLORS.length]} />
                                  ))}
                              </Pie>
                              <Tooltip />
                              <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Client Acquisition Chart */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                      <div>
                          <h3 className="font-bold text-invest-900">Client Acquisition</h3>
                          <p className="text-xs text-slate-500">New accounts over time</p>
                      </div>
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <Users size={20} />
                      </div>
                  </div>
                  <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={clientGrowthData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                              <Line type="monotone" dataKey="clients" stroke="#003D69" strokeWidth={3} dot={{r: 4}} />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              {/* Transaction Volume Chart */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                      <div>
                          <h3 className="font-bold text-invest-900">Net Deposit Flow</h3>
                          <p className="text-xs text-slate-500">Deposits vs Withdrawals</p>
                      </div>
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                          <Activity size={20} />
                      </div>
                  </div>
                  <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={transactionVolumeData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} formatter={(val: number) => `₵${val.toLocaleString()}`} />
                              <Bar dataKey="amount" fill="#d97706" radius={[0, 4, 4, 0]} barSize={30}>
                                {
                                    transactionVolumeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Deposits' ? '#10b981' : '#ef4444'} />
                                    ))
                                }
                              </Bar>
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
        </div>
      )}

      {/* Custom Report Banner */}
      <div className="bg-invest-900 text-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
              <h3 className="text-xl font-bold mb-2">Need a custom report?</h3>
              <p className="text-invest-goldlight text-sm max-w-md">Our analytics engine can generate custom insights based on specific parameters. Contact the data team.</p>
          </div>
          <button className="px-6 py-3 bg-white text-invest-900 font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-lg">
              Request Custom Report
          </button>
      </div>
    </div>
  );
};

export default Reports;
