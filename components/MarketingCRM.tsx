
import React, { useState } from 'react';
import { MarketingCampaign, Lead, Client } from '../types';
import { Megaphone, Mail, MessageSquare, Plus, Search, Filter, Gift, Trophy, UserPlus, ArrowRight, CheckCircle, Smartphone } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface MarketingCRMProps {
    campaigns: MarketingCampaign[];
    leads: Lead[];
    clients: Client[];
    onAddCampaign: (c: MarketingCampaign) => void;
    onUpdateLead: (l: Lead) => void;
    onAddLead: (l: Lead) => void;
}

const MarketingCRM: React.FC<MarketingCRMProps> = ({ campaigns, leads, clients, onAddCampaign, onUpdateLead, onAddLead }) => {
    const [activeTab, setActiveTab] = useState<'Campaigns' | 'Funnels' | 'Loyalty'>('Campaigns');
    const [showModal, setShowModal] = useState(false);
    
    // Campaign Modal State
    const [newCampaign, setNewCampaign] = useState<Partial<MarketingCampaign>>({
        name: '', type: 'SMS', status: 'Draft', audience: 'All Clients', content: ''
    });

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Draft': return 'bg-slate-100 text-slate-600';
            case 'Scheduled': return 'bg-amber-50 text-amber-600';
            case 'Sent': return 'bg-green-50 text-green-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const handleAddCampaign = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCampaign({
            ...newCampaign as MarketingCampaign,
            id: `camp_${Date.now()}`,
            sentCount: 0,
            date: new Date().toLocaleDateString()
        });
        setShowModal(false);
    };

    const handleMoveLead = (lead: Lead, newStatus: Lead['status']) => {
        onUpdateLead({ ...lead, status: newStatus });
    };

    // Kanban Columns
    const columns: Lead['status'][] = ['New', 'Contacted', 'Interested', 'Converted'];

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-invest-900 dark:text-white">Marketing & Loyalty</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage campaigns, sales funnels, and reward programs.</p>
                </div>
                <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
                    <button onClick={() => setActiveTab('Campaigns')} className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'Campaigns' ? 'bg-invest-900 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Campaigns</button>
                    <button onClick={() => setActiveTab('Funnels')} className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'Funnels' ? 'bg-invest-900 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Sales Funnels</button>
                    <button onClick={() => setActiveTab('Loyalty')} className={`px-4 py-1.5 text-sm font-medium rounded ${activeTab === 'Loyalty' ? 'bg-invest-900 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>Loyalty Rewards</button>
                </div>
            </div>

            {/* CAMPAIGNS TAB */}
            {activeTab === 'Campaigns' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search campaigns..." className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-invest-gold/50" />
                        </div>
                        <button onClick={() => setShowModal(true)} className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg">
                            <Plus size={18} /> New Campaign
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map(camp => (
                            <div key={camp.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${camp.type === 'SMS' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {camp.type === 'SMS' ? <Smartphone size={20} /> : <Mail size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-invest-900 dark:text-white">{camp.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{camp.date}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(camp.status)}`}>{camp.status}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 bg-slate-50 dark:bg-slate-900 p-3 rounded italic border border-slate-100 dark:border-slate-700">"{camp.content}"</p>
                                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
                                    <span>Audience: <strong className="text-slate-700 dark:text-slate-200">{camp.audience}</strong></span>
                                    <span>Sent: {camp.sentCount || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* FUNNELS TAB (KANBAN) */}
            {activeTab === 'Funnels' && (
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-6 min-w-[1000px]">
                        {columns.map(col => (
                            <div key={col} className="flex-1 min-w-[250px] bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300">{col}</h3>
                                    <span className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">
                                        {leads.filter(l => l.status === col).length}
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {leads.filter(l => l.status === col).map(lead => (
                                        <div key={lead.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 group hover:shadow-md transition-all">
                                            <h4 className="font-bold text-invest-900 dark:text-white text-sm">{lead.name}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{lead.source}</p>
                                            <div className="flex items-center justify-between mt-3">
                                                <button className="p-1.5 text-slate-400 hover:text-blue-600 rounded bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 transition-colors">
                                                    <MessageSquare size={14} />
                                                </button>
                                                {col !== 'Converted' && (
                                                    <button 
                                                        onClick={() => handleMoveLead(lead, columns[columns.indexOf(col) + 1])}
                                                        className="p-1.5 text-slate-400 hover:text-green-600 rounded bg-slate-50 dark:bg-slate-700 hover:bg-green-50 transition-colors"
                                                        title="Move Next"
                                                    >
                                                        <ArrowRight size={14} />
                                                    </button>
                                                )}
                                                {col === 'Converted' && <CheckCircle size={16} className="text-green-500" />}
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => {/* Add Lead Logic */}} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-400 text-sm hover:bg-white hover:border-invest-gold hover:text-invest-gold transition-colors flex items-center justify-center gap-2">
                                        <Plus size={16} /> Add Lead
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* LOYALTY TAB */}
            {activeTab === 'Loyalty' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="font-bold text-invest-900 dark:text-white mb-4 flex items-center gap-2">
                                <Trophy className="text-invest-gold" /> Top Loyal Clients
                            </h3>
                            <div className="space-y-4">
                                {clients.sort((a,b) => (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0)).slice(0, 5).map((client, idx) => (
                                    <div key={client.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-200 text-slate-600'}`}>
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-invest-900 dark:text-white">{client.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">Since {client.onboardingDate.split('-')[0]}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-invest-gold">{client.loyaltyPoints || 0} pts</div>
                                            <div className="text-xs text-slate-400">Gold Tier</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-invest-900 to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2">Referral Program Status</h3>
                                <p className="text-slate-300 text-sm mb-6 max-w-md">Active referral campaign "Spread the Wealth" gives 500 bonus points for every qualified signup.</p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white/10 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-invest-gold">24</div>
                                        <div className="text-xs opacity-70">Referrals this month</div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-green-400">85%</div>
                                        <div className="text-xs opacity-70">Conversion Rate</div>
                                    </div>
                                    <div className="bg-white/10 p-3 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-blue-400">₵45k</div>
                                        <div className="text-xs opacity-70">New AUM Generated</div>
                                    </div>
                                </div>
                            </div>
                            <UserPlus className="absolute right-[-20px] bottom-[-20px] text-white/5 w-64 h-64" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="font-bold text-invest-900 dark:text-white mb-4">Points Configuration</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Deposit Reward (Points per 100 GHS)</label>
                                    <input type="number" defaultValue={10} className="w-full border border-slate-200 dark:border-slate-600 rounded p-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Referral Bonus (Points)</label>
                                    <input type="number" defaultValue={500} className="w-full border border-slate-200 dark:border-slate-600 rounded p-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Anniversary Bonus (Points)</label>
                                    <input type="number" defaultValue={1000} className="w-full border border-slate-200 dark:border-slate-600 rounded p-2 text-sm bg-slate-50 dark:bg-slate-700 dark:text-white" />
                                </div>
                                <button className="w-full bg-invest-900 text-white py-2 rounded font-medium hover:bg-invest-800 transition-colors">Save Rules</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Campaign Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-lg animate-fade-in-down">
                        <h3 className="text-lg font-bold text-invest-900 dark:text-white mb-4">Create Campaign</h3>
                        <form onSubmit={handleAddCampaign} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Campaign Name</label>
                                <input required type="text" value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none" placeholder="e.g. October Promo" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                                    <select value={newCampaign.type} onChange={e => setNewCampaign({...newCampaign, type: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none">
                                        <option value="SMS">Bulk SMS</option>
                                        <option value="Email">Email Blast</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Audience</label>
                                    <select value={newCampaign.audience} onChange={e => setNewCampaign({...newCampaign, audience: e.target.value as any})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none">
                                        <option>All Clients</option>
                                        <option>High Net Worth</option>
                                        <option>Leads</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Message Content</label>
                                <textarea required value={newCampaign.content} onChange={e => setNewCampaign({...newCampaign, content: e.target.value})} rows={4} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none resize-none" placeholder="Type your message here..." />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Create Draft</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketingCRM;
