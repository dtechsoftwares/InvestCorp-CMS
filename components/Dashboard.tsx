import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Activity } from 'lucide-react';
import { DashboardStat, ChartDataPoint } from '../types';

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

const StatCard: React.FC<{ stat: DashboardStat }> = ({ stat }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
        <h3 className="text-2xl font-bold text-invest-900 mt-1">{stat.value}</h3>
      </div>
      <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-600' : stat.trend === 'down' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
        {stat.trend === 'up' ? <ArrowUpRight size={20} /> : stat.trend === 'down' ? <ArrowDownRight size={20} /> : <Activity size={20} />}
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <span className={`font-medium ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-slate-600'}`}>
        {stat.change}
      </span>
      <span className="text-slate-400 ml-2">vs last month</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-invest-900">Executive Overview</h2>
        <div className="text-sm text-slate-500">Last updated: Just now</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AUM Growth Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-invest-900 mb-6">AUM Growth (Millions GHS)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aumData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Mix */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-invest-900 mb-6">Fund Composition</h3>
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