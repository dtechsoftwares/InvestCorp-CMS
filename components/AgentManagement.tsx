
import React, { useState } from 'react';
import { Agent } from '../types';
import { Plus, Search, BadgeDollarSign, MapPin, Phone, User } from 'lucide-react';

interface AgentManagementProps {
  agents: Agent[];
  onAdd: (agent: Agent) => void;
}

const AgentManagement: React.FC<AgentManagementProps> = ({ agents, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
      name: '', email: '', phone: '', region: 'Greater Accra', commissionRate: 2.5, status: 'Active'
  });

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      onAdd({
          ...newAgent as Agent,
          id: Date.now().toString(),
          code: `AGT-${Math.floor(Math.random() * 1000)}`,
          totalSales: 0
      });
      setShowModal(false);
      setNewAgent({ name: '', email: '', phone: '', region: 'Greater Accra', commissionRate: 2.5, status: 'Active' });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-invest-900">Agent & Sales Management</h2>
          <p className="text-slate-500 text-sm mt-1">Manage external sales agents and track commissions.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg"
        >
          <Plus size={18} />
          New Agent
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search agents..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => (
              <div key={agent.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-invest-900 text-white rounded-full flex items-center justify-center font-bold">
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
                  </div>

                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                      <div>
                          <div className="text-xs text-slate-400 mb-1">Total Sales</div>
                          <div className="font-bold text-invest-900">₵{agent.totalSales.toLocaleString()}</div>
                      </div>
                      <div>
                          <div className="text-xs text-slate-400 mb-1">Commission</div>
                          <div className="font-bold text-invest-gold flex items-center gap-1">
                              <BadgeDollarSign size={14} /> {agent.commissionRate}%
                          </div>
                      </div>
                  </div>
              </div>
          ))}
      </div>

      {/* Add Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in-down">
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
                     <label className="block text-xs font-medium text-slate-500 mb-1">Commission (%)</label>
                     <input required type="number" step="0.1" value={newAgent.commissionRate} onChange={e => setNewAgent({...newAgent, commissionRate: parseFloat(e.target.value)})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-invest-gold outline-none" />
                  </div>
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
