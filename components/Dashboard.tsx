

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Activity, Sparkles, AlertTriangle, ShieldCheck, BrainCircuit } from 'lucide-react';
import { DashboardStat, ChartDataPoint, AIInsight } from '../types';

const stats: DashboardStat[] = [
  { label: 'Assets Under Management', value: '₵45.2M', change: '+12.5%', trend: 'up' },
  { label: 'Active Clients', value: '1,240', change: '+4.2%', trend: 'up' },
  { label: 'YTD Return', value: '18.4%', change: '-1.1%', trend: 'down' },
  { label: 'Pending Applications', value: '34', change: '+0.0%', trend: 'neutral' },
];

const aumData: ChartDataPoint[] = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 32 },
  { name: 'Mar', value: 35 },
  { name: 'Apr', value: 34 },
  { name: 'May', value: 38 },
  { name: 'Jun', value: 42 },
  { name: 'Jul', value: 45.2 },
];

const productData: ChartDataPoint[] = [
  { name: 'Fixed Income', value: 4000 },
  { name: 'Equity', value: 2400 },
  { name: 'Balanced', value: 2400 },
  { name: 'Treasury', value: 1800 },
];

// Mock AI Prediction Data
const predictionData = [
    { name: 'Current', actual: 45.2, predicted: 45.2 },
    { name: 'Aug (Proj)', actual: null, predicted: 48.5 },
    { name: 'Sep (Proj)', actual: null, predicted: 51.0 },
    { name: 'Oct (Proj)', actual: null, predicted: 54.2 },
];

const aiInsights: AIInsight[] = [
    { id: '1', type: 'Prediction', message: 'Liquidity surge expected in Q4 driven by cocoa bill maturities.', score: 85, timestamp: '10 mins ago' },
    { id: '2', type: 'Fraud', message: 'Unusual withdrawal pattern detected: Account #004128.', score: 92, timestamp: '1 hour ago' },
    { id: '3', type: 'Opportunity', message: 'Client retention risk: 15 high-net-worth clients showing inactivity.', score: 65, timestamp: '3 hours ago' },
];

const StatCard: React.FC<{ stat: DashboardStat, isPrivacyMode: boolean }> = ({ stat, isPrivacyMode }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
        <h3 className="text-2xl font-bold text-invest-900 dark:text-white mt-1">
            {isPrivacyMode && (stat.label.includes('Assets') || stat.label.includes('Value')) ? '••••••' : stat.value}
        </h3>
      </div>
      <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : stat.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
        {stat.trend === 'up' ? <ArrowUpRight size={20} /> : stat.trend === 'down' ? <ArrowDownRight size={20} /> : <Activity size={20} />}
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={`font-medium ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-slate-600 dark:text-slate-400'}`}>
        {stat.change}
      </span>
      <span className="text-slate-400 ml-2">vs last month</span>
    </div>
  </div>
);

interface DashboardProps {
    isPrivacyMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isPrivacyMode = false }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-invest-900 dark:text-white">Executive Overview</h2>
            <p className="text-sm text-slate-500">Welcome to your AI-powered command center.</p>
        </div>
        <div className="text-sm text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Live
        </div>
      </div>

      {/* AI Command Center Widget */}
      <div className="bg-gradient-to-r from-invest-900 to-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
              <BrainCircuit size={200} />
          </div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 bg-white/10 rounded-lg animate-pulse">
                  <Sparkles className="text-invest-gold" size={24} />
              </div>
              <h3 className="text-lg font-bold">InvestCorp AI Engine</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {aiInsights.map(insight => (
                  <div key={insight.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/5 hover:bg-white/20 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                              insight.type === 'Fraud' ? 'bg-red-500/20 text-red-300' : 
                              insight.type === 'Prediction' ? 'bg-invest-gold/20 text-invest-goldlight' : 'bg-blue-500/20 text-blue-300'
                          }`}>
                              {insight.type.toUpperCase()}
                          </span>
                          <span className="text-xs opacity-60">{insight.timestamp}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{insight.message}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs opacity-60">
                          {insight.type === 'Fraud' ? <ShieldCheck size={12}/> : <Activity size={12}/>}
                          Confidence Score: {insight.score}%
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} isPrivacyMode={isPrivacyMode} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Predictive Growth Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-invest-900 dark:text-white">AUM Forecast (AI Model)</h3>
             <span className="text-xs bg-invest-gold/10 text-invest-gold px-2 py-1 rounded font-bold">Predictive Analytics Active</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictionData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                  <pattern id="pattern-stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="4" height="8" transform="translate(0,0)" fill="white"></rect>
                  </pattern>
                  <mask id="mask-stripe">
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-stripe)" />
                  </mask>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(val: number) => isPrivacyMode ? '••••••' : val}
                />
                <Area type="monotone" dataKey="actual" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" name="Actual AUM" />
                <Area type="monotone" dataKey="predicted" stroke="#003D69" strokeWidth={2} strokeDasharray="5 5" fillOpacity={0} name="AI Projection" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Mix */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-invest-900 dark:text-white mb-6">Fund Composition</h3>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} layout="vertical">
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9"/>
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                 <Bar dataKey="value" fill="#0f172a" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
