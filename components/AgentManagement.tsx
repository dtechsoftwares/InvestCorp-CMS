

import React, { useState } from 'react';
import { Agent, CommissionPayout } from '../types';
import { Plus, Search, BadgeDollarSign, MapPin, Phone, User, Trophy, TrendingUp, Wallet, CheckCircle, XCircle, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AgentManagementProps {
  agents: Agent[];
  payouts: CommissionPayout[];
  onAdd: (agent: Agent) => void;
  onPayoutAction: (id: string, action: 'Paid' | 'Rejected') => void;
}

const AgentManagement: React.FC<AgentManagementProps> = ({ agents, payouts, onAdd, onPayoutAction }) => {
  const [activeTab, setActiveTab] = useState<'Agents' | 'Payouts' | 'Leaderboard'>('Agents');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
      name: '', email: '', phone: '', region: 'Greater Accra', commissionRate: 2.5, commissionType: 'Percentage', status: 'Active', walletBalance: 0
  });

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayouts = payouts.filter(p => p.status === 'Pending');

  const topAgents = [...agents].sort((a, b) => b.totalSales - a.totalSales).slice(0, 5);
  
  const salesData = topAgents.map(a => ({
      name: a.name.split(' ')[0], // First name
      sales: a.totalSales
  }));

  const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      onAdd({
          ...newAgent as Agent,
          id: Date.now().toString(),
          code: `AGT-${Math.floor(Math.random() * 1000)}`,
          totalSales: 0,
          walletBalance: 0,
          assignedClientCount: 0
      });
      setShowModal(false);
      setNewAgent({ name: '', email: '', phone: '', region: 'Greater Accra', commissionRate: 2.5, commissionType: 'Percentage', status: 'Active', walletBalance: 0 });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Agent & Sales Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage sales force, track commissions, and process payouts.</p>
        </div>
        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
            <button 
                onClick={() => setActiveTab('Agents')}
                className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'Agents' ? 'bg-invest-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >Agents</button>
            <button 
                    onClick={() => setActiveTab('Leaderboard')}
                className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'Leaderboard' ? 'bg-invest-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >Leaderboard</button>
            <button 
                    onClick={() => setActiveTab('Payouts')}
                className={`px-4 py-1.5 text-sm font-medium rounded flex items-center gap-2 ${activeTab === 'Payouts' ? 'bg-invest-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
                Payout Requests
                {filteredPayouts.length > 0 && <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">{filteredPayouts.length}</span>}
            </button>
        </div>
      </div>

      {activeTab === 'Agents' && (
        <>
            <div className="flex justify-between items-center">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 w-full max-w-md">
                    <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search agents..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-none rounded-lg text-sm focus:outline-none focus:ring-0"
                    />
                    </div>
                </div>
                 <button 
                    onClick={() => setShowModal(true)}
                    className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg ml-4"
                >
                    <Plus size={18} />
                    New Agent
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map(agent => (
                    <div key={agent.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-invest-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                    {agent.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-invest-900">{agent.name}</h3>
                                    <p className="text-xs text-slate-500">{agent.code}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${agent.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {agent.status}
                            </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-slate-600 mb-4">
                            <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400"/> {agent.region}</div>
                            <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> {agent.phone}</div>
                            <div className="flex items-center gap-2"><User size={14} className="text-slate-400"/> {agent.assignedClientCount} Assigned Clients</div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-slate-400 mb-1">Total Sales</div>
                                <div className="font-bold text-invest-900">₵{agent.totalSales.toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 mb-1">Wallet Bal.</div>
                                <div className="font-bold text-green-600">₵{agent.walletBalance.toLocaleString()}</div>
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                             <span className="text-slate-500">Commission Model:</span>
                             <span className="font-medium bg-amber-50 text-amber-700 px-2 py-1 rounded">
                                 {agent.commissionType === 'Percentage' ? `${agent.commissionRate}% per Deal` : `₵${agent.commissionRate} Flat`}
                             </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
      )}

      {activeTab === 'Leaderboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-invest-900 mb-6 flex items-center gap-2"><TrendingUp className="text-invest-gold" /> Top Performers (Sales Volume)</h3>
                  <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={salesData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 14, fontWeight: 600}} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                <Bar dataKey="sales" fill="#d97706" radius={[0, 4, 4, 0]} barSize={40} label={{ position: 'right', fill: '#64748b', fontSize: 12, formatter: (val: number) => `₵${val.toLocaleString()}` }} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>

              <div className="bg-gradient-to-br from-invest-900 to-invest-800 rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                      <Trophy className="text-yellow-400" size={32} />
                      <div>
                          <h3 className="font-bold text-lg">Sales Champion</h3>
                          <p className="text-invest-goldlight text-sm">Most valuable agent</p>
                      </div>
                  </div>
                  
                  {topAgents.length > 0 && (
                      <div className="text-center">
                          <div className="w-24 h-24 bg-white/10 rounded-full mx-auto flex items-center justify-center text-4xl font-bold mb-4 border-4 border-yellow-400">
                              {topAgents[0].name.charAt(0)}
                          </div>
                          <h2 className="text-2xl font-bold">{topAgents[0].name}</h2>
                          <p className="opacity-80 mb-6">{topAgents[0].code}</p>
                          <div className="bg-white/10 rounded-lg p-4">
                              <p className="text-xs uppercase tracking-widest opacity-60 mb-1">Total Generated Revenue</p>
                              <p className="text-3xl font-bold text-yellow-400">₵{topAgents[0].totalSales.toLocaleString()}</p>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {activeTab === 'Payouts' && (
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="text-sm text-slate-500 mb-1">Pending Requests</div>
                      <div className="text-2xl font-bold text-invest-gold">{filteredPayouts.length}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="text-sm text-slate-500 mb-1">Processed Today</div>
                      <div className="text-2xl font-bold text-green-600">₵12,500</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="text-sm text-slate-500 mb-1">Total Commission Paid</div>
                      <div className="text-2xl font-bold text-invest-900">₵452,000</div>
                  </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-medium">Request Date</th>
                            <th className="px-6 py-4 font-medium">Agent</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {payouts.map(payout => {
                            const agent = agents.find(a => a.id === payout.agentId);
                            return (
                                <tr key={payout.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4">{payout.date}</td>
                                    <td className="px-6 py-4 font-medium text-invest-900">{agent?.name || 'Unknown Agent'}</td>
                                    <td className="px-6 py-4 font-bold text-slate-700">₵{payout.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${payout.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 
                                              payout.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {payout.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {payout.status === 'Pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => onPayoutAction(payout.id, 'Paid')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve">
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button onClick={() => onPayoutAction(payout.id, 'Rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject">
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}
                                        {payout.status === 'Paid' && <span className="text-xs text-green-600 flex items-center justify-end gap-1"><CheckCircle size={12}/> Paid</span>}
                                    </td>
                                </tr>
                            );
                        })}
                        {payouts.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">No payout requests.</td></tr>
                        )}
                    </tbody>
                </table>
              </div>
          </div>
      )}

      {/* Add Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-fade-in-down">
            <h3 className="text-lg font-bold text-invest-900 mb-4">Register New Agent</h3>
            <form onSubmit={handleAdd} className="space-y-4">
               <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input required type="text" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                     <input required type="email" value={newAgent.email} onChange={e => setNewAgent({...newAgent, email: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                     <input required type="tel" value={newAgent.phone} onChange={e => setNewAgent({...newAgent, phone: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">Region</label>
                     <select value={newAgent.region} onChange={e => setNewAgent({...newAgent, region: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                        <option>Greater Accra</option>
                        <option>Ashanti</option>
                        <option>Western</option>
                        <option>Northern</option>
                        <option>Central</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">Commission Type</label>
                     <select value={newAgent.commissionType} onChange={e => setNewAgent({...newAgent, commissionType: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none">
                        <option value="Percentage">Percentage of Sales</option>
                        <option value="Flat">Flat Rate / Deal</option>
                     </select>
                  </div>
              </div>
              <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1">
                       {newAgent.commissionType === 'Percentage' ? 'Commission Rate (%)' : 'Flat Rate Amount (GHS)'}
                   </label>
                   <input required type="number" step="0.1" value={newAgent.commissionRate} onChange={e => setNewAgent({...newAgent, commissionRate: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Add Agent</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;