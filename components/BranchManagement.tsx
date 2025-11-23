import React, { useState } from 'react';
import { Branch, User } from '../types';
import { Building2, Plus, MapPin, Users, Briefcase, Search, MoreVertical, LayoutGrid, CheckCircle, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface BranchManagementProps {
    branches: Branch[];
    users: User[];
    onAddBranch: (branch: Branch) => void;
}

const BranchManagement: React.FC<BranchManagementProps> = ({ branches, users, onAddBranch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newBranch, setNewBranch] = useState<Partial<Branch>>({
        name: '', location: '', managerId: '', status: 'Active', aum: 0
    });

    const filteredBranches = branches.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Performance Data for Chart
    const performanceData = branches.map(b => ({
        name: b.name,
        aum: b.aum
    }));

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        onAddBranch({
            ...newBranch as Branch,
            id: `br_${Date.now()}`,
            clientCount: 0,
            aum: 0
        });
        setShowModal(false);
        setNewBranch({ name: '', location: '', managerId: '', status: 'Active', aum: 0 });
    };

    const getManagerName = (id: string) => users.find(u => u.id === id)?.name || 'Unassigned';

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-invest-900 dark:text-white">Branch Network</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage physical locations, performance, and staffing.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg"
                >
                    <Plus size={18} /> Add Branch
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-invest-900 dark:text-white mb-6">AUM by Branch</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} 
                                    formatter={(val: number) => `₵${val.toLocaleString()}`}
                                />
                                <Bar dataKey="aum" fill="#003D69" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-invest-900 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/10 rounded-lg"><LayoutGrid size={24} /></div>
                        <div>
                            <div className="text-3xl font-bold">{branches.length}</div>
                            <div className="text-sm opacity-80">Total Branches</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                         <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                             <span className="text-sm opacity-80">Active</span>
                             <span className="font-bold text-green-400">{branches.filter(b => b.status === 'Active').length}</span>
                         </div>
                         <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                             <span className="text-sm opacity-80">Renovating</span>
                             <span className="font-bold text-amber-400">{branches.filter(b => b.status === 'Renovating').length}</span>
                         </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search branches..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50 bg-transparent dark:text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBranches.map(branch => (
                    <div key={branch.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg text-invest-900 dark:text-white group-hover:bg-invest-900 group-hover:text-white transition-colors">
                                <Building2 size={24} />
                            </div>
                            <button className="text-slate-400 hover:text-invest-900 dark:hover:text-white">
                                <MoreVertical size={18} />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-invest-900 dark:text-white mb-1">{branch.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mb-4">
                            <MapPin size={12} /> {branch.location}
                        </div>

                        <div className="space-y-3 border-t border-slate-100 dark:border-slate-700 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Manager</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{getManagerName(branch.managerId)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Clients</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{branch.clientCount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">AUM</span>
                                <span className="font-bold text-invest-gold">₵{branch.aum.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 flex items-center gap-2">
                            {branch.status === 'Active' ? <CheckCircle size={14} className="text-green-500"/> : <AlertTriangle size={14} className="text-amber-500"/>}
                            <span className={`text-xs font-medium ${branch.status === 'Active' ? 'text-green-600' : 'text-amber-600'}`}>{branch.status}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-down">
                        <h3 className="text-lg font-bold text-invest-900 dark:text-white mb-4">Add New Branch</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Branch Name</label>
                                <input required type="text" value={newBranch.name} onChange={e => setNewBranch({...newBranch, name: e.target.value})} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 text-sm outline-none dark:bg-slate-700 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Location / City</label>
                                <input required type="text" value={newBranch.location} onChange={e => setNewBranch({...newBranch, location: e.target.value})} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 text-sm outline-none dark:bg-slate-700 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Assign Manager</label>
                                <select value={newBranch.managerId} onChange={e => setNewBranch({...newBranch, managerId: e.target.value})} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 text-sm outline-none dark:bg-slate-700 dark:text-white">
                                    <option value="">Select Manager...</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                                <select value={newBranch.status} onChange={e => setNewBranch({...newBranch, status: e.target.value as any})} className="w-full border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 text-sm outline-none dark:bg-slate-700 dark:text-white">
                                    <option>Active</option>
                                    <option>Renovating</option>
                                    <option>Closed</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900 dark:text-slate-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-invest-900 text-white rounded-lg text-sm font-medium hover:bg-invest-800">Create Branch</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchManagement;